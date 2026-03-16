#!/usr/bin/env bash
# Ari backup script — supports SQLite (default) and MariaDB.
# Runs inside the backup Docker container on a cron schedule.
#
# Usage: backup.sh <db|files|prune>
#
# Required env vars (always):
#   RESTIC_REPOSITORY  — Restic repo URL (s3:..., sftp:..., /local/path, etc.)
#   RESTIC_PASSWORD    — Restic encryption passphrase
#
# Required env vars for MariaDB (when DB_CONNECTION=mysql):
#   BACKUP_MARIADB_HOST      — database hostname (default: database)
#   BACKUP_MARIADB_USER      — database user
#   BACKUP_MARIADB_PASSWORD  — database password
#   BACKUP_MARIADB_DB        — database name
#
# For SQLite (default): no extra vars needed; accesses /app/core/var/data.db.
set -euo pipefail

# ── Helpers ──────────────────────────────────────────────────────────────────

log() { printf '[%s] %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$*"; }

die() { log "ERROR: $*" >&2; exit 1; }

# ── Args ─────────────────────────────────────────────────────────────────────

COMMAND="${1:-}"
[[ -n "${COMMAND}" ]] || die "Usage: backup.sh <db|files|prune>"

# ── Constants ─────────────────────────────────────────────────────────────────

DATE="$(date -u +%Y%m%d_%H%M%S)"
DUMP_FILE="/tmp/dump_${DATE}.sql.gz"
APP_VAR="/app/core/var"
SENTINEL_DIR="/var/node_exporter_textfiles"
SENTINEL="${SENTINEL_DIR}/ari_backup.prom"
DB_CONNECTION="${DB_CONNECTION:-sqlite}"

# ── Cleanup on exit ───────────────────────────────────────────────────────────

cleanup() { rm -f "${DUMP_FILE}"; }
trap cleanup EXIT

# ── Ensure Restic repository exists ──────────────────────────────────────────

if ! restic snapshots --quiet > /dev/null 2>&1; then
    log "Restic repository not found — initialising at ${RESTIC_REPOSITORY}"
    restic init
fi

# ── Commands ──────────────────────────────────────────────────────────────────

case "${COMMAND}" in

  db)
    log "Starting database backup (DB_CONNECTION=${DB_CONNECTION})"

    if [[ "${DB_CONNECTION}" == "mysql" ]]; then
      log "Dumping MariaDB: host=${BACKUP_MARIADB_HOST:-database} db=${BACKUP_MARIADB_DB:-}"
      # Use MYSQL_PWD to avoid password in process arguments (shellcheck SC2027).
      MYSQL_PWD="${BACKUP_MARIADB_PASSWORD:-}" \
        mariadb-dump \
          --single-transaction \
          --routines \
          --triggers \
          -h "${BACKUP_MARIADB_HOST:-database}" \
          -u "${BACKUP_MARIADB_USER:-}" \
          "${BACKUP_MARIADB_DB:-}" \
        | gzip > "${DUMP_FILE}"
    else
      log "Dumping SQLite: ${APP_VAR}/data.db"
      [[ -f "${APP_VAR}/data.db" ]] || die "SQLite database not found at ${APP_VAR}/data.db"
      sqlite3 "${APP_VAR}/data.db" ".dump" | gzip > "${DUMP_FILE}"
    fi

    log "Uploading database dump to Restic repository"
    restic backup "${DUMP_FILE}" \
      --tag "db" \
      --tag "${DB_CONNECTION}"

    # Write Prometheus textfile sentinel — node_exporter reads this to expose
    # ari_backup_last_success_timestamp_seconds for the BackupMissed alert.
    log "Writing backup sentinel to ${SENTINEL}"
    mkdir -p "${SENTINEL_DIR}"
    printf \
      '# HELP ari_backup_last_success_timestamp_seconds Unix timestamp of last successful backup.\n# TYPE ari_backup_last_success_timestamp_seconds gauge\nari_backup_last_success_timestamp_seconds %s\n' \
      "$(date +%s)" > "${SENTINEL}.tmp"
    mv "${SENTINEL}.tmp" "${SENTINEL}"

    log "Database backup completed successfully"
    ;;

  files)
    log "Starting file backup"
    STORAGE_DIR="${APP_VAR}/storage"

    if [[ ! -d "${STORAGE_DIR}" ]]; then
      log "Storage directory ${STORAGE_DIR} does not exist — skipping file backup"
      exit 0
    fi

    restic backup "${STORAGE_DIR}" --tag "files"
    log "File backup completed successfully"
    ;;

  prune)
    log "Starting retention prune (GFS: daily=7, weekly=4, monthly=12)"
    restic forget \
      --keep-daily 7 \
      --keep-weekly 4 \
      --keep-monthly 12 \
      --prune
    log "Prune completed successfully"
    ;;

  *)
    die "Unknown command '${COMMAND}'. Valid commands: db, files, prune"
    ;;

esac

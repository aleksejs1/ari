FROM alpine:3.21

# restic — backup tool with AES-256 encryption
# mariadb-client — provides mariadb-dump for MariaDB backups
# sqlite — provides sqlite3 CLI for SQLite backups
# tzdata — correct timestamps in cron logs
RUN apk add --no-cache \
    bash \
    restic \
    mariadb-client \
    sqlite \
    tzdata

COPY backup.sh /backup.sh
COPY crontab /var/spool/cron/crontabs/root

RUN chmod +x /backup.sh \
    && mkdir -p /var/node_exporter_textfiles

# crond -f: run in foreground; -d 8: log level debug (visible via docker logs)
CMD ["crond", "-f", "-d", "8"]

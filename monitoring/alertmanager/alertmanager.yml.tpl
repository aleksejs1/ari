global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'telegram'

receivers:
  - name: 'telegram'
    telegram_configs:
      - bot_token: '__TELEGRAM_BOT_TOKEN__'
        chat_id: __TELEGRAM_CHAT_ID__
        parse_mode: 'HTML'
        message: |
          {{ range .Alerts }}
          <b>[{{ .Labels.severity | toUpper }}] {{ .Labels.alertname }}</b>
          {{ .Annotations.summary }}
          {{ .Annotations.description }}
          {{ end }}

inhibit_rules:
  - source_matchers:
      - severity="critical"
    target_matchers:
      - severity="warning"
    equal: ['alertname']

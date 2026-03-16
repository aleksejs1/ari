global:
  scrape_interval: 15s      # faster in dev for quicker feedback
  evaluation_interval: 15s
  external_labels:
    app: ari

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - 'rules/ari.yml'

scrape_configs:
  - job_name: 'ari'
    static_configs:
      - targets: ['app:8000']   # dev server listens on 8000, not 8080
    metrics_path: '/metrics'
    authorization:
      credentials: __METRICS_SECRET__

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']

  - job_name: 'prometheus'
    static_configs:
      - targets: ['prometheus:9090']

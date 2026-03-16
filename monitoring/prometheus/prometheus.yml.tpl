global:
  scrape_interval: 30s
  evaluation_interval: 30s
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
      - targets: ['app:8080']
    metrics_path: '/metrics'
    http_config:
      headers:
        X-Metrics-Token: __METRICS_SECRET__

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node_exporter:9100']

  - job_name: 'prometheus'
    static_configs:
      - targets: ['prometheus:9090']

  - job_name: 'alloy'
    static_configs:
      - targets: ['alloy:12345']

#!/bin/bash
set -e

#############################
# UPDATE SYSTEM
#############################
yum update -y

#############################
# CREATE DIRECTORIES
#############################
mkdir -p /etc/prometheus
mkdir -p /etc/alertmanager
mkdir -p /opt/prometheus
mkdir -p /opt/alertmanager
mkdir -p /var/lib/prometheus
mkdir -p /var/lib/alertmanager

#############################
# INSTALL NODE EXPORTER
#############################
cd /tmp
curl -LO https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xzf node_exporter-1.6.1.linux-amd64.tar.gz
cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

cat << EOF > /etc/systemd/system/node_exporter.service
[Unit]
Description=Node Exporter
After=network.target

[Service]
ExecStart=/usr/local/bin/node_exporter
User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now node_exporter

#############################
# INSTALL PROMETHEUS
#############################
cd /tmp
curl -LO https://github.com/prometheus/prometheus/releases/download/v2.47.0/prometheus-2.47.0.linux-amd64.tar.gz
tar xzf prometheus-2.47.0.linux-amd64.tar.gz

cp prometheus-2.47.0.linux-amd64/prometheus /opt/prometheus/
cp prometheus-2.47.0.linux-amd64/promtool /opt/prometheus/
cp -r prometheus-2.47.0.linux-amd64/consoles /etc/prometheus/
cp -r prometheus-2.47.0.linux-amd64/console_libraries /etc/prometheus/

#############################
# PROMETHEUS CONFIG
#############################
cat << 'EOF' > /etc/prometheus/prometheus.yml
global:
  scrape_interval: 5s
  evaluation_interval: 5s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - "localhost:9093"

rule_files:
  - "/etc/prometheus/alert-rules.yml"

scrape_configs:
  - job_name: "node_exporters"
    static_configs:
      - targets:
          - "10.0.3.217:9100"
          - "10.0.5.216:9100"
          - "localhost:9100"

  - job_name: "cloudlibrary-backend"
    static_configs:
      - targets:
          - "10.0.5.216:3000"

  - job_name: "prometheus"
    static_configs:
      - targets:
          - "localhost:9090"
EOF

#############################
# PROMETHEUS ALERT RULES
#############################
cat << 'EOF' > /etc/prometheus/alert-rules.yml
groups:
  - name: system-alerts
    rules:
    - alert: HighCPUUsage
      expr: vector(1)
      for: 5s
      labels:
        severity: critical
      annotations:
        description: "Forced CPU alert (manual test)"

    - alert: HighPageHits
      expr: increase(cloudlibrary_page_hits_total[10s]) > 10
      for: 10s
      labels:
        severity: warning
      annotations:
        description: "Page hit spike detected"
EOF

#############################
# SYSTEMD SERVICE: PROMETHEUS
#############################
cat << EOF > /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus Server
After=network.target

[Service]
ExecStart=/opt/prometheus/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --web.listen-address=0.0.0.0:9090

User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now prometheus


#############################
# INSTALL ALERTMANAGER
#############################
cd /tmp
curl -LO https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz
tar xzf alertmanager-0.27.0.linux-amd64.tar.gz

cp alertmanager-0.27.0.linux-amd64/alertmanager /opt/alertmanager/
cp alertmanager-0.27.0.linux-amd64/amtool /opt/alertmanager/

#############################
# ALERTMANAGER CONFIG
#############################
cat << 'EOF' > /etc/alertmanager/alertmanager.yml
global:
  resolve_timeout: 1m

route:
  receiver: "slack_notifications"

receivers:
  - name: "slack_notifications"
    slack_configs:
      - send_resolved: true
        channel: "#alerts"
        api_url: "YOUR_SLACK_WEBHOOK_URL"
EOF

#############################
# ALERTMANAGER SYSTEMD SERVICE
#############################
cat << EOF > /etc/systemd/system/alertmanager.service
[Unit]
Description=Alertmanager
After=network.target

[Service]
ExecStart=/opt/alertmanager/alertmanager \
  --config.file=/etc/alertmanager/alertmanager.yml \
  --storage.path=/var/lib/alertmanager

User=root

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now alertmanager

#############################
# DONE
#############################
echo "Monitoring Stack Installed Successfully"

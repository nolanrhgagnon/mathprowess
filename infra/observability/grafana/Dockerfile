FROM grafana/grafana
COPY ./dashboards.yaml /etc/grafana/provisioning/dashboards/
COPY ./prometheus.yaml /etc/grafana/provisioning/datasources/
COPY ./dashboards/ /var/lib/grafana/dashboards/

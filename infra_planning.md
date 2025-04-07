---

# 🎯 Objective

✅ Web Application Firewall (WAF)  
✅ HashiCorp Vault (for secret management)  
✅ Monitoring via **Grafana + Prometheus**

---

# 🚀 Updated Justification for Order of Work

| Order | Component | Why This Order? |
|---|---|---|
| 1️⃣ | WAF | Since Nginx is already there, adding WAF as a **first security barrier** protects everything right away (frontend, backend, ELK). Immediate risk reduction. |
| 2️⃣ | Vault | Vault integration will change how you pass passwords, especially to Postgres, Elasticsearch, and Django. It’s foundational to secret management. |
| 3️⃣ | Monitoring | After the architecture is stabilized (with WAF & Vault in place), you observe how the whole system behaves — and build Grafana dashboards & alerts.

---

# 📆 Updated 2-Week Timeline (Infrastructure Enhancement)

| Day | Task | Description |
|---|---|---|
| 📍 Day 1 | Research WAF Options | You already have Nginx, so the natural choices are: <br>- **Nginx + ModSecurity** (recommended for flexibility) <br>- Traefik (if you want to move to modern reverse proxy in future). |
| 📍 Day 2-3 | Implement WAF (Nginx + ModSecurity) | Add WAF container or extend your existing **frontend-prod** service to run ModSecurity directly. Load basic rules (OWASP CRS). |
| 📍 Day 4 | Forward WAF Logs to ELK | Modify Logstash pipeline to parse WAF logs, and adjust GELF logging for Nginx if needed. |
| 📍 Day 5 | Research Vault Use Cases | Identify: <br>- Secrets to manage (DB, Elastic, JWT keys, TLS cert paths) <br>- Secret lifecycle (rotation?) <br>- Vault auth method (AppRole recommended for Docker services). |
| 📍 Day 6-7 | Deploy Vault | Add **vault** service to your prod compose. Store:<br>- Postgres credentials<br>- Elasticsearch credentials<br>- Future secrets like API keys or TLS private keys. |
| 📍 Day 8 | Modify Services to Pull Secrets from Vault | Example: Backend (Django) loads DB credentials from Vault at startup instead of `.env` files. |
| 📍 Day 9 | Research Prometheus Exporters | Target services: Docker, Postgres, Elasticsearch, Nginx, Vault |
| 📍 Day 10 | Deploy Prometheus & Grafana | Compose + configs for Prometheus scraping all needed targets. Add Grafana with pre-configured dashboards. |
| 📍 Day 11 | Create Dashboards | Examples: <br>- Nginx request metrics <br>- Elasticsearch cluster health <br>- Postgres performance <br>- Docker container health |
| 📍 Day 12 | Integrate Alerts | Grafana alerts for:<br>- WAF detects attack spike <br>- Elasticsearch down <br>- DB connection errors. |
| 📍 Day 13 | Full End-to-End Testing | Attack simulation, restart containers, secret rotation in Vault, validate dashboards. |
| 📍 Day 14 | Documentation & Final Demo | Document: <br>- Updated architecture <br>- Security flow (WAF + Vault) <br>- Monitoring flow (Prometheus + Grafana) <br>- Example dashboards. |

---

# 💼 Updated Architecture Diagram (Target)

```
                     +---------------+
                     |   Frontend    |
                     +---------------+
                             |
                             ▼
                 +------------------+
                 | Nginx + ModSec   |  (WAF Layer)
                 +------------------+
                             |
                             ▼
           +---------------------------------+
           | Backend (Django)                |
           +---------------------------------+
                     |
                     ▼
     +----------------------------+
     | PostgreSQL                  |
     +----------------------------+

                     +---------------------+
                     | ELK Stack            |
                     | (Logstash parses WAF)|
                     +---------------------+

                     +---------------------+
                     | Vault (Secrets)      |
                     +---------------------+

                     +---------------------+
                     | Prometheus + Grafana |
                     +---------------------+
```

---

# 📂 File Structure Example After This Work

```
.
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── 
├── docker-compose.vault.yml       # New
├── nginx/
│   ├── Dockerfile.prod
│   ├── nginx.conf
│   ├── modsecurity.conf          # New
│   ├── rules/                     # New (OWASP CRS rules here)
├── vault/                        # New
│   ├── policies/
│   ├── vault-config.hcl
├── ELK/
│   ├── docker-compose.elk.yml
│   ├── Elasticsearch/
│   ├── Logstash/
│   ├── kibana/
├── monitoring/                 # New
│   ├── docker-compose.monitoring.yml  
│   ├── prometheus/
│   │   ├── prometheus.yml
│   ├── grafana/
│   │   ├── dashboards/
```

---

# ⚙️ Example WAF Service (in `docker-compose.prod.yml`)

```yaml
  waf:
    image: owasp/modsecurity-crs:nginx
    container_name: waf
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/modsecurity.conf:/etc/modsecurity/modsecurity.conf:ro
      - ./nginx/rules:/etc/nginx/modsec_rules:ro
    ports:
      - "${FRONT_PORT}:80"
      - "${HTTPS_PORT}:443"
    depends_on:
      - backend
    networks:
      - web
    logging:
      driver: gelf
      options:
        gelf-address: "udp://logstash:12201"
        tag: "waf"
```

---

# 🌐 Key Recommendations

✅ **WAF Logs to Logstash**  
You can either log directly in GELF.  

✅ **Vault Secrets Injection**  
For maximum security, avoid environment variables. Instead, use init scripts in containers that fetch secrets from Vault and inject into Django settings or Elasticsearch config files.

✅ **Prometheus Targets**  
- Nginx exporter (WAF & web metrics)
- Elasticsearch exporter (official)
- Postgres exporter (official)
- Vault metrics endpoint

✅ **Grafana Dashboards**  
- WAF Threat Monitoring
- Elasticsearch Cluster Health
- Postgres Performance
- Docker Container Health

---

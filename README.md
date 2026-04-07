# ft_transcendence

ft_transcendence is the final project of the 42 core curriculum. The premise is deceptively simple — build a multiplayer Pong website — but the real scope is defined by a catalog of optional modules, each evaluated independently. A team of four, we completed 6 major modules and 5 minor modules (8.5 major-equivalents), well beyond the required minimum of 7.

I owned the infrastructure: containerization strategy, NGINX reverse proxy, SSL configuration, the full ELK logging stack, and the microservices architecture. I also acted as technical reference for the team — running security tests manually, onboarding teammates on backend architecture, and coordinating architectural decisions across the stack.

> Built with [@Lochane](https://github.com/Lochane/) (backend), [@barbiloup](https://github.com/barbiloup) (frontend), and [@elnop](https://github.com/elnop) (game engine & frontend technical lead).

---

## Modules completed

The 42 subject defines a set of optional modules scored individually. Each major module is worth 10 points; two minor modules equal one major.

| Module | Weight | Owner |
|---|---|---|
| Backend Framework — Django replacing the default Ruby stack | Major | Lochane |
| Standard User Management — auth, profiles, match history, friends | Major | Lochane (backend) · barbiloup (frontend) |
| Remote Authentication — OAuth 2.0 with 42 | Major | — |
| 2FA + JWT — two-factor auth with OTP and token-based sessions | Major | Lochane |
| ELK Log Management — centralized logging infrastructure | Major | Me |
| Backend as Microservices | Major | Me |
| Advanced 3D Graphics — Three.js/WebGL game rendering | Major | Elnop |
| Frontend Toolkit — Vite build tooling | Minor | — |
| PostgreSQL Database | Minor | — |
| Game Customization Options | Minor | — |
| User and Game Stats Dashboards | Minor | — |
| Support on all devices | Minor | — |

The default stack imposed by 42 is Ruby backend + vanilla JS frontend. Django, PostgreSQL, and Three.js were each explicit module choices that replaced or extended those defaults, with the associated constraints and evaluation requirements.

---

## What I built

| Area | Details |
|---|---|
| **Project foundation** | Directory structure, all Dockerfiles, both Compose profiles (dev + prod), inter-service networking, Makefile automation. Set up before any feature work began, then onboarded the team on the architecture. |
| **ELK log management** | Logstash with grok pipelines, Elasticsearch with daily ILM index rotation and SLM snapshot policies, Kibana dashboards. All service logs (NGINX, Django, PostgreSQL) routed via GELF/UDP. ELK isolated on a dedicated Docker network and excluded from the dev profile to avoid ~6 GB RAM overhead during development. |
| **Microservices architecture** | Structured the backend as loosely-coupled services with clearly defined interfaces, enabling independent deployment of each component. |
| **Security hardening** | HTTPS with HSTS, X-Frame-Options, XSS protection headers, and CORS policy configured at the NGINX level. JWT tokens short-lived with refresh rotation. |
| **Manual security testing** | Probed SQL injection vectors across all user-controlled inputs, tested XSS payloads in display name and avatar fields, verified authentication edge cases (expired tokens, concurrent sessions), audited password policy enforcement. |
| **SSL on a constrained environment** | 42 machines run Docker in rootless mode with restrictions on bind-mount volumes. Generating and distributing self-signed certificates across services under those constraints required workarounds not covered by the documentation. |
| **Technical reference** | Coordinated technology choices with the team (Django, PostgreSQL, Three.js) and served as technical reference on infrastructure, architecture, and backend. This role was shared with Elnop, who covered the frontend, game development, and general codebase side. |

---

## Architecture

```
┌──────────────────────────────────────────┐
│         NGINX (Reverse Proxy)            │
│    SSL/TLS · Security Headers · CORS     │
└──────────────┬───────────────────────────┘
               │
     ┌─────────┴──────────┐
     ▼                    ▼
┌─────────────┐    ┌──────────────────┐
│ Django DRF  │◄──►│ Django Channels  │
│  REST API   │    │ WebSocket (ASGI) │
└──────┬──────┘    └──────────────────┘
       │
       ▼
┌─────────────────┐
│  PostgreSQL 15  │
└────────┬────────┘
         │ GELF/UDP
         ▼
┌──────────────────────────────┐
│          ELK Stack           │
│  Logstash (grok pipelines)   │
│  Elasticsearch (ILM indices) │
│  Kibana (dashboards)         │
└──────────────────────────────┘
```

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vite · Three.js/WebGL · Vanilla JS SPA (42 constraint) |
| Backend | Django 5.0 · Django REST Framework · Django Channels |
| Real-time | Daphne (ASGI) · Redis (channel layer) |
| Auth | JWT (simplejwt) · TOTP 2FA (email + authenticator app) |
| Database | PostgreSQL 15 |
| Proxy | NGINX · SSL/TLS (self-signed RSA 2048) |
| Logging | Logstash · Elasticsearch · Kibana · GELF/UDP |
| Infra | Docker · Docker Compose (dev + prod profiles) |

---

## Getting started

**Prerequisites:** Docker + Docker Compose v2, GNU Make, ~8 GB RAM (ELK requires ~6 GB alone), ~20 GB disk.

```bash
# Development — hot reload, no ELK overhead
make
# Frontend → http://localhost:3000
# API      → http://localhost:8000
# Swagger  → http://localhost:8000/swagger/

# Production — HTTPS + full ELK stack
make prod
# App    → https://localhost
# Kibana → http://localhost:5601
```

---

## Repository structure

```
ft_transcendence/
├── docker-compose.dev.yml          # Lightweight dev stack (no ELK)
├── docker-compose.prod.yml         # Production + ELK
├── Makefile
├── infra_planning.md               # Infrastructure roadmap (WAF, Vault, Prometheus)
│
├── backend/
│   ├── Dockerfile.dev
│   ├── requirements.txt
│   ├── setup.sh                    # Init script (migrations, admin seed)
│   └── src/ft_transcendence/
│       ├── billpong/               # Django project config (settings, ASGI, URLs)
│       └── api/                    # Models, views, consumers, serializers, cron
│
├── frontend/
│   ├── Dockerfile.dev              # Vite + HMR
│   ├── Dockerfile.prod             # NGINX + static build
│   ├── default.conf                # NGINX reverse proxy config
│   └── src/
│       ├── js/
│       │   ├── pong-game/          # Three.js game engine
│       │   ├── game_pages/         # UI components
│       │   ├── api/                # API client (routes, utils)
│       │   └── utils/              # Auth, WebSocket, profile helpers
│       └── css/
│
├── ELK/
│   ├── docker-compose.yml
│   ├── Logstash/
│   │   └── logstash.conf           # Grok pipelines (GELF input)
│   ├── Elasticsearch/
│   │   ├── elasticsearch.yml
│   │   ├── setup.sh                # Cluster init
│   │   └── policy_scripts/
│   │       ├── ilm_policy/         # Index lifecycle (rollover, delete)
│   │       ├── slm_policy/         # Weekly snapshot scheduling
│   │       ├── snapshot_repository/
│   │       └── index_template/
│   └── README.md
│
├── infra_script/
│   └── ELK/
│       ├── trigger_snapshot.sh     # Manual snapshot trigger
│       ├── check_archive.sh        # Snapshot status check
│       └── list_slm.sh
│
└── nginx/
    └── ssl/                        # Generated self-signed certificates
```
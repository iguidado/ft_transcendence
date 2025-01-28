# Ft-transcendence makefile


# Build configuration
# ------------------------

BUILD_FILE=docker-compose.yml
DC=docker compose


# SSL configuration path
# ------------------------
CERT_DIR=nginx/ssl/
KEY_FILE=privkey.pem
CERT_FILE=fullchain.pem


# Frontend development paths
# --------------------------

DEV_DIR=frontend/dev/
PKG_FILE=package-lock.json
VITE_CFG=vite.config.js

# Main Commands:
# -------------
# make          : Starts development environment with dev profile after setup
# make build    : Rebuilds and starts containers
# make prod     : Starts production environment with prod profile
# make down     : Stops development environment
# make prod-down: Stops production environment
# make clean    : Removes stopped containers and dangling resources
# make fclean   : Complete cleanup (stops containers, removes images and dev folder)
# make re       : Full rebuild (fclean + all)
# make monitoring: Starts monitoring services
# make log      : Alias for monitoring
#

# Frontend dev environment Setup:
# ------------------------------------

all: $(BUILD_FILE) $(DEV_DIR)$(PKG_FILE) .env
	sed -i "s/\(.*=\).*/\1/" .env.dev 
	$(DC) --profile dev up -d

.env:
	cp .env.dev .env

# Dev environment Setup:
# ------------------------------------

$(DEV_DIR)$(PKG_FILE): $(DEV_DIR)
	npm create vite@latest frontend/dev -- --template vanilla -y \
		&& cd $(DEV_DIR) && npm install
	rm -f $(DEV_DIR)index.html
	rm -rf $(DEV_DIR)src $(DEV_DIR)public


$(DEV_DIR):
	mkdir -p $(DEV_DIR)

down:
	-$(DC) --profile=dev down


build:
	$(DC) up --build -d


monitoring:
	$(DC) --profile=monitoring up


log:
	$(DC) --profile=monitoring up

 
# Prod environment Setup:
# ------------------------------------

prod: $(CERT_DIR)$(CERT_FILE) $(CERT_DIR)$(KEY_FILE) 
	cp .env.prod .env
	$(DC) --profile prod up -d


$(CERT_DIR):
	mkdir -p $(CERT_DIR)


$(CERT_DIR)$(CERT_FILE)  $(CERT_DIR)$(KEY_FILE): $(CERT_DIR)
	openssl req -x509 -nodes -newkey rsa:2048 \
		-keyout $(CERT_DIR)$(KEY_FILE) -out $(CERT_DIR)$(CERT_FILE) \
		-days 825 \
		-subj "/C=XX/ST=State/L=City/O=Organization/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

prod-down:
	-$(DC) --profile=prod down


# Cleaning command
# ----------------------------------------

clean:
	$(DC) rm #Clean stopped container
	docker system prune #Clean all dangling entity


fclean: down prod-down
	-docker rmi frontend:local backend:local postgres:15-alpine
	-rm -rf frontend/dev


re: fclean all


.PHONY: all bg monitoring log down

# Ft-transcendence makefile

# NPM Dependencies
# ------------------------

NPM_DEPS=three
STACK_V=8.7.1

# Build configuration
# ------------------------

DEV_CMP=docker-compose.dev.yml
PROD_CMP=docker-compose.prod.yml
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
# make prod-re  : Restart production environment
# make clean    : Removes stopped containers and dangling resources
# make fclean   : Complete cleanup (stops containers, removes images and dev folder)
# make re       : Full rebuild (fclean + all) : Delete everything but the site
# make monitoring: Starts monitoring services
#

# Frontend dev environment Setup:
# ------------------------------------

all: $(DEV_CMP) $(DEV_DIR)$(PKG_FILE) dev .env
	sed -i "s/\(.*=\).*/\1/" .env.dev

dev:
	$(DC) -f docker-compose.dev.yml up -d

.env:
	cp .env.dev .env


# Dev environment Setup:
# ------------------------------------

$(DEV_DIR)$(PKG_FILE): $(DEV_DIR)
	sudo npm create vite@latest frontend/dev -- --template vanilla -y \
		&& cd $(DEV_DIR) && sudo npm install && sudo npm install --save $(NPM_DEPS)
	sudo rm -f $(DEV_DIR)index.html
	sudo rm -rf $(DEV_DIR)src $(DEV_DIR)public


$(DEV_DIR):
	mkdir -p $(DEV_DIR)

down:
	-$(DC) -f docker-compose.dev.yml down


build: $(DEV_CMP)
	$(DC) -f docker-compose.dev.yml up --build -d


monitoring:
	$(DC) -f docker-compose.prod.yml --profile=monitoring up


# Prod environment Setup:
# ------------------------------------

prod: $(CERT_DIR)$(CERT_FILE) $(CERT_DIR)$(KEY_FILE) .env
	$(DC) -f docker-compose.prod.yml up --build -d


$(CERT_DIR):
	mkdir -p $(CERT_DIR)


$(CERT_DIR)$(CERT_FILE)  $(CERT_DIR)$(KEY_FILE): $(CERT_DIR)
	openssl req -x509 -nodes -newkey rsa:2048 \
		-keyout $(CERT_DIR)$(KEY_FILE) -out $(CERT_DIR)$(CERT_FILE) \
		-days 825 \
		-subj "/C=XX/ST=State/L=City/O=Organization/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

prod-down:
	-$(DC) -f docker-compose.prod.yml down

prod-re: prod-down prod

# Cleaning command
# ----------------------------------------

clean:
	$(DC) -f docker-compose.dev.yml rm -f  #Clean stopped container
	@sed -i "s/\(.*=\).*/\1/" .env.dev 
	@sed -i "s/\(.*=\).*/\1/" .env.prod
	@echo "Cleaned .env.{dev;prod} files"
	@docker system prune #Clean all dangling entity


fclean: down prod-down
	@-docker rmi frontend:prod frontend:dev backend:local postgres:15-alpine
	@-docker rmi -f docker.elastic.co/kibana/kibana:$(STACK_V)  docker.elastic.co/logstash/logstash:$(STACK_V) docker.elastic.co/elasticsearch/elasticsearch:$(STACK_V) ft_transcendence-setup
	@Deleted every images
	@Deleting every volumes
	-@docker volume rm $$(docker volume ls -q)
	-sudo rm -rf frontend/dev

re: fclean all

.PHONY: all dev down prod prod-down prod-re clean fclean re

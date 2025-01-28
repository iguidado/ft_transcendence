BUILD_FILE=docker-compose.yml

DC=docker compose

CERT_DIR=nginx/ssl/
KEY_FILE=privkey.pem
CERT_FILE=fullchain.pem

DEV_DIR=frontend/dev/
PKG_FILE=package-lock.json

VITE_CFG=vite.config.js

all: $(BUILD_FILE) $(CERT_DIR)$(CERT_FILE) $(CERT_DIR)$(KEY_FILE) $(DEV_DIR)$(PKG_FILE) .env
	sed -i "s/\(.*=\).*/\1/" .env.dev 
	$(DC) --profile dev up -d


.env:
	cp .env.dev .env


build:
	$(DC) up --build -d


$(DEV_DIR)$(PKG_FILE): $(DEV_DIR)
	npm create vite@latest frontend/dev -- --template vanilla -y \
		&& cd $(DEV_DIR) && npm install
	rm -f $(DEV_DIR)index.html
	rm -rf $(DEV_DIR)src $(DEV_DIR)public



$(DEV_DIR):
	mkdir -p $(DEV_DIR)


monitoring:
	$(DC) --profile=monitoring up


log:
	$(DC) --profile=monitoring up


down:
	-$(DC) --profile=dev down

prod: 
	cp .env.prod .env
#	sed -i "s/\(.*=\).*/\1/" .env.prod 
	$(DC) --profile prod up -d

prod-down:
	-$(DC) --profile=prod down


clean:
	$(DC) rm #Clean stopped container
	docker system prune #Clean all dangling entity


fclean: down prod-down
	-docker rmi frontend:local backend:local postgres:15-alpine
	-rm -rf frontend/dev


re: fclean all


$(CERT_DIR):
	mkdir -p $(CERT_DIR)


$(CERT_DIR)$(CERT_FILE)  $(CERT_DIR)$(KEY_FILE): $(CERT_DIR)
	openssl req -x509 -nodes -newkey rsa:2048 \
		-keyout $(CERT_DIR)$(KEY_FILE) -out $(CERT_DIR)$(CERT_FILE) \
		-days 825 \
		-subj "/C=XX/ST=State/L=City/O=Organization/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"


.PHONY: all bg monitoring log down

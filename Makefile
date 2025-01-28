BUILD_FILE=docker-compose.yml

DC=docker compose

CERT_DIR=nginx/ssl/
KEY_FILE=privkey.pem
CERT_FILE=fullchain.pem


all: $(BUILD_FILE) $(CERT_DIR)$(CERT_FILE) $(CERT_DIR)$(KEY_FILE) .env
	sed -i "s/\(.*=\).*/\1/" .env.dev 
	$(DC) up -d


.env:
	cp .env.dev .env

build:
	$(DC) up --build -d


monitoring:
	$(DC) --profile=monitoring up


log:
	$(DC) --profile=monitoring up


down:
	$(DC) down


clean:
	docker compose rm #Clean stopped container
	docker system prune #Clean all dangling entity


fclean: down
	-docker rmi frontend:local backend:local postgres:15-alpine


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

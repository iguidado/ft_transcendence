BUILD=docker-compose.yml

DC=docker compose


all:$(BUILD) .env
	sed -i "s/\(.*=\).*/\1/" .env.dev 
	$(DC) up -d


.env:
	cp .env.dev

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
	docker rmi frontend:local backend:local postgres:15-alpine


re: fclean all


.PHONY: all bg monitoring log down

BUILD=docker-compose.yml

DC=docker compose


all:$(BUILD)
	cp .env.dev .env
	$(DC) up -d

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

fclean:
	echo "need to add a full clean command to makefile. It should clean database but don't touch to website !"

re: down all

.PHONY: all bg monitoring log down

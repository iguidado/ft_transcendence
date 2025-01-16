BUILD=docker-compose.yml

DC=docker compose


all:$(BUILD)
	$(DC) up --build

bg:
	$(DC) up --build -d

monitoring:
	$(DC) --profile=monitoring up

log:
	$(DC) --profile=monitoring up

down:
	$(DC) down

re: down bg

.PHONY: all bg monitoring log down

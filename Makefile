BUILD=docker-compose.yml

DC=docker compose


all:$(BUILD)
	cp .env.dev .env
	sed -i "s/\(.*=\).*/\1/" .env.dev 
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


fclean: down
	docker rmi $$(docker images -aq)


re: down all


.PHONY: all bg monitoring log down

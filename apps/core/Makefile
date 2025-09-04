.PHONY: rebuild
rebuild:
	@docker compose build app

.PHONY: create-migration
create-migration:
	@./scripts/typeorm-create-migration.sh $(name)

.PHONY: lint
lint:
	@docker compose run --remove-orphans app yarn lint

.PHONY: migrate
migrate:
	@docker compose up migrate

.PHONY: test
test:
	@docker compose up test

.PHONY: test-unit
test-unit:
	@docker compose run --remove-orphans test yarn test:unit

.PHONY: test-functional
test-functional:
	@docker compose run --remove-orphans test yarn test:functional

.PHONY: up
up:
	@docker compose up app

.PHONY: down
down:
	@docker compose down app
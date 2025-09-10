.PHONY: help
help:
	@echo ""
	@cat ../../scripts/ol-logo.txt
	@echo ""
	@echo "A flexible open-source ledger for tracking any type of asset. Store, manage, and audit all your transactions in one place."
	@echo ""
	@echo "Makefile commands:"
	@echo ""
	@echo "make help                                    Show this help message"
	@echo "make rebuild                                 Rebuild the Docker image for the app"
	@echo "make lint                                    Run linting on the codebase"
	@echo "make migrate                                 Run database migrations"
	@echo "make create-migration name=<migration-name>  Create a new database migration"
	@echo "make test                                    Run all tests"
	@echo "make test-cov                                Run all tests with coverage"
	@echo "make test-unit                               Run unit tests"
	@echo "make test-functional                         Run functional tests"
	@echo "make up                                      Start the application"
	@echo "make down                                    Stop the application"
	@echo ""

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

.PHONY: test-cov
test-cov:
	@docker compose run --remove-orphans test yarn test:cov

.PHONY: test-unit
test-unit:
	@docker compose run --remove-orphans test yarn test:unit:debug

.PHONY: test-functional
test-functional:
	@docker compose run --remove-orphans test yarn test:functional

.PHONY: up
up: migrate
	@docker compose up app

.PHONY: down
down:
	@docker compose down
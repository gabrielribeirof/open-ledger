rebuild:
	@docker compose build app

test: migrate
	@docker compose up --abort-on-container-exit test

test-unit:
	@docker compose run app yarn test:unit

migrate:
	@docker compose up migrate

up:
	@docker compose up app

down:
	@docker compose down app
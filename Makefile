test: migrate
	@docker compose up --abort-on-container-exit test

migrate:
	@docker compose up migrate

up:
	@docker compose up api
CORE_DIR := ./apps/core

APPS := $(CORE_DIR)

.PHONY: help
help:
	@echo ""
	@cat ./scripts/ol-logo.txt
	@echo ""
	@echo "A flexible open-source ledger for tracking any type of asset. Store, manage, and audit all your transactions in one place."
	@echo ""
	@echo "Makefile commands:"
	@echo ""
	@echo " make help                                    Show this help message"
	@echo " make set-env                                 Set up environment variables"
	@echo " make up                                      Start all applications"
	@echo " make down                                    Stop all applications"
	@echo ""

.PHONY: set-env
set-env:
	@echo "Setting up .env files for all apps..."
	@for dir in $(APPS); do \
		if [ -f $$dir/.env.example ] && [ ! -f $$dir/.env ]; then \
			cp $$dir/.env.example $$dir/.env; \
			echo "Created $$dir/.env from $$dir/.env.example"; \
		elif [ ! -f "$$dir/.env.example" ]; then \
			echo "Warning: No .env.example found in $$dir"; \
		else \
			echo ".env already exists in $$dir"; \
		fi; \
	done
	@echo "All .env files are set up."

.PHONY: up
up:
	@echo "Starting all applications..."
	@for dir in $(APPS); do \
		echo "Starting application in $$dir..."; \
		(cd $$dir && make up); \
	done
	@echo "All applications started."

.PHONY: down
down:
	@echo "Stopping all applications..."
	@for dir in $(APPS); do \
		echo "Stopping application in $$dir..."; \
		(cd $$dir && make down); \
	done
	@echo "All applications stopped."
# include .env files if they exist
-include .env

install: install-backend install-frontend

install-dev: install-dev-backend install-dev-frontend

install-backend:
	@ echo -e "$(BUILD_PRINT)Installing the BACKEND requirements$(END_BUILD_PRINT)"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

install-dev-backend:
	@ echo -e "$(BUILD_PRINT)Installing the dev BACKEND requirements$(END_BUILD_PRINT)"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.dev.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

install-frontend:
	@ echo -e "$(BUILD_PRINT)Installing the FRONTEND requirements$(END_BUILD_PRINT)"

install-dev-frontend:
	@ echo -e "$(BUILD_PRINT)Installing the dev FRONTEND requirements$(END_BUILD_PRINT)"

test: test-unit
test-unit: test-unit-backend test-unit-frontend
test-e2e: test-e2e-backend test-e2e-frontend

test-unit-backend:
	@ echo "$(BUILD_PRINT)UNIT Testing BACKEND ... $(END_BUILD_PRINT)"
	@ tox -e unit backend

test-unit-frontend:
	@ echo "$(BUILD_PRINT)UNIT Testing FRONTEND ... $(END_BUILD_PRINT)"
	@ tox -e unit frontend

test-e2e-backend:
	@ echo "$(BUILD_PRINT)E2E Testing BACKEND ... $(END_BUILD_PRINT)"
	@ tox -e e2e backend

test-e2e-frontend:
	@ echo "$(BUILD_PRINT)E2E Testing FRONTEND ... $(END_BUILD_PRINT)"
	@ tox -e e2e frontend

PACKAGE_NAME := mapping_workbench
FRONTEND_HOME := ${PACKAGE_NAME}/frontend
FRONTEND_DEVELOPMENT_ENV_FILE := ${FRONTEND_HOME}/.env.development
FRONTEND_DEVELOPMENT_PORT := 3001

# include .env files if they exist
-include .env

install: install-backend install-frontend

install-dev: install-dev-backend install-dev-frontend

install-backend:
	@ echo "Installing BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

install-dev-backend:
	@ echo "Installing dev BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.dev.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

install-frontend:
	@ echo "Installing FRONTEND requirements"
	@ cd ${FRONTEND_HOME} && npm install

install-dev-frontend:
	@ echo "Installing dev FRONTEND requirements"

build-frontend:
	@ echo "Building FRONTEND"
	@ cd ${FRONTEND_HOME} && npm run build

start-frontend:
	@ echo "Starting FRONTEND"
	@ cd ${FRONTEND_HOME} && npm run start

init-frontend-env-development:
	@ echo "Init FRONTEND .env.development"
	@ echo "NODE_ENV=development" > ${FRONTEND_DEVELOPMENT_ENV_FILE}
	@ echo "PORT=${FRONTEND_DEVELOPMENT_PORT}" >> ${FRONTEND_DEVELOPMENT_ENV_FILE}

test: test-unit
test-unit: test-unit-backend test-unit-frontend
test-e2e: test-e2e-backend test-e2e-frontend

test-unit-backend:
	@ echo "UNIT Testing BACKEND ... "
	@ tox -e unit backend

test-unit-frontend:
	@ echo "UNIT Testing FRONTEND ... "
	@ cd ${FRONTEND_HOME} && npm run test
#	@ tox -e unit frontend

test-e2e-backend:
	@ echo "E2E Testing BACKEND ... "
	@ tox -e e2e backend

test-e2e-frontend:
	@ echo "E2E Testing FRONTEND ... "

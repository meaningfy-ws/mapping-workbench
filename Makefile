PROJECT_PATH = $(shell pwd)

NAME := mapping_workbench
FRONTEND_HOME := ${NAME}/frontend
FRONTEND_DEVELOPMENT_ENV_FILE := ${FRONTEND_HOME}/.env.development
FRONTEND_DEVELOPMENT_PORT := 3001
PM2_SCRIPT := ${PROJECT_PATH}/${FRONTEND_HOME}/node_modules/pm2/bin/pm2

ENV_FILE := .env

# include .env files if they exist
-include .env

install: install-toolchain install-backend install-frontend

install-dev: install-dev-toolchain install-dev-backend install-dev-frontend

install-toolchain:
	@ echo "Installing TOOLCHAIN requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.toolchain.txt

install-dev-toolchain:
	@ echo "Installing dev TOOLCHAIN requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.toolchain.dev.txt

install-backend:
	@ echo "Installing BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.backend.txt

install-dev-backend:
	@ echo "Installing dev BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.backend.dev.txt

install-all-backend: install-backend install-dev-backend

start-dev-backend:
	@ echo "Starting BACKEND"
	@ uvicorn --host localhost --port 8000 mapping_workbench.core.entrypoints.api.main:app --reload

stop-dev-backend:
	@ echo "Stopping BACKEND"
	@ cd ${FRONTEND_HOME} && ${PM2_SCRIPT} delete ${NAME}

install-frontend:
	@ echo "Installing FRONTEND requirements"
	@ cd ${FRONTEND_HOME} && npm install --production

install-dev-frontend:
	@ echo "Installing dev FRONTEND requirements"
	@ cd ${FRONTEND_HOME} && npm install --only=dev

install-all-frontend: install-frontend install-dev-frontend

build-dev-frontend:
	@ echo "Building FRONTEND"
	@ cd ${FRONTEND_HOME} && npm run build

start-dev-frontend:
	@ echo "Starting FRONTEND"
	@ cd ${FRONTEND_HOME} && ${PM2_SCRIPT} start npm --name ${NAME} -- run start

stop-dev-frontend:
	@ echo "Stopping FRONTEND"
	@ cd ${FRONTEND_HOME} && ${PM2_SCRIPT} delete ${NAME}

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

start-backend-dev-api:
	uvicorn mapping_workbench.core.entrypoints.api.main:app --reload


dev-dotenv-file:
	@ echo "Creating DEV .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > .env
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> .env
	@ echo DOMAIN=localhost >> .env
	@ echo ENVIRONMENT=dev >> .env
	@ echo SUBDOMAIN= >> .env
	@ vault kv get -format="json" mapping-workbench/dev | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env

staging-dotenv-file:
	@ echo "Creating STAGING .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > .env
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> .env
	@ echo ENVIRONMENT=dev >> .env
	@ vault kv get -format="json" mapping-workbench/staging | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env

clear-frontend:
	@ cd ${FRONTEND_HOME} && rm -rf build && rm -rf node_modules && rm -f .env* &&  rm -f package-lock.json

build-backend:
	@ echo "Building the BACKEND"
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} build --no-cache --force-rm
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} up -d --force-recreate

start-backend:
	@ echo "Starting the BACKEND"
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-backend:
	@ echo "Stopping the BACKEND"
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} down

build-frontend:
	@ echo "Building the FRONTEND"
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} build --no-cache --force-rm
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} up -d --force-recreate

start-frontend:
	@ echo "Starting the FRONTEND"
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-frontend:
	@ echo "Stopping the FRONTEND"
	@ docker-compose -p ${ENVIRONMENT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} down
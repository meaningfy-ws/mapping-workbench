PROJECT_PATH = $(shell pwd)

ENV_FILE := .env

NAME := mapping_workbench
BACKEND_INFRA_FOLDER := ${PROJECT_PATH}/${NAME}/backend
FRONTEND_HOME := ${NAME}/frontend
FRONTEND_INFRA_FOLDER := ${PROJECT_PATH}/${FRONTEND_HOME}
FRONTEND_ENV_FILE := ${FRONTEND_HOME}/${ENV_FILE}
PM2_SCRIPT := ${PROJECT_PATH}/${FRONTEND_HOME}/node_modules/pm2/bin/pm2


# include .env files if they exist
-include ${ENV_FILE}

install: install-backend install-frontend

install-dev: install-dev-backend install-frontend-dev

install-backend:
	@ echo "Installing BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.txt

install-dev-backend:
	@ echo "Installing dev BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.dev.txt

install-frontend-dev:
	@ cd ${FRONTEND_HOME} && make install-${ENVIRONMENT}-frontend

install-all-backend: install-backend install-dev-backend

install-frontend:
	@ cd ${FRONTEND_HOME} && make install-${ENVIRONMENT}-frontend

test: test-unit
test-unit: test-unit-backend test-unit-frontend
test-e2e: test-e2e-backend test-e2e-frontend

test-unit-backend:
	@ echo "UNIT Testing BACKEND ... "
	@ tox -e unit -- backend

test-unit-frontend:
	@ echo "UNIT Testing FRONTEND ... "
	@ cd ${FRONTEND_HOME} && npm run test
#	@ tox -e unit frontend

test-e2e-backend:
	@ echo "E2E Testing BACKEND ... "
	@ tox -e e2e -- backend

test-e2e-frontend:
	@ echo "E2E Testing FRONTEND ... "

start-backend-dev-api:
	uvicorn mapping_workbench.backend.core.entrypoints.api.main:app --reload

build-frontend-dev:
	@ echo "Building FRONTEND"
	@ cd ${FRONTEND_HOME} && npm run build

start-frontend-dev:
	@ echo "Starting FRONTEND"
	@ cd ${FRONTEND_HOME} && make start-dev-frontend


dev-dotenv-file:
	@ echo "Creating DEV .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > ${ENV_FILE}
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> ${ENV_FILE}
	@ echo BACKEND_INFRA_FOLDER=${BACKEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo FRONTEND_INFRA_FOLDER=${FRONTEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo NODE_ENV=development >> ${ENV_FILE}
	@ vault kv get -format="json" mapping-workbench-dev/app | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> ${ENV_FILE}

staging-dotenv-file:
	@ echo "Creating STAGING .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > ${ENV_FILE}
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> ${ENV_FILE}
	@ echo BACKEND_INFRA_FOLDER=${BACKEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo FRONTEND_INFRA_FOLDER=${FRONTEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo NODE_ENV=development >> ${ENV_FILE}
	@ vault kv get -format="json" mapping-workbench-staging/app | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> ${ENV_FILE}

prod-dotenv-file:
	@ echo "Creating PROD .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > ${ENV_FILE}
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> ${ENV_FILE}
	@ echo BACKEND_INFRA_FOLDER=${BACKEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo FRONTEND_INFRA_FOLDER=${FRONTEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo NODE_ENV=production >> ${ENV_FILE}
	@ vault kv get -format="json" mapping-workbench-prod/app | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> ${ENV_FILE}

clear-frontend:
	@ cd ${FRONTEND_HOME} && rm -rf build && rm -rf node_modules && rm -f .env* &&  rm -f package-lock.json


create-env-backend:
	@ echo "Creating BACKEND env"
	@ echo "${BACKEND_INFRA_FOLDER} ${ENVIRONMENT}"
#	@ ln -s -f -n ${PROJECT_PATH}/mapping_workbench/backend ${AIRFLOW_INFRA_FOLDER}/mapping_workbench/backend

build-backend: create-env-backend
	@ echo "Building the BACKEND"
	@ docker-compose -p ${NAME} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${NAME} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} up -d --force-recreate

start-backend:
	@ echo "Starting the BACKEND"
	@ docker-compose -p ${NAME} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-backend:
	@ echo "Stopping the BACKEND"
	@ docker-compose -p ${NAME} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} down

build-frontend:
	@ echo "Building the FRONTEND"
	@ docker-compose -p ${NAME} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${NAME} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} up -d --force-recreate

start-frontend:
	@ echo "Starting the FRONTEND"
	@ docker-compose -p ${NAME} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-frontend:
	@ echo "Stopping the FRONTEND"
	@ docker-compose -p ${NAME} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} down

#-----------------------------------------------------------------------------
# SERVER SERVICES
#-----------------------------------------------------------------------------
build-externals:
	@ echo "Creating the necessary volumes, networks and folders and setting the special rights"
	@ docker network create proxy-net || true
	@ docker network create common-ext-${ENVIRONMENT} || true

start-traefik: build-externals
	@ echo "Starting the Traefik services"
	@ docker-compose -p common --file ./infra/traefik/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-traefik:
	@ echo "Stopping the Traefik services"
	@ docker-compose -p common --file ./infra/traefik/docker-compose.yml --env-file ${ENV_FILE} down

start-mongo: build-externals
	@ echo "Starting the Mongo services"
	@ docker-compose -p ${NAME} --file ./infra/mongodb/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-mongo:
	@ echo "Stopping the Mongo services"
	@ docker-compose -p ${NAME} --file ./infra/mongodb/docker-compose.yml --env-file ${ENV_FILE} down
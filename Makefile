PROJECT_PATH = $(shell pwd)

ENV_FILE := .env

# include .env files if they exist
-include ${ENV_FILE}

NAME := mapping_workbench
DOCKER_PROJECT := ${NAME}_${ENVIRONMENT}
BACKEND_INFRA_FOLDER := ${PROJECT_PATH}/${NAME}/backend
FRONTEND_HOME := ${NAME}/frontend
FRONTEND_INFRA_FOLDER := ${PROJECT_PATH}/${FRONTEND_HOME}

RML_MAPPER_PATH = ${PROJECT_PATH}/.rmlmapper/rmlmapper.jar

PYTHON := python3
APP_VERSION_SCRIPT := ${BACKEND_INFRA_FOLDER}/core/scripts/get_app_version.py

#-----------------------------------------------------------------------------
# INSTALLING
#----------------------------------------------------------------------

install: install-backend install-frontend

install-dev: install-dev-backend install-dev-frontend

install-backend: init-rml-mapper setup-env-paths
	@ echo "Installing BACKEND requirements :: START"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.txt
	@ echo "Installing BACKEND requirements :: END"

install-dev-backend:
	@ echo "Installing dev BACKEND requirements"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.dev.txt

install-dev-frontend:
	@ cd ${FRONTEND_HOME} && make install-${ENVIRONMENT}-frontend

install-all-backend: install-backend install-dev-backend

install-frontend:
	@ cd ${FRONTEND_HOME} && make install-${ENVIRONMENT}-frontend


#-----------------------------------------------------------------------------
# TESTING
#----------------------------------------------------------------------

test: test-unit test-e2e
test-unit: test-unit-backend test-unit-frontend
test-e2e: test-e2e-backend test-e2e-frontend
test-on-deploy: test-on-deploy-backend test-on-deploy-frontend

test-frontend: test-unit-frontend test-e2e-frontend
test-backend: test-unit-backend test-e2e-backend

test-unit-backend:
	@ echo "UNIT Testing BACKEND ... "
	@ tox -e unit -- backend

test-unit-frontend:
	@ echo "UNIT Testing FRONTEND ... "
#	@ cd ${FRONTEND_HOME} && npm run test
#	@ tox -e unit frontend

test-e2e-backend:
	@ echo "E2E Testing BACKEND ... "
	@ tox -e e2e -- backend

test-e2e-frontend:
	@ echo "E2E Testing FRONTEND ... "
	@ cd ${FRONTEND_HOME} && make test-e2e

test-on-deploy-backend:
	@ echo "Testing BACKEND on Deploy ... "

test-on-deploy-frontend:
	@ echo "Testing FRONTEND on Deploy ... "

#-----------------------------------------------------------------------------
# ENV FILE
#-----------------------------------------------------------------------------

dev-dotenv-file:
	@ echo "Creating DEV .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > ${ENV_FILE}
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> ${ENV_FILE}
	@ echo BACKEND_INFRA_FOLDER=${BACKEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo FRONTEND_INFRA_FOLDER=${FRONTEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo NODE_ENV=development >> ${ENV_FILE}
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> ${ENV_FILE}
	@ vault kv get -format="json" mapping-workbench-dev/app | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> ${ENV_FILE}

staging-dotenv-file:
	@ echo "Creating STAGING .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > ${ENV_FILE}
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> ${ENV_FILE}
	@ echo BACKEND_INFRA_FOLDER=${BACKEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo FRONTEND_INFRA_FOLDER=${FRONTEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo NODE_ENV=development >> ${ENV_FILE}
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> ${ENV_FILE}
	@ vault kv get -format="json" mapping-workbench-staging/app | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> ${ENV_FILE}

prod-dotenv-file:
	@ echo "Creating PROD .env file ... "
	@ echo VAULT_ADDR=${VAULT_ADDR} > ${ENV_FILE}
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> ${ENV_FILE}
	@ echo BACKEND_INFRA_FOLDER=${BACKEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo FRONTEND_INFRA_FOLDER=${FRONTEND_INFRA_FOLDER} >> ${ENV_FILE}
	@ echo NODE_ENV=production >> ${ENV_FILE}
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> ${ENV_FILE}
	@ vault kv get -format="json" mapping-workbench-prod/app | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> ${ENV_FILE}

dotenv-file-frontend:
	@ echo "Creating .env file for FRONTEND ... "
	@ cp .env ${FRONTEND_INFRA_FOLDER}/

#-----------------------------------------------------------------------------
# STAGING & PRODUCTION
#-----------------------------------------------------------------------------

cleanup-unused-infra:
	@ echo "Pruning unused containers, images, volumes, and networks"
	@ docker container prune -f
	@ docker image prune -a -f
	@ docker volume prune -f
	@ docker network prune -f

build-backend:
	@ echo "Building the BACKEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} up -d --force-recreate

start-backend:
	@ echo "Starting the BACKEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-backend:
	@ echo "Stopping the BACKEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.yml --env-file ${ENV_FILE} down

build-frontend:
	@ echo "Building the FRONTEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} up -d --force-recreate

start-frontend:
	@ echo "Starting the FRONTEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-frontend:
	@ echo "Stopping the FRONTEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.yml --env-file ${ENV_FILE} down

build-mongo: build-externals
	@ echo "Building the Mongo services"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/mongodb/docker-compose.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/mongodb/docker-compose.yml --env-file ${ENV_FILE} up -d

start-mongo: build-externals
	@ echo "Starting the Mongo services"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/mongodb/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-mongo:
	@ echo "Stopping the Mongo services"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/mongodb/docker-compose.yml --env-file ${ENV_FILE} down

reset_mwb_script:
	@ echo "Resetting the Mapping Workbench"
	@ python3 reset_mwb.py

dump_mongodb_local:
	@ echo "Dumping Mapping Workbench MongoDB locally"
	@ mongodump --uri=$(MW_MONGODB_URL) --out=./.mongodump
	@ echo "Dumping Mapping Workbench MongoDB locally done"

#-----------------------------------------------------------------------------
# DEVELOPMENT
#-----------------------------------------------------------------------------

build-backend-dev:
	@ echo "Building the BACKEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.dev.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.dev.yml --env-file ${ENV_FILE} up -d --force-recreate

start-backend-dev:
	@ echo "Starting the BACKEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.dev.yml --env-file ${ENV_FILE} up -d

stop-backend-dev:
	@ echo "Stopping the BACKEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/backend/docker-compose.dev.yml --env-file ${ENV_FILE} down

build-frontend-dev:
	@ echo "Building the FRONTEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.dev.yml --env-file ${ENV_FILE} build --progress plain --no-cache --force-rm
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.dev.yml --env-file ${ENV_FILE} up -d --force-recreate

start-frontend-dev:
	@ echo "Starting the FRONTEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.dev.yml --env-file ${ENV_FILE} up -d

stop-frontend-dev:
	@ echo "Stopping the FRONTEND"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/frontend/docker-compose.dev.yml --env-file ${ENV_FILE} down

clear-frontend:
	@ cd ${FRONTEND_HOME} && rm -rf build && rm -rf node_modules && rm -f .env* &&  rm -f package-lock.json

start-frontend-console-mode:
	@ echo "Starting FRONTEND"
	@ cd ${FRONTEND_HOME} && make start-dev-frontend

start-backend-console-mode:
	uvicorn mapping_workbench.backend.core.entrypoints.api.main:app --reload --log-level debug

start-mongo-console-mode:
	mongod --dbpath=/usr/local/var/mongodb/data/

start-mongo-dev: build-externals
	@ echo "Starting the Mongo services"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/mongodb/docker-compose.dev.yml --env-file ${ENV_FILE} up -d

stop-mongo-dev:
	@ echo "Stopping the Mongo services"
	@ docker-compose -p ${DOCKER_PROJECT} --file ./infra/mongodb/docker-compose.dev.yml --env-file ${ENV_FILE} down

#-----------------------------------------------------------------------------
# SERVER SERVICES
#-----------------------------------------------------------------------------

build-externals:
	@ echo "Creating the necessary volumes, networks and folders and setting the special rights"
	@ docker network create proxy-net || true
	@ docker network create mw-net || true

start-traefik: build-externals
	@ echo "Starting the Traefik services"
	@ docker-compose -p common --file ./infra/traefik/docker-compose.yml --env-file ${ENV_FILE} up -d

stop-traefik:
	@ echo "Stopping the Traefik services"
	@ docker-compose -p common --file ./infra/traefik/docker-compose.yml --env-file ${ENV_FILE} down

init-rml-mapper:
	@ echo -e "RMLMapper folder initialization!"
	@ mkdir -p ./.rmlmapper
	@ wget https://github.com/RMLio/rmlmapper-java/releases/download/v6.2.2/rmlmapper-6.2.2-r371-all.jar -O ./.rmlmapper/rmlmapper.jar

setup-env-paths:
	@ perl -i -ne 'print unless /^RML_MAPPER_PATH/' ${ENV_FILE}
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> ${ENV_FILE}

deploy-app-version:
	@ perl -i -ne 'print unless /^MW_APP_VERSION/' ${ENV_FILE}
	@ echo MW_APP_VERSION=$$($(PYTHON) $(APP_VERSION_SCRIPT)) >> ${ENV_FILE}

deploy-env-app-settings: deploy-app-version
	@ echo "Deployed ENV App Settings"

deploy-env: deploy-env-app-settings
	@ echo "Deployed ENV"

deploy-prod-dotenv-file: prod-dotenv-file deploy-env-app-settings
	@ echo "Deployed PROD ENV file"

deploy-staging-dotenv-file: staging-dotenv-file deploy-env-app-settings
	@ echo "Deployed STAGING ENV file"

create-release-tag:
	@ git tag -a v$(V) -m "Release version $(V)"
	@ git push origin v$(V)
	@ echo "Release Tag `v$(V)` was successfully created and pushed."

deploy-app: stop-frontend stop-backend build-backend build-frontend

deploy-prod: deploy-prod-dotenv-file deploy-app
	@ echo "Deployed App to PROD"

deploy-staging: deploy-staging-dotenv-file deploy-app
	@ echo "Deployed App to STAGING"

SHELL=/bin/bash -o pipefail
BUILD_PRINT = \e[1;34mSTEP:
END_BUILD_PRINT = \e[0m

CURRENT_UID := $(shell id -u)
export CURRENT_UID
# These are constants used for make targets so we can start prod and staging services on the same machine
ENV_FILE := .env

# include .env files if they exist
-include .env

PROJECT_PATH = $(shell pwd)
AIRFLOW_INFRA_FOLDER ?= ${PROJECT_PATH}/.airflow
RML_MAPPER_PATH = ${PROJECT_PATH}/.rmlmapper/rmlmapper.jar
XML_PROCESSOR_PATH = ${PROJECT_PATH}/.saxon/saxon-he-10.6.jar
LIMES_ALIGNMENT_PATH = $(PROJECT_PATH)/.limes/limes.jar
HOSTNAME = $(shell hostname)
CAROOT = $(shell pwd)/infra/traefik/certs

#-----------------------------------------------------------------------------
# Dev commands
#-----------------------------------------------------------------------------
install:
	@ echo -e "$(BUILD_PRINT)Installing the requirements$(END_BUILD_PRINT)"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

install-dev:
	@ echo -e "$(BUILD_PRINT)Installing the dev requirements$(END_BUILD_PRINT)"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r requirements.dev.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

test: test-unit

test-unit:
	@ echo -e "$(BUILD_PRINT)Unit Testing ...$(END_BUILD_PRINT)"
	@ tox -e unit

test-features:
	@ echo -e "$(BUILD_PRINT)Gherkin Features Testing ...$(END_BUILD_PRINT)"
	@ tox -e features

test-e2e:
	@ echo -e "$(BUILD_PRINT)End to End Testing ...$(END_BUILD_PRINT)"
	@ tox -e e2e

test-all-parallel:
	@ echo -e "$(BUILD_PRINT)Complete Testing ...$(END_BUILD_PRINT)"
	@ tox -p

test-all:
	@ echo -e "$(BUILD_PRINT)Complete Testing ...$(END_BUILD_PRINT)"
	@ tox


#-----------------------------------------------------------------------------
# VAULT SERVICES
#-----------------------------------------------------------------------------
# Testing whether an env variable is set or not
guard-%:
	@ if [ "${${*}}" = "" ]; then \
        echo -e "$(BUILD_PRINT)Environment variable $* not set $(END_BUILD_PRINT)"; \
        exit 1; \
	fi

# Testing that vault is installed
vault-installed: #; @which vault1 > /dev/null
	@ if ! hash vault 2>/dev/null; then \
        echo -e "$(BUILD_PRINT)Vault is not installed, refer to https://www.vaultproject.io/downloads $(END_BUILD_PRINT)"; \
        exit 1; \
	fi
# Get secrets in dotenv format
staging-dotenv-file: guard-VAULT_ADDR guard-VAULT_TOKEN vault-installed
	@ echo -e "$(BUILD_PRINT)Creating .env.staging file $(END_BUILD_PRINT)"
	@ echo VAULT_ADDR=${VAULT_ADDR} > .env
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> .env
	@ echo DOMAIN=ontobuilder.com >> .env
	@ echo ENVIRONMENT=staging >> .env
	@ echo SUBDOMAIN=staging. >> .env
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> .env
	@ echo LIMES_ALIGNMENT_PATH=${LIMES_ALIGNMENT_PATH} >> .env
	@ echo XML_PROCESSOR_PATH=${XML_PROCESSOR_PATH} >> .env
	@ echo AIRFLOW_INFRA_FOLDER=~/airflow-infra/staging >> .env
	@ echo AIRFLOW_WORKER_HOSTNAME=${HOSTNAME} >> .env
	@ vault kv get -format="json" ted-staging/airflow | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/mongo-db | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/metabase | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/ted-sws | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/agraph | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/fuseki | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/github | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-staging/minio | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env


dev-dotenv-file: guard-VAULT_ADDR guard-VAULT_TOKEN vault-installed
	@ echo -e "$(BUILD_PRINT)Create .env file $(END_BUILD_PRINT)"
	@ echo VAULT_ADDR=${VAULT_ADDR} > .env
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> .env
	@ echo DOMAIN=localhost >> .env
	@ echo ENVIRONMENT=dev >> .env
	@ echo SUBDOMAIN= >> .env
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> .env
	@ echo LIMES_ALIGNMENT_PATH=${LIMES_ALIGNMENT_PATH} >> .env
	@ echo XML_PROCESSOR_PATH=${XML_PROCESSOR_PATH} >> .env
	@ echo AIRFLOW_INFRA_FOLDER=${AIRFLOW_INFRA_FOLDER} >> .env
	@ echo AIRFLOW_WORKER_HOSTNAME=${HOSTNAME} >> .env
	@ vault kv get -format="json" ted-dev/airflow | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/mongo-db | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/metabase | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/agraph | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/fuseki | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/ted-sws | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/github | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-dev/minio | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env


prod-dotenv-file: guard-VAULT_ADDR guard-VAULT_TOKEN vault-installed
	@ echo -e "$(BUILD_PRINT)Create .env file $(END_BUILD_PRINT)"
	@ echo VAULT_ADDR=${VAULT_ADDR} > .env
	@ echo VAULT_TOKEN=${VAULT_TOKEN} >> .env
	@ echo DOMAIN=ted-data.eu >> .env
	@ echo ENVIRONMENT=prod >> .env
	@ echo SUBDOMAIN= >> .env
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> .env
	@ echo LIMES_ALIGNMENT_PATH=${LIMES_ALIGNMENT_PATH} >> .env
	@ echo XML_PROCESSOR_PATH=${XML_PROCESSOR_PATH} >> .env
	@ echo AIRFLOW_INFRA_FOLDER=~/airflow-infra/prod >> .env
	@ echo AIRFLOW_WORKER_HOSTNAME=${HOSTNAME} >> .env
	@ echo AIRFLOW_CELERY_WORKER_CONCURRENCY=32 >> .env
	@ vault kv get -format="json" ted-prod/airflow | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/mongo-db | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/metabase | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/agraph | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/fuseki | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/ted-sws | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/github | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env
	@ vault kv get -format="json" ted-prod/minio | jq -r ".data.data | keys[] as \$$k | \"\(\$$k)=\(.[\$$k])\"" >> .env

local-dotenv-file: rml-mapper-path-add-dotenv-file

rml-mapper-path-add-dotenv-file:
	@ echo -e "$(BUILD_PRINT)Add rml-mapper path to local .env file $(END_BUILD_PRINT)"
	@ sed -i '/^RML_MAPPER_PATH/d' .env
	@ echo RML_MAPPER_PATH=${RML_MAPPER_PATH} >> .env

refresh-mapping-files:
	@ python -m ted_sws.data_manager.entrypoints.cli.cmd_generate_mapping_resources

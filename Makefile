ENV_FILE := .env

# include .env files if they exist
-include .env

PROJECT_PATH = $(shell pwd)
PACKAGE_PATH = $(PROJECT_PATH)/mapping_workbench

install: install-toolchain

install-dev: install-dev-toolchain

install-toolchain:
	@ echo -e "$(BUILD_PRINT)Installing the TOOLCHAIN requirements$(END_BUILD_PRINT)"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r $(PACKAGE_PATH)/toolchain/requirements.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"
	@ pip install $(PACKAGE_PATH)/toolchain

install-dev-toolchain:
	@ echo -e "$(BUILD_PRINT)Installing the dev TOOLCHAIN requirements$(END_BUILD_PRINT)"
	@ pip install --upgrade pip
	@ pip install --no-cache-dir -r $(PACKAGE_PATH)/toolchain/requirements.dev.txt --constraint "https://raw.githubusercontent.com/apache/airflow/constraints-2.5.1/constraints-no-providers-3.8.txt"

test-all: test-app test-core test-toolchain
test: test-unit
test-unit: test-app-unit test-core-unit test-toolchain-unit
test-e2e: test-app-e2e test-core-e2e test-toolchain-e2e
test-features: test-toolchain-features


test-app-unit: test-app-backend-unit test-app-frontend-unit

test-app-backend-unit:
	@ echo "$(BUILD_PRINT)Unit Testing App Backend ... $(END_BUILD_PRINT)"

test-app-frontend-unit:
	@ echo "$(BUILD_PRINT)Unit Testing App Frontend ... $(END_BUILD_PRINT)"

test-app-e2e: test-app-backend-e2e test-app-frontend-e2e

test-app-backend-e2e:
	@ echo "$(BUILD_PRINT)E2E Testing App Backend ... $(END_BUILD_PRINT)"

test-app-frontend-e2e:
	@ echo "$(BUILD_PRINT)E2E Testing App Frontend ... $(END_BUILD_PRINT)"

test-app: test-app-unit test-app-e2e


test-core-unit:
	@ echo "$(BUILD_PRINT)Unit Testing Core ... $(END_BUILD_PRINT)"
	@ tox -e unit-core

test-core-e2e:
	@ echo "$(BUILD_PRINT)E2E Testing Core ... $(END_BUILD_PRINT)"
	@ tox -e e2e-core

test-core:
	@ echo "$(BUILD_PRINT)Testing Core ... $(END_BUILD_PRINT)"
	@ tox -e core


test-toolchain-unit:
	@ echo "$(BUILD_PRINT)Unit Testing Toolchain ... $(END_BUILD_PRINT)"
	@ tox -e unit-toolchain

test-toolchain-e2e:
	@ echo "$(BUILD_PRINT)E2E Testing Toolchain ... $(END_BUILD_PRINT)"
	@ tox -e e2e-toolchain

test-toolchain-features:
	@ echo -e "$(BUILD_PRINT)Gherkin Features Testing Toolchain ...$(END_BUILD_PRINT)"
	@ tox -e features-toolchain

test-toolchain:
	@ echo "$(BUILD_PRINT)Testing Toolchain ... $(END_BUILD_PRINT)"
	@ tox -e toolchain
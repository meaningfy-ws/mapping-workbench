init-dev-frontend-deps:
	@ npm install && npm run build

init-staging-frontend-deps: install-dev-frontend-deps

init-prod-frontend-deps:
	@ npm install --production && npm install -g serve && npm run build && rm -fr node_modules

start-dev-frontend:
	@ npm run start

start-staging-frontend: start-dev-frontend

start-prod-frontend:
	serve -s build

install-dev-frontend: init-dev-frontend-deps start-dev-frontend
	@ echo "Installing DEV FRONTEND"

install-staging-frontend: init-staging-frontend-deps start-staging-frontend
	@ echo "Installing STAGING FRONTEND"

install-prod-frontend: init-prod-frontend-deps start-prod-frontend
	@ echo "Installing PROD FRONTEND"

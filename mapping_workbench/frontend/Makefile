install-dev-frontend-deps:
	@ npm install

install-staging-frontend-deps: install-dev-frontend-deps

install-prod-frontend-deps:
	@ npm install --production

install-frontend:
	@ npm install -g serve && npm run build # && rm -fr node_modules

install-dev-frontend: install-dev-frontend-deps install-frontend
	@ echo "Installing DEV FRONTEND"

install-staging-frontend: install-staging-frontend-deps install-frontend
	@ echo "Installing STAGING FRONTEND"

install-prod-frontend: install-prod-frontend-deps install-frontend
	@ echo "Installing PROD FRONTEND"

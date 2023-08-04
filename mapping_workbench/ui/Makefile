start-dev-frontend:
	@ echo "Starting DEV UI"
	@ npm run start

start-staging-frontend: start-dev-frontend

start-prod-frontend:
	@ echo "Starting PROD UI"
	serve -s build

install-dev-frontend:
	@ echo "Installing DEV UI"
	@ npm install

install-staging-frontend:
	@ echo "Installing STAGING UI"
	@ npm install

install-prod-frontend:
	@ echo "Installing PROD UI"
	@ npm install --production && npm install -g serve && npm run build && rm -fr node_modules

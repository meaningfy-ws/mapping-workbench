start-dev-frontend:
	@ echo "Starting DEV FRONTEND"
	@ npm run dev

start-staging-frontend:
	@ echo "Starting STAGING FRONTEND"
	serve -s build

start-prod-frontend:
	@ echo "Starting PROD FRONTEND"
	serve -s build

install-dev-frontend:
	@ echo "Installing DEV FRONTEND"
	@ npm install

install-staging-frontend:
	@ echo "Installing STAGING FRONTEND"
	@ npm install

install-prod-frontend:
	@ echo "Installing PROD FRONTEND"
	@ npm install --production && npm install -g serve && npm run build && rm -fr node_modules

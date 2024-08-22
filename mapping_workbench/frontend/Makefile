start-dev-frontend:
	@ echo "Starting DEV FRONTEND"
	@ npm run dev

start-staging-frontend:
	@ echo "Starting STAGING FRONTEND"
	@ npm run dev
#	@ serve -s build

start-prod-frontend:
	@ echo "Starting PROD FRONTEND"
	@ npm run dev
#	@ serve -s build

install-dev-frontend:
	@ echo "Installing DEV FRONTEND"
	@ npm install

install-staging-frontend:
	@ echo "Installing STAGING FRONTEND"
	@ npm install
#	@ npm install && npm install -g serve && npm run build && rm -fr node_modules

install-prod-frontend:
	@ echo "Installing PROD FRONTEND"
	@ npm install
#	@ npm install && npm install -g serve && npm run build && rm -fr node_modules

test-e2e:
	@ npm install
	@ Xvfb :99 -screen 0 1280x1024x24 &
	@ export DISPLAY=:99
	@ npm run test-e2e
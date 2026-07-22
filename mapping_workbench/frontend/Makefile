start-dev-frontend:
	@ echo "Starting DEV FRONTEND"
	@ npm run dev

start-test-frontend:
	@ echo "Starting TEST FRONTEND"
	@ npm run dev

start-staging-frontend:
	@ echo "Starting STAGING FRONTEND"
	@ npm run dev
#	@ serve -s build

start-prod-frontend:
	@ echo "Starting PROD FRONTEND"
	@ npm run start

install-dev-frontend:
	@ echo "Installing DEV FRONTEND"
	@ npm install

install-test-frontend:
	@ echo "Installing TEST FRONTEND"
	@ npm install

install-staging-frontend:
	@ echo "Installing STAGING FRONTEND"
	@ npm install
#	@ npm install && npm install -g serve && npm run build && rm -fr node_modules

install-prod-frontend:
	@ echo "Installing PROD FRONTEND"
	@ npm install && npm run build
#	@ npm install && npm install -g serve && npm run build && rm -fr node_modules

test-e2e:
	@ npm run test:e2e:pr

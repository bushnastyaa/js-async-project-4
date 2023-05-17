install:
	npm ci

publish:
	npm publish --dry-run

link:
	sudo npm link

lint:
	npx eslint .

test-coverage:
	npm test -- --coverage --coverageProvider=v8

jest:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage
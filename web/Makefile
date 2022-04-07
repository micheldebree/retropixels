BUILD_NR=$(shell git show --no-patch --format='%cs').$(shell git rev-parse --short HEAD)
COMMIT_SHA=$(shell git rev-parse HEAD)
COMMIT_URL=https://github.com/micheldebree/retropixels/commit/$(COMMIT_SHA)

.PHONY: start
.PHONY: build
.PHONY: icons

start: node_modules
	yarn start

build: icons node_modules
	echo "export default {buildnr: '$(BUILD_NR)', url: '$(COMMIT_URL)'}" > src/version.js
	yarn build

node_modules:
	yarn install

icons: 
	./scale_logo.sh 16
	./scale_logo.sh 24
	./scale_logo.sh 32
	./scale_logo.sh 180
	./scale_logo.sh 192
	./scale_logo.sh 512
	./scale_logo.sh 600


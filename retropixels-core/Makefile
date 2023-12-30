VERSION=$(shell cat package.json | jq -r .version) 
TSC=./node_modules/.bin/tsc
TS_STANDARD=./node_modules/.bin/ts-standard
SRC=./src
TARGET=./target
SOURCES=$(shell find ./src -type f -name '*.ts')
OBJ=$(SOURCES:.ts=.js) 
OBJ_PATHS=$(patsubst $(SRC)/%,$(TARGET)/%,$(OBJ))

$(TARGET)/%.js: $(SRC)/%.ts $(TARGET)
	$(TSC)

.PHONY: all
all: node_modules $(OBJ_PATHS)

$(TARGET):
	mkdir -p $(TARGET)

.PHONY: lint
lint:
	$(TS_STANDARD) $(SRC)

.PHONY: fix
fix:
	$(TS_STANDARD) $(SRC) --fix

# First:
# - update package.json with <version>
# - commit everything
# Be careful: when you release, everything that is not in Git is deleted!
.PHONY: publish
publish: build
	git push
	git clean -d -f
	npm publish
	git tag core-$(VERSION)
	git push --tags

.PHONY: snapshot
snapshot: build
	git clean -d -f
	yarn publish --tag snapshot

node_modules:
	yarn install

# Resolve dependencies for retropixels-core to this package
.PHONY: link
link:
	yarn link

.PHONY: clean
clean:
	rm -rf target
	rm -rf node_modules
	rm *.log


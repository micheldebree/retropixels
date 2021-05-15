VERSION=$(shell cat package.json | jq -r .version) 

build:
	yarn build

# First:
# - update package.json with <version>
# - commit everything
# Be careful: when you release, everything that is not in Git is deleted!
publish: build
	git push
	git clean -d -f
	npm publish
	git tag core-$(VERSION)
	git push --tags

snapshot: build
	git clean -d -f
	yarn publish --tag snapshot

graph:
	npx madge --ts-config ./tsconfig.json -i  graph.png .

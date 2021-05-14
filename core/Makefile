build:
	yarn build

# First:
# - update package.json with <version>
# - git tag <version>
# Be careful: when you release, everything that is not in Git is deleted!
release: build
	git push
	git clean -d -f
	npm publish
	git push --tags

snapshot: build
	git clean -d -f
	yarn publish --tag snapshot

graph:
	npx madge --ts-config ./tsconfig.json -i  graph.png .

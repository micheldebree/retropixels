build:
	yarn build

cleanbuild: clean samples

clean:
	rm -rf target && rm -f *.png && rm -f *.prg && rm -rf *.kla && rm -rf samples && rm -rf node_modules

# First:
# - update package.json with <version>
# - git tag <version>
# Be careful: when you release, everything that is not in Git is deleted!
release: build
	git push
	git clean -d -f
	npm publish
	git push --tags

snapshot: cleanbuild
	git clean -d -f
	npm publish --tag snapshot

graph:
	npx madge --ts-config ./tsconfig.json -i  graph.png .

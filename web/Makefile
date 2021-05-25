BUILD_NR=$(shell git show --no-patch --format='%cs').$(shell git rev-parse --short HEAD)
COMMIT_SHA=$(shell git rev-parse HEAD)
COMMIT_URL=https://github.com/micheldebree/retropixels/commit/$(COMMIT_SHA)

.PHONY: start
.PHONY: build

start:
	yarn start

build: icons
	echo "export default {buildnr: '$(BUILD_NR)', url: '$(COMMIT_URL)'}" > src/version.js
	yarn build

icons: public/favicon-16x16.png \
	public/favicon-24x24.png \
	public/favicon-32x32.png \
	public/apple-touch-icon.png \
	public/logo192.png \
	public/logo512.png

public/favicon-16x16.png: src/logo.svg
	convert -resize 16x16 -background none $< $@
	optipng -o7 $@

public/favicon-24x24.png: src/logo.svg
	convert -resize 24x24 -background none $< $@
	optipng -o7 $@

public/favicon-32x32.png: src/logo.svg
	convert -resize 32x32 -background none $< $@
	optipng -o7 $@

public/apple-touch-icon.png: src/logo.svg
	convert -resize 180x180 -background none $< $@
	optipng -o7 $@

public/logo192.png: src/logo.svg
	convert -resize 192x192 -background none $< $@
	optipng -o7 $@

public/logo512.png: src/logo.svg
	convert -resize 512x512 -background none $< $@
	optipng -o7 $@

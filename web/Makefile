start:
	yarn start

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

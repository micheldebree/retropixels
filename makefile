EXAMPLE=paintface

%.png: %.jpg compile
	node index.js "$<" "$*.png"

%.prg: %.jpg compile
	node index.js "$<" "$*.prg"

compile:
	gulp

install:
	gulp
	npm install -g

dockerimage:
	docker build -t micheldebree/retropixels-cli .

example: compile $(EXAMPLE).png
	open $(EXAMPLE).png

test64: compile $(EXAMPLE).prg
	x64sc $(EXAMPLE).prg




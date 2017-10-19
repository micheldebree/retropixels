VERSION=0.4.2
EXAMPLE=paintface
DOCKERIMAGE=micheldebree/retropixels-cli
DOCKERCMD=docker run -t --rm -v "$$PWD":/data $(DOCKERIMAGE)
LOCALCMD=node index.js

%.png: %.jpg compile
	node index.js "$<" "$*.png"

%.prg: %.jpg compile
	node index.js "$<" "$*.prg"

%.prg: %.asm
	cd ./src/c64 && make
	mkdir -p ./target/c64 && mv ./src/c64/*.prg ./target/c64/

compile: c64code node_modules
	npm run prepare

clean:
	npm run clean
	cd src/c64 && make clean

node_modules:
	npm install

c64code: src/c64/KoalaShower.prg src/c64/FLIShower.prg src/c64/AFLIShower.prg

install: clean compile
	npm install -g

release: publish
	git tag $(VERSION)
	git push
	git push --tags

publish:
	git clean -d -f
	npm publish

dockerimage: clean
	docker build -t $(DOCKERIMAGE) .

docker_debug: dockerimage
	docker run -it --entrypoint /bin/sh $(DOCKERIMAGE)

example: compile $(EXAMPLE).png
	open $(EXAMPLE).png

samples: compile
	$(LOCALCMD) -m c64FLI paintface.jpg ./samples/paintface-FLI-$(VERSION).png
	$(LOCALCMD) -m c64FLI paintface.jpg ./samples/paintface-FLI-$(VERSION).prg
	$(LOCALCMD) -m c64AFLI paintface.jpg ./samples/paintface-AFLI-$(VERSION).png
	$(LOCALCMD) -m c64AFLI paintface.jpg ./samples/paintface-AFLI-$(VERSION).prg

# Test PRG making with dockerimage
test64: $(EXAMPLE).prg
	x64sc $(EXAMPLE).prg

testfli: compile
	$(LOCALCMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).prg"
	$(LOCALCMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).png"
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"



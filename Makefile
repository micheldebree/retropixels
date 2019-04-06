EXAMPLE=paintface
#BUILDIMAGE=micheldebree/retropixels-build

CMD=node index.js
C64CODE=target/c64/Koala.prg target/c64/AFLI.prg target/c64/FLI.prg target/c64/Hires.prg

target/c64/%.prg: src/c64/%.asm target/c64/
	ACME=./src/c64 acme -f cbm -o "$@" "$<"

build: node_modules $(C64CODE)
	yarn build

#build:
	#docker run -it -w /retropixels -v "$$PWD":/retropixels $(DOCKERIMAGE)

target/c64/:
	mkdir -p target/c64

clean:
	rm -rf target && rm -f *.png && rm -f *.prg && rm -rf samples && rm -rf node_modules

node_modules:
	yarn install

install: clean compile
	yarn global install

release: publish
	git push
	git push --tags

snapshot: compile
	git clean -d -f
	npm publish --tag snapshot

publish: compile
	git clean -d -f
	npm publish

samples: build
	$(CMD) paintface.jpg ./samples/paintface-Multicolor.png
	$(CMD) paintface.jpg ./samples/paintface-Multicolor.prg
	$(CMD) paintface.jpg ./samples/paintface-Multicolor.kla
	$(CMD) -m c64Hires paintface.jpg ./samples/paintface-Hires.png
	$(CMD) -m c64Hires paintface.jpg ./samples/paintface-Hires.prg
	$(CMD) -m c64HiresMono paintface.jpg ./samples/paintface-HiresMono.png
	$(CMD) -m c64HiresMono paintface.jpg ./samples/paintface-HiresMono.prg
	$(CMD) -m c64FLI paintface.jpg ./samples/paintface-FLI.png
	$(CMD) -m c64FLI paintface.jpg ./samples/paintface-FLI.prg
	$(CMD) -m c64AFLI paintface.jpg ./samples/paintface-AFLI.png
	$(CMD) -m c64AFLI paintface.jpg ./samples/paintface-AFLI.prg
	$(CMD) -m c64HiresSprites paintface.jpg ./samples/paintface-HiresSprites.spd
	$(CMD) -m c64MulticolorSprites paintface.jpg ./samples/paintface-MulticolorSprites.spd

test: build
	$(CMD) $(EXAMPLE).jpg $(EXAMPLE).prg

test64: $(EXAMPLE).prg
	x64sc $(EXAMPLE).prg

testfli: compile
	$(CMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).prg"
	$(CMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).png"
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

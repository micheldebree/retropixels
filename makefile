VERSION=0.7.0
EXAMPLE=paintface
DOCKERIMAGE=micheldebree/retropixels-cli:$(VERSION)
DOCKERCMD=docker run -t --rm -v "$$PWD":/data $(DOCKERIMAGE)
C64CODE=target/c64/Koala.prg target/c64/AFLI.prg target/c64/FLI.prg target/c64/Hires.prg

target/c64/%.prg: src/c64/%.asm
	mkdir -p target/c64
	export ACME=./src/c64 && acme -f cbm -o "$@" "$<"

compile: node_modules $(C64CODE)
	npm run prepare

clean:
	npm run clean

node_modules:
	npm install

install: clean compile
	npm install -g

release: publish
	git tag $(VERSION)
	git push
	git push --tags

publish:
	git clean -d -f
	npm publish

dockerimage: Dockerfile clean
	docker build -t $(DOCKERIMAGE) .

docker_debug: dockerimage
	docker run -it --entrypoint /bin/sh $(DOCKERIMAGE)

samples: dockerimage
	$(DOCKERCMD) paintface.jpg ./samples/paintface-Multicolor.png
	$(DOCKERCMD) paintface.jpg ./samples/paintface-Multicolor.prg
	$(DOCKERCMD) paintface.jpg ./samples/paintface-Multicolor.kla
	$(DOCKERCMD) -m c64Hires paintface.jpg ./samples/paintface-Hires.png
	$(DOCKERCMD) -m c64Hires paintface.jpg ./samples/paintface-Hires.prg
	$(DOCKERCMD) -m c64HiresMono paintface.jpg ./samples/paintface-HiresMono.png
	$(DOCKERCMD) -m c64HiresMono paintface.jpg ./samples/paintface-HiresMono.prg
	$(DOCKERCMD) -m c64FLI paintface.jpg ./samples/paintface-FLI.png
	$(DOCKERCMD) -m c64FLI paintface.jpg ./samples/paintface-FLI.prg
	$(DOCKERCMD) -m c64AFLI paintface.jpg ./samples/paintface-AFLI.png
	$(DOCKERCMD) -m c64AFLI paintface.jpg ./samples/paintface-AFLI.prg
	$(DOCKERCMD) -m c64HiresSprites paintface.jpg ./samples/paintface-HiresSprites.spd
	$(DOCKERCMD) -m c64MulticolorSprites paintface.jpg ./samples/paintface-MulticolorSprites.spd

testdocker: dockerimage
	docker run -v "$$PWD":/data $(DOCKERIMAGE) -m c64FLI paintface.jpg ./samples/paintface-FLI.prg

test64: $(EXAMPLE).prg
	x64sc $(EXAMPLE).prg

testfli: compile
	$(DOCKERCMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).prg"
	$(DOCKERCMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).png"
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"


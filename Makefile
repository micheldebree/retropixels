EXAMPLE=paintface

CMD=node cli.js
C64CODE=target/c64/Koala.prg target/c64/AFLI.prg target/c64/FLI.prg target/c64/Hires.prg

target/c64/%.prg: src/c64/%.asm target/c64/
	npx c64jasm --out "$@" "$<"

build: node_modules $(C64CODE)
	yarn build

cleanbuild: clean node_modules format build samples

target/c64/:
	mkdir -p target/c64

clean:
	rm -rf target && rm -f *.png && rm -f *.prg && rm -rf samples && rm -rf node_modules

format:
	yarn fix || true

node_modules:
	yarn install

# Be careful: when you release everything that is not in Git is deleted.
release: build
	git clean -d -f
	npm publish
	git push
	git push --tags

snapshot: cleanbuild
	git clean -d -f
	npm publish --tag snapshot

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

test: build
	rm $(EXAMPLE).png || true
	rm $(EXAMPLE).prg || true
	$(CMD) $(EXAMPLE).jpg $(EXAMPLE).prg
	$(CMD) $(EXAMPLE).jpg $(EXAMPLE).png
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

testfli: build
	rm $(EXAMPLE).png || true
	rm $(EXAMPLE).prg || true
	$(CMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).prg"
	$(CMD) -m c64FLI "$(EXAMPLE).jpg" "$(EXAMPLE).png"
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

benchmark: build
	hyperfine --export-markdown Benchmark-formats.md \
		"$(CMD) paintface.jpg ./tmp.png" \
		"$(CMD) paintface.jpg ./tmp.prg" \
		"$(CMD) paintface.jpg ./tmp.kla"
	hyperfine --export-markdown Benchmark-modes.md \
		"$(CMD) paintface.jpg -m c64Multicolor ./tmp.png" \
		"$(CMD) paintface.jpg -m c64Hires ./tmp.png" \
		"$(CMD) paintface.jpg -m c64HiresMono ./tmp.png" \
		"$(CMD) paintface.jpg -m c64FLI ./tmp.png" \
		"$(CMD) paintface.jpg -m c64AFLI ./tmp.png" 
	hyperfine --export-markdown Benchmark-colorspaces.md \
		"$(CMD) paintface.jpg -c rgb c64Multicolor ./tmp.png" \
		"$(CMD) paintface.jpg -c yuv c64Multicolor ./tmp.png" \
		"$(CMD) paintface.jpg -c xyz c64Multicolor ./tmp.png" 

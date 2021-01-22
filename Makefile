EXAMPLE=paintface

CMD=node cli.js
C64CODE=target/c64/koala.prg target/c64/afli.prg target/c64/fli.prg target/c64/artstudio.prg

target/c64/%.prg: src/c64/%.asm target/c64/
	npx c64jasm --out "$@" "$<"

build: node_modules $(C64CODE)
	yarn build

cleanbuild: clean node_modules format build samples

target/c64/:
	mkdir -p target/c64

clean:
	rm -rf target && rm -f *.png && rm -f *.prg && rm -rf samples && rm -rf node_modules

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
	$(CMD) --overwrite -f png -o ./samples/$(EXAMPLE)-Multicolor.png $(EXAMPLE).jpg
	$(CMD) --overwrite -f prg -o ./samples/$(EXAMPLE)-Multicolor.prg $(EXAMPLE).jpg
	$(CMD) --overwrite -o ./samples/$(EXAMPLE)-Multicolor.kla $(EXAMPLE).jpg
	$(CMD) --overwrite -f png -h -o ./samples/$(EXAMPLE)-Hires.png $(EXAMPLE).jpg
	$(CMD) --overwrite -f prg -h -o ./samples/$(EXAMPLE)-Hires.prg $(EXAMPLE).jpg
	$(CMD) --overwrite -f png -h --nomaps -o ./samples/$(EXAMPLE)-HiresMono.png $(EXAMPLE).jpg
	$(CMD) --overwrite -f prg -h -o ./samples/$(EXAMPLE)-HiresMono.prg $(EXAMPLE).jpg
	$(CMD) --overwrite -f png -m fli -o ./samples/$(EXAMPLE)-FLI.png $(EXAMPLE).jpg
	$(CMD) --overwrite -f prg -m fli -o ./samples/$(EXAMPLE)-FLI.prg $(EXAMPLE).jpg
	$(CMD) --overwrite -f png -m fli -h -o ./samples/$(EXAMPLE)-AFLI.png $(EXAMPLE).jpg
	$(CMD) --overwrite -f prg -m fli -h -o ./samples/$(EXAMPLE)-AFLI.prg $(EXAMPLE).jpg

test: build
	rm $(EXAMPLE).png || true
	rm $(EXAMPLE).prg || true
	$(CMD) --overwrite -f prg -o $(EXAMPLE).prg $(EXAMPLE).jpg
	$(CMD) --overwrite -f png -o $(EXAMPLE).png $(EXAMPLE).jpg
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

testfli: build
	rm $(EXAMPLE).png || true
	rm $(EXAMPLE).prg || true
	$(CMD) -f prg -m fli "$(EXAMPLE).jpg" "$(EXAMPLE).prg"
	$(CMD) -f png -m fli "$(EXAMPLE).jpg" "$(EXAMPLE).png"
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

benchmark: build
	hyperfine --export-markdown Benchmark-formats.md \
		"$(CMD) --overwrite -f png -o ./tmp.png $(EXAMPLE).jpg"  \
		"$(CMD) --overwrite -f prg -o ./tmp.prg $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -o ./tmp.kla $(EXAMPLE).jpg"
	hyperfine --export-markdown Benchmark-modes.md \
		"$(CMD) --overwrite -f png -o ./tmp.png $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -f png -h -o ./tmp.png $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -f png -h --nomaps -o ./tmp.png $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -f png -o ./tmp.png -m fli  $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -f png -o ./tmp.png -m afli -h $(EXAMPLE).jpg"
	hyperfine --export-markdown Benchmark-colorspaces.md \
		"$(CMD) --overwrite -c rgb -o ./tmp.png $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -c yuv -o ./tmp.png $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -c xyz -o ./tmp.png $(EXAMPLE).jpg"

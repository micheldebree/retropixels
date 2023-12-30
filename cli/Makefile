VERSION=$(shell cat package.json | jq -r .version)

EXAMPLE=paintface

CMD=node cli.js
C64CODE=target/c64/koala.prg target/c64/afli.prg target/c64/fli.prg target/c64/artstudio.prg
CORE=../retropixels-core

target/c64/%.prg: c64/%.asm target/c64/ node_modules
	npx c64jasm --out "$@" "$<"

.PHONY: all
all: $(C64CODE) node_modules 
	cd $(CORE) && make

target/c64/:
	mkdir -p target/c64

node_modules:
	yarn install

.PHONY: clean
clean:
	rm -rf target && rm -f *.png && rm -f *.prg && rm -rf *.kla && rm -rf samples && rm -rf node_modules

# First:
# - update package.json with <version>
# - commit everything
# Be careful: when you release, everything that is not in Git is deleted!
publish: all
	git push
	git clean -d -f
	npm publish
	git tag cli-$(VERSION)
	git push --tags

snapshot: all
	git clean -d -f
	npm publish --tag snapshot

samples: all
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
	convert -extent 384x272 -background black -gravity center ./samples/$(EXAMPLE)-Multicolor.png ./samples/CSDb.png

.PHONY: test
test: all
	$(CMD) --overwrite -f prg -o $(EXAMPLE).prg $(EXAMPLE).jpg
	$(CMD) --overwrite -f png -o $(EXAMPLE).png $(EXAMPLE).jpg
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

testfli: all
	$(CMD) --overwrite -f prg -m fli "$(EXAMPLE).jpg" "$(EXAMPLE).prg"
	$(CMD) --overwrite -f png -m fli "$(EXAMPLE).jpg" "$(EXAMPLE).png"
	open "$(EXAMPLE).png"
	x64sc "$(EXAMPLE).prg"

benchmark: all
	hyperfine --export-markdown Benchmark-formats.md \
		"$(CMD) --overwrite -f png -o ./tmp.png $(EXAMPLE).jpg"  \
		"$(CMD) --overwrite -f prg -o ./tmp.prg $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -o ./tmp.kla $(EXAMPLE).jpg" \
		"$(CMD) --overwrite -h -o ./tmp.art $(EXAMPLE).jpg"
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

.PHONY: link
# link to the local retropixels-core version in ../core
# run 'make link' in ../core first!
link:
	yarn link "retropixels-core"

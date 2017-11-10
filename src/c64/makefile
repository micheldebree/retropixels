ACME_SRC=acme-master/src

%.prg: %.asm $(ACME_SRC)/acme
	$(ACME_SRC)/acme -f cbm -r "$*.txt" -o "$*.prg" "$<"

all: Koala.prg Hires.prg FLI.prg AFLI.prg

clean:
	rm -f *.prg
	rm -rf acme-master

$(ACME_SRC):
	wget https://github.com/meonwax/acme/archive/master.zip
	unzip master.zip
	rm master.zip

$(ACME_SRC)/acme: $(ACME_SRC)
	cd $(ACME_SRC) && make

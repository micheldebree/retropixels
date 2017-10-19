ACME_SRC=acme-master/src

%.prg: %.asm $(ACME_SRC)/acme
	$(ACME_SRC)/acme "$<"

all: KoalaShower.prg FLIShower.prg AFLIShower.prg

clean:
	rm -f *.prg
	rm -rf acme-master

$(ACME_SRC):
	wget https://github.com/meonwax/acme/archive/master.zip
	unzip master.zip
	rm master.zip

$(ACME_SRC)/acme: $(ACME_SRC)
	cd $(ACME_SRC) && make
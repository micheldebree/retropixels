# Build Docker image with the retropixels cli application in it.
# Builds everything from source code.
FROM node:8.11.3-alpine
LABEL maintainer="michel@micheldebree.nl"

# install gcc, make and wget
RUN apk add --no-cache \
    gcc=6.3.0-r4 \
    g++=6.3.0-r4 \
    make=4.2.1-r0 \
    ca-certificates=20161130-r2 \
    wget=1.19.5-r0 \
    && update-ca-certificates

# install acme
WORKDIR /root
RUN wget https://github.com/meonwax/acme/archive/master.zip \
    && unzip master.zip \
    && rm master.zip
WORKDIR /root/acme-master/src
RUN make \
    && mv acme /usr/local/bin/ \
    && rm -rf /acme-master
RUN npm install -g typescript@2.6.2

COPY . /retropixels
WORKDIR /retropixels
RUN make clean compile

WORKDIR /data
ENTRYPOINT ["node", "/retropixels/index.js"]
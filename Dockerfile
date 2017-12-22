# Build Docker image with the retropixels cli application in it.
# Builds everything from source code.
FROM node:8.9-alpine
MAINTAINER michel@micheldebree.nl

# install gcc, make and wget
RUN apk update && apk add gcc g++ make ca-certificates wget && update-ca-certificates
# install ImageMagick
RUN apk add imagemagick
# install acme
RUN wget https://github.com/meonwax/acme/archive/master.zip \
    && unzip master.zip \
    && rm master.zip \
    && cd acme-master/src \
    && make \
    && mv acme /usr/local/bin/ \
    && rm -rf /acme-master
RUN npm install -g typescript@2.6.2

COPY . /retropixels

RUN cd /retropixels && make clean compile

WORKDIR /data
ENTRYPOINT ["node", "/retropixels/index.js"]

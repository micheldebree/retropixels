# Build Docker image with the retropixels cli application in it.
# Builds everything from source code.
FROM node:6.11.0-alpine
MAINTAINER michel@micheldebree.nl

# install gcc, make and wget
RUN apk update && apk add gcc g++ make ca-certificates wget && update-ca-certificates

# install typescript
RUN npm install -g typescript@2.3.3

COPY . /retropixels
WORKDIR /retropixels

RUN make clean compile && rm -rf ./src

WORKDIR /data
ENTRYPOINT ["node", "/retropixels/index.js"]

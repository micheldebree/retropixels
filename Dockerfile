# Run retropixels CLI
FROM node:6.11.0
MAINTAINER michel@michdeldebree.nl
ADD . /retropixels
WORKDIR /retropixels
RUN npm install -g typescript
RUN npm install -g gulp-cli
RUN npm install -g
RUN gulp
RUN mkdir -p /data/retropixels
WORKDIR /data/retropixels
ENTRYPOINT ["retropixels"]

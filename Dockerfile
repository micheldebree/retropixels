# Run retropixels CLI
FROM node:6.11.0-alpine
MAINTAINER michel@michdeldebree.nl
COPY . /retropixels
WORKDIR /retropixels
RUN npm install -g typescript@2.3.3
RUN npm install -g gulp-cli@1.3.0
RUN npm install -g
RUN gulp
RUN mkdir -p /data
WORKDIR /data
ENTRYPOINT ["retropixels"]

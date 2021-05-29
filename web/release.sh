#!/bin/sh
set -e
make build
SITE="../../website/public"
APP="${SITE}/retropixels"
rm -rf ${APP}
mv ./build ${APP}

# cd "${SITE}" && git add . && git commit -m "New retropixels release" && git push



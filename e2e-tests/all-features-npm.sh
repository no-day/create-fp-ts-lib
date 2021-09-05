#!/usr/bin/env bash

set -e

DIR=$PWD
TMP=$(mktemp -d)

cd $TMP

$DIR/bin/index.js --noQuest --packageManager=npm

cd fp-ts-lib

npm run spell
npm run build
npm run lint
npm run test
npm run docs
npm run md

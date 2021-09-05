#!/usr/bin/env bash

set -e

DIR=$PWD
TMP=$(mktemp -d)

cd $TMP

$DIR/bin/index.js --noQuest --packageManager=yarn

cd fp-ts-lib

yarn run spell
yarn run build
yarn run lint
yarn run test
yarn run docs
yarn run md

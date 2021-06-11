#!/usr/bin/env bash

set -e

DIR=$PWD
TMP=$(mktemp -d)

cd $TMP

$DIR/bin/index.js --noQuest

cd fp-ts-lib

yarn run spell
yarn run build
yarn run lint
yarn run test
yarn run docs-ts
yarn run md

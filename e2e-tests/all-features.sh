#!/usr/bin/env bash

set -e

DIR=$PWD
TMP=$(mktemp -d)

cd $TMP

$DIR/bin/index.js --noQuest

cd fp-ts-lib

yarn install
yarn build

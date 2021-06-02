#!/usr/bin/env bash

set -e

yarn install
yarn run spell
yarn run deps
yarn run build
yarn run test
yarn run lint
yarn run e2e-test

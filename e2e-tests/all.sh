#!/usr/bin/env bash

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

$DIR/all-features-yarn.sh
$DIR/all-features-npm.sh

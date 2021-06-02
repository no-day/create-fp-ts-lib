#!/usr/bin/env ts-node

import * as cp from 'child_process'

const gitStatusBefore = cp.execSync('git status --porcelain').toString()

cp.execSync('yarn ci')

const gitStatusAfter = cp.execSync('git status --porcelain').toString()

if (gitStatusBefore !== gitStatusAfter) {
  process.exit(1)
}

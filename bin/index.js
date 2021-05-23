#!/usr/bin/env node

var app = require('../dist')

try {
  app.main()
} catch (e) {
  console.error('Unexpected error')
  process.exit(1)
}

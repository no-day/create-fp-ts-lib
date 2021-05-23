import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEffect } from './AppEffect'

import Option = O.Option

export type Config = {
  name: string
  homepage: string
  version: string
  license: string
  prettier: boolean
  eslint: boolean
  testing: Option<{ fastCheck: boolean }>
  docs: boolean
  ci: boolean
  vscode: boolean
  markdownMagic: boolean
}

export const getConfig: AppEffect<Config> = RTE.of({
  name: 'fp-ts-lib',
  homepage: 'http://',
  version: '1.0.0',
  license: 'MIT',
  prettier: true,
  eslint: true,
  testing: O.some({ fastCheck: true }),
  docs: true,
  ci: true,
  vscode: true,
  markdownMagic: true,
})

import * as PromptsTypeMap from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEffect } from './AppEffect'
import { prompts } from './prompts'

import Option = PromptsTypeMap.Option
import { pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'

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

export const getConfig: AppEffect<Config> = pipe(
  RTE.Do,
  RTE.bind('name', () =>
    prompts({
      type: 'text',
      message: 'project name',
    })
  ),
  RTE.bind('homepage', () =>
    prompts({
      type: 'text',
      message: 'homepage',
      initial: 'http://',
    })
  ),
  RTE.bind('version', () =>
    prompts({
      type: 'text',
      message: 'version',
      initial: '1.0.0',
    })
  ),
  RTE.bind('prettier', () =>
    prompts({
      type: 'toggle',
      message: 'use prettier',
      initial: true,
      active: 'yes',
      inactive: 'no',
    })
  ),
  RTE.bind('_1', () => RTE.fromIO(log(''))),
  RTE.bind('_confirm', ({ name }) =>
    prompts({
      type: 'confirm',
      message: `ready to setup project in folder \`${name}\`?`,
      initial: true,
    })
  ),
  RTE.chain((x) => (x._confirm ? RTE.of(x) : RTE.left('Aborted by user'))),
  RTE.map((answers) => ({
    ...answers,
    license: 'MIT',
    eslint: true,
    testing: PromptsTypeMap.some({ fastCheck: true }),
    docs: true,
    ci: true,
    vscode: true,
    markdownMagic: true,
  }))
)

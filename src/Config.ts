import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEffect } from './AppEffect'
import { prompts } from './prompts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import Option = O.Option
import { merge } from '@no-day/ts-prefix'

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

const getName = prompts({
  type: 'text',
  message: 'project name',
})

const getHomepage = prompts({
  type: 'text',
  message: 'homepage',
  initial: 'http://',
})

const getVersion = prompts({
  type: 'text',
  message: 'version',
  initial: '1.0.0',
})

const getPrettier = prompts({
  type: 'toggle',
  message: 'use prettier',
  initial: true,
  active: 'yes',
  inactive: 'no',
})

export const getConfig: AppEffect<Config> = pipe(
  RTE.Do,
  RTE.bind('name', () => getName),
  RTE.bind('homepage', () => getHomepage),
  RTE.bind('version', () => getVersion),
  RTE.bind('prettier', () => getPrettier),
  RTE.chainFirst(() => RTE.fromIO(log(''))),
  RTE.chainFirst(({ name }) =>
    pipe(
      prompts({
        type: 'confirm',
        message: `ready to setup project in folder \`${name}\`?`,
        initial: true,
      }),
      RTE.chain((confirmed) =>
        confirmed ? RTE.of(constVoid()) : RTE.left('Aborted by user')
      )
    )
  ),

  RTE.map(
    merge({
      license: 'MIT',
      eslint: true,
      testing: O.some({ fastCheck: true }),
      docs: true,
      ci: true,
      vscode: true,
      markdownMagic: true,
    })
  )
)

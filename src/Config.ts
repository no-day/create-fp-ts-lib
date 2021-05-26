import * as O from 'fp-ts/lib/Option'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { prompts } from './prompts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import Option = O.Option
import { merge } from '@no-day/ts-prefix'
import { Capabilities } from './AppEffect'

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

const confirm = <O extends { name: string }>({ name }: O) =>
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

export const getConfig: RTE.ReaderTaskEither<
  { cap: Capabilities },
  string,
  Config
> = pipe(
  RTE.Do,
  RTE.bind('name', () => getName),
  RTE.bind('homepage', () => getHomepage),
  RTE.bind('version', () => getVersion),
  RTE.bind('prettier', () => getPrettier),
  RTE.chainFirst(() => RTE.fromIO(log(''))),
  RTE.chainFirst(confirm),
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

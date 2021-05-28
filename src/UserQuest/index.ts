import * as RTE from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import { prompts } from '../prompts'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import { UserQuest } from './type'
import { CliOpts } from '../CliOpts'

// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

type Env = { cap: unknown; cliOpts: CliOpts }

type Effect<A> = RTE.ReaderTaskEither<Env, string, A>

const getName: Effect<string> = () =>
  prompts({
    type: 'text',
    message: 'project name',
  })

const getHomepage: Effect<string> = () =>
  prompts({
    type: 'text',
    message: 'homepage',
    initial: 'http://',
  })

const getVersion: Effect<string> = () =>
  prompts({
    type: 'text',
    message: 'version',
    initial: '1.0.0',
  })

const getPrettier: Effect<boolean> = () =>
  prompts({
    type: 'toggle',
    message: 'use prettier',
    initial: true,
    active: 'yes',
    inactive: 'no',
  })

const confirm: (o: { name: string }) => Effect<void> = ({ name }) => () =>
  pipe(
    prompts({
      type: 'confirm',
      message: `ready to setup project in folder \`${name}\`?`,
      initial: true,
    }),
    TE.chain((confirmed) =>
      confirmed ? TE.of(constVoid()) : TE.left('Aborted by user')
    )
  )

export const getQuest: Effect<UserQuest> = (env) =>
  pipe(
    TE.Do,
    TE.bind('name', () => getName(env)),
    TE.bind('homepage', () => getHomepage(env)),
    TE.bind('version', () => getVersion(env)),
    TE.bind('prettier', () => getPrettier(env)),
    TE.bind('license', () => TE.of('MIT')),
    TE.bind('eslint', () => TE.of(true)),
    TE.bind('jest', () => TE.of(true)),
    TE.bind('fastCheck', () => TE.of(true)),
    TE.bind('docsTs', () => TE.of(true)),
    TE.bind('ghActions', () => TE.of(true)),
    TE.bind('vscode', () => TE.of(true)),
    TE.bind('markdownMagic', () => TE.of(true)),
    TE.chainFirst(() => TE.fromIO(log(''))),
    TE.chainFirst(({ name }) => confirm({ name })(env))
  )

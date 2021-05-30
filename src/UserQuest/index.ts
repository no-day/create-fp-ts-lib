import * as RTE from '../ReaderTaskEither'
import * as O from 'fp-ts/Option'
import { prompts as prompts_ } from '../prompts'
import { constVoid, flow, pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import { UserQuest } from './type'
import { CliOpts } from '../CliOpts'
import { descriptions } from '../descriptions'

// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

type Env = { cap: unknown; cliOpts: CliOpts }

type Effect<A> = RTE.ReaderTaskEither<Env, string, A>

const prompts = flow(prompts_, RTE.fromTaskEither)

const getName: Effect<string> = RTE.scope(({ cliOpts: { name } }) =>
  pipe(
    name,
    O.fromNullable,
    O.match(
      () =>
        prompts({
          type: 'text',
          message: descriptions.name,
        }),
      RTE.of
    )
  )
)

const getHomepage: Effect<string> = RTE.scope(({ cliOpts: { homepage } }) =>
  pipe(
    homepage,
    O.fromNullable,
    O.match(
      () =>
        prompts({
          type: 'text',
          message: descriptions.homepage,
          initial: 'http://',
        }),
      RTE.of
    )
  )
)

const getProjectVersion: Effect<string> = RTE.scope(
  ({ cliOpts: { projectVersion: version } }) =>
    pipe(
      version,
      O.fromNullable,
      O.match(
        () =>
          prompts({
            type: 'text',
            message: descriptions.projectVersion,
            initial: '1.0.0',
          }),
        RTE.of
      )
    )
)

const getPrettier: Effect<boolean> = RTE.scope(({ cliOpts: { prettier } }) =>
  pipe(
    prettier,
    O.fromNullable,
    O.match(
      () =>
        prompts({
          type: 'toggle',
          message: 'use prettier',
          initial: true,
          active: 'yes',
          inactive: 'no',
        }),
      RTE.of
    )
  )
)

const confirm: (env: Pick<UserQuest, 'name'>) => Effect<void> = ({ name }) =>
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

export const getQuest: Effect<UserQuest> = RTE.scope(() =>
  pipe(
    RTE.Do,
    RTE.bind('name', () => getName),
    RTE.bind('homepage', () => getHomepage),
    RTE.bind('projectVersion', () => getProjectVersion),
    RTE.bind('prettier', () => getPrettier),
    RTE.bind('license', () => RTE.of('MIT')),
    RTE.bind('eslint', () => RTE.of(true)),
    RTE.bind('jest', () => RTE.of(true)),
    RTE.bind('fastCheck', () => RTE.of(true)),
    RTE.bind('docsTs', () => RTE.of(true)),
    RTE.bind('ghActions', () => RTE.of(true)),
    RTE.bind('vscode', () => RTE.of(true)),
    RTE.bind('markdownMagic', () => RTE.of(true)),
    RTE.chainFirst(() => RTE.fromIO(log(''))),
    RTE.chainFirst(({ name }) => confirm({ name }))
  )
)

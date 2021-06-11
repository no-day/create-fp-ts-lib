import * as RTE from '../ReaderTaskEither'
import { ReaderTaskEither } from '../ReaderTaskEither'
import { prompts as prompts_ } from '../prompts'
import { constVoid, flow, pipe } from 'fp-ts/lib/function'
import { log } from 'fp-ts/lib/Console'
import { UserQuest } from './type'
import { descriptions } from '../Config/descriptions'
import { Config, PackageManager } from '../Config/type'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Env = { cap: unknown; config: Config }

type Error = string

type Effect<A> = ReaderTaskEither<Env, Error, A>

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

const prompts = flow(prompts_, RTE.fromTaskEither)

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const getName: Effect<string> = RTE.scope(({ config: { name } }) =>
  prompts({
    type: 'text',
    initial: name,
    message: descriptions.name,
  })
)

const getPackageManager: Effect<PackageManager> = RTE.scope(
  ({ config: { packageManager } }) =>
    prompts({
      type: 'select',
      initial: { yarn: 0, npm: 1 }[packageManager],
      message: descriptions.packageManager,
      choices: [
        { title: 'Yarn', value: 'yarn' as const },
        { title: 'NPM', value: 'npm' as const },
      ],
    })
)

const getInPlace: Effect<boolean> = RTE.scope(({ config: { inPlace } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.inPlace,
    initial: inPlace,
    active: 'yes',
    inactive: 'no',
  })
)

const getHomepage: Effect<string> = RTE.scope(({ config: { homepage } }) =>
  prompts({
    type: 'text',
    message: descriptions.homepage,
    initial: homepage,
  })
)

const getHomepageAPI: Effect<string> = RTE.scope(
  ({ config: { homepageAPI } }) =>
    prompts({
      type: 'text',
      message: descriptions.homepageAPI,
      initial: homepageAPI,
    })
)

const getProjectVersion: Effect<string> = RTE.scope(
  ({ config: { projectVersion } }) =>
    prompts({
      type: 'text',
      message: descriptions.projectVersion,
      initial: projectVersion,
    })
)
const getLicense: Effect<string> = RTE.scope(({ config: { license } }) =>
  prompts({
    type: 'text',
    message: descriptions.license,
    initial: license,
  })
)

const getPrettier: Effect<boolean> = RTE.scope(({ config: { prettier } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.prettier,
    initial: prettier,
    active: 'yes',
    inactive: 'no',
  })
)

const getEsLint: Effect<boolean> = RTE.scope(({ config: { eslint } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.eslint,
    initial: eslint,
    active: 'yes',
    inactive: 'no',
  })
)

const getJest: Effect<boolean> = RTE.scope(({ config: { jest } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.jest,
    initial: jest,
    active: 'yes',
    inactive: 'no',
  })
)

const getFastCheck: Effect<boolean> = RTE.scope(({ config: { fastCheck } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.fastCheck,
    initial: fastCheck,
    active: 'yes',
    inactive: 'no',
  })
)

const getDocsTs: Effect<boolean> = RTE.scope(({ config: { docsTs } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.docsTs,
    initial: docsTs,
    active: 'yes',
    inactive: 'no',
  })
)

const getGhActions: Effect<boolean> = RTE.scope(({ config: { ghActions } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.ghActions,
    initial: ghActions,
    active: 'yes',
    inactive: 'no',
  })
)

const getMarkdownMagic: Effect<boolean> = RTE.scope(
  ({ config: { markdownMagic } }) =>
    prompts({
      type: 'toggle',
      message: descriptions.markdownMagic,
      initial: markdownMagic,
      active: 'yes',
      inactive: 'no',
    })
)

const getVscode: Effect<boolean> = RTE.scope(({ config: { vscode } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.vscode,
    initial: vscode,
    active: 'yes',
    inactive: 'no',
  })
)

const getCspell: Effect<boolean> = RTE.scope(({ config: { cspell } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.cspell,
    initial: cspell,
    active: 'yes',
    inactive: 'no',
  })
)

const getRunInstall: Effect<boolean> = RTE.scope(({ config: { runInstall } }) =>
  prompts({
    type: 'toggle',
    message: descriptions.runInstall,
    initial: runInstall,
    active: 'yes',
    inactive: 'no',
  })
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

const main: Effect<UserQuest> = pipe(
  RTE.Do,
  RTE.bind('name', () => getName),
  RTE.bind('inPlace', () => getInPlace),
  RTE.bind('homepage', () => getHomepage),
  RTE.bind('homepageAPI', () => getHomepageAPI),
  RTE.bind('projectVersion', () => getProjectVersion),
  RTE.bind('license', () => getLicense),
  RTE.bind('packageManager', () => getPackageManager),
  RTE.bind('prettier', () => getPrettier),
  RTE.bind('eslint', () => getEsLint),
  RTE.bind('jest', () => getJest),
  RTE.bind('fastCheck', () => getFastCheck),
  RTE.bind('docsTs', () => getDocsTs),
  RTE.bind('ghActions', () => getGhActions),
  RTE.bind('vscode', () => getVscode),
  RTE.bind('markdownMagic', () => getMarkdownMagic),
  RTE.bind('cspell', () => getCspell),
  RTE.bind('runInstall', () => getRunInstall),
  RTE.chainFirst(() => RTE.fromIO(log(''))),
  RTE.chainFirst(({ name }) => confirm({ name }))
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

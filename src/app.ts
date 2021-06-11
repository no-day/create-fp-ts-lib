import { constVoid, pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as features from './features'
import { FileSystem } from './FileSystem'
import * as FS from './FileSystem'
import { Capabilities, capabilities } from './Capabilities'
import { merge } from '@no-day/ts-prefix'
import getQuest from './UserQuest'
import { getCliOpts } from './Config/cli'
import { Config } from './Config/type'
import { getProjectDirectory } from './Config'
import * as CFG from './Config'

// -----------------------------------------------------------------------------
// type
// -----------------------------------------------------------------------------

type Error = string

type Effect<A> = TE.TaskEither<Error, A>

type _config = { config: Config }

type _cap = { cap: Capabilities }

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const getConfig: <Env extends _cap>(env: Env) => Effect<Config> = (cap) =>
  pipe(
    TE.fromTask<string, Config>(getCliOpts),
    TE.chain((config) =>
      config.noQuest
        ? TE.of(config)
        : pipe(getQuest({ cap, config }), TE.map(merge(config)))
    )
  )

const generateFiles: <Env extends _config & _cap>(
  env: Env
) => Effect<FileSystem> = ({ cap, config }) =>
  pipe(
    TE.of({}),
    TE.chain((files) =>
      pipe(features.skeleton({ cap, config, files }), TE.map(merge(files)))
    ),
    TE.chain((files) =>
      config.prettier
        ? pipe(features.prettier({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.eslint
        ? pipe(features.esLint({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.jest
        ? pipe(features.jest({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.fastCheck
        ? pipe(features.fastCheck({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.docsTs
        ? pipe(features.docsTs({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.ghActions
        ? pipe(features.ghActions({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.vscode
        ? pipe(features.vscode({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.cspell
        ? pipe(features.cspell({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.markdownMagic
        ? pipe(
            features.markdownMagic({ cap, config, files }),
            TE.map(merge(files))
          )
        : TE.of(files)
    )
  )

const checkGitDir: <Env extends _config & _cap>(env: Env) => Effect<void> = ({
  config,
  cap,
}) =>
  config.inPlace
    ? pipe(
        cap.spawn('git', ['status', '--porcelain'], {})({}),
        TE.chain(({ stdout, exitCode, stderr }) =>
          stderr === '' && stdout === '' && exitCode === 0
            ? TE.of(constVoid())
            : TE.throwError(
                'Not inside a Git directory with clean working tree'
              )
        )
      )
    : TE.of(constVoid())

const setup: <Env extends _config & _cap>(env: Env) => Effect<void> = ({
  config,
  cap,
}) =>
  config.runInstall
    ? pipe(
        cap.spawn(config.packageManager, ['install'], {
          cwd: CFG.getProjectDirectory(config),
        })({}),
        TE.map(() => constVoid())
      )
    : TE.of(constVoid())

const main: Effect<void> = pipe(
  TE.Do,
  TE.bind('cap', () => TE.of(capabilities)),
  TE.bind('config', getConfig),
  TE.chainFirst(checkGitDir),
  TE.bind('files', generateFiles),
  TE.chainFirst(FS.writeOut),
  TE.chainFirst(setup),
  TE.map(constVoid)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { main }

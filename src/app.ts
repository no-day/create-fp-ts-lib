import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as features from './features'
import { FileSystem } from './FileSystem'
import * as FS from './FileSystem'
import { Capabilities, capabilities } from './Capabilities'
import { merge } from '@no-day/ts-prefix'
import getQuest from './UserQuest'
import { getCliOpts } from './Config/cli'
import { Config } from './Config/type'

// -----------------------------------------------------------------------------
// type
// -----------------------------------------------------------------------------

type Error = string

type Effect<A> = TE.TaskEither<Error, A>

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const getConfig: (_1: Capabilities) => Effect<Config> = (cap) =>
  pipe(
    TE.fromTask<string, Config>(getCliOpts),
    TE.chain((config) =>
      config.noQuest
        ? TE.of(config)
        : pipe(getQuest({ cap, config }), TE.map(merge(config)))
    )
  )

const generateFiles: (_1: {
  config: Config
  cap: Capabilities
}) => Effect<FileSystem> = ({ cap, config }) =>
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
      config.markdownMagic
        ? pipe(
            features.markdownMagic({ cap, config, files }),
            TE.map(merge(files))
          )
        : TE.of(files)
    )
  )

const main: Effect<void> = pipe(
  TE.Do,
  TE.bind('cap', () => TE.of(capabilities)),
  TE.bind('config', ({ cap }) => getConfig(cap)),
  TE.bind('files', ({ config, cap }) => generateFiles({ cap, config })),
  TE.chain(({ cap, config, files }) => FS.writeOut({ files, cap, config }))
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { main }

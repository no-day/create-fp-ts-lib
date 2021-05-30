import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import featureSkeleton from './features/skeleton'
import featurePrettier from './features/prettier'
import featureEsLint from './features/eslint'
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
    TE.chain((config) => pipe(getQuest({ cap, config }), TE.map(merge(config))))
  )

const generateFiles: (_1: Capabilities, _2: Config) => Effect<FileSystem> = (
  cap,
  config
) =>
  pipe(
    TE.of({}),
    TE.chain((files) =>
      pipe(featureSkeleton({ cap, config, files }), TE.map(merge(files)))
    ),
    TE.chain((files) =>
      config.prettier
        ? pipe(featurePrettier({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    ),
    TE.chain((files) =>
      config.eslint
        ? pipe(featureEsLint({ cap, config, files }), TE.map(merge(files)))
        : TE.of(files)
    )
  )

const main: Effect<void> = pipe(
  TE.Do,
  TE.bind('cap', () => TE.of(capabilities)),
  TE.bind('config', ({ cap }) => getConfig(cap)),
  TE.bind('files', ({ config, cap }) => generateFiles(cap, config)),
  TE.chain(({ cap, config, files }) => FS.writeOut({ files, cap, config }))
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { main }

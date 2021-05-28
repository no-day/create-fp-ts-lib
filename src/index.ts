import { pipe } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as I from 'fp-ts/IO'
import featureSkeleton from './features/skeleton'
import featurePrettier from './features/prettier'
import * as FileSystem from './FileSystem'
import { log } from 'fp-ts/lib/Console'
import { getCliOpts } from './CliOpts'
import { getQuest } from './UserQuest'
import { capabilities } from './Capabilities'
import { merge } from '@no-day/ts-prefix'

const setup: TE.TaskEither<string, void> = pipe(
  TE.Do,
  TE.bind('cap', () => TE.of(capabilities)),
  TE.bind('cliOpts', ({ cap }) => getCliOpts({ cap })),
  TE.bind('config', ({ cliOpts, cap }) => getQuest({ cap, cliOpts })),
  TE.chain(({ config, cap }) =>
    pipe(
      TE.of({}),
      TE.chain((files) =>
        pipe(featureSkeleton({ cap, config, files }), merge(files))
      ),
      TE.chain((files) =>
        pipe(featurePrettier({ cap, config, files }), merge(files))
      ),
      TE.chain((files) => FileSystem.writeOut({ files, cap, config }))
    )
  )
)

export const main: Task<void> = pipe(
  setup,
  TE.getOrElse((e) =>
    pipe(
      log(`ERROR: ${e}`),
      I.chain(() => () => process.exit(1) as void),
      T.fromIO
    )
  )
)

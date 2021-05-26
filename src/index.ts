import { pipe } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as I from 'fp-ts/IO'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEffect } from './AppEffect'
import { getConfig } from './Config'
import featureSkeleton from './features/skeleton'
import featurePrettier from './features/prettier'
import * as FileSystem from './FileSystem'
import { log } from 'fp-ts/lib/Console'
import { capabilities } from './capabilities'

const app: AppEffect<void> = pipe(
  {},
  featureSkeleton,
  RTE.chain(featurePrettier),
  RTE.chain(FileSystem.writeOut)
)

const cap = capabilities

const setup: TE.TaskEither<string, void> = pipe(
  TE.Do,
  TE.bind('config', () => getConfig({ cap })),
  TE.chain(({ config }) => app({ config, cap }))
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

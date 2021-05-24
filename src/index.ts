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
import { tag } from './type-utils'
import { PackageJson } from './FileObj'

const run: AppEffect<void> = pipe(
  RTE.Do,
  RTE.bind('config', () => getConfig),
  RTE.chain(({ config }) =>
    pipe(
      {},
      featureSkeleton(config),
      RTE.chain(featurePrettier(config)),
      RTE.chain(FileSystem.writeOut({ config }))
    )
  )
)

export const main: Task<void> = pipe(
  run(capabilities),
  TE.getOrElse((e) =>
    pipe(
      log(`ERROR: ${e}`),
      I.chain(() => () => process.exit(1) as void),
      T.fromIO
    )
  )
)

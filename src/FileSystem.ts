import { AppEffect, Capabilities } from './AppEffect'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { pipe } from 'fp-ts/lib/function'
import { Config } from './Config'

export type FileSystem = Record<string, string>

export const writeOut = ({ config }: { config: Config }) => (
  fileSystem: FileSystem
): AppEffect<void> =>
  pipe(
    RTE.ask<Capabilities>(),
    RTE.chain((cap) => cap.mkDir(config.name, { recursive: false }))
  )

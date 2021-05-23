import { AppEffect, Capabilities } from './AppEffect'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as R from 'fp-ts/Record'
import * as path from 'path'

import { pipe } from 'fp-ts/lib/function'
import { Config } from './Config'

export type FileSystem = Record<string, string>

export const writeOut = ({ config }: { config: Config }) => (
  fileSystem: FileSystem
): AppEffect<void> =>
  pipe(
    RTE.ask<Capabilities>(),
    RTE.map((cap) => ({ cap })),
    RTE.bind('_1', ({ cap }) => cap.mkDir(config.name, { recursive: false })),
    RTE.bind('_2', ({ cap }) =>
      pipe(
        fileSystem,
        R.traverseWithIndex(RTE.ApplicativeSeq)((k, v) =>
          pipe(
            RTE.Do,
            RTE.bind('filePath', () => RTE.of(path.join(config.name, k))),
            RTE.bind('dirPath', (s) => RTE.of(path.dirname(s.filePath))),
            RTE.bind('_1', (s) => cap.mkDir(s.dirPath, { recursive: true })),
            RTE.bind('_2', (s) => cap.writeFile(s.filePath, v))
          )
        )
      )
    ),
    RTE.map((x) => undefined as void)
  )

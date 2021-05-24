import { AppEffect, Capabilities } from './AppEffect'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as R from 'fp-ts/Record'
import * as path from 'path'

import { constVoid, pipe } from 'fp-ts/lib/function'
import { Config } from './Config'
import { FileObj, print } from './FileObj'

export type FileSystem = Record<string, string>

export const writeOut = ({ config }: { config: Config }) => (
  fileSystem: Record<string, FileObj>
): AppEffect<void> =>
  pipe(
    RTE.ask<Capabilities>(),
    RTE.map((cap) => ({ cap })),
    RTE.chainFirst(({ cap }) => cap.mkDir(config.name, { recursive: false })),
    RTE.chainFirst(({ cap }) =>
      pipe(
        fileSystem,
        R.traverseWithIndex(RTE.ApplicativeSeq)((k, v) =>
          pipe(
            RTE.Do,
            RTE.bind('filePath', () => RTE.of(path.join(config.name, k))),
            RTE.bind('dirPath', (s) => RTE.of(path.dirname(s.filePath))),
            RTE.chainFirst((s) => cap.mkDir(s.dirPath, { recursive: true })),
            RTE.chainFirst((s) => cap.writeFile(s.filePath, print(v)))
          )
        )
      )
    ),
    RTE.map(constVoid)
  )

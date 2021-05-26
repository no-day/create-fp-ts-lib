import { AppEffect, AppEnv } from './AppEffect'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as R from 'fp-ts/Record'
import * as path from 'path'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { FileObj, print } from './FileObj'
export type FileSystem = Record<string, string>

export const writeOut = (
  fileSystem: Record<string, FileObj>
): AppEffect<void> =>
  pipe(
    RTE.ask<AppEnv>(),
    RTE.chainFirst(({ cap, config }) =>
      cap.mkDir(config.name, { recursive: false })
    ),
    RTE.chainFirst(({ cap, config }) =>
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

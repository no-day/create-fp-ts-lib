import * as TE from 'fp-ts/lib/TaskEither'
import * as R from 'fp-ts/Record'
import * as path from 'path'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { FileObj, print } from './FileObj'
import { Config } from './Config'
import { Capabilities } from './Capabilities'
export type FileSystem = Record<string, string>

type Env = {
  cap: Capabilities
  config: Config
  files: Record<string, FileObj>
}

type Effect<A> = (env: Env) => TE.TaskEither<string, A>

export const writeOut: Effect<void> = ({ files, cap, config }) =>
  pipe(
    cap.mkDir(config.name, { recursive: false }),
    TE.chainFirst(() =>
      pipe(
        files,
        R.traverseWithIndex(TE.ApplicativeSeq)((k, v) =>
          pipe(
            TE.Do,
            TE.bind('filePath', () => TE.of(path.join(config.name, k))),
            TE.bind('dirPath', (s) => TE.of(path.dirname(s.filePath))),
            TE.chainFirst((s) => cap.mkDir(s.dirPath, { recursive: true })),
            TE.chainFirst((s) => cap.writeFile(s.filePath, print(v)))
          )
        )
      )
    ),
    TE.map(constVoid)
  )

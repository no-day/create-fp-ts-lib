import * as TE from 'fp-ts/lib/TaskEither'
import * as RTE from './ReaderTaskEither'
import * as R from 'fp-ts/Record'
import * as path from 'path'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { FileObj, print } from './FileObj'
import { Config } from './Config'
import { Capabilities } from './Capabilities'
export type FileSystem = Record<string, string>

export { writeOut }

type Env = {
  cap: Capabilities
  config: Config
  files: Record<string, FileObj>
}

type Effect<A> = (env: Env) => TE.TaskEither<string, A>

const writeFile: (_1: string, _2: FileObj) => Effect<void> = (
  filePath,
  content
) =>
  RTE.scope(({ cap, config }) =>
    pipe(
      RTE.Do,
      RTE.bind('filePath', () => RTE.of(path.join(config.name, filePath))),
      RTE.bind('dirPath', (s) => RTE.of(path.dirname(s.filePath))),
      RTE.chainFirst((s) => cap.mkDir(s.dirPath, { recursive: true })),
      RTE.chainFirst((s) => cap.writeFile(s.filePath, print(content))),
      RTE.map(constVoid)
    )
  )

const writeOut: Effect<void> = RTE.scope(({ files, cap, config }) =>
  pipe(
    cap.mkDir(config.name, { recursive: false }),
    RTE.chainFirst(() =>
      pipe(files, R.traverseWithIndex(RTE.ApplicativeSeq)(writeFile))
    ),
    RTE.map(constVoid)
  )
)

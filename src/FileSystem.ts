import * as TE from 'fp-ts/lib/TaskEither'
import * as RTE from './ReaderTaskEither'
import * as R from 'fp-ts/Record'
import * as path from 'path'
import { constVoid, pipe } from 'fp-ts/lib/function'
import { FileObj, print } from './FileObj'
import { Config } from './Config/type'
import { Capabilities } from './Capabilities'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type FileSystem = Record<string, FileObj>

type Env = {
  cap: Capabilities
  config: Config
  files: FileSystem
}

type Effect<A> = (env: Env) => TE.TaskEither<string, A>

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const writeFile: (_1: string, _2: FileObj) => Effect<void> = (
  filePath,
  content
) =>
  RTE.scope(({ cap, config }) =>
    pipe(
      RTE.Do,
      RTE.bind('filePath', () =>
        RTE.of(config.inPlace ? filePath : path.join(config.name, filePath))
      ),
      RTE.bind('dirPath', (s) => pipe(path.dirname(s.filePath), RTE.of)),
      RTE.chainFirst((s) => cap.mkDir(s.dirPath, { recursive: true })),
      RTE.chainFirst((s) => cap.writeFile(s.filePath, print(content))),
      RTE.map(constVoid)
    )
  )

const mkDir: Effect<void> = RTE.scope(({ config, cap }) =>
  config.inPlace
    ? RTE.of(constVoid())
    : cap.mkDir(config.name, { recursive: false })
)

const writeFiles: Effect<void> = RTE.scope(({ files }) =>
  pipe(
    files,
    R.traverseWithIndex(RTE.ApplicativeSeq)(writeFile),
    RTE.map(constVoid)
  )
)

const writeOut: Effect<void> = pipe(
  mkDir,
  RTE.chainFirst(() => writeFiles)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { FileSystem, writeOut }

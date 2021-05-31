import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import * as fs from 'fs'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Error = string

type Effect<A> = ReaderTaskEither<Record<string, unknown>, Error, A>

type Capabilities = {
  mkDir: (path: string, opts: { recursive: boolean }) => Effect<void>
  writeFile: (path: string, content: string) => Effect<void>
  readFile: (path: string) => Effect<string>
}

// -----------------------------------------------------------------------------
// impl
// -----------------------------------------------------------------------------

const implWriteFile: (
  filename: string,
  data: string
) => TaskEither<NodeJS.ErrnoException, void> = TE.taskify(fs.writeFile)

const implReadFile: (
  filename: string
) => TaskEither<NodeJS.ErrnoException, Buffer> = TE.taskify(fs.readFile)

const implMkdir: (
  filename: string,
  opts: { recursive: boolean }
) => TaskEither<NodeJS.ErrnoException, void> = TE.taskify(fs.mkdir)

// -----------------------------------------------------------------------------
// capabilities
// -----------------------------------------------------------------------------

const mkDir: Capabilities['mkDir'] = (name, opts) =>
  pipe(
    implMkdir(name, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot create dictionary ${name}`)
  )

const writeFile: Capabilities['writeFile'] = (name, opts) =>
  pipe(
    implWriteFile(name, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot write to file ${name}`)
  )

const readFile: Capabilities['readFile'] = (name) =>
  pipe(
    implReadFile(name),
    RTE.fromTaskEither,
    RTE.mapLeft(() => 'Cannot read file `name`'),
    RTE.map((_) => _.toString())
  )

const capabilities: Capabilities = {
  mkDir,
  writeFile,
  readFile,
}

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { capabilities, Capabilities }

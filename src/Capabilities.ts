import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import * as taskified from './taskified'
import { SimpleSpawnResult } from './simple-spawn'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Error = string

type Effect<A> = ReaderTaskEither<Record<string, unknown>, Error, A>

type Capabilities = {
  mkDir: (path: string, opts: { recursive: boolean }) => Effect<void>
  writeFile: (path: string, content: string) => Effect<void>
  readFile: (path: string) => Effect<string>
  runGit: (args: string[]) => Effect<SimpleSpawnResult>
}

// -----------------------------------------------------------------------------
// capabilities
// -----------------------------------------------------------------------------

const mkDir: Capabilities['mkDir'] = (name, opts) =>
  pipe(
    taskified.mkdir(name, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot create dictionary ${name}`)
  )

const writeFile: Capabilities['writeFile'] = (name, opts) =>
  pipe(
    taskified.writeFile(name, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot write to file ${name}`)
  )

const readFile: Capabilities['readFile'] = (name) =>
  pipe(
    taskified.readFile(name),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot read file ${name}`),
    RTE.map((_) => _.toString())
  )

const runGit: Capabilities['runGit'] = (args) =>
  pipe(
    taskified.simpleSpawn('git', args),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot read file ${name}`)
  )

const capabilities: Capabilities = {
  mkDir,
  writeFile,
  readFile,
  runGit,
}

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { capabilities, Capabilities }

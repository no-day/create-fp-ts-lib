import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import * as taskified from './taskified'
import { SimpleSpawnResult } from './simple-spawn'
import * as SIS from './simple-spawn'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Error = string

type Effect<A> = ReaderTaskEither<Record<string, unknown>, Error, A>

// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------

const mkDir: (path: string, opts: { recursive: boolean }) => Effect<void> = (
  name,
  opts
) =>
  pipe(
    taskified.mkdir(name, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot create dictionary ${name}`)
  )

const writeFile: (path: string, content: string) => Effect<void> = (
  name,
  opts
) =>
  pipe(
    taskified.writeFile(name, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot write to file ${name}`)
  )

const readFile: (path: string) => Effect<string> = (name) =>
  pipe(
    taskified.readFile(name),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot read file ${name}`),
    RTE.map((_) => _.toString())
  )

const spawn: (
  command: string,
  args: string[],
  opts: SIS.Options
) => Effect<SimpleSpawnResult> = (command, args, opts) =>
  pipe(
    taskified.simpleSpawn(command, args, opts),
    RTE.fromTaskEither,
    RTE.mapLeft(() => `Cannot spawn ${command}`)
  )

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { mkDir, writeFile, readFile, spawn }

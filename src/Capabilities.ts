import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { SimpleSpawnResult } from './simple-spawn'
import * as Eff from './effects'
import * as SIS from './simple-spawn'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Error = string

type Effect<A> = ReaderTaskEither<Record<string, unknown>, Error, A>

type Capabilities = {
  mkDir: (path: string, opts: { recursive: boolean }) => Effect<void>
  writeFile: (path: string, content: string) => Effect<void>
  readFile: (path: string) => Effect<string>
  spawn: (
    command: 'yarn' | 'npm' | 'git',
    args: string[],
    opts: SIS.Options
  ) => Effect<SimpleSpawnResult>
}

// -----------------------------------------------------------------------------
// capabilities
// -----------------------------------------------------------------------------

const capabilities: Capabilities = {
  mkDir: Eff.mkDir,
  writeFile: Eff.writeFile,
  readFile: Eff.readFile,
  spawn: Eff.spawn,
}

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { capabilities, Capabilities }

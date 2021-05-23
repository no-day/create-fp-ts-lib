import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import ReaderTaskEither = RTE.ReaderTaskEither

export type AppEffect<T> = ReaderTaskEither<Capabilities, string, T>

export type Capabilities = {
  mkDir: (path: string, opts: { recursive: boolean }) => AppEffect<void>
  writeFile: (path: string, content: string) => AppEffect<void>
  readFile: (path: string) => AppEffect<string>
}

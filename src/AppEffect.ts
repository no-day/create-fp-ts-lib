import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import ReaderTaskEither = RTE.ReaderTaskEither

export type AppEffect<T> = ReaderTaskEither<{ cap: Capabilities }, string, T>

export type Capabilities = {
  mkDir: (
    path: string,
    opts: { recursive: boolean }
  ) => ReaderTaskEither<{ cap: Capabilities }, string, void>
  writeFile: (
    path: string,
    content: string
  ) => ReaderTaskEither<{ cap: Capabilities }, string, void>
  readFile: (
    path: string
  ) => ReaderTaskEither<{ cap: Capabilities }, string, string>
}

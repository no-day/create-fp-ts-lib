import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import ReaderTaskEither = RTE.ReaderTaskEither

export type AppEffect<T> = ReaderTaskEither<Capabilities, string, T>

export type Capabilities = {
  mkDir: (
    path: string,
    opts: { recursive: boolean }
  ) => ReaderTaskEither<Capabilities, string, void>
  writeFile: (
    path: string,
    content: string
  ) => ReaderTaskEither<Capabilities, string, void>
  readFile: (path: string) => ReaderTaskEither<Capabilities, string, string>
}

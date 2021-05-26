import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Config } from './Config'

import ReaderTaskEither = RTE.ReaderTaskEither

export type AppEffect<T> = ReaderTaskEither<AppEnv, string, T>

export type AppEnv = { cap: Capabilities; config: Config }

export type Capabilities = {
  mkDir: (
    path: string,
    opts: { recursive: boolean }
  ) => ReaderTaskEither<any, string, void>
  writeFile: (
    path: string,
    content: string
  ) => ReaderTaskEither<any, string, void>
  readFile: (path: string) => ReaderTaskEither<any, string, string>
}

import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEffect } from './AppEffect'

export type Config = { name: string }

export const getConfig: AppEffect<Config> = RTE.of({
  name: 'fp-ts-lib',
})

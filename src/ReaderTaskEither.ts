import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
export * from 'fp-ts/lib/ReaderTaskEither'

export const scope = <R, E, A>(
  fn: (r: R) => ReaderTaskEither<R, E, A>
): ReaderTaskEither<R, E, A> => pipe(RTE.ask<R>(), RTE.chain(fn))

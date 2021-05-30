import { pipe } from 'fp-ts/function'
import { Task } from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as T from 'fp-ts/Task'
import * as I from 'fp-ts/IO'
import { log } from 'fp-ts/lib/Console'
import * as app from './app'

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const main: Task<void> = pipe(
  app.main,
  TE.getOrElse((e) =>
    pipe(
      log(`ERROR: ${e}`),
      I.chain(() => () => process.exit(1) as void),
      T.fromIO
    )
  )
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { main }

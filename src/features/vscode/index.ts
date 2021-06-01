import * as RTE from '../../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../../type-utils'
import { FileObj, FileObjects } from '../../FileObj'
import { Capabilities } from '../../Capabilities'
import { Config } from '../../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import mkTasksJson from './tasks-json'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Env = {
  cap: Capabilities
  config: Config
  files: InFiles
}

type Error = string

type Effect<A> = ReaderTaskEither<Env, Error, A>

type InFiles = Record<string, FileObj>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    '.vscode/tasks.json': FileObjects['Json']
  }
>

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const tasksJson: Effect<FileObjects['Json']> = RTE.scope(({ config }) =>
  pipe(
    RTE.of(mkTasksJson(config, ['build', ...(config.jest ? ['test'] : [])])),
    RTE.map(tag('Json'))
  )
)

const main: Effect<OutFiles> = pipe(
  {
    '.vscode/tasks.json': tasksJson,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

import * as RTE from '../../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../../type-utils'
import { FileObj, FileObjects } from '../../FileObj'
import { Capabilities } from '../../Capabilities'
import { Config } from '../../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import mkBuildYml from './build-yml'
import mkPublishYml from './publish-yml'

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
    '.github/workflows/build.yml': FileObjects['Yaml']
    '.github/workflows/publish.yml': FileObjects['Yaml']
  }
>

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const buildYml: Effect<FileObjects['Yaml']> = RTE.scope(({ config }) =>
  pipe(RTE.of(mkBuildYml(config)), RTE.map(tag('Yaml')))
)

const publishYml: Effect<FileObjects['Yaml']> = pipe(
  RTE.of(mkPublishYml),
  RTE.map(tag('Yaml'))
)

const main: Effect<OutFiles> = pipe(
  {
    '.github/workflows/build.yml': buildYml,
    '.github/workflows/publish.yml': publishYml,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

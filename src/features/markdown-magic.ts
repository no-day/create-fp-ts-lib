import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import * as PJ from '../PackageJson'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

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

type InFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
  }
>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
  }
>

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const mkPackageJson = (config: Config) => ({
  devDependencies: {
    'markdown-magic': '^2.0.0',
  },
  scripts: {
    md: `${config.packageManager} run markdown`,
  },
})

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const packageJson: Effect<FileObjects['PackageJson']> = RTE.scope(
  ({
    files: {
      'package.json': { data },
    },
    config,
  }) => pipe(mkPackageJson(config), PJ.merge(data), tag('PackageJson'), RTE.of)
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

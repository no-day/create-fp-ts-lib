import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import { merge } from '@no-day/ts-prefix'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { prettierConfig } from '../prettier-config'
import { Json } from '../Json'

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
    '.prettierrc': FileObjects['Json']
    '.prettierignore': FileObjects['Text']
  }
>

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const mkPackageJson = (config: Config): Json => ({
  devDependencies: {
    prettier: '^2.2.1',
    'prettier-plugin-jsdoc': '^0.3.13',
  },
  scripts: {
    pretty: `${config.packageManager} run prettier --check .`,
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
  }) =>
    pipe(
      mkPackageJson(config),
      RTE.of,
      RTE.map(merge(data)),
      RTE.map(tag('PackageJson'))
    )
)

const prettierRc: Effect<FileObjects['Json']> = pipe(
  prettierConfig as Json,
  tag('Json'),
  RTE.of
)

const prettierIgnore: Effect<FileObjects['Text']> = pipe(
  ['/dist'],
  tag('Text'),
  RTE.of
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    '.prettierrc': prettierRc,
    '.prettierignore': prettierIgnore,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

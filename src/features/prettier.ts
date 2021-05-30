import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { merge } from '@no-day/ts-prefix'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { prettierConfig } from '../prettier-config'
import { Json } from '../Json'
import { PackageJson } from '../PackageJson'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Env = {
  cap: Capabilities
  config: Config
  files: InFiles
}

type Effect<A> = ReaderTaskEither<Env, string, A>

type InFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObj_['PackageJson']
  }
>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObj_['PackageJson']
    '.prettierrc': FileObj_['Json']
    '.prettierignore': FileObj_['Text']
  }
>

// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

const dependencies: Effect<PackageJson['dependencies']> = pipe(
  {
    prettier: '^2.2.1',
  },
  RTE.of
)

const scripts: Effect<PackageJson['scripts']> = pipe(
  {
    pretty: 'yarn prettier --check .',
  },
  RTE.of
)

const packageJson: Effect<FileObj_['PackageJson']> = RTE.scope(
  ({
    files: {
      'package.json': { data },
    },
  }) =>
    pipe(
      {
        dependencies: pipe(dependencies, RTE.map(merge(data.dependencies))),
        scripts: pipe(scripts, RTE.map(merge(data.scripts))),
      },
      sequenceS(RTE.ApplySeq),
      RTE.map(merge(data)),
      RTE.map(tag('PackageJson'))
    )
)

const prettierRc: Effect<FileObj_['Json']> = pipe(
  prettierConfig as Json,
  tag('Json'),
  RTE.of
)

const prettierIgnore: Effect<FileObj_['Text']> = pipe(
  ['/dist'],
  tag('Text'),
  RTE.of
)

const main: Effect<OutFiles> = RTE.scope(() =>
  pipe(
    {
      'package.json': packageJson,
      '.prettierrc': prettierRc,
      '.prettierignore': prettierIgnore,
    },
    sequenceS(RTE.ApplySeq)
  )
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { merge } from '@no-day/ts-prefix'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { Json } from '../Json'
import { Linter } from 'eslint'
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
    '.eslintrc': FileObj_['Json']
    '.eslintignore': FileObj_['Text']
  }
>

// -----------------------------------------------------------------------------
//
// -----------------------------------------------------------------------------

const eslintConfig: Linter.Config = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {},
}
// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

const dependencies: Effect<PackageJson['dependencies']> = pipe(
  {
    eslint: '^7.27.0',
    '@typescript-eslint/eslint-plugin': '^4.25.0',
    '@typescript-eslint/parser': '^4.25.0',
  },
  RTE.of
)

const scripts: Effect<PackageJson['scripts']> = pipe(
  {
    lint: 'yarn eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0',
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

const eslintIgnore: Effect<FileObj_['Text']> = pipe(
  ['node_modules', 'dist', 'coverage'],
  tag('Text'),
  RTE.of
)

const eslintRc: Effect<FileObj_['Json']> = pipe(
  eslintConfig as Json,
  tag('Json'),
  RTE.of
)

const main: Effect<OutFiles> = RTE.scope(() =>
  pipe(
    {
      'package.json': packageJson,
      '.eslintrc': eslintRc,
      '.eslintignore': eslintIgnore,
    },
    sequenceS(RTE.ApplySeq)
  )
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

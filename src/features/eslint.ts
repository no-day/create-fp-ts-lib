import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import * as PJ from '../PackageJson'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { Json } from '../Json'
import { Linter } from 'eslint'

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
    '.eslintrc': FileObjects['Json']
    '.eslintignore': FileObjects['Text']
  }
>

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const eslintConfig: Linter.Config = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  env: { node: true },
  rules: {},
}

const mkPackageJson = (config: Config) => ({
  devDependencies: {
    eslint: '^7.27.0',
    '@typescript-eslint/eslint-plugin': '^4.25.0',
    '@typescript-eslint/parser': '^4.25.0',
  },
  scripts: {
    lint: `${config.packageManager} run eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0`,
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

const eslintIgnore: Effect<FileObjects['Text']> = pipe(
  ['node_modules', 'dist', 'coverage'],
  tag('Text'),
  RTE.of
)

const eslintRc: Effect<FileObjects['Json']> = pipe(
  eslintConfig as Json,
  tag('Json'),
  RTE.of
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    '.eslintrc': eslintRc,
    '.eslintignore': eslintIgnore,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

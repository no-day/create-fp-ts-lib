import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { Json } from '../Json'
import * as PJ from '../PackageJson'

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
    '.cspell.json': FileObjects['Json']
  }
>

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const mkPackageJson = {
  devDependencies: {
    cspell: '^5.5.2',
  },
  scripts: {
    spell: "yarn cspell '**/*.*'",
  },
}

const mkCspellJson = (config: Config): Json => ({
  version: '0.1',
  language: 'en',
  ignorePaths: [
    '**/node_modules/**',
    '**/.cache/**',
    '**/dist/**',
    '**/.git/**',
    '**/.cache/**',
    '**/*.tsbuildinfo',
    'tmp/',
    ...(config.packageManager === 'yarn'
      ? ['yarn.lock', '**/yarn-error.log']
      : ['package-lock.json']),
    ...(config.docsTs ? ['**/docs/examples/', '**/docs/modules/*.ts.md'] : []),
    ...(config.vscode ? ['.vscode'] : []),
  ],
  words: [],
})

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const packageJson: Effect<FileObjects['PackageJson']> = RTE.scope(
  ({
    files: {
      'package.json': { data },
    },
  }) => pipe(mkPackageJson, PJ.merge(data), tag('PackageJson'), RTE.of)
)

const cspellJson: Effect<FileObjects['Json']> = RTE.scope(({ config }) =>
  pipe(mkCspellJson(config), tag('Json'), RTE.of)
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    '.cspell.json': cspellJson,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

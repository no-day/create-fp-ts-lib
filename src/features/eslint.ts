import * as RTE from '../ReaderTaskEither'
import { flow, pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { modify } from '@no-day/ts-prefix'
import * as R from 'fp-ts/Record'
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
  rules: {
    'id-length': ['error', { min: 1, max: 20 }],
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

const packageJson: Effect<FileObj_['PackageJson']> = RTE.scope(({ files }) =>
  pipe(
    files['package.json'],
    modify('data', (data) =>
      pipe(
        data,
        modify(
          'dependencies',
          flow(
            R.upsertAt('eslint', '^7.27.0'),
            R.upsertAt('@typescript-eslint/eslint-plugin', '^4.25.0'),
            R.upsertAt('@typescript-eslint/parser', '^4.25.0')
          )
        ),
        modify(
          'scripts',
          R.upsertAt(
            'lint',
            'yarn eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0'
          )
        )
      )
    ),
    RTE.of
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

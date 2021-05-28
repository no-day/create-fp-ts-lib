import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { modify } from '@no-day/ts-prefix'
import * as R from 'fp-ts/Record'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config'
import { sequenceS } from 'fp-ts/lib/Apply'

const packageJson: Effect<FileObj_['PackageJson']> = ({ files }) =>
  pipe(
    files['package.json'],
    modify('data', (data) =>
      pipe(data, modify('dependencies', R.upsertAt('prettier', '^2.2.1')))
    ),
    TE.of
  )

const prettierRc: Effect<FileObj_['Json']> = () =>
  pipe(
    {
      singleQuote: true,
      printWidth: 80,
      semi: false,
    },
    tag('Json'),
    TE.of
  )

type Env = {
  cap: Capabilities
  config: Config
  files: InFiles
}

type Effect<A> = (env: Env) => TE.TaskEither<string, A>

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
  }
>

const main: Effect<OutFiles> = (env) =>
  pipe(
    sequenceS(TE.ApplyPar)({
      'package.json': packageJson(env),
      '.prettierrc': prettierRc(env),
    })
  )

export default main

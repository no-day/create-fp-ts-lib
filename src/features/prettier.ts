import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Config } from '../Config'
import * as path from 'path'
import * as Mustache from 'mustache'
import { AppEffect, Capabilities } from '../AppEffect'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_, PackageJson } from '../FileObj'
import { call, merge, modify, ShallowMerge } from '@no-day/ts-prefix'
import { split } from 'fp-ts/lib/Choice'
import * as R from 'fp-ts/Record'

const rootDir = path.join(__dirname, '../../')
const assetsDir = path.join(rootDir, 'assets/skeleton')

type In = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObj_['PackageJson']
  }
>

type Out = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObj_['PackageJson']
    '.prettierrc': FileObj_['Json']
  }
>

export default (config: Config) => <I extends In & Record<string, FileObj>>(
  files: I
): AppEffect<ShallowMerge<I, Out>> =>
  pipe(
    {
      'package.json': pipe(
        files['package.json'],
        modify('data', (data) =>
          pipe(data, modify('dependencies', R.upsertAt('prettier', '^2.2.1')))
        )
      ),
      '.prettierrc': pipe(
        {
          singleQuote: true,
          printWidth: 80,
          semi: false,
        },
        tag('Json')
      ),
    },
    merge(files),
    RTE.of
  )

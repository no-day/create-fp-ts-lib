import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { AppEffect } from '../AppEffect'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { merge, modify, ShallowMerge } from '@no-day/ts-prefix'
import * as R from 'fp-ts/Record'

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

const packageJson = (files: In) =>
  pipe(
    files['package.json'],
    modify('data', (data) =>
      pipe(data, modify('dependencies', R.upsertAt('prettier', '^2.2.1')))
    )
  )

const prettierRc = pipe(
  {
    singleQuote: true,
    printWidth: 80,
    semi: false,
  },
  tag('Json')
)

export default <I extends In & Record<string, FileObj>>(
  files: I
): AppEffect<ShallowMerge<I, Out>> =>
  pipe(
    {
      'package.json': packageJson(files),
      '.prettierrc': prettierRc,
    },
    merge(files),
    RTE.of
  )

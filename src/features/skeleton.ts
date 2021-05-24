import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Config } from '../Config'
import * as path from 'path'
import * as Mustache from 'mustache'
import { AppEffect, Capabilities } from '../AppEffect'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { call, merge, ShallowMerge } from '@no-day/ts-prefix'
import { split } from 'fp-ts/lib/Choice'

const rootDir = path.join(__dirname, '../../')
const assetsDir = path.join(rootDir, 'assets/skeleton')

type In = Extends<Record<string, FileObj>, {}>

type Out = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObj_['PackageJson']
    //  '.gitignore': FileObj_['Text']
    'src/index.ts': FileObj_['Text']
    //   'tsconfig.json': FileObj_['Text']
    //   'tsconfig.settings.json': FileObj_['Text']
    //   'tsconfig.build.json': FileObj_['Text']
  }
>

export default (config: Config) => <I extends In & Record<string, FileObj>>(
  files: I
): AppEffect<ShallowMerge<I, Out>> =>
  pipe(
    RTE.ask<Capabilities>(),
    RTE.chain((cap) =>
      sequenceS(RTE.ApplyPar)({
        'package.json': pipe(
          {
            name: config.name,
            homepage: config.homepage,
            version: config.version,
            main: 'dist/index.js',
            license: config.license,
            peerDependencies: {
              'fp-ts': '^2.9.5',
            },
            dependencies: {},
            devDependencies: {
              typescript: '^4.2.3',
              'fp-ts': '^2.9.5',
            },
            scripts: {
              build: 'tsc -p tsconfig.build.json',
              'build:watch': 'tsc ',
              prepublish: 'yarn build',
            },
          },
          tag('PackageJson'),
          RTE.of
        ),
        // '.gitignore': pipe(
        //   ['node_modules/', 'dist/', 'yarn-error.log'],
        //   tag('Text'),
        //   RTE.of
        // ),
        'src/index.ts': pipe(
          path.join(assetsDir, 'src/index.ts'),
          cap.readFile,
          RTE.map((x) => Mustache.render(x, config)),
          RTE.map(splitLines),
          RTE.map(tag('Text'))
        ),
        // 'tsconfig.json': pipe(
        //   path.join(assetsDir, 'tsconfig.json'),
        //   cap.readFile,
        //   RTE.map(splitLines),
        //   RTE.map(tag('Text'))
        // ),
        // 'tsconfig.settings.json': pipe(
        //   path.join(assetsDir, 'tsconfig.settings.json'),
        //   cap.readFile,
        //   RTE.map(splitLines),
        //   RTE.map(tag('Text'))
        // ),
        // 'tsconfig.build.json': pipe(
        //   path.join(assetsDir, 'tsconfig.build.json'),
        //   cap.readFile,
        //   RTE.map(splitLines),
        //   RTE.map(tag('Text'))
        // ),
      })
    ),
    RTE.map(merge(files))
  )

const splitLines = call('split', '\n')

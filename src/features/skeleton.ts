import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Config } from '../Config'
import { FileSystem } from '../FileSystem'
import * as path from 'path'
import * as Mustache from 'mustache'
import { AppEffect, Capabilities } from '../AppEffect'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, PackageJson, Text } from '../FileObj'

const rootDir = path.join(__dirname, '../../')
const assetsDir = path.join(rootDir, 'assets/skeleton')

type Out = Extends<
  Record<string, FileObj>,
  {
    'src/index.ts': Text
    'package.json': PackageJson
    'tsconfig.json': Text
    'tsconfig.settings.json': Text
    'tsconfig.build.json': Text
  }
>

export default (config: Config) => <I>(files: I): AppEffect<Out & I> =>
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
            peerDependencies: {},
            dependencies: {},
            devDependencies: {
              typescript: '^4.2.3',
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
        'src/index.ts': pipe(
          path.join(assetsDir, 'src/index.ts'),
          cap.readFile,
          RTE.map((x) => Mustache.render(x, config)),
          RTE.map(tag('Text'))
        ),
        'tsconfig.json': pipe(
          path.join(assetsDir, 'tsconfig.json'),
          cap.readFile,
          RTE.map(tag('Text'))
        ),
        'tsconfig.settings.json': pipe(
          path.join(assetsDir, 'tsconfig.settings.json'),
          cap.readFile,
          RTE.map(tag('Text'))
        ),
        'tsconfig.build.json': pipe(
          path.join(assetsDir, 'tsconfig.build.json'),
          cap.readFile,
          RTE.map(tag('Text'))
        ),
      })
    ),
    RTE.map((x) => ({ ...files, ...x }))
  )

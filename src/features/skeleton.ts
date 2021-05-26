import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as path from 'path'
import * as Mustache from 'mustache'
import { AppEffect, AppEnv } from '../AppEffect'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_, PackageJson } from '../FileObj'
import { call, merge, ShallowMerge } from '@no-day/ts-prefix'

const rootDir = path.join(__dirname, '../../')
const assetsDir = path.join(rootDir, 'assets/skeleton')

const devDependencies: PackageJson['devDependencies'] = {
  typescript: '^4.2.3',
  'fp-ts': '^2.9.5',
}

const scripts: PackageJson['scripts'] = {
  build: 'tsc -p tsconfig.build.json',
  'build:watch': 'tsc ',
  prepublish: 'yarn build',
}

const peerDependencies = {
  'fp-ts': '^2.9.5',
}

const packageJson: AppEffect<FileObj_['PackageJson']> = pipe(
  RTE.ask<AppEnv>(),
  RTE.map(({ config }) =>
    pipe(
      {
        name: config.name,
        homepage: config.homepage,
        version: config.version,
        main: 'dist/index.js',
        license: config.license,
        peerDependencies,
        dependencies: {},
        devDependencies: devDependencies,
        scripts,
      },
      tag('PackageJson')
    )
  )
)

const gitIgnore: AppEffect<FileObj_['Text']> = pipe(
  ['node_modules/', 'dist/', 'yarn-error.log'],
  tag('Text'),
  RTE.of
)

const indexTs: AppEffect<FileObj_['Text']> = pipe(
  RTE.ask<AppEnv>(),
  RTE.chain(({ cap, config }) =>
    pipe(
      path.join(assetsDir, 'src/index.ts'),
      cap.readFile,
      RTE.map((x) => Mustache.render(x, config)),
      RTE.map(splitLines),
      RTE.map(tag('Text'))
    )
  )
)

const tsConfig: AppEffect<FileObj_['Text']> = pipe(
  RTE.ask<AppEnv>(),
  RTE.chain(({ cap }) =>
    pipe(
      path.join(assetsDir, 'tsconfig.json'),
      cap.readFile,
      RTE.map(splitLines),
      RTE.map(tag('Text'))
    )
  )
)

const tsConfigBuild: AppEffect<FileObj_['Text']> = pipe(
  RTE.ask<AppEnv>(),
  RTE.chain(({ cap }) =>
    pipe(
      path.join(assetsDir, 'tsconfig.build.json'),
      cap.readFile,
      RTE.map(splitLines),
      RTE.map(tag('Text'))
    )
  )
)

type In = Record<string, FileObj>

type Out = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObj_['PackageJson']
    '.gitignore': FileObj_['Text']
    'src/index.ts': FileObj_['Text']
    'tsconfig.json': FileObj_['Text']
    'tsconfig.settings.json': FileObj_['Text']
    'tsconfig.build.json': FileObj_['Text']
  }
>

export default <I extends In & Record<string, FileObj>>(
  files: I
): AppEffect<ShallowMerge<I, Out>> =>
  pipe(
    sequenceS(RTE.ApplyPar)({
      'package.json': packageJson,
      '.gitignore': gitIgnore,
      'src/index.ts': indexTs,
      'tsconfig.json': tsConfig,
      'tsconfig.settings.json': tsConfig,
      'tsconfig.build.json': tsConfigBuild,
    }),
    RTE.map(merge(files))
  )

const splitLines = call('split', '\n')

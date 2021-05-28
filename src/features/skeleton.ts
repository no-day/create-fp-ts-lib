import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as path from 'path'
import * as Mustache from 'mustache'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_, PackageJson } from '../FileObj'
import { call, merge, ShallowMerge } from '@no-day/ts-prefix'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config'

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

const packageJson: Effect<FileObj_['PackageJson']> = ({ config }) =>
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
    tag('PackageJson'),
    TE.of
  )

const gitIgnore: Effect<FileObj_['Text']> = () =>
  pipe(['node_modules/', 'dist/', 'yarn-error.log'], tag('Text'), TE.of)

const indexTs: Effect<FileObj_['Text']> = ({ cap, config }) =>
  pipe(
    path.join(assetsDir, 'src/index.ts'),
    cap.readFile,
    TE.map((x) => Mustache.render(x, config)),
    TE.map(splitLines),
    TE.map(tag('Text'))
  )

const tsConfig: Effect<FileObj_['Text']> = ({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.json'),
    cap.readFile,
    TE.map(splitLines),
    TE.map(tag('Text'))
  )

const tsConfigBuild: Effect<FileObj_['Text']> = ({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.build.json'),
    cap.readFile,
    TE.map(splitLines),
    TE.map(tag('Text'))
  )

type InFiles = Record<string, FileObj>

type OutFiles = Extends<
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

type Env = {
  cap: Capabilities
  config: Config
  files: InFiles
}

type Effect<A> = (env: Env) => TE.TaskEither<string, A>

const main: Effect<OutFiles> = (env) =>
  pipe(
    sequenceS(TE.ApplyPar)({
      'package.json': packageJson(env),
      '.gitignore': gitIgnore(env),
      'src/index.ts': indexTs(env),
      'tsconfig.json': tsConfig(env),
      'tsconfig.settings.json': tsConfig(env),
      'tsconfig.build.json': tsConfigBuild(env),
    })
  )

export default main

const splitLines = call('split', '\n')

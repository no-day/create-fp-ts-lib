import * as RTE from '../ReaderTaskEither'
import * as TE from 'fp-ts/lib/TaskEither'
import * as path from 'path'
import * as Mustache from 'mustache'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObj_ } from '../FileObj'
import { call } from '@no-day/ts-prefix'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config'
import { scope } from '../ReaderTaskEither'
import { PackageJson } from '../PackageJson'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

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

type Effect<A> = (env: Env) => Effect_<A>

type Effect_<A> = TE.TaskEither<string, A>

const rootDir = path.join(__dirname, '../../')

const assetsDir = path.join(rootDir, 'assets/skeleton')

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

const splitLines = call('split', '\n')

// -----------------------------------------------------------------------------
// Effect
// -----------------------------------------------------------------------------

const devDependencies: Effect<PackageJson['devDependencies']> = RTE.scope(() =>
  RTE.of({
    typescript: '^4.2.3',
    'fp-ts': '^2.9.5',
  })
)

const scripts: Effect<PackageJson['scripts']> = RTE.scope(() =>
  RTE.of({
    build: 'tsc -p tsconfig.build.json',
    'build:watch': 'tsc -w -p tsconfig.build.json',
    prepublish: 'yarn build',
  })
)

const peerDependencies: Effect<PackageJson['peerDependencies']> = RTE.scope(
  () =>
    RTE.of({
      'fp-ts': '^2.9.5',
    })
)

const packageJson: Effect<FileObj_['PackageJson']> = RTE.scope(({ config }) =>
  pipe(
    {
      name: RTE.of(config.name),
      homepage: RTE.of(config.homepage),
      version: RTE.of(config.projectVersion),
      main: RTE.of('dist/index.js'),
      license: RTE.of(config.license),
      peerDependencies: peerDependencies,
      dependencies: RTE.of({}),
      devDependencies: devDependencies,
      scripts: scripts,
    },
    sequenceS(RTE.ApplyPar),
    RTE.map(tag('PackageJson'))
  )
)

const gitIgnore: Effect<FileObj_['Text']> = RTE.scope(() =>
  pipe(['node_modules/', 'dist/', 'yarn-error.log'], tag('Text'), RTE.of)
)

const indexTs: Effect<FileObj_['Text']> = RTE.scope(({ config, cap }) =>
  pipe(
    path.join(assetsDir, 'src/index.ts'),
    cap.readFile,
    RTE.map((x) => Mustache.render(x, config)),
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const tsConfig: Effect<FileObj_['Text']> = scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.json'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const tsConfigBuild: Effect<FileObj_['Text']> = scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.build.json'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const tsConfigSettings: Effect<FileObj_['Text']> = scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.settings.json'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const main: Effect<OutFiles> = RTE.scope(() =>
  pipe(
    {
      'package.json': packageJson,
      '.gitignore': gitIgnore,
      'src/index.ts': indexTs,
      'tsconfig.json': tsConfig,
      'tsconfig.settings.json': tsConfigSettings,
      'tsconfig.build.json': tsConfigBuild,
    },
    sequenceS(RTE.ApplyPar)
  )
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

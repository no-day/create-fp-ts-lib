import * as RTE from '../ReaderTaskEither'
import * as path from 'path'
import * as Mustache from 'mustache'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { PackageJson } from '../PackageJson'
import { assetsDirRoot } from '../assets-dir'
import { splitLines } from '../split-lines'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type InFiles = Record<string, FileObj>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
    '.gitignore': FileObjects['Text']
    'src/index.ts': FileObjects['Text']
    'tsconfig.json': FileObjects['Text']
    'tsconfig.settings.json': FileObjects['Text']
    'tsconfig.build.json': FileObjects['Text']
    'README.md': FileObjects['Text']
  }
>

type Env = {
  cap: Capabilities
  config: Config
  files: InFiles
}

type Error = string

type Effect<A> = ReaderTaskEither<Env, Error, A>

// -----------------------------------------------------------------------------
// constant
// -----------------------------------------------------------------------------

const assetsDir = path.join(assetsDirRoot, 'skeleton')

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const devDependencies: Effect<PackageJson['devDependencies']> = RTE.of({
  typescript: '^4.2.3',
  'fp-ts': '^2.9.5',
})

const scripts: Effect<PackageJson['scripts']> = RTE.scope(
  ({ config: { packageManager } }) =>
    RTE.of({
      build: 'tsc -p tsconfig.build.json',
      'build:watch': 'tsc -w -p tsconfig.build.json',
      prepublish: `${packageManager} run build`,
    })
)

const peerDependencies: Effect<PackageJson['peerDependencies']> = RTE.of({
  'fp-ts': '^2.9.5',
})

const packageJson: Effect<FileObjects['PackageJson']> = RTE.scope(
  ({ config }) =>
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

const gitIgnore: Effect<FileObjects['Text']> = pipe(
  ['node_modules/', 'dist/', 'yarn-error.log'],
  tag('Text'),
  RTE.of
)

const indexTs: Effect<FileObjects['Text']> = RTE.scope(({ config, cap }) =>
  pipe(
    path.join(assetsDir, 'src/index.ts'),
    cap.readFile,
    RTE.map((x) => Mustache.render(x, config)),
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const tsConfig: Effect<FileObjects['Text']> = RTE.scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.json'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const tsConfigBuild: Effect<FileObjects['Text']> = RTE.scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.build.json'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const tsConfigSettings: Effect<FileObjects['Text']> = RTE.scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tsconfig.settings.json'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const readme: Effect<FileObjects['Text']> = RTE.scope(({ cap, config }) =>
  pipe(
    path.join(assetsDir, 'README.md'),
    cap.readFile,
    RTE.map((x) => Mustache.render(x, config)),
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    '.gitignore': gitIgnore,
    'src/index.ts': indexTs,
    'tsconfig.json': tsConfig,
    'tsconfig.settings.json': tsConfigSettings,
    'tsconfig.build.json': tsConfigBuild,
    'README.md': readme,
  },
  sequenceS(RTE.ApplyPar)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

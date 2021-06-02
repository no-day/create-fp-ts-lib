import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import * as PJ from '../PackageJson'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as path from 'path'
import { assetsDirRoot } from '../assets-dir'
import { splitLines } from '../split-lines'

// -----------------------------------------------------------------------------
// types
// -----------------------------------------------------------------------------

type Env = {
  cap: Capabilities
  config: Config
  files: InFiles
}

type Error = string

type Effect<A> = ReaderTaskEither<Env, Error, A>

type InFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
  }
>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
    'jest.config.js': FileObjects['Text']
    'tests/index.ts': FileObjects['Text']
  }
>

// -----------------------------------------------------------------------------
// constant
// -----------------------------------------------------------------------------

const assetsDir = path.join(assetsDirRoot, 'jest')

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const mkPackageJson = (config: Config) => ({
  devDependencies: {
    '@types/jest': '^26.0.20',
    jest: '^26.6.3',
    'ts-jest': '^26.5.3',
  },
  scripts: {
    test: `${config.packageManager} run jest`,
    'test:watch': `${config.packageManager} run jest --watch`,
  },
})

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const packageJson: Effect<FileObjects['PackageJson']> = RTE.scope(
  ({
    files: {
      'package.json': { data },
    },
    config,
  }) => pipe(mkPackageJson(config), PJ.merge(data), tag('PackageJson'), RTE.of)
)

const jestConfigJs: Effect<FileObjects['Text']> = RTE.scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'jest.config.js'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const indexTs: Effect<FileObjects['Text']> = RTE.scope(({ cap }) =>
  pipe(
    path.join(assetsDir, 'tests/index.ts'),
    cap.readFile,
    RTE.map(splitLines),
    RTE.map(tag('Text'))
  )
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    'jest.config.js': jestConfigJs,
    'tests/index.ts': indexTs,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

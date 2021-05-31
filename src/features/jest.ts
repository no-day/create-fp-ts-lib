import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import { merge } from '@no-day/ts-prefix'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { Json } from '../Json'
import { Linter } from 'eslint'
import { PackageJson } from '../PackageJson'
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
    'jest.config.js': FileObjects['Text']
    'tests/index.ts': FileObjects['Text']
  }
>

// -----------------------------------------------------------------------------
// constant
// -----------------------------------------------------------------------------

const assetsDir = path.join(assetsDirRoot, 'jest')

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const devDependencies: Effect<PackageJson['dependencies']> = RTE.of({
  '@types/jest': '^26.0.20',
  jest: '^26.6.3',
  'ts-jest': '^26.5.3',
})

const scripts: Effect<PackageJson['scripts']> = RTE.scope(
  ({ config: { packageManager } }) =>
    RTE.of({
      test: `${packageManager} run jest`,
      'test:watch': `${packageManager} run jest --watch`,
    })
)

const packageJson: Effect<FileObjects['PackageJson']> = RTE.scope(
  ({
    files: {
      'package.json': { data },
    },
  }) =>
    pipe(
      {
        devDependencies: pipe(
          devDependencies,
          RTE.map(merge(data.devDependencies))
        ),
        scripts: pipe(scripts, RTE.map(merge(data.scripts))),
      },
      sequenceS(RTE.ApplySeq),
      RTE.map(merge(data)),
      RTE.map(tag('PackageJson'))
    )
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

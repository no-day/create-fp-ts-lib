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
    'tests/index.ts'?: FileObjects['Text']
  }
>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
    'tests/index.ts'?: FileObjects['Text']
  }
>

// -----------------------------------------------------------------------------
// constant
// -----------------------------------------------------------------------------

const assetsDir = path.join(assetsDirRoot, 'fast-check')

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const mkPackageJson = {
  devDependencies: {
    'fast-check': '^2.13.0',
  },
}

// -----------------------------------------------------------------------------
// effect
// -----------------------------------------------------------------------------

const packageJson: Effect<FileObjects['PackageJson']> = RTE.scope(
  ({
    files: {
      'package.json': { data },
    },
  }) => pipe(mkPackageJson, PJ.merge(data), tag('PackageJson'), RTE.of)
)

const indexTs: Effect<
  undefined | FileObjects['Text']
> = RTE.scope(({ cap, config }) =>
  config.jest
    ? pipe(
        path.join(assetsDir, 'tests/index.ts'),
        cap.readFile,
        RTE.map(splitLines),
        RTE.map(tag('Text'))
      )
    : RTE.of(undefined)
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    'tests/index.ts': indexTs,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

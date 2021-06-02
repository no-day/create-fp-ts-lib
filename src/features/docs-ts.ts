import * as RTE from '../ReaderTaskEither'
import { pipe } from 'fp-ts/lib/function'
import { Extends, tag } from '../type-utils'
import { FileObj, FileObjects } from '../FileObj'
import { Capabilities } from '../Capabilities'
import { Config } from '../Config/type'
import { sequenceS } from 'fp-ts/lib/Apply'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as PJ from '../PackageJson'

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
    '.gitignore': FileObjects['Text']
  }
>

type OutFiles = Extends<
  Record<string, FileObj>,
  {
    'package.json': FileObjects['PackageJson']
    '.gitignore': FileObjects['Text']
  }
>

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------

const mkPackageJson = (config: Config) => ({
  devDependencies: {
    'docs-ts': '^0.6.10',
  },
  scripts: {
    docs: `${config.packageManager} run docs-ts`,
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

const gitignore: Effect<FileObjects['Text']> = RTE.scope(
  ({
    files: {
      '.gitignore': { data },
    },
  }) =>
    pipe(
      [...data, 'docs/modules/*.ts.md', 'docs/_site'],
      RTE.of,
      RTE.map(tag('Text'))
    )
)

const main: Effect<OutFiles> = pipe(
  {
    'package.json': packageJson,
    '.gitignore': gitignore,
  },
  sequenceS(RTE.ApplySeq)
)

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export default main

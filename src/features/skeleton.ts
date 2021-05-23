import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { Config } from '../Config'
import { FileSystem } from '../FileSystem'
import * as path from 'path'

import { AppEffect, Capabilities } from '../AppEffect'
import { sequenceS } from 'fp-ts/lib/Apply'
import { pipe } from 'fp-ts/lib/function'

const rootDir = path.join(__dirname, '../../')
const assetsDir = path.join(rootDir, 'assets/skeleton')

export default (config: Config) => (files: FileSystem): AppEffect<FileSystem> =>
  pipe(
    RTE.ask<{ cap: Capabilities }>(),
    RTE.chain(({ cap }) =>
      sequenceS(RTE.ApplyPar)({
        'package.json': pipe(
          path.join(assetsDir, 'package.json'),
          cap.readFile
        ),
        'src/index.ts': pipe(
          path.join(assetsDir, 'src/index.ts'),
          cap.readFile
        ),
        'tsconfig.json': pipe(
          path.join(assetsDir, 'tsconfig.json'),
          cap.readFile
        ),
        'tsconfig.settings.json': pipe(
          path.join(assetsDir, 'tsconfig.settings.json'),
          cap.readFile
        ),
        'tsconfig.build.json': pipe(
          path.join(assetsDir, 'tsconfig.build.json'),
          cap.readFile
        ),
      })
    )
  )

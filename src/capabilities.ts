import { flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { Capabilities } from './AppEffect'
import * as fs from 'fs'

const writeFile: (
  filename: string,
  data: string
) => TE.TaskEither<NodeJS.ErrnoException, void> = TE.taskify(fs.writeFile)

const readFile: (
  filename: string
) => TE.TaskEither<NodeJS.ErrnoException, Buffer> = TE.taskify(fs.readFile)

const mkdir: (
  filename: string,
  opts: { recursive: boolean }
) => TE.TaskEither<NodeJS.ErrnoException, void> = TE.taskify(fs.mkdir)

export const capabilities: Capabilities = {
  mkDir: flow(
    mkdir,
    RTE.fromTaskEither,
    RTE.mapLeft(() => 'MKDIR ERROR')
  ),

  writeFile: flow(
    writeFile,
    RTE.fromTaskEither,
    RTE.mapLeft(() => 'WRITE FILE ERROR')
  ),

  readFile: flow(
    readFile,
    RTE.fromTaskEither,
    RTE.mapLeft(() => 'READ FILE ERROR'),
    RTE.map((_) => _.toString())
  ),
}

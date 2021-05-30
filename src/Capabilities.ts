import { TaskEither } from 'fp-ts/lib/TaskEither'
import { flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as fs from 'fs'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

export type Capabilities = {
  mkDir: (
    path: string,
    opts: { recursive: boolean }
  ) => ReaderTaskEither<Record<string, unknown>, string, void>
  writeFile: (
    path: string,
    content: string
  ) => ReaderTaskEither<Record<string, unknown>, string, void>
  readFile: (
    path: string
  ) => ReaderTaskEither<Record<string, unknown>, string, string>
}

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

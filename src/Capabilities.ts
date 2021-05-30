import { TaskEither } from 'fp-ts/lib/TaskEither'
import { flow } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import * as fs from 'fs'

export type Capabilities = {
  mkDir: (
    path: string,
    opts: { recursive: boolean }
  ) => TaskEither<string, void>
  writeFile: (path: string, content: string) => TaskEither<string, void>
  readFile: (path: string) => TaskEither<string, string>
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
    TE.mapLeft(() => 'MKDIR ERROR')
  ),

  writeFile: flow(
    writeFile,
    TE.mapLeft(() => 'WRITE FILE ERROR')
  ),

  readFile: flow(
    readFile,
    TE.mapLeft(() => 'READ FILE ERROR'),
    TE.map((_) => _.toString())
  ),
}

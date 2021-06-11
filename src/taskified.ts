import * as TE from 'fp-ts/TaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import * as fs from 'fs'
import { simpleSpawn as simpleSpawn_, SimpleSpawnResult } from './simple-spawn'
import * as SIS from './simple-spawn'

export const writeFile: (
  filename: string,
  data: string
) => TaskEither<NodeJS.ErrnoException, void> = TE.taskify(fs.writeFile)

export const readFile: (
  filename: string
) => TaskEither<NodeJS.ErrnoException, Buffer> = TE.taskify(fs.readFile)

export const mkdir: (
  filename: string,
  opts: { recursive: boolean }
) => TaskEither<NodeJS.ErrnoException, void> = TE.taskify(fs.mkdir)

export const simpleSpawn: (
  command: string,
  args: string[],
  options: SIS.Options
) => TaskEither<NodeJS.ErrnoException, SimpleSpawnResult> = TE.taskify(
  simpleSpawn_
)

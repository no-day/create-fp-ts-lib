import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { Option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import { UserQuest } from './UserQuest/type'
import { pipe } from 'fp-ts/lib/function'
import { Task } from 'fp-ts/lib/Task'
import * as T from 'fp-ts/lib/Task'
import * as R from 'fp-ts/lib/Record'

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

type MapOption<T> = { [key in keyof T]: Option<T[key]> }

type MapOrUndefined<T> = { [key in keyof T]: T[key] | undefined }

const eliminatePromise = <T>(args: T) => {
  type EliminatePromise<H> = H extends Promise<any> ? never : H
  console.log(args)
  return Promise.resolve(args as EliminatePromise<typeof args>)
}

const mapOption = <R extends Record<string, unknown>>(
  r: { [key in keyof R]: R[key] | undefined }
): { [key in keyof R]: Option<R[key]> } =>
  pipe(r as Record<string, unknown>, R.map(O.fromNullable)) as {
    [key in keyof R]: Option<R[key]>
  }

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------

export type CliOpts = MapOption<UserQuest>

type YArgsOpts = MapOrUndefined<UserQuest>

const getYArgs: Task<YArgsOpts> = () =>
  eliminatePromise(
    yargs(hideBin(process.argv))
      .option('name', {
        alias: 'n',
        type: 'string',
        description: 'TODO',
      })
      .option('homepage', {
        alias: 'h',
        type: 'string',
        description: 'TODO',
      })
      .option('version', {
        alias: 'v',
        type: 'string',
        description: 'TODO',
      })
      .option('license', {
        alias: 'l',
        type: 'string',
        description: 'TODO',
      })
      .option('prettier', {
        type: 'boolean',
        description: 'TODO',
      })
      .option('eslint', {
        type: 'boolean',
        description: 'TODO',
      })
      .option('jest', {
        type: 'boolean',
        description: 'TODO',
      })
      .option('fastCheck', {
        type: 'boolean',
        description: 'TODO',
      })
      .option('docsTs', {
        type: 'boolean',
        description: 'TODO',
      })
      .option('ghActions', {
        type: 'boolean',
        description: 'TODO',
      })
      .option('vscode', {
        alias: 'h',
        type: 'boolean',
        description: 'TODO',
      })
      .option('markdownMagic', {
        alias: 'h',
        type: 'boolean',
        description: 'TODO',
      }).argv
  )

export const getCliOpts = pipe(getYArgs, T.map(mapOption))

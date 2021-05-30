import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { Option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import { UserQuest } from './UserQuest/type'
import { pipe } from 'fp-ts/lib/function'
import { Task } from 'fp-ts/lib/Task'
import * as T from 'fp-ts/lib/Task'
import * as R from 'fp-ts/lib/Record'
import { descriptions } from './descriptions'

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

type MapOrUndefined<T> = { [key in keyof T]?: T[key] }

const excludePromise = <T>(args: T) => {
  type EliminatePromise<H> = H extends Promise<any> ? never : H
  return Promise.resolve(args as EliminatePromise<typeof args>)
}

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------

export type CliOpts = MapOrUndefined<UserQuest>

type YArgsOpts = MapOrUndefined<UserQuest>

const getYArgs: Task<YArgsOpts> = () =>
  excludePromise(
    yargs(hideBin(process.argv))
      .option('name', {
        alias: 'n',
        type: 'string',
        description: descriptions.name,
      })
      .option('homepage', {
        alias: 'h',
        type: 'string',
        description: descriptions.homepage,
      })
      .option('projectVersion', {
        alias: 'v',
        type: 'string',
        description: descriptions.projectVersion,
      })
      .option('license', {
        type: 'string',
        description: descriptions.license,
      })
      .option('prettier', {
        type: 'boolean',
        description: descriptions.prettier,
      })
      .option('eslint', {
        type: 'boolean',
        description: descriptions.eslint,
      })
      .option('jest', {
        type: 'boolean',
        description: descriptions.jest,
      })
      .option('fastCheck', {
        type: 'boolean',
        description: descriptions.fastCheck,
      })
      .option('docsTs', {
        type: 'boolean',
        description: descriptions.docsTs,
      })
      .option('ghActions', {
        type: 'boolean',
        description: descriptions.ghActions,
      })
      .option('vscode', {
        type: 'boolean',
        description: descriptions.vscode,
      })
      .option('markdownMagic', {
        type: 'boolean',
        description: descriptions.markdownMagic,
      }).argv
  )

export const getCliOpts = pipe(getYArgs)

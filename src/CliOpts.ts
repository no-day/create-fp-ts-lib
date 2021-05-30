import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { Option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import { UserQuest } from './UserQuest/type'
import { pipe } from 'fp-ts/lib/function'
import { Task } from 'fp-ts/lib/Task'
import * as T from 'fp-ts/lib/Task'
import * as R from 'fp-ts/lib/Record'
import { descriptions } from './UserQuest/descriptions'
import { defaults } from './UserQuest/defaults'

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

export type CliOpts = YArgsOpts

type YArgsOpts = UserQuest & {
  noQuest: boolean
}

const groups = {
  meta: 'Project metadata:',
  features: 'Features:',
}

const getYArgs: Task<YArgsOpts> = () =>
  excludePromise(
    yargs(hideBin(process.argv))
      // Group: Options
      .option('noQuest', {
        alias: 'q',
        default: false,
        type: 'boolean',
        description: "Don't ask questions",
      })

      // Group: Meta
      .option('name', {
        alias: 'n',
        default: defaults.name,
        type: 'string',
        group: groups.meta,
        description: descriptions.name,
      })
      .option('homepage', {
        alias: 'h',
        default: defaults.homepage,
        type: 'string',
        group: groups.meta,
        description: descriptions.homepage,
      })
      .option('projectVersion', {
        alias: 'v',
        default: defaults.projectVersion,
        type: 'string',
        group: groups.meta,
        description: descriptions.projectVersion,
      })
      .option('license', {
        default: defaults.license,
        type: 'string',
        group: groups.meta,
        description: descriptions.license,
      })

      // Group: Features
      .option('prettier', {
        default: defaults.prettier,
        type: 'boolean',
        group: groups.features,
        description: descriptions.prettier,
      })
      .option('eslint', {
        default: defaults.eslint,
        type: 'boolean',
        group: groups.features,
        description: descriptions.eslint,
      })
      .option('jest', {
        default: defaults.jest,
        type: 'boolean',
        group: groups.features,
        description: descriptions.jest,
      })
      .option('fastCheck', {
        default: defaults.fastCheck,
        type: 'boolean',
        group: groups.features,
        description: descriptions.fastCheck,
      })
      .option('docsTs', {
        default: defaults.docsTs,
        type: 'boolean',
        group: groups.features,
        description: descriptions.docsTs,
      })
      .option('ghActions', {
        default: defaults.ghActions,
        type: 'boolean',
        group: groups.features,
        description: descriptions.ghActions,
      })
      .option('vscode', {
        default: defaults.vscode,
        type: 'boolean',
        group: groups.features,
        description: descriptions.vscode,
      })
      .option('markdownMagic', {
        default: defaults.markdownMagic,
        type: 'boolean',
        group: groups.features,
        description: descriptions.markdownMagic,
      }).argv
  )

export const getCliOpts = pipe(getYArgs)

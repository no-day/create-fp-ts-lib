import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { Task } from 'fp-ts/lib/Task'
import { Config } from './type'
import { defaults } from '../UserQuest/defaults'
import { descriptions } from '../UserQuest/descriptions'

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

const excludePromise = <T>(args: T) => {
  type EliminatePromise<H> = H extends Promise<any> ? never : H
  return Promise.resolve(args as EliminatePromise<typeof args>)
}

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------

const groups = {
  meta: 'Project metadata:',
  features: 'Features:',
}

const getCliOpts: Task<Config> = () =>
  excludePromise(
    yargs(hideBin(process.argv))
      // Group: Options
      .option('noQuest', {
        alias: 'q',
        default: false,
        boolean: true,
        description: "Don't ask questions",
      })
      .option('inPlace', {
        alias: 'u',
        default: false,
        boolean: true,
        description: 'Use current directory',
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
        boolean: true,
        group: groups.features,
        description: descriptions.prettier,
      })
      .option('eslint', {
        default: defaults.eslint,
        boolean: true,
        group: groups.features,
        description: descriptions.eslint,
      })
      .option('jest', {
        default: defaults.jest,
        boolean: true,
        group: groups.features,
        description: descriptions.jest,
      })
      .option('fastCheck', {
        default: defaults.fastCheck,
        boolean: true,
        group: groups.features,
        description: descriptions.fastCheck,
      })
      .option('docsTs', {
        default: defaults.docsTs,
        boolean: true,
        group: groups.features,
        description: descriptions.docsTs,
      })
      .option('ghActions', {
        default: defaults.ghActions,
        boolean: true,
        group: groups.features,
        description: descriptions.ghActions,
      })
      .option('vscode', {
        default: defaults.vscode,
        boolean: true,
        group: groups.features,
        description: descriptions.vscode,
      })
      .option('markdownMagic', {
        default: defaults.markdownMagic,
        boolean: true,
        group: groups.features,
        description: descriptions.markdownMagic,
      }).argv
  )

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { getCliOpts }

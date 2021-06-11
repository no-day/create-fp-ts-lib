import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { Task } from 'fp-ts/lib/Task'
import { Config, PackageManager } from './type'
import { defaults } from './defaults'
import { descriptions } from '../Config/descriptions'

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

const excludePromise = <T>(args: T) => {
  type EliminatePromise<H> = H extends Promise<any> ? never : H
  return Promise.resolve(args as EliminatePromise<typeof args>)
}

// -----------------------------------------------------------------------------
// constants
// -----------------------------------------------------------------------------

const packageManagers: ReadonlyArray<PackageManager> = ['npm', 'yarn']

const groups = {
  meta: 'Project metadata:',
  features: 'Features:',
  setup: 'Setup:',
}

// -----------------------------------------------------------------------------
// main
// -----------------------------------------------------------------------------

const getCliOpts: Task<Config> = () =>
  excludePromise(
    yargs(hideBin(process.argv))
      // Group: Options
      .option('noQuest', {
        alias: 'q',
        default: defaults.noQuest,
        boolean: true,
        description: descriptions.noQuest,
      })
      .option('inPlace', {
        alias: 'u',
        default: defaults.inPlace,
        boolean: true,
        description: descriptions.inPlace,
      })
      .option('packageManager', {
        default: defaults.packageManager,
        choices: packageManagers,
        description: descriptions.packageManager,
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
      .option('homepageAPI', {
        default: defaults.homepageAPI,
        type: 'string',
        group: groups.meta,
        description: descriptions.homepageAPI,
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
      })
      .option('cspell', {
        default: defaults.cspell,
        boolean: true,
        group: groups.features,
        description: descriptions.cspell,
      })
      .option('runInstall', {
        default: defaults.runInstall,
        boolean: true,
        group: groups.setup,
        description: descriptions.runInstall,
      }).argv
  )

// -----------------------------------------------------------------------------
// export
// -----------------------------------------------------------------------------

export { getCliOpts }

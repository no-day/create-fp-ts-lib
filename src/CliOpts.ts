import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import ReaderTaskEither = RTE.ReaderTaskEither
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { Option } from 'fp-ts/lib/Option'
import * as O from 'fp-ts/lib/Option'
import { UserQuest } from './UserQuest/type'

export type CliOpts = MapOption<UserQuest>

type MapOption<T> = { [key in keyof T]: Option<T> }

export const getCliOpts: ReaderTaskEither<
  unknown,
  string,
  CliOpts
> = RTE.fromTask(
  () =>
    new Promise((res) => {
      const args = yargs(hideBin(process.argv)).option('yes', {
        alias: 'y',
        type: 'boolean',
        default: false,
        description: 'Answer all questions with "yes"',
      }).argv

      res({
        name: O.none,
        homepage: O.none,
        version: O.none,
        license: O.none,
        prettier: O.none,
        eslint: O.none,
        jest: O.none,
        fastCheck: O.none,
        docsTs: O.none,
        ghActions: O.none,
        vscode: O.none,
        markdownMagic: O.none,
      })
    })
)

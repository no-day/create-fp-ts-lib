import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import ReaderTaskEither = RTE.ReaderTaskEither
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

export type CliOpts = { yes: boolean }

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

      res(args)
    })
)

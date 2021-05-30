import * as PromptsTypeMap from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/TaskEither'
import prompts_, { PromptObject } from 'prompts'
import { get } from '@no-day/ts-prefix'
import { pipe } from 'fp-ts/lib/function'

type PromptsTypeMap = {
  text: string
  toggle: boolean
  confirm: boolean
}

type GetMaybe<T, K> = K extends keyof T ? T[K] : unknown

export const prompts = <Opts extends Omit<PromptObject<'value'>, 'name'>>(
  opts: Opts
): TE.TaskEither<string, GetMaybe<PromptsTypeMap, Opts['type']>> =>
  pipe(
    () =>
      prompts_(
        { ...opts, name: 'value' },
        {
          onCancel: () => {
            process.exit(1)
          },
        }
      ),
    T.map(get('value')),
    (x) => TE.fromTask(x)
  )

import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/TaskEither'
import prompts_, { PromptObject } from 'prompts'
import { get } from '@no-day/ts-prefix'
import { pipe } from 'fp-ts/lib/function'

type Opts = Omit<PromptObject<'value'>, 'name'>

type GetType<opts extends Opts> = opts['type'] extends 'text'
  ? string
  : opts['type'] extends 'toggle' | 'confirm'
  ? boolean
  : opts['type'] extends 'select'
  ? GetSelectType<opts['choices']>
  : unknown

type GetSelectType<Xs> = Xs extends [infer head, ...infer tail]
  ? head extends { value: infer value }
    ? value | GetSelectType<tail>
    : '2'
  : never

type Tuple<T> =
  | [T]
  | [T, T]
  | [T, T, T]
  | [T, T, T, T]
  | [T, T, T, T, T]
  | [T, T, T, T, T, T]
  | [T, T, T, T, T, T, T]
  | [T, T, T, T, T, T, T, T]

export const prompts = <
  Opts extends Omit<PromptObject<'value'>, 'name'> & {
    choices?: Tuple<{ value: unknown }>
  }
>(
  opts: Opts
): TE.TaskEither<string, GetType<Opts>> =>
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

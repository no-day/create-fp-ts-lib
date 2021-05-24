import * as PromptsTypeMap from 'fp-ts/lib/Option'
import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/ReaderTaskEither'
import { AppEffect } from './AppEffect'
import prompts_, { PromptObject } from 'prompts'

import { pipe } from 'fp-ts/lib/function'

type PromptsTypeMap = {
  text: string
  toggle: boolean
  confirm: boolean
}

type GetMaybe<T, K> = K extends keyof T ? T[K] : unknown

export const prompts = <Opts extends Omit<PromptObject<'value'>, 'name'>>(
  opts: Opts
): AppEffect<GetMaybe<PromptsTypeMap, Opts['type']>> =>
  pipe(
    () => prompts_({ ...opts, name: 'value' }),
    T.map((x) => x.value),
    (x) => RTE.fromTask(x)
  )

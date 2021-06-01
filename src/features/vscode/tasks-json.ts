import { Config } from '../../Config/type'
import { Json } from '../../Json'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

const task = (config: Config) => (name: string) => ({
  label: `${name}:watch`,
  runOptions: { runOn: 'folderOpen' },
  type: 'shell',
  command: config.packageManager,
  isBackground: true,
  args: ['run', `${name}:watch`],
  group: name === 'build' ? 'build' : 'none',
  presentation: {
    reveal: 'always',
    echo: false,
    focus: false,
    panel: 'dedicated',
  },
})

const tasks = (config: Config, names: string[]): Json => ({
  version: '2.0.0',
  tasks: pipe(names, A.map(task(config))),
})

export default tasks

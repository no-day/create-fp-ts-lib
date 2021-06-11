import * as cp from 'child_process'

export type SimpleSpawnResult = {
  stdout: string
  stderr: string
  exitCode: number | null
}

export type Options = Omit<cp.SpawnOptions, 'stdio'>

export const simpleSpawn: (
  command: string,
  args: string[],
  options: Options,
  cb: (err: null | NodeJS.ErrnoException, r?: SimpleSpawnResult) => void
) => void = (command, args, options, cb) => {
  try {
    const proc = cp.spawn(command, args, options)
    let stdout = ''
    let stderr = ''

    proc.stdout?.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    proc.stderr?.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    proc.on('error', cb)

    proc.on('exit', (exitCode) => cb(null, { exitCode, stdout, stderr }))
  } catch (e) {
    cb(e)
  }
}

import * as cp from 'child_process'

export type SimpleSpawnResult = {
  stdout: string
  stderr: string
  exitCode: number | null
}

export const simpleSpawn: (
  command: string,
  args: string[],
  cb: (err: null | '', r?: SimpleSpawnResult) => void
) => void = (command, args, cb) => {
  try {
    const proc = cp.spawn(command, args)
    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    proc.on('exit', (exitCode) => cb(null, { exitCode, stdout, stderr }))
  } catch (e) {
    cb('')
  }
}

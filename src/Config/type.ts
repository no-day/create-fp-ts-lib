export type Config = {
  noQuest: boolean
  inPlace: boolean
  name: string
  packageManager: PackageManager
  homepage: string
  projectVersion: string
  license: string
  prettier: boolean
  eslint: boolean
  jest: boolean
  fastCheck: boolean
  docsTs: boolean
  ghActions: boolean
  vscode: boolean
  markdownMagic: boolean
}

export type PackageManager = 'yarn' | 'npm'

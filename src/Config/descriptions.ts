import { Config } from './type'

export const descriptions: { [key in keyof Config]: string } = {
  noQuest: "Don't ask questions",
  inPlace: 'Use current directory',
  name: 'Project name',
  homepage: 'Project homepage URL',
  projectVersion: 'Project version',
  license: 'Project license',
  prettier: 'Use prettier',
  eslint: 'Use eslint',
  jest: 'Use jest',
  fastCheck: 'Use fast-check',
  docsTs: 'Use docs-ts',
  ghActions: 'Use GitHub actions',
  vscode: 'Use vscode tasks',
  markdownMagic: 'Use markdown-magic',
}
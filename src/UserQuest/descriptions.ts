import { UserQuest } from './type'

export const descriptions: { [key in keyof UserQuest]: string } = {
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

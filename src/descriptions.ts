import { UserQuest } from './UserQuest/type'

export const descriptions: { [key in keyof UserQuest]: string } = {
  name: 'project name',
  homepage: 'project homepage URL',
  version: 'project version',
  license: 'project license',
  prettier: 'use prettier',
  eslint: 'use eslint',
  jest: 'use jest',
  fastCheck: 'use fast-check',
  docsTs: 'use docs-ts',
  ghActions: 'use GitHub actions',
  vscode: 'use vscode tasks',
  markdownMagic: 'use markdown-magic',
}

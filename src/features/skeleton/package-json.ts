import { Config } from '../../Config/type'
import { PackageJson } from '../../PackageJson'

export default (config: Config): PackageJson => ({
  name: config.name,
  homepage: config.homepage,
  version: config.projectVersion,
  main: 'dist/index.js',
  license: config.license,
  peerDependencies: {
    'fp-ts': '^2.9.5',
  },
  dependencies: {},
  devDependencies: {
    typescript: '^4.2.3',
    'fp-ts': '^2.9.5',
  },
  scripts: {
    build: 'tsc -p tsconfig.build.json',
    'build:watch': 'tsc -w -p tsconfig.build.json',
    prepublish: `${config.packageManager} run build`,
  },
})

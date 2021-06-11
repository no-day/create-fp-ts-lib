export * from './type'
import { Config } from './type'

const getProjectDirectory = (config: Config): string =>
  config.inPlace ? '.' : config.name

export { getProjectDirectory }

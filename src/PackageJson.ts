import { Json } from './Json'

export type PackageJson<Extra = Record<string, Json>> = Extra & {
  name: string
  homepage: string
  version: string
  main: string
  license: string
  peerDependencies: Record<string, string>
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  scripts: Record<string, string>
}

export const merge = <Extra>(p1: PackageJson<Extra>) => (
  p2: Partial<PackageJson<Extra>>
): PackageJson<Extra> => ({
  ...p1,
  ...p2,
  peerDependencies: { ...p1.peerDependencies, ...p2.peerDependencies },
  dependencies: { ...p1.dependencies, ...p2.dependencies },
  devDependencies: { ...p1.devDependencies, ...p2.devDependencies },
  scripts: { ...p1.scripts, ...p2.scripts },
})

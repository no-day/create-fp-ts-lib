export type PackageJson = {
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

export const merge = (p1: PackageJson) => (
  p2: Partial<PackageJson>
): PackageJson => ({
  ...p1,
  ...p2,
  peerDependencies: { ...p1.peerDependencies, ...p2.peerDependencies },
  dependencies: { ...p1.dependencies, ...p2.dependencies },
  devDependencies: { ...p1.devDependencies, ...p2.devDependencies },
  scripts: { ...p1.scripts, ...p2.scripts },
})

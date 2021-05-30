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

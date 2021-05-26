import { MapTagged, match, Union } from './type-utils'

export type Json =
  | string
  | number
  | boolean
  | Array<Json>
  | { [key: string]: Json }

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

export type Text = string[]

export type FileObj_ = MapTagged<{
  PackageJson: PackageJson
  Text: Text
  Json: Json
}>

export type FileObj = Union<FileObj_>

export const print = (x: FileObj): string =>
  match(x, {
    Text: (d) => d.data.join('\n'),
    Json: (d) => JSON.stringify(d.data, null, 2),
    PackageJson: (d) => JSON.stringify(d.data, null, 2),
  })

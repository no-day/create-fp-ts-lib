import { match, Tagged } from './type-utils'

export type Json = Tagged<
  'Json',
  string | number | boolean | Array<Json> | { [key: string]: Json }
>

export type PackageJson = Tagged<
  'PackageJson',
  {
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
>

export type Text = Tagged<'Text', string>

export type FileObj = PackageJson | Text | Json

export const print = (x: FileObj): string =>
  match(x, {
    Text: (d) => d.data,
    Json: (d) => JSON.stringify(d.data, null, 2),
    PackageJson: (d) => JSON.stringify(d.data, null, 2),
  })

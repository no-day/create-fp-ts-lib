import { MapTagged, match, Union } from './type-utils'
import * as J from './Json'
import { Json } from './Json'
import { PackageJson } from './PackageJson'
import { prettierConfig } from './prettier-config'
import { flow } from 'fp-ts/lib/function'
import * as P from 'prettier'
import * as Y from 'yaml'

// -----------------------------------------------------------------------------
// type
// -----------------------------------------------------------------------------

export type Text = string[]

export type FileObjects = MapTagged<{
  PackageJson: PackageJson
  Text: Text
  Json: Json
  Yaml: Json
}>

export type FileObj = Union<FileObjects>

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

const printJson: (val: Json) => string = flow(J.print, (str) =>
  P.format(str, { ...prettierConfig, parser: 'json' })
)

const printYaml: (val: Json) => string = flow(
  (val) => Y.stringify(val),
  (str) => P.format(str, { ...prettierConfig, parser: 'yaml' })
)

const printText: (text: Text) => string = (lines) => lines.join('\n')

// -----------------------------------------------------------------------------
// fns
// -----------------------------------------------------------------------------

export const print = (x: FileObj): string =>
  match(x, {
    Text: (d) => printText(d.data),
    Json: (d) => printJson(d.data),
    PackageJson: (d) => printJson(d.data),
    Yaml: (d) => printYaml(d.data),
  })

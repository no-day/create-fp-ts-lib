import { MapTagged, match, Union } from './type-utils'
import * as J from './Json'
import { Json } from './Json'
import { PackageJson } from './PackageJson'
import { prettierConfig } from './prettier-config'
import { flow } from 'fp-ts/lib/function'
import * as P from 'prettier'

// -----------------------------------------------------------------------------
// type
// -----------------------------------------------------------------------------

export type Text = string[]

export type FileObjects = MapTagged<{
  PackageJson: PackageJson
  Text: Text
  Json: J.Json
}>

export type FileObj = Union<FileObjects>

// -----------------------------------------------------------------------------
// util
// -----------------------------------------------------------------------------

const printJson: (text: Json) => string = flow(J.print, (str) =>
  P.format(str, { ...prettierConfig, parser: 'json' })
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
  })

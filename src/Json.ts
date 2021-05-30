export type Json =
  | null
  | string
  | number
  | boolean
  | Array<Json>
  | { [key: string]: Json }

export const print = (data: Json): string => JSON.stringify(data, null, 2)

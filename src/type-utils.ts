export type Tagged<T, D> = { tag: T; data: D }

export type MapTagged<T> = { [key in keyof T]: Tagged<key, T[key]> }

export type Union<T> = T[keyof T]

export type Extends<G, H extends G> = H

export const tag = <T extends string>(tag: T) => <D>(
  data: D
): { tag: T; data: D } => ({ tag, data })

export const match = <T extends { tag: string; data: any }, B>(
  x: T,
  r: { [key in T['tag']]: (x: Extract<T, { tag: key }>) => B }
): B => (r as any)[x.tag](x)

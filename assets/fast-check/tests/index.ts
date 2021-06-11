import * as myLib from '../src'
import * as fc from 'fast-check'

describe('greet', () => {
  it('greets anything', () => {
    fc.assert(
      fc.property(fc.string(), (name) => {
        expect(myLib.greet(name)).toBe(`Hello, ${name}!`)
      })
    )
  })
})

import * as myLib from '../src'

describe('greet', () => {
  it('greets the world', () => {
    expect(myLib.greet('World')).toBe(`Hello, World!`)
  })
})

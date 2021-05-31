import * as mylib from '../src'

describe('greet', () => {
  it('greets the world', () => {
    expect(mylib.greet('World')).toBe(`Hello, World!`)
  })
})

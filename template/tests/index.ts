import * as mylib from '../src';
import * as fc from 'fast-check';

describe('index', () => {
  it('greets anything', () => {
    fc.property(fc.string(), (name) => {
      expect(mylib.greet(name)).toBe(`Hello, ${name}!`);
    });
  });
});

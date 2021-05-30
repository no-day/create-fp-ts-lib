/** @since {{projectVersion}} */

import { pipe } from 'fp-ts/function'

// -----------------------------------------------------------------------------
// greetings
// -----------------------------------------------------------------------------

/**
 * It's a greeting
 *
 * @since {{projectVersion}}
 * @category Greetings
 * @example
 *   import { greet } from '{{NAME}}'
 *   assert.deepStrictEqual(greet('World'), 'Hello, World!')
 */
export const greet = (name: string): string =>
  pipe(`Hello`, (x) => `${x}, ${name}!`)

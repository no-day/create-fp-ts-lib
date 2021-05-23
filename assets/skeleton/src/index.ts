/** @since {{version}} */

// -----------------------------------------------------------------------------
// greetings
// -----------------------------------------------------------------------------

/**
 * It's a greeting
 *
 * @since {{version}}
 * @category Greetings
 * @example
 *   import { greet } from '{{NAME}}'
 *   assert.deepStrictEqual(greet('World'), 'Hello, World!')
 */
export const greet = (name: string) => `Hello, ${name}!`

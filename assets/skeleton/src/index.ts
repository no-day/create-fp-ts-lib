/** @since {{VERSION}} */

// -----------------------------------------------------------------------------
// greetings
// -----------------------------------------------------------------------------

/**
 * It's a greeting
 *
 * @since {{VERSION}}
 * @category Greetings
 * @example
 *   import { greet } from '{{NAME}}';
 *   assert.deepStrictEqual(greet('World'), 'Hello, World!');
 */
export const greet = (name: string) => `Hello, ${name}!`;

/** @since 1.0.0 */

// --------------------------------------------------------------------------------------------------------------------
// Greetings
// --------------------------------------------------------------------------------------------------------------------

/**
 * It's a greeting
 *
 * @since 1.0.0
 * @category Greetings
 * @example
 *   import { greet } from 'fp-ts-library-template';
 *   assert.deepStrictEqual(greet('World'), 'Hello, World!');
 */
export const greet = (name: string) => `Hello, ${name}!`;

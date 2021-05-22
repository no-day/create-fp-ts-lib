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
 *   import { greet } from 'create-fp-ts-lib';
 *   assert.deepStrictEqual(greet('World'), 'Hello, World!');
 */
export const greet = (name: string) => `Hello, ${name}!`;

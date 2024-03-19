/** a minimal implementation of `JSX.IntrinsicElements` to get syntax highlighting in your `.jsx` and `.tsx` files. <br>
 * to use this, and banish all the red error lines under your jsx blocks, simply import this file.
 * 
 * @example
 * ```tsx
 * import { } from "./path/to/hyperzone/jsx.ts"
 * 
 * const my_div = <div>
 * 	<span>Hello</span>
 * 	<span>World!!</span>
 * </div>
 * ```
 * 
 * @module
*/

export { IntrinsicElements } from "../src/tsignal/mod.ts"
export as namespace JSX

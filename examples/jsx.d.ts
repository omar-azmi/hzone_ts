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

import type { MaybeAccessor } from "../src/tsignal/mod.ts"
import type { AttrValue } from "../src/typedefs.ts"

type AttributeKey = string
interface Attributes {
	[key: AttributeKey]: MaybeAccessor<AttrValue>
}

type IntrinsicHTMLElements = { [tagName in keyof HTMLElementTagNameMap]: Attributes }
type IntrinsicSVGElements = { [tagName in keyof SVGElementTagNameMap]: Attributes }
export type IntrinsicElements = IntrinsicHTMLElements & IntrinsicSVGElements

export as namespace JSX

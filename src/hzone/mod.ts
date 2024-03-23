/** {@link HyperZone | `HyperZone`} is the main component of this library. <br>
 * it lets you define a bunch of {@link HyperRender | hyper renderers} to be used for `Element` creation. <br>
 * in addition, it lets you scope your renderers by entering a new "zone" by calling {@link HyperRender.pushZone | `HyperRender.pushZone(...new_renderers)`},
 * and then exiting out of that "zone" by popping it by calling {@link HyperRender.popZone | `HyperRender.popZone()`}.
 * 
 * the {@link InlineHyperZone | `InlineHyperZone`} renderer is a subclass of {@link HyperZone | `HyperZone`},
 * that provides a more user-friendly interface for defining attributes, events, etc... through the use of inline props,
 * rather than using `Symbol`s (placed inside of a spread props).
 * 
 * @example
 * ```tsx
 * // \@jsx h
 * // \@jsxFrag Fragment
 * 
 * import { InlineHyperZone } from "jsr:@oazmi/hzone/hzone"
 * import { VanillaHTMLRender, VanillaSVGRender, VanillaFragmentRender } from "jsr:@oazmi/hzone/vanilla"
 * 
 * const { h, Fragment, pushZone, popZone } = InlineHyperZone.create({
 * 	default: [new VanillaFragmentRender(), new VanillaHTMLRender()]
 * })
 * 
 * const my_div = <div class="my-div" style={{ backgroundColor: "blue" }}>
 * 	Hello World. Enjoy the SVG below:
 * 	<br />
 * 	{pushZone(new VanillaSVGRender())}
 * 	<svg viewBox="0 0 400 100" font-size="10px" fill="red">
 * 		<rect stroke="green" fill="transparent" x="20" y="20" width="360" height="60"></rect>
 * 		<text y="0" alignment-baseline="hanging">the following text is brought to you by an SVG</text>
 * 		<text y="50" alignment-baseline="hanging">Believe IT! said Naruto while performing his Talk-No-Jutsu.</text>
 * 	</svg>
 * 	{popZone()}
 * 	<>
 * 		a `Fragment` is just an array of `Element` nodes that get placed directly
 * 		into the parent of the fragment.
 * 		<hr />
 * 		<span>this portion is still part of the fragment.</span>
 * 	</>
 * </div>
 * 
 * document.body.append(my_div)
 * ```
 * 
 * @module
*/

import type { HyperRender } from "../typedefs.ts"
import type { HyperZone, InlineHyperZone } from "./renderers.ts"

export { HyperZone, InlineHyperZone } from "./renderers.ts"


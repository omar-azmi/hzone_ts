import type { HyperZoneConfigs } from "./configs.ts"
import { DEBUG, bindMethodToSelfByName } from "./deps.ts"
import type { HyperZone } from "./hzone/mod.ts"
import type { Props } from "./props.ts"
import type { VanillaComponentRender } from "./vanilla/mod.ts"

/** any object or primitive that implements the `toString` method. */
export type Stringifiable = { toString(): string }

/** any object (usually an `HTMLElement`, or a `CSSStyleRule` inside of a `StyleSheet`) that can by styled. */
export interface Stylable { style: CSSStyleDeclaration }

/** a truthy value assigned to the attribute of an `Element` will get converted to an empty string `""`,
 * so that it renders as an attribute without a value. (for instance, the `checked` attribute of `<input type="checkbox" checked />`)
*/
export type AttrTruthy = "" | true

/** a falsy value assigned to the attribute of an `Element` will cause it to detach. <br>
 * but when converted to non-falsy value, then it will get reattached to its original parent element.
*/
export type AttrFalsy = null | undefined | false

/** the value assignable to any attribute of an `Element`. <br>
 * this is specifically for {@link VanillaComponentRender | `ComponentRenderer`} and its subclasses.
*/
export type AttrValue = Stringifiable | AttrTruthy | AttrFalsy

/** the value assignable to any `TextNode` */
export type TextValue = Stringifiable | null | undefined

/** this is the base model for this library which must be extended by all JSX renders. */
export abstract class HyperRender<TAG = any, OUTPUT = any> {
	constructor(hyperzone_renderer?: HyperZone)
	constructor(config?: HyperZoneConfigs[keyof HyperZoneConfigs])
	constructor(config?: any) { }

	/** tests if the provided parameters, {@link tag | `tag`} and {@link props | `props`}, are compatible this `Zone`'s {@link h | `h` method} */
	abstract test(tag: any, props?: any): boolean

	/** creates an {@link OUTPUT | element} out of its properties. functions similar to `React.createElement` */
	abstract h(tag: TAG, props?: null | { [key: PropertyKey]: any }, ...children: any[]): OUTPUT

	/** convenience method for generating instance-bound closures out of prototype methods.
	 * only for internal use.
	*/
	bindMethod<M extends keyof this>(method_name: M): this[M] {
		return bindMethodToSelfByName(this as any, method_name) as this[M]
	}
}


/** a function that takes in a single {@link Props | `Props`} object variable, and generates a single HTML element. */
export type SingleComponentGenerator<P = {}> = (props: Props<P>) => Element

/** a function that takes in a single {@link Props | `Props`} object variable, and generates an array of HTML elements (aka a fragment). */
export type FragmentComponentGenerator<P = {}> = (props: P) => (string | Element)[]

/** a function that takes in a single {@link Props | `Props`} object variable, and generates either a single HTML element or an array of them. */
export type ComponentGenerator<P = {}> = SingleComponentGenerator<P> | FragmentComponentGenerator<P>

export const Fragment = Symbol(DEBUG.MINIFY || "indicator for a fragment component")

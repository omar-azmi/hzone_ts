import { HyperZoneConfigs } from "./configs.ts"
import { DEBUG, HTMLEventNames, PreserveStringKeyAndValues, bindMethodToSelfByName } from "./deps.ts"
import type { HyperZone } from "./hzone/mod.ts"
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

/** the key used for explicitly declaring attribute props on the output of {@link ComponentGenerator | `ComponentGenerator`s}. */
export const ATTRS = Symbol(DEBUG.MINIFY || "explicitly declared Element attributes of a single Component")

/** the props used for explicitly declaring attributes on the output of {@link ComponentGenerator | `ComponentGenerator`s}.
 * 
 * @example
 * ```ts
 * const CanvasComponent: ComponentGenerator<{
 * 	width?: number,
 * 	height?: number,
 * }> = ({ width = 300, height = 300 }) => <canvas width={width} height={height}>canvas is not supported</canvas>
 * const my_canvas = <CanvasComponent height={200} {...{
 * 	[ATTRS]: {
 * 		width: 400, // this later overrides the original value of `"300"` set by default.
 * 		style: "background-color: green;", // assign a new attribute node for a green background.
 * 	} as AttrProps
 * }}>ddd</CanvasComponent>
 * ```
*/
export type AttrProps = { [attr: string]: any }

/** mapped dictionary of all standard HTMLEvents */
export type EventFn<NAME extends HTMLEventNames> = (this: Element, event: HTMLElementEventMap[NAME]) => void

export type AdvancedEventFn<NAME extends HTMLEventNames> = [event_fn: EventFn<NAME>, options?: boolean | AddEventListenerOptions]

/** the key used for explicitly declaring event handling functions on the output of any {@link HyperRender.h | `Element Renderer`}. */
export const EVENTS = Symbol(DEBUG.MINIFY || "explicitly declared event listeners of a single Component")

/** the props used for explicitly declaring event handler functions on the output of any {@link HyperRender.h | `Element Renderer`}.
 * 
 * @example
 * ```tsx
 * let triggered = false
 * const my_button = <button {...{
 * 	[EVENTS]: {
 * 		click(event) {
 * 			const element = event.currentTarget as HTMLButtonElement
 * 			if (triggered) { element.attributeStyleMap.set("background-color", "red") }
 * 			else { element.attributeStyleMap.set("background-color", "blue") }
 * 			triggered = !triggered
 * 		}
 * 	} as EventProps
 * }}>
 * GET TRIGGERED
 * </button>
 * ```
*/
export type EventProps = {
	[event_name in HTMLEventNames]?: EventFn<event_name>
}

/** the key used for explicitly declaring advanced event handling functions on the output of any {@link HyperRender.h | `Element Renderer`}. */
export const ADVANCED_EVENTS = Symbol(DEBUG.MINIFY || "explicitly declared advaced configurable events of a single component")

/** the props used for explicitly declaring advanced event handler functions on the output of any {@link HyperRender.h | `Element Renderer`}. <br>
 * each entry's value needs to be a 2-tuple of the event handler function (`event_fn`) and its configuration `option` (of type `AddEventListenerOptions`).
 * 
 * @example
 * ```tsx
 * const my_div = <div {...{
 * 	[ADVANCED_EVENTS]: {
 * 		click: [(event) => {
 * 			console.log("user clicked at (x,y)-position:", event.clientX, event.clientY)
 * 		}, { once: true, passive: true }]
 * 	} as AdvancedEventProps
 * }}>
 * PLZZ CLICC ONN BIGG DIVV ONCEE ONLYY
 * </div>
 * ```
*/
export type AdvancedEventProps = {
	[event_name in HTMLEventNames]?: [event_fn: EventFn<event_name>, options?: boolean | AddEventListenerOptions]
}

/** the key used for explicitly declaring member assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. */
export const MEMBERS = Symbol(DEBUG.MINIFY || "explicitly declared element member assignments to make")

/** the props used for explicitly declaring member assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. <br>
 * note that many intrinsic properties of certain HTMLElements, such as `value` and `checked`, are also reflected as their "attributes",
 * but they are merely there for the purpose of initialization, and not actual mutation (although it does work in many cases). <br>
 * still, it is best to modify the property of an element if it is an intrinsic feature of that element, rather than modifying its attributes,
 * since the property holds the "real"/"true" value, and usually in a primitive javascript object format, rather than being exclusively a `string` or `null`.
 * 
 * @example
 * ```tsx
 * // assign `my_input.value = "hello"` and `my_input.disabled = true`
 * const my_input = <input value="default value" {...{
 * 	[MEMBERS]: {
 * 		value: "hello",
 * 		disabled: true,
 * 	} as MemberProps<HTMLInputElement>
 * }} />
 * ```
*/
export type MemberProps<E = Element> = {
	[member_key in keyof E]?: E[member_key]
}

/** the key used for explicitly declaring style assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. */
export const STYLE = Symbol(DEBUG.MINIFY || "explicitly declared element style to apply")
export type CSSVarProps = { [var_name: `--${string}`]: string | undefined }
export type StyleProps = Partial<PreserveStringKeyAndValues<CSSStyleDeclaration> & CSSVarProps>

/** the key used for explicitly declaring an array of functions to execute on the generated output element of any {@link HyperRender.h | `Element Renderer`} as the first parameter. */
export const EXECUTE = Symbol(DEBUG.MINIFY || "explicitly declared list of functions to execute on the element itself after its creation")

/** provide an array of functions to execute on the generated output of an {@link HyperRender.h | `Element Renderer`} as the first argument. <br>
 * this is useful in cases where you may wish to register the element post-creation, or perhaps apply some mutations to the element itself.
 * 
 * @example
 * ```tsx
 * // apply some style to `my_div` post-creation
 * const my_div = <div style="background-color: green;" {...{
 * 	[EXECUTE]: [
 * 		(div_element): void => {
 * 			if(div_element.style.backgroundColor === "green") {
 * 				div_element.style.backgroundColor = "red"
 * 			}
 * 		},
 * 		(div_element): void => {
 * 			if(div_element.style.backgroundColor === "red") {
 * 				div_element.style.backgroundColor = "blue"
 * 			}
 * 		},
 * 	] as ExecuteProps<HTMLDivElement>
 * }}>
 * I'm blue daba dee daba die, If I were green I would die.
 * </div>
 * ```
*/
export type ExecuteProps<E = Element> = Array<(element: E) => void>

/** the default props assignable to all components (any renderer that inherits from {@link VanillaComponentRender | `ComponentRenderer`} will support these). <br>
 * see the details of each on their respective documentation:
 * - for element attributes, see: {@link AttrProps | `AttrProps`}
 * - for element events, see: {@link EventProps | `EventProps`}
 * - for configurable element events, see: {@link AdvancedEventProps | `AdvancedEventProps`}
 * - for element javascript members, see: {@link MemberProps | `MemberProps`}
 * - for element dynamic styling, see: {@link StyleProps | `StyleProps`}
 * - for running post-creation functions with the element as the parameter, see: {@link ExecuteProps | `SelfProps`}
*/
export interface DefaultProps {
	[ATTRS]?: AttrProps | undefined | null
	[EVENTS]?: EventProps | undefined | null
	[ADVANCED_EVENTS]?: AdvancedEventProps | undefined | null
	[MEMBERS]?: MemberProps | undefined | null
	[STYLE]?: StyleProps | undefined | null
	[EXECUTE]?: ExecuteProps | undefined | null
}

/** the props accepted by any {@link ComponentGenerator}, as a single variable. */
export type Props<P = {}> = P & DefaultProps

/** a function that takes in a single {@link Props | `Props`} object variable, and generates a single HTML element. */
export type SingleComponentGenerator<P = {}> = (props: Props<P>) => Element

/** a function that takes in a single {@link Props | `Props`} object variable, and generates an array of HTML elements (aka a fragment). */
export type FragmentComponentGenerator<P = {}> = (props: P) => (string | Element)[]

/** a function that takes in a single {@link Props | `Props`} object variable, and generates either a single HTML element or an array of them. */
export type ComponentGenerator<P = {}> = SingleComponentGenerator<P> | FragmentComponentGenerator<P>

export const Fragment = Symbol(DEBUG.MINIFY || "indicator for a fragment component")

import type { Component_Render } from "./core/mod.ts"
import { DEBUG } from "./deps.ts"

/** any object or primitive that implements the `toString` method. */
export type Stringifiable = { toString(): string }

/** a truthy value assigned to the attribute of an `Element` will get converted to an empty string `""`,
 * so that it renders as an attribute without a value. (for instance, the `checked` attribute of `<input type="checkbox" checked />`)
*/
export type AttrTruthy = "" | true

/** a falsy value assigned to the attribute of an `Element` will cause it to detach. <br>
 * but when converted to non-falsy value, then it will get reattached to its original parent element.
*/
export type AttrFalsy = null | undefined | false

/** the value assignable to any attribute of an `Element`. <br>
 * this is specifically for {@link Component_Render | `Component_Render`} and its subclasses.
*/
export type AttrValue = Stringifiable | AttrTruthy | AttrFalsy

/** the value assignable to any `TextNode` */
export type TextValue = Stringifiable | null | undefined

/** every instance of {@link HyperRender | `HyperRender`} should be identifiable by a unique symbol. */
export type RenderKind = symbol

/** this is the base model for this library which must be extended by all JSX renders. */
export abstract class HyperRender<TAG = any, OUTPUT = any> {
	kind: RenderKind

	constructor(existing_kind?: symbol)
	constructor(new_kind_description?: string)
	constructor(kind?: symbol | string) {
		this.kind = typeof kind === "symbol" ? kind : Symbol(kind)
	}

	/** tests if the provided parameters, {@link tag | `tag`} and {@link props | `props`}, are compatible this `Zone`'s {@link h | `h` method} */
	abstract test(tag: any, props?: any): boolean

	/** creates an {@link OUTPUT | element} out of its properties. functions similar to `React.createElement` */
	abstract h(tag: TAG, props?: null | { [key: PropertyKey]: any }, ...children: any[]): OUTPUT
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
export type EventFn<NAME extends keyof HTMLElementEventMap> = (this: Element, event: HTMLElementEventMap[NAME]) => void

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
	[event_name in keyof HTMLElementEventMap]?: EventFn<event_name>
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
 * 	} as AdvancedEvenProps
 * }}>
 * PLZZ CLICC ONN BIGG DIVV ONCEE ONLYY
 * </div>
 * ```
*/
export type AdvancedEvenProps = {
	[event_name in keyof HTMLElementEventMap]?: [event_fn: EventFn<event_name>, options?: boolean | AddEventListenerOptions]
}

/** the default props assignable to all components (any renderer that inherits from {@link Component_Render | `Component_Render`} will support these). <br>
 * see the details of each on their respective documentation:
 * - for element attributes, see: {@link AttrProps | `AttrProps`}
 * - for element events, see: {@link EventProps | `EventProps`}
 * - for configurable element events, see: {@link AdvancedEvenProps | `AdvancedEvenProps`}
*/
export interface DefaultProps {
	[ATTRS]?: AttrProps | undefined | null
	[EVENTS]?: EventProps | undefined | null
	[ADVANCED_EVENTS]?: AdvancedEvenProps | undefined | null
}

/** the props accepted by any {@link ComponentGenerator}, as a single variable. */
export type Props<P = {}> = P & DefaultProps

/** a function that takes in a single {@link Props | `Props`} object variable, and generates a single HTML element. */
export type SingleComponentGenerator<P = {}> = (props: Props<P>) => Element

/** a function that takes in a single {@link Props | `Props`} object variable, and generates an array of HTML elements (aka a fragment). */
export type FragmentComponentGenerator<P = {}> = (props: P) => (string | Element)[]

/** a function that takes in a single {@link Props | `Props`} object variable, and generates either a single HTML element or an array of them. */
export type ComponentGenerator<P = {}> = SingleComponentGenerator<P> | FragmentComponentGenerator<P>

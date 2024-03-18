import { DEBUG, HTMLEventNames, PreserveStringKeyAndValues } from "./deps.ts"


export const
	/** the key used for explicitly declaring attribute props on the output of {@link ComponentGenerator | `ComponentGenerator`s}. */
	ATTRS = Symbol(DEBUG.MINIFY || "explicitly declared Element attributes of a single Component"),
	/** the key used for explicitly declaring event handling functions on the output of any {@link HyperRender.h | `Element Renderer`}. */
	EVENTS = Symbol(DEBUG.MINIFY || "explicitly declared event listeners of a single Component"),
	/** the key used for explicitly declaring advanced event handling functions on the output of any {@link HyperRender.h | `Element Renderer`}. */
	ADVANCED_EVENTS = Symbol(DEBUG.MINIFY || "explicitly declared advaced configurable events of a single component"),
	/** the key used for explicitly declaring member assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. */
	MEMBERS = Symbol(DEBUG.MINIFY || "explicitly declared element member assignments to make"),
	/** the key used for explicitly declaring style assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. */
	STYLE = Symbol(DEBUG.MINIFY || "explicitly declared element style to apply"),
	/** the key used for explicitly declaring an array of functions to execute on the generated output element of any {@link HyperRender.h | `Element Renderer`} as the first parameter. */
	EXECUTE = Symbol(DEBUG.MINIFY || "explicitly declared list of functions to execute on the element itself after its creation")

/** the default props assignable to all components (any renderer that inherits from {@link Component_Render | `Component_Render`} will support these). <br>
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


export type CSSVarProps = { [var_name: `--${string}`]: string | undefined }

/** standard CSS styling properties, along with variable property declaration support (i.e. `css_object["--my-var"]`) */
export type StyleProps = Partial<PreserveStringKeyAndValues<CSSStyleDeclaration> & CSSVarProps>


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

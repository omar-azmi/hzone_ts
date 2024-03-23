/** exports the symbols for {@link DefaultProps | symbol props}, and the name-prefixes for {@link InlineDefaultProps | inline props},
 * in addition to the {@link Props | `Props`} interface that must be accepted by all components generators.
 * 
 * @module
*/

import { DEBUG, HTMLEventNames, PreserveStringKeyAndValues, object_assign, object_entries, object_fromEntries } from "./deps.ts"
import type { InlineHyperZone } from "./hzone/mod.ts"
import type { ComponentGenerator } from "./typedefs.ts"
import type { VanillaComponentRender } from "./vanilla/mod.ts"


/** the props accepted by any {@link ComponentGenerator}, as a single variable. <br>
 * see {@link DefaultProps | `DefaultProps`} to understand the default (symbol-based) properties accepted by all components. <br>
 * or see {@link InlineDefaultProps | `InlineDefaultProps`} for the inlined equivalent (prefix-based) properties accepted by all components if you use {@link InlineHyperZone | `InlineHyperZone`}.
*/
export type Props<P = {}> = P & DefaultProps

/** the props accepted by any {@link ComponentGenerator}, ONLY when the inline hyperzone {@link InlineHyperZone | `InlineHyperZone`} is being used. */
export type InlineProps<P = {}> = P & InlineDefaultProps

export const
	/** the key used for explicitly declaring attribute props on the output of {@link ComponentGenerator | `ComponentGenerator`s}. */
	ATTRS = Symbol(DEBUG.MINIFY || "explicitly declared Element attributes of a single Component"),
	/** the key used for explicitly declaring event handling functions (or 2-tuple descriptor) on the output of any {@link HyperRender.h | `Element Renderer`}. */
	EVENTS = Symbol(DEBUG.MINIFY || "explicitly declared event listeners of a single Component"),
	/** the key used for explicitly declaring member assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. */
	MEMBERS = Symbol(DEBUG.MINIFY || "explicitly declared element member assignments to make"),
	/** the key used for explicitly declaring style assignments to make on the generated output of any {@link HyperRender.h | `Element Renderer`}. */
	STYLE = Symbol(DEBUG.MINIFY || "explicitly declared element style to apply"),
	/** the key used for explicitly declaring a function to execute on the generated output element of any {@link HyperRender.h | `Element Renderer`} as the first parameter. */
	ONINIT = Symbol(DEBUG.MINIFY || "explicitly declared function to execute on the element itself after its creation"),
	/** the key used for explicitly declaring a function to execute on the element when it is being deleted/detached permanently. */
	ONCLEAN = Symbol(DEBUG.MINIFY || "explicitly declared function to execute on the element's permanent destruction")

/** the default props assignable to all components (any renderer that inherits from {@link VanillaComponentRender | `VanillaComponentRender`} will support these). <br>
 * see the details of each on their respective documentation:
 * - for element attributes, see: {@link AttrProps | `AttrProps`}
 * - for element events, see: {@link EventProps | `EventProps`}
 * - for element javascript members, see: {@link MemberProps | `MemberProps`}
 * - for element dynamic styling, see: {@link StyleProps | `StyleProps`}
 * - for running a post-creation function with the element as the parameter, see: {@link ExecuteProp | `ExecuteProp`} and its symbol {@link ONINIT | `ONINIT`}
 * - for running a pre-deletion function with the element as the parameter, see: {@link ExecuteProp | `ExecuteProp`} and its symbol {@link ONCLEAN | `ONCLEAN`}
*/
export interface DefaultProps {
	[ATTRS]?: AttrProps | undefined | null
	[EVENTS]?: EventProps<any> | undefined | null
	[MEMBERS]?: MemberProps<any> | undefined | null
	[STYLE]?: StyleProps | undefined | null
	[ONINIT]?: ExecuteProp<any> | undefined | null
	[ONCLEAN]?: ExecuteProp<any> | undefined | null
}

/** the default inline props assignable to all components (any renderer that inherits from {@link VanillaComponentRender | `VanillaComponentRender`} will support these). <br>
 * see {@link DefaultProps | `DefaultProps`} for the details of each property:
*/
export interface InlineDefaultProps {
	[attribute_name: `attr:${string}`]: AttrProps[keyof AttrProps]
	[event_name: `on:${string}`]: EventProps[keyof EventProps]
	[element_member_name: `set:${string}`]: MemberProps[keyof MemberProps]
	["style"]?: StyleProps
	["init"]?: ExecuteProp
	["clean"]?: ExecuteProp
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
export type AttrProps = { [attribute_name: string]: any }

/** mapped dictionary of all standard HTMLEvents */
export type EventFn<
	EventName extends HTMLEventNames,
	ELEM extends Element = Element
> = (this: ELEM, event: HTMLElementEventMap[EventName]) => void

export type AdvancedEventFn<
	EventName extends HTMLEventNames,
	ELEM extends Element = Element
> = [event_fn: EventFn<EventName, ELEM>, options?: boolean | AddEventListenerOptions]

/** the props used for explicitly declaring event handler functions on the output of any {@link HyperRender.h | `Element Renderer`}. <br>
 * if you use a 2-tuple, you can specify the event handler function (`event_fn`) in the first entry,
 * and its configuration `option` (of type `AddEventListenerOptions`) in the second entry.
 * 
 * @example
 * ```tsx
 * // example for a simple click event:
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
 * 
 * @example
 * ```tsx
 * // example for click-once event using 2-tuple description:
 * const my_div = <div {...{
 * 	[EVENTS]: {
 * 		click: [(event) => {
 * 			console.log("user clicked at (x,y)-position:", event.clientX, event.clientY)
 * 		}, { once: true, passive: true }]
 * 	} as EventProps
 * }}>
 * PLZZ CLICC ONN BIGG DIVV ONCEE ONLYY
 * </div>
 * ```
*/
export type EventProps<ELEM extends Element = Element> = {
	[EventName in HTMLEventNames]?: EventFn<EventName, ELEM> | AdvancedEventFn<EventName, ELEM>
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
export type MemberProps<ELEM = Element> = {
	[member_key in keyof ELEM]?: ELEM[member_key]
}

export type CSSVarProps = { [var_name: `--${string}`]: string | undefined }

/** standard CSS styling properties, along with variable property declaration support (i.e. `css_object["--my-var"]`) */
export type StyleProps = Partial<PreserveStringKeyAndValues<CSSStyleDeclaration> & CSSVarProps>

/** provide a function to execute on the generated output of an {@link HyperRender.h | `Element Renderer`} as the first argument. <br>
 * this is useful in cases where you may wish to register the element post-creation, or perhaps apply some mutations to the element itself. <br>
 * or, declare a "on delete" function to execute when the element is being permanently detached. ideally, you should run any cleanup tasks here. <br>
 * 
 * @example
 * ```tsx
 * // apply some style to `my_div` post-creation
 * const my_div = <div style="background-color: green;" {...{
 * 	[ONINIT]: (div_element): void => {
 * 		if(div_element.style.backgroundColor === "green") {
 * 			div_element.style.backgroundColor = "red"
 * 		}
 * 		if(div_element.style.backgroundColor === "red") {
 * 			div_element.style.backgroundColor = "blue"
 * 		}
 * 	} as ExecuteProp<HTMLDivElement>
 * }}>
 * I'm blue daba dee daba die, If I were green I would die.
 * </div>
 * ```
 * 
 * @example
 * ```tsx
 * // log when the div element has been destroyed
 * const my_div = <div style="background-color: green;" {...{
 * 	[ONCLEAN]: (div_element): void => {
 * 		console.log("eiffel 65 turned green, and died")
 * 	} as ExecuteProp<HTMLDivElement>
 * }}>
 * I'm blue daba dee daba die, If I were green I would die.
 * </div>
 * ```
*/
export type ExecuteProp<ELEM = Element> = (element: ELEM) => void

/** place top level props into the {@link ATTRS | `props[ATTRS]`} field. this is useful for HTMLElement and SVGElement component generators. <br>
 * 
 * @example
 * ```ts
 * const normalized_props = normalizeAttrProps({
 * 	width: 50,
 * 	height: 30,
 * 	[ATTRS]: {
 * 		height: 40,
 * 		style: "background-color: red;",
 * 	},
 * 	[EVENTS]: { click: () => { console.log("you suck") } }
 * })
 * // this will now produce: the following equivalent structure:
 * normalized_props === {
 * 	[ATTRS]: {
 * 		width: 50,
 * 		height: 40, // notice that the thing in `[ATTRS]` has a higher precedence.
 * 		style: "background-color: red;",
 * 	},
 * 	[EVENTS]: { click: () => { console.log("you suck") } }
 * }
 * ```
*/
export const normalizeAttrProps = (props?: null | Props<AttrProps>): Props<{}> => {
	const {
		[EVENTS]: event_props,
		[MEMBERS]: member_props,
		[STYLE]: style_props,
		[ONINIT]: oninit_fn,
		[ONCLEAN]: onclean_fn,
		[ATTRS]: other_attr_props,
		...attr_props
	} = props ?? {}
	return {
		[EVENTS]: event_props,
		[MEMBERS]: member_props,
		[STYLE]: style_props,
		[ONINIT]: oninit_fn,
		[ONCLEAN]: onclean_fn,
		[ATTRS]: { ...attr_props, ...other_attr_props },
	}
}

/** remaps the inlined attributes/properties into their standard symbol fields, so that they become {@link Props} compliant. */
export const inlinePropsRemapper = (props?: InlineProps<any>): Props<any> => {
	const {
		// [STYLE]: style_props, // do not use the `[STYLE]` symbol prop key for inline hyperzone rendering
		[ATTRS]: attr_props = {},
		[EVENTS]: event_props = {},
		[MEMBERS]: member_props = {},
		style: style_props,
		init: oninit_fn,
		clean: onclean_fn,
		...rest_props
	} = props ?? {}
	const component_props = object_fromEntries(
		object_entries(rest_props).filter(([key, value]) => {
			if (key.startsWith("on:")) {
				event_props![key.slice(3)] = value
			} else if (key.startsWith("set:")) {
				member_props![key.slice(4)] = value
			} else if (key.startsWith("attr:")) {
				attr_props[key.slice(5)] = value
			} else {
				// if we make it to here, then the key must be for the component generator itself.
				// thus we will not filter it out.
				return true
			}
		})
	) as Props<any>
	return object_assign(component_props, {
		[ATTRS]: attr_props,
		[EVENTS]: event_props,
		[MEMBERS]: member_props,
		[STYLE]: style_props,
		[ONINIT]: oninit_fn,
		[ONCLEAN]: onclean_fn,
	})
}



/// INLINE PREFIX NAMING AND DOCUMENTATION

import type { HTMLElementUniqueMemberKeys, HTMLTagNames, SVGEventNames, SVGTagNames } from "./deps.ts"
import type { HTMLTagNameAttributesMap } from "./dom_typedefs/html_attributes_map.ts"
import type { SVGTagNameAttributesMap } from "./dom_typedefs/svg_attributes_map.ts"


/** when explicitly declaring a prop to be of an attribute kind, use the `attr:` prefix to specify. <br>
 * examples: `attr:id`, `attr:style`, `attr:class`, and `attr:href`. <br>
 * common values for the {@link QualifiedAttributeNames | `QualifiedAttributeNames` type parameter}:
 * - for all html attributes: InlineAttrName<{@link HTMLTagNameAttributesMap}[{@link HTMLTagNames}]>
 * - for all svg attributes: InlineAttrName<{@link SVGTagNameAttributesMap}[{@link SVGTagNames}]>
 * - for any allowing arbitrary attribute name: InlineAttrName<string>
 * 
 * note that using a union of string literal attributes instead of just using any arbitrary string attribute, will lead to slowdowns in you IDE.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 * 	return <div style="color: blue;" class="some-thing" attr:id="another-thing">
 * 		Hello world!
 * 	</div>
 * }
 * const my_green_component = <MyComponent style="color: green;" attr:id="a-different-thing" />
 * // this will create:
 * // <div style="color: green;" id="a-different-thing" class="some-thing">Hello World!</div>
 * ```
*/
export type InlineAttrName<QualifiedAttributeNames extends string = string> = `attr:${QualifiedAttributeNames}`

/** when explicitly declaring a function to execute right after the creation of the element, use the `init` inline property. <br>
 * also see {@link ExecuteProp | `ExecuteProp`} for the on-initialization function signature.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 * 	return <div style="color: blue;" class="some-thing" attr:id="another-thing">
 * 		Hello world!
 * 	</div>
 * }
 * const my_green_component = <MyComponent init={(element) => {
 * 	element.style.color = "green"
 * 	element.id = "a-different-thing"
 * }} />
 * // this will create:
 * // <div style="color: green;" id="a-different-thing" class="some-thing">Hello World!</div>
 * ```
*/
export type InlineOnInit = "init"

/** when explicitly declaring a function to execute right before the destruction of the element, use the `clean` inline property . <br>
 * also see {@link ExecuteProp | `ExecuteProp`} for the on-cleanup function signature.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 * 	return <div style="color: blue;" class="some-thing" attr:id="another-thing">
 * 		Hello world!
 * 	</div>
 * }
 * const my_green_component = <MyComponent clean={(element) => {
 * 	console.log("my_green_component is dead...")
 * }} />
 * // this will log when the component is permanently detached
 * ```
*/
export type InlineOnClean = "clean"

/** when explicitly declaring a prop to be of an event listener, use the `on:` prefix to specify. <br>
 * examples: `on:change`, `on:click`, and `on:resize` <br>
 * common values for the {@link QualifiedEventNames | `QualifiedEventNames` type parameter}:
 * - for all html events: InlineEventName<{@link HTMLEventNames}>
 * - for all svg events: InlineEventName<{@link SVGEventNames}>
 * - for any allowing arbitrary event names: InlineEventName<string>
 * 
 * note that using a union of string literal event names instead of just using any arbitrary string attribute, will lead to slowdowns in you IDE. <br>
 * also, your event should implement either {@link EventFn | `EventFn`} signature, or the {@link AdvancedEventFn | `AdvancedEventFn`} tuple.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 * 	return <div style="color: blue;" class="some-thing" attr:id="another-thing">
 * 		Hello world!
 * 	</div>
 * }
 * const my_soon_to_be_green_component = <MyComponent on:click={(event: MouseEvent) => {
 * 	const the_element = event.currentTarget
 * 	the_element.style.color = "green"
 * 	the_element.id = "a-different-thing"
 * }} />
 * // this will turn into the following when clicked:
 * // <div style="color: green;" id="a-different-thing" class="some-thing">Hello World!</div>
 * ```
*/
export type InlineEventName<QualifiedEventNames extends string = HTMLEventNames> = `on:${QualifiedEventNames}`

/** when declaring a mutation to the element's member (not an attribute, but rather something that is accessible via the dot property accessor, such as `element.classList`),
 * use the `set:` prefix to specify what value to set it to. <br>
 * examples: `set:classList`, `set:style` (this is different from the style-attribute), and `set:parentNode` (I don't think this one will work). <br>
 * common values for the {@link QualifiedMemberNames | `QualifiedMemberNames` type parameter}:
 * - for all common html element members: InlineMemberName<{@link HTMLElementUniqueMemberKeys<any>}> (this is a tiny subset of what a specific element by support)
 * - for a specific element's members: InlineMemberName<{@link HTMLElementUniqueMemberKeys<HTMLInputElement>}> (this one will now have unqie members such as `value`, `valueAsNumber` and `valueAsDate`)
 * 
 * note that using a union of string literal attributes instead of just using any arbitrary string attribute, will lead to slowdowns in you IDE.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 * 	return <div style="color: blue;" class="some-thing" attr:id="another-thing">
 * 		Hello world!
 * 	</div>
 * }
 * const my_green_component = <MyComponent style="color: green;" attr:id="a-different-thing" />
 * // this will create:
 * // <div style="color: green;" id="a-different-thing" class="some-thing">Hello World!</div>
 * ```
*/
export type InlineMemberName<QualifiedMemberNames extends string = HTMLElementUniqueMemberKeys<any>> = `set:${QualifiedMemberNames}`

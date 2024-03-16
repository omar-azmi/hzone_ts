/** this module defines a set of convenient inline attribute/property naming guide */

import { number_parseInt, object_assign, object_entries, object_fromEntries, type HTMLElementUniqueMemberKeys, type HTMLEventNames, type HTMLTagNames, type SVGEventNames, type SVGTagNames, } from "../deps.ts"
import { ATTRS, EVENTS, EXECUTE, MEMBERS, STYLE, type AdvancedEventFn, type EventFn, type Props } from "../typedefs.ts"
import type { HTMLTagNameAttributesMap } from "./html_attributes_map.ts"
import type { SVGTagNameAttributesMap } from "./svg_attributes_map.ts"

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

/** the function signature of functions executable via jsx {@link InlineExecuteName | `InlineExecuteName`},
 * right after the element has been created
*/
export type InlineExecuteFn<E extends Element = Element> = (new_element: E) => void

/** when explicitly declaring function to execute right after the creation of the element, use the `exec:$` prefix to specify the order in which it should be ran. <br>
 * examples: `exec:$0` (first function to execute), and `exec:$4` (fifth function to execute).
 * the executed function should take only one parameter, which will be that of the created element.
 * see {@link InlineExecuteFn}
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 * 	return <div style="color: blue;" class="some-thing" attr:id="another-thing">
 * 		Hello world!
 * 	</div>
 * }
 * const my_green_component = <MyComponent exec:$0={(element) => {
 * 	element.style.color = "green"
 * 	element.id = "a-different-thing"
 * }} />
 * // this will create:
 * // <div style="color: green;" id="a-different-thing" class="some-thing">Hello World!</div>
 * ```
*/
export type InlineExecuteName = `exec:$${number}`

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

type GenericInlineProps = {
	style?: any
	[attribute_name: `attr:${string}`]: any
	[execute_function_in_order: `exec:$${number}`]: any
	[set_element_member: `set:${string}`]: any
	[event_name: `on:${string}`]: any
}
// Record<| `style` | `on:${string}` | `set:${string}` | `attr:${string}` | `exec:$${number}`, any>

/** remaps the inlined attributes/properties into their standard symbol fields, so that they become {@link Props} compliant. */
export const inlinePropsRemapper = (props?: Props<GenericInlineProps> | any): Props<any> => {
	const {
		// [STYLE]: style_props, // do not use the `[STYLE]` symbol prop key for convenient renderers
		style: style_props = {},
		[EVENTS]: event_props = {},
		[MEMBERS]: member_props = {},
		[ATTRS]: attr_props = {},
		[EXECUTE]: execute_props = [] as InlineExecuteFn[],
		// [ADVANCED_EVENTS]: advanced_events_props = {} as any, // TODO: Purge it!
		...rest_props
	} = props as Record<string | symbol, any> ?? {}
	const component_props = object_fromEntries(
		object_entries(rest_props).filter(([key, value]) => {
			if (key.startsWith("on:")) {
				event_props![key.slice(3)] = value
			} else if (key.startsWith("set:")) {
				member_props![key.slice(4)] = value
			} else if (key.startsWith("attr:")) {
				attr_props[key.slice(5)] = value
			} else if (key.startsWith("exec:$")) {
				// note that the resulting `execute_props` may become a sparse array as a consequence of the assignment below.
				// thus we will condense it later on using `Array.filter` method.
				execute_props[number_parseInt(key.slice(6))] = value
			} else {
				// if we make it to here, then the key must be for the component generator itself.
				// thus we will not filter it out.
				return true
			}
		})
	) as Props<any>
	return object_assign(component_props, {
		[STYLE]: style_props,
		[EVENTS]: event_props,
		[MEMBERS]: member_props,
		[ATTRS]: attr_props,
		// we remove the potential sparseness of the `execute_props` here
		[EXECUTE]: execute_props.filter((exec_fn?: ((element: Element) => void)) => exec_fn ? true : false),
	})
}

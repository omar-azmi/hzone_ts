import { isFunction, number_parseInt, object_assign, object_entries, object_fromEntries } from "../deps.ts"
import { ATTRS, AttrValue, ComponentGenerator, EVENTS, EXECUTE, EventFn, ExecuteProps, MEMBERS, Props, STYLE, Stringifiable, StyleProps } from "../typedefs.ts"
import { type Accessor, type Context, type DynamicStylable, type HTMLElementUniqueMembers, type MaybeAccessor, type ReactiveStyleProps } from "./deps.ts"
import { HTMLElementTagSpecificAttributes, SVGElementTagSpecificAttributes } from "./dom_attribute_types.ts"
import { ReactiveComponent_Render_Factory, ReactiveFragment_Render_Factory, ReactiveHTMLElement_Render_Factory, ReactiveSVGElement_Render_Factory } from "./renderers.ts"
import type { ReactiveDynamicStylable } from "./styling.ts"


export type ConvenientAttrProps = Record<`attr:${string}`, MaybeAccessor<Stringifiable>>

export type ConvenientExecuteProps<E extends Element> = Record<`exec:$${number}`, (element: E) => void>

export type ConvenientEventProps = {
	[NAME in keyof HTMLElementEventMap as `on:${NAME}`]?: EventFn<NAME> | [EventFn<NAME>, options?: AddEventListenerOptions]
}

export type ConvenientMemberProps<E extends Element> = {
	[KEY in keyof HTMLElementUniqueMembers<E> as (KEY extends string ? `set:${KEY}` : never)]?: MaybeAccessor<E[KEY]>
}

/**
 * note that using `MaybeAccessor<string>` (aka `string | Accessor<string>`), will be re-routed to the element's `"style"` attribute,
 * and it won't be used for assigning onto the element's `"style"` member.
 * in other words, depending on what you choose, one of the following will occur:
 * - `MaybeAccessor<string>` will ultimately lead to `element.setAttribute("style", the_whole_reactive_style)`, during the assignment stage.
 * - `Accessor<StyleProps>` will create an underlying {@link DynamicStylable | `DynamicStylable`}, which will ultimately result in `Object.assign(element.style, the_whole_reactive_style)`, during the assignment stage.
 * - `ReactiveStyleProps` will create an underlying {@link ReactiveDynamicStylable | `ReactiveDynamicStylable`}, which will only update the modified property via `element.style.setProperty(the_reactive_style.["changedMember"])`.
*/
export type ConvenientStyleProps = {
	style?: ReactiveStyleProps | Accessor<StyleProps> | MaybeAccessor<string>
}

export type ConvenientElementProps<
	E extends Element = HTMLElement
> = & ConvenientStyleProps
	& ConvenientEventProps
	& ConvenientMemberProps<E>
	& ConvenientAttrProps
	& ConvenientExecuteProps<E>

export type ReactiveComponentProps<P, E extends HTMLElement = HTMLElement> = ConvenientElementProps<E> & Props<P>
// type ImportantHTMLAttributes = keyof Omit<AllHTMLAttributes<any>, A | keyof DOMAttributes<any> | keyof AriaAttributes>
// type ImportantSVGAttributes = keyof Omit<SVGAttributes<any>, keyof DOMAttributes<any> | keyof AriaAttributes>
// type ReactiveElementProps<
// 	E extends Element,
// 	ConvenientProps extends ConvenientElementProps<E> = ConvenientElementProps<E>
// > = ConvenientProps & Partial<Record<ImportantHTMLAttributes, MaybeAccessor<AttrValue>>>
// type ReactiveSVGElementProps<
// 	E extends SVGElement,
// 	ConvenientProps extends ConvenientElementProps<E> = ConvenientElementProps<E>
// > = ConvenientProps & Partial<Record<ImportantSVGAttributes, MaybeAccessor<AttrValue>>>

type IntrinsicHTMLElements = {
	[TagName in keyof HTMLElementTagNameMap]:
	& ConvenientElementProps<HTMLElementTagNameMap[TagName]>
	& Partial<Record<HTMLElementTagSpecificAttributes[TagName], MaybeAccessor<AttrValue>>>
}
type IntrinsicSVGElements = {
	[TagName in keyof SVGElementTagNameMap]:
	& ConvenientElementProps<SVGElementTagNameMap[TagName]>
	& Partial<Record<SVGElementTagSpecificAttributes[TagName], MaybeAccessor<AttrValue>>>
}

/** to get JSX highlighting, assuming your source code directory is `/src/`, create the file `/src/jsx.d.ts`, then fill it with the following:
 * 
 * ```ts
 * // path: `/src/jsx.d.ts`
 * export { IntrinsicElements } from "./path/to/this/convenient.ts"
 * export as namespace JSX
 * ```
*/
export type IntrinsicElements = IntrinsicHTMLElements & IntrinsicSVGElements

export const convenientPropsRemapper = (props?: Props<ConvenientElementProps>): Props<any> => {
	const {
		// [STYLE]: style_props, // do not use the `[STYLE]` symbol prop key for convenient renderers
		style: style_props = {},
		[EVENTS]: event_props = {},
		[MEMBERS]: member_props = {},
		[ATTRS]: attr_props = {},
		[EXECUTE]: execute_props = [] as ExecuteProps,
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
	// see the note in {@link ConvenientStyleProps}. this is the part where we differentiate between `MaybeAccessor<string>`, and the other assugnable types
	const
		style_is_accessor = isFunction(style_props),
		style_is_string = typeof (style_is_accessor ? style_props() : style_props) === "string"
	if (style_is_string) { attr_props.style = style_props }
	return object_assign(component_props, {
		[STYLE]: style_is_string ? {} : style_props,
		[EVENTS]: event_props,
		[MEMBERS]: member_props,
		[ATTRS]: attr_props,
		// we remove the potential sparseness of the `execute_props` here
		[EXECUTE]: execute_props.filter((exec_fn?: ((element: Element) => void)) => exec_fn ? true : false),
	})
}

export const ConvenientReactiveComponent_Render_Factory = (ctx: Context) => {
	const base_class = ReactiveComponent_Render_Factory(ctx)
	return class ConvenientReactiveComponent_Render<G extends ComponentGenerator = ComponentGenerator> extends base_class<G> {
		h<
			C extends G,
			P extends (C extends ComponentGenerator<infer PROPS> ? PROPS : undefined | null | object) = any
		>(component: C, props: Props<P & ConvenientElementProps>, ...children: (string | Node)[]): ReturnType<C> {
			return super.h(component, convenientPropsRemapper(props), ...children)
		}
	}
}

export const ConvenientReactiveHTMLElement_Render_Factory = (ctx: Context) => {
	const base_class = ReactiveHTMLElement_Render_Factory(ctx)
	return class ConvenientReactiveHTMLElement_Render_Factory extends base_class {
		h<TAG extends keyof HTMLElementTagNameMap>(tag: TAG, props?: null | Props<ConvenientElementProps>, ...children: (string | Node)[]): HTMLElementTagNameMap[TAG] {
			return super.h(tag, convenientPropsRemapper(props!), ...children)
		}
	}
}

export const ConvenientReactiveSVGElement_Render_Factory = (ctx: Context) => {
	const base_class = ReactiveSVGElement_Render_Factory(ctx)
	return class ConvenientReactiveSVGElement_Render_Factory extends base_class {
		h<TAG extends keyof SVGElementTagNameMap>(tag: TAG, props?: null | Props<ConvenientElementProps>, ...children: (string | Node)[]): SVGElementTagNameMap[TAG] {
			return super.h(tag, convenientPropsRemapper(props!), ...children)
		}
	}
}

export const ConvenientReactiveFragment_Render_Factory = ReactiveFragment_Render_Factory

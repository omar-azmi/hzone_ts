import type { HTMLElementUniqueMemberKeys, HTMLEventNames, HTMLTagNames, InlineAttrName, InlineEventName, InlineExecuteFn, InlineExecuteName, InlineMemberName, IntrinsicHTMLElements_Factory, IntrinsicSVGElements_Factory, SVGTagNames } from "../dom_core/mod.ts"
import type { Accessor, DynamicStylable, MaybeAccessor, TsignalStyleProps } from "../tsignal_base/deps.ts"
import type { ReactiveDynamicStylable } from "../tsignal_base/styling.ts"
import type { AttrValue, EventFn, Props, Stringifiable, StyleProps } from "../typedefs.ts"


type InlineAttrProps = Record<InlineAttrName, MaybeAccessor<Stringifiable>>

type InlineExecuteProps<E extends Element> = Record<InlineExecuteName, InlineExecuteFn<E>>

type InlineEventProps = {
	[NAME in HTMLEventNames as InlineEventName<HTMLEventNames>]?: EventFn<NAME> | [EventFn<NAME>, options?: AddEventListenerOptions]
}

type InlineMemberProps<E extends Element> = {
	[KEY in HTMLElementUniqueMemberKeys<E> as InlineMemberName<KEY>]?: MaybeAccessor<E[KEY]>
}

/**
 * note that using `MaybeAccessor<string>` (aka `string | Accessor<string>`), will be re-routed to the element's `"style"` attribute,
 * and it won't be used for assigning onto the element's `"style"` member.
 * in other words, depending on what you choose, one of the following will occur:
 * - `MaybeAccessor<string>` will ultimately lead to `element.setAttribute("style", the_whole_reactive_style)`, during the assignment stage.
 * - `Accessor<StyleProps>` will create an underlying {@link DynamicStylable | `DynamicStylable`}, which will ultimately result in `Object.assign(element.style, the_whole_reactive_style)`, during the assignment stage.
 * - `ReactiveStyleProps` will create an underlying {@link ReactiveDynamicStylable | `ReactiveDynamicStylable`}, which will only update the modified property via `element.style.setProperty(the_reactive_style.["changedMember"])`.
*/
type InlineStyleProps = {
	style?: TsignalStyleProps | Accessor<StyleProps> | MaybeAccessor<string>
}

export type DefaultElementProps<
	E extends Element = HTMLElement
> = & InlineStyleProps
	& InlineEventProps
	& InlineMemberProps<E>
	& InlineAttrProps
	& InlineExecuteProps<E>

export type ComponentProps<P, E extends HTMLElement = HTMLElement> = DefaultElementProps<E> & Props<P>

type InlineElementProps_ByHTMLTagName = {
	[TagName in HTMLTagNames]: DefaultElementProps<HTMLElementTagNameMap[TagName]>
}
type IntrinsicHTMLElements = IntrinsicHTMLElements_Factory<
	InlineElementProps_ByHTMLTagName,
	MaybeAccessor<AttrValue>
>

type InlineElementProps_BySVGTagName = {
	[TagName in SVGTagNames]: DefaultElementProps<SVGElementTagNameMap[TagName]>
}
type IntrinsicSVGElements = IntrinsicSVGElements_Factory<
	InlineElementProps_BySVGTagName,
	MaybeAccessor<AttrValue>
>

/** to get JSX highlighting, assuming your source code directory is `/src/`, create the file `/src/jsx.d.ts`, then fill it with the following:
 * 
 * ```ts
 * // path: `/src/jsx.d.ts`
 * export { IntrinsicElements } from "./path/to/this/file.ts"
 * export as namespace JSX
 * ```
*/
export type IntrinsicElements = IntrinsicHTMLElements & IntrinsicSVGElements

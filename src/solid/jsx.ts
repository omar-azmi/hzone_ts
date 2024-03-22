import { HTMLElementUniqueMemberKeys, HTMLEventNames, HTMLTagNames, SVGTagNames } from "../deps.ts"
import { IntrinsicHTMLElements_Factory, IntrinsicSVGElements_Factory } from "../dom_typedefs/mod.ts"
import { ATTRS, AdvancedEventFn, DefaultProps, EVENTS, EventFn, EventProps, ExecuteProp, InlineAttrName, InlineEventName, InlineMemberName, MEMBERS, MemberProps, ONCLEAN, ONINIT, STYLE, StyleProps } from "../props.ts"
import { Stringifiable } from "../typedefs.ts"
import type { Accessor, DynamicStylable, MaybeAccessor } from "./deps.ts"
// import type { TsignalDynamicStylable } from "./styling.ts"


export interface SymbolDefaultProps<ELEM extends Element = Element> extends Omit<DefaultProps, typeof STYLE> {
	[ATTRS]?: { [attribute_name: string]: MaybeAccessor<Stringifiable> }
	[EVENTS]?: EventProps<ELEM>
	[MEMBERS]?: MaybeAccessor<MemberProps<ELEM>>
	/** TODO: no longer fully true. `MaybeAccessor<string>` is not accepted by `[STYLE]`. it only accepts objects now.
	 * note that using `MaybeAccessor<string>` (aka `string | Accessor<string>`), will be re-routed to the element's `"style"` attribute,
	 * and it won't be used for assigning onto the element's `"style"` member.
	 * in other words, depending on what you choose, one of the following will occur:
	 * - `MaybeAccessor<string>` will ultimately lead to `element.setAttribute("style", the_whole_reactive_style)`, during the assignment stage.
	 * - `Accessor<StyleProps>` will create an underlying {@link DynamicStylable | `DynamicStylable`}, which will ultimately result in `Object.assign(element.style, the_whole_reactive_style)`, during the assignment stage.
	 * - `ReactiveStyleProps` will create an underlying {@link TsignalDynamicStylable | `TsignalDynamicStylable`}, which will only update the modified property via `element.style.setProperty(the_reactive_style.["changedMember"])`.
	*/
	[STYLE]?: Accessor<StyleProps>
	[ONINIT]?: ExecuteProp<ELEM>
	[ONCLEAN]?: ExecuteProp<ELEM>
}
export type SymbolComponentProps<P, ELEM extends HTMLElement = HTMLElement> = P & SymbolDefaultProps<ELEM>

export type SymbolIntrinsicHTMLElements = IntrinsicHTMLElements_Factory<{
	[TagName in HTMLTagNames]: SymbolDefaultProps<HTMLElementTagNameMap[TagName]>
}, MaybeAccessor<Stringifiable>>
export type SymbolIntrinsicSVGElements = IntrinsicSVGElements_Factory<{
	[TagName in SVGTagNames]: SymbolDefaultProps<SVGElementTagNameMap[TagName]>
}, MaybeAccessor<Stringifiable>>

/** to get JSX symbol-based highlighting, assuming your source code directory is `/src/`, create the file `/src/jsx.d.ts`, then fill it with the following:
 * 
 * ```ts
 * // path: `/src/jsx.d.ts`
 * export { SymbolIntrinsicElements as IntrinsicElements } from "./path/to/hzone/tsignal/jsx.ts"
 * export as namespace JSX
 * ```
*/
export type SymbolIntrinsicElements = SymbolIntrinsicHTMLElements & SymbolIntrinsicSVGElements


export type InlineAttrProps = Record<InlineAttrName<string>, MaybeAccessor<Stringifiable>>
export type InlineEventProps<ELEM extends Element> = {
	[EventName in HTMLEventNames as InlineEventName<EventName>]?: EventFn<EventName, ELEM> | AdvancedEventFn<EventName, ELEM>
}
export type InlineMemberProps<ELEM extends Element> = {
	[MemberName in HTMLElementUniqueMemberKeys<ELEM> as InlineMemberName<MemberName>]?: MaybeAccessor<ELEM[MemberName]>
}
export type InlineStyleProps = {
	style?: Accessor<StyleProps>
}
export type InlineInitAndCleanProps<ELEM extends Element> = {
	init?: ExecuteProp<ELEM>
	clean?: ExecuteProp<ELEM>
}
export type InlineDefaultProps<ELEM extends Element = HTMLElement> =
	& InlineAttrProps
	& InlineEventProps<ELEM>
	& InlineMemberProps<ELEM>
	& InlineStyleProps
	& InlineInitAndCleanProps<ELEM>
export type InlineComponentProps<P, ELEM extends HTMLElement = HTMLElement> = P & InlineDefaultProps<ELEM>

export type InlineIntrinsicHTMLElements = IntrinsicHTMLElements_Factory<{
	[TagName in HTMLTagNames]: InlineDefaultProps<HTMLElementTagNameMap[TagName]>
}, MaybeAccessor<Stringifiable>>
export type InlineIntrinsicSVGElements = IntrinsicSVGElements_Factory<{
	[TagName in SVGTagNames]: InlineDefaultProps<SVGElementTagNameMap[TagName]>
}, MaybeAccessor<Stringifiable>>

/** to get inline-based JSX highlighting, assuming your source code directory is `/src/`, create the file `/src/jsx.d.ts`, then fill it with the following:
 * 
 * ```ts
 * // path: `/src/jsx.d.ts`
 * export { InlineIntrinsicElements as IntrinsicElements } from "./path/to/hzone/tsignal/jsx.ts"
 * export as namespace JSX
 * ```
*/
export type InlineIntrinsicElements = InlineIntrinsicHTMLElements & InlineIntrinsicSVGElements

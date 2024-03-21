import { HTMLElementUniqueMemberKeys, HTMLEventNames, HTMLTagNames, SVGTagNames } from "../deps.ts"
import { IntrinsicHTMLElements_Factory, IntrinsicSVGElements_Factory } from "../dom_typedefs/mod.ts"
import { ATTRS, AdvancedEventFn, DefaultProps, EVENTS, EventFn, EventProps, ExecuteProp, InlineAttrName, InlineEventName, InlineMemberName, MEMBERS, MemberProps, ONCLEAN, ONINIT, STYLE, StyleProps } from "../props.ts"
import { Stringifiable } from "../typedefs.ts"


export interface SymbolDefaultProps<ELEM extends Element = Element> extends DefaultProps {
	[ATTRS]?: { [attribute_name: string]: Stringifiable }
	[EVENTS]?: EventProps<ELEM>
	[MEMBERS]?: MemberProps<ELEM>
	[STYLE]?: StyleProps
	[ONINIT]?: ExecuteProp<ELEM>
	[ONCLEAN]?: ExecuteProp<ELEM>
}
export type SymbolComponentProps<P, ELEM extends HTMLElement = HTMLElement> = P & SymbolDefaultProps<ELEM>

export type SymbolIntrinsicHTMLElements = IntrinsicHTMLElements_Factory<{
	[TagName in HTMLTagNames]: SymbolDefaultProps<HTMLElementTagNameMap[TagName]>
}, Stringifiable>
export type SymbolIntrinsicSVGElements = IntrinsicSVGElements_Factory<{
	[TagName in SVGTagNames]: SymbolDefaultProps<SVGElementTagNameMap[TagName]>
}, Stringifiable>

/** to get JSX symbol-based highlighting, assuming your source code directory is `/src/`, create the file `/src/jsx.d.ts`, then fill it with the following:
 * 
 * ```ts
 * // path: `/src/jsx.d.ts`
 * export { SymbolIntrinsicElements as IntrinsicElements } from "./path/to/hzone/vanilla/jsx.ts"
 * export as namespace JSX
 * ```
*/
export type SymbolIntrinsicElements = SymbolIntrinsicHTMLElements & SymbolIntrinsicSVGElements


export type InlineAttrProps = Record<InlineAttrName<string>, Stringifiable>
export type InlineEventProps<ELEM extends Element> = {
	[EventName in HTMLEventNames as InlineEventName<EventName>]?: EventFn<EventName, ELEM> | AdvancedEventFn<EventName, ELEM>
}
export type InlineMemberProps<ELEM extends Element> = {
	[MemberName in HTMLElementUniqueMemberKeys<ELEM> as InlineMemberName<MemberName>]?: ELEM[MemberName]
}
export type InlineStyleProps = {
	style?: StyleProps
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
}, Stringifiable>
export type InlineIntrinsicSVGElements = IntrinsicSVGElements_Factory<{
	[TagName in SVGTagNames]: InlineDefaultProps<SVGElementTagNameMap[TagName]>
}, Stringifiable>

/** to get inline-based JSX highlighting, assuming your source code directory is `/src/`, create the file `/src/jsx.d.ts`, then fill it with the following:
 * 
 * ```ts
 * // path: `/src/jsx.d.ts`
 * export { InlineIntrinsicElements as IntrinsicElements } from "./path/to/hzone/vanilla/jsx.ts"
 * export as namespace JSX
 * ```
*/
export type InlineIntrinsicElements = InlineIntrinsicHTMLElements & InlineIntrinsicSVGElements



// attribute comparison:
// TODO: make it part of this module's documentation comment, in order to show how two similar props can be represented under the two variants of the props systems.
/*
const my_inline_props: InlineComponentProps<{}, HTMLButtonElement> = {
	"attr:data-aria-kill-yourself": "4ryyl",
	"on:mouseleave": (evt) => { },
	"on:click": [(evt) => { }, { once: true }],
	"set:disabled": false,
	style: {
		"--my-theme": "black",
		backgroundColor: "var(--my-theme)",
	},
}

const my_symbol_props: SymbolComponentProps<{}, HTMLButtonElement> = {
	[ATTRS]: { "data-aria-kill-yourself": "4ryyl" },
	[EVENTS]: {
		mouseleave(evt) { },
		click: [(evt) => { }, { once: true }]
	},
	[MEMBERS]: { disabled: true },
	[STYLE]: {
		"--my-theme": "black",
		backgroundColor: "var(--my-theme)",
	},
}
*/

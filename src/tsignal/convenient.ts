import type { DynamicStylable } from "../core/styling.ts"
import type { EventFn, StyleProps } from "../typedefs.ts"
import type { HTMLElementUniqueMembers, MaybeAccessor, ReactiveStyleProps } from "./deps.ts"
import { Accessor } from "./deps.ts"
import type { ReactiveDynamicStylable } from "./styling.ts"


export type ConvenientEventProps = {
	[NAME in keyof HTMLElementEventMap as `on:${NAME}`]?: EventFn<NAME>
}

export type ConvenientMemberProps<E extends HTMLElement> = {
	[KEY in keyof HTMLElementUniqueMembers<E> as (KEY extends string ? `let:${KEY}` : never)]?: MaybeAccessor<E[KEY]>
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
	style: ReactiveStyleProps | Accessor<StyleProps> | MaybeAccessor<string>
}

// type AttributeKey = string
export type ReactiveHTMLElementProps<
	E extends HTMLElement = HTMLElement
> = ConvenientStyleProps & ConvenientEventProps & ConvenientMemberProps<E>

// {
// 	[key: AttributeKey]: MaybeAccessor<AttrValue>
// }

// const a: ReactiveHTMLElementProps<HTMLInputElement> = {
// 	"on:submit": () => { },
// 	"let:valueAsNumber": 22,
// 	style: {
// 		"--var": "color"
// 	}
// }


/** hyperscript renderer for vanilla javascript. <br>
 * 
 * @example
 * ```tsx
 * // \@jsx h
 * // \@jsxFrag Fragment
 * 
 * import { InlineHyperZone } from "jsr:@oazmi/hzone"
 * import { VanillaFragmentRender, VanillaHTMLRender } from "jsr:@oazmi/hzone/vanilla"
 * 
 * const fragment_renderer = new VanillaFragmentRender()
 * const html_renderer = new VanillaHTMLRender()
 * const { h, Fragment } = InlineHyperZone.create({ default: [html_renderer, fragment_renderer] })
 * 
 * const span_element_1 = <span>
 * 	this button logs only once, <br />
 * 	and then turns red, <br />
 * 	in addition to becoming disabled.
 * </span>
 * const span_element_2 = <span>
 * 	fills you with solid determination
 * </span>
 * let my_button_is_disabled = false
 * 
 * const my_button = <button
 * 	style={{ backgroundColor: "green" }}
 * 	set:disabled={my_button_is_disabled}
 * 	on:click={[(mouse_event) => {
 * 		const the_button = mouse_event.currentTarget as HTMLButtonElement
 * 		console.log("you clicked the button")
 * 		my_button_is_disabled = true
 * 		the_button.style.backgroundColor = "red"
 * 		the_button.disabled = my_button_is_disabled
 * 		span_element_1.innerHTML = "WHY'D YOU CLICK THE BUTTON??."
 * 		span_element_2.innerHTML = "has left you in shambles."
 * 	}, { once: true }]}
 * >
 * 	{span_element_1}
 * 	<br />
 * 	<span>your temptation to click the button </span>
 * 	{span_element_2}
 * </button>
 * 
 * document.body.append(my_button)
 * ```
 * 
 * @module
*/

export type {
	InlineIntrinsicElements,
	SymbolIntrinsicElements,
	SymbolComponentProps as VanillaComponentProps,
	InlineComponentProps as VanillaInlineComponentProps
} from "./jsx.ts"
export {
	VanillaComponentRender,
	VanillaFragmentRender,
	VanillaHTMLRender,
	VanillaSVGRender,
	VanillaTemplateRender
} from "./renderers.ts"
export type { TemplateProps } from "./renderers.ts"
export { DynamicStylable, DynamicStyleSheet } from "./styling.ts"


/** hyperscript renderer for [Tsignal](https://github.com/omar-azmi/tsignal_ts). <br>
 * 
 * @example
 * ```tsx
 * // \@jsx h
 * // \@jsxFrag Fragment
 * 
 * import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
 * import { InlineHyperZone } from "jsr:@oazmi/hzone"
 * import { TsignalFragmentRender, TsignalHTMLRender } from "jsr:@oazmi/hzone/tsignal"
 * 
 * const
 * 	ctx = new Context,
 * 	createState = ctx.addClass(StateSignal_Factory),
 * 	createMemo = ctx.addClass(MemoSignal_Factory)
 * 
 * const fragment_renderer = new TsignalFragmentRender({ ctx })
 * const html_renderer = new TsignalHTMLRender({ ctx })
 * const { h, Fragment } = InlineHyperZone.create({ default: [html_renderer, fragment_renderer] })
 * const [, getMyButtonIsDisabled, setMyButtonIsDisabled] = createState(false)
 * 
 * const my_button = <button
 * 	style={{ backgroundColor: createMemo((id) => getMyButtonIsDisabled(id) ? "red" : "green", { defer: false })[1] }}
 * 	set:disabled={getMyButtonIsDisabled}
 * 	on:click={[(mouse_event) => {
 * 		console.log("you clicked the button")
 * 		setMyButtonIsDisabled(true)
 * 	}, { once: true }]}
 * >
 * 	<span
 * 		set:innerHTML={createMemo((id) => {
 * 			return getMyButtonIsDisabled(id)
 * 				? "WHY'D YOU CLICK THE BUTTON??."
 * 				: `this button logs only once, <br />
 * 				and then turns red, <br />
 * 				in addition to becoming disabled.
 * 				`.replaceAll(/\s+/g, " ")
 * 		}, { defer: false })[1]}
 * 	></span>
 * 	<br />
 * 	<span>your temptation to click the button </span>
 * 	{createMemo(
 * 		(id) => (getMyButtonIsDisabled(id)
 * 			? "has left you in shambles."
 * 			: "fills you with solid determination."
 * 		), { defer: false }
 * 	)[1]}
 * </button>
 * 
 * document.body.append(my_button)
 * ```
 * 
 * @module
*/

export type { Accessor, MaybeAccessor, TsignalStyleProps } from "./deps.ts"
export type {
	InlineIntrinsicElements,
	SymbolIntrinsicElements,
	SymbolComponentProps as TsignalComponentProps,
	InlineComponentProps as TsignalInlineComponentProps
} from "./jsx.ts"
export {
	TsignalComponentRender,
	TsignalFragmentRender,
	TsignalHTMLRender,
	TsignalSVGRender
} from "./renderers.ts"
export { TsignalDynamicStylable } from "./styling.ts"


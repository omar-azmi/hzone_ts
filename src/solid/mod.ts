/** experimental hyperscript renderer for [SolidJS](https://github.com/solidjs/solid). <br>
 * this will allow you to omit the need for using `npm:solid-js/web` or `npm:solid-js/h` for rendering. <br>
 * moreover, this renderer does not import any part of SolidJS - you will have to plugin your version's `createEffect`
 * into the constructor of `SolidComponentRender` and its subclasses.
 * (or define a default `config["solid"]["createEffect"]` inside of your `HyperZone`'s config, and then pass the HyperZone to the constructor.)
 * 
 * @example
 * ```tsx
 * // \@jsx h
 * // \@jsxFrag Fragment
 * 
 * import { createEffect, createSignal } from "npm:solid-js"
 * import { InlineHyperZone } from "jsr:@oazmi/hzone"
 * import { SolidFragmentRender, SolidHTMLRender } from "jsr:@oazmi/hzone/solid"
 * 
 * const fragment_renderer = new SolidFragmentRender({ createEffect })
 * const html_renderer = new SolidHTMLRender({ createEffect })
 * const { h, Fragment } = InlineHyperZone.create({ default: [html_renderer, fragment_renderer] })
 * const [getMyButtonIsDisabled, setMyButtonIsDisabled] = createSignal(false)
 * 
 * const my_button = <button
 * 	style={{ backgroundColor: "green" }}
 * 	set:disabled={getMyButtonIsDisabled}
 * 	on:click={[(mouse_event) => {
 * 		const the_button = mouse_event.currentTarget as HTMLButtonElement
 * 		console.log("you clicked the button")
 * 		setMyButtonIsDisabled(true)
 * 		the_button.style.backgroundColor = "red"
 * 	}, { once: true }]}
 * >
 * 	<span
 * 		set:innerHTML={createMemo(() => {
 * 			return getMyButtonIsDisabled()
 * 				? "WHY'D YOU CLICK THE BUTTON??."
 * 				: `this button logs only once, <br />
 * 				and then turns red, <br />
 * 				in addition to becoming disabled.
 * 				`.replaceAll(/\s+/g, " ")
 * 		})}
 * 	></span>
 * 	<br />
 * 	<span>your temptation to click the button </span>
 * 	{createMemo(() => getMyButtonIsDisabled()
 * 		? "has left you in shambles."
 * 		: "fills you with solid determination."
 * 	)}
 * </button>
 * 
 * document.body.append(my_button)
 * ```
 * 
 * @module
*/

export type { Accessor, MaybeAccessor } from "./deps.ts"
export type {
	InlineIntrinsicElements,
	SymbolComponentProps as SolidComponentProps,
	InlineComponentProps as SolidInlineComponentProps,
	SymbolIntrinsicElements
} from "./jsx.ts"
export {
	SolidComponentRender,
	SolidFragmentRender,
	SolidHTMLRender,
	SolidSVGRender
} from "./renderers.ts"
// export { TsignalDynamicStylable } from "./styling.ts"

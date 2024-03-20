import { SymbolComponentProps } from "./jsx.ts"
export type { Accessor, MaybeAccessor, TsignalStyleProps } from "./deps.ts"
export type { InlineIntrinsicElements, SymbolIntrinsicElements } from "./jsx.ts"
export {
	TsignalComponentRender,
	TsignalFragmentRender,
	TsignalHTMLRender,
	TsignalSVGRender
} from "./renderers.ts"
export { ReactiveDynamicStylable } from "./styling.ts"
export type TsignalComponentProps<P, ELEM extends HTMLElement = HTMLElement> = SymbolComponentProps<P, ELEM>


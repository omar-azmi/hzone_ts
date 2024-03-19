import { ComponentProps } from "./jsx.ts"
export type { Accessor, MaybeAccessor, TsignalStyleProps } from "./deps.ts"
export type { IntrinsicElements } from "./jsx.ts"
export {
	TsignalComponentRender,
	TsignalFragmentRender,
	TsignalHTMLRender,
	TsignalSVGRender
} from "./renderers.ts"
export { ReactiveDynamicStylable } from "./styling.ts"
export type ReactiveComponentProps<P, E extends HTMLElement = HTMLElement> = ComponentProps<P, E>


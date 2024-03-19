import { ComponentProps } from "./jsx.ts"
export type ReactiveComponentProps<P, E extends HTMLElement = HTMLElement> = ComponentProps<P, E>
export type { IntrinsicElements } from "./jsx.ts"
export {
	ConvenientReactiveComponent_Render_Factory,
	ConvenientReactiveFragment_Render_Factory,
	ConvenientReactiveHTMLElement_Render_Factory,
	ConvenientReactiveSVGElement_Render_Factory
} from "./renderers.ts"


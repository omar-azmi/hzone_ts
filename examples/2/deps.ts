/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { bindMethodToSelfByName, object_entries } from "../../src/deps.ts"
import { HyperScope } from "../../src/mod.ts"
import { ReactiveComponent_Render_Factory, ReactiveFragment_Render_Factory, ReactiveHTMLElement_Render_Factory, ReactiveSVGElement_Render_Factory } from "../../src/signal.ts"
export { throttlingEquals } from "jsr:@oazmi/tsignal"
export type { Accessor, Setter } from "jsr:@oazmi/tsignal"
export { Fragment } from "../../src/mod.ts"


export const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory)

const
	fragment_renderer = new (ReactiveFragment_Render_Factory(ctx))("reactive fragment component jsx renderer"),
	component_renderer = new (ReactiveComponent_Render_Factory(ctx))("reactive component jsx renderer"),
	html_renderer = new (ReactiveHTMLElement_Render_Factory(ctx))("reactive html jsx renderer")

const hyperscope = new HyperScope(
	html_renderer,
	component_renderer,
	fragment_renderer,
)

const svg_renderer = hyperscope.addClass(ReactiveSVGElement_Render_Factory(ctx), "reactive svg jsx renderer")

export const
	HTML_SCOPE = html_renderer.kind,
	COMP_SCOPE = component_renderer.kind,
	FRAG_SCOPE = fragment_renderer.kind,
	SVG_SCOPE = svg_renderer.kind

export const h = bindMethodToSelfByName(hyperscope, "h")
export const { pushScope, popScope } = hyperscope

export const object_to_css_inline_style = (style: Record<string, string> = {}): string => {
	return object_entries(style)
		.map(([key, value]) => `${key}:${value}`)
		.join(';')
}

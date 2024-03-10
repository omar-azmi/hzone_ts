/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { bindMethodToSelfByName, object_entries } from "../../src/deps.ts"
import { HyperZone } from "../../src/hyperzone.ts"
import { ReactiveComponent_Render_Factory, ReactiveFragment_Render_Factory, ReactiveHTMLElement_Render_Factory, ReactiveSVGElement_Render_Factory } from "../../src/tsignal/mod.ts"
export { throttlingEquals } from "jsr:@oazmi/tsignal"
export type { Accessor, Setter } from "jsr:@oazmi/tsignal"
export { Fragment } from "../../src/core/mod.ts"
export { ATTRS } from "../../src/typedefs.ts"
export type { ComponentGenerator, FragmentComponentGenerator } from "../../src/typedefs.ts"


export const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory)

const
	fragment_renderer = new (ReactiveFragment_Render_Factory(ctx))("reactive fragment component jsx renderer"),
	component_renderer = new (ReactiveComponent_Render_Factory(ctx))("reactive component jsx renderer"),
	html_renderer = new (ReactiveHTMLElement_Render_Factory(ctx))("reactive html jsx renderer")

const hyperzone = new HyperZone(
	html_renderer,
	component_renderer,
	fragment_renderer,
)

const svg_renderer = hyperzone.addClass(ReactiveSVGElement_Render_Factory(ctx), "reactive svg jsx renderer")

export const
	HTML_ZONE = html_renderer.kind,
	COMP_ZONE = component_renderer.kind,
	FRAG_ZONE = fragment_renderer.kind,
	SVG_ZONE = svg_renderer.kind

export const h = bindMethodToSelfByName(hyperzone, "h")
export const { pushZone, popZone } = hyperzone

export const object_to_css_inline_style = (style: Record<string, string> = {}): string => {
	return object_entries(style)
		.map(([key, value]) => `${key}:${value}`)
		.join(';')
}

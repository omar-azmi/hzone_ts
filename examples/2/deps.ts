/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { object_entries } from "../../src/deps.ts"
import { HyperZone } from "../../src/mod.ts"
import { ReactiveComponent_Render_Factory, ReactiveFragment_Render_Factory, ReactiveHTMLElement_Render_Factory, ReactiveSVGElement_Render_Factory } from "../../src/tsignal_base/mod.ts"
export { throttlingEquals } from "jsr:@oazmi/tsignal"
export type { Accessor, Setter } from "jsr:@oazmi/tsignal"
export { ATTRS } from "../../src/mod.ts"
export type { AttrProps, ComponentGenerator, FragmentComponentGenerator } from "../../src/mod.ts"


export const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory)

export const
	fragment_renderer = new (ReactiveFragment_Render_Factory(ctx))(),
	component_renderer = new (ReactiveComponent_Render_Factory(ctx))(),
	html_renderer = new (ReactiveHTMLElement_Render_Factory(ctx))(),
	svg_renderer = new (ReactiveSVGElement_Render_Factory(ctx))()

export const { h, Fragment, pushZone, popZone, } = HyperZone.create(
	html_renderer,
	component_renderer,
	fragment_renderer,
)

export const object_to_css_inline_style = (style: Record<string, string> = {}): string => {
	return object_entries(style)
		.map(([key, value]) => `${key}:${value}`)
		.join(';')
}

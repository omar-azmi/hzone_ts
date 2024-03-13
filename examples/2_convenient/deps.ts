/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { HyperZone } from "../../src/mod.ts"
import { ConvenientReactiveComponent_Render_Factory, ConvenientReactiveFragment_Render_Factory, ConvenientReactiveHTMLElement_Render_Factory, ConvenientReactiveSVGElement_Render_Factory } from "../../src/tsignal/convenient.ts"
export { throttlingEquals } from "jsr:@oazmi/tsignal"
export type { Accessor, Setter } from "jsr:@oazmi/tsignal"
export type { ComponentGenerator, FragmentComponentGenerator } from "../../src/mod.ts"
export type { ReactiveComponentProps } from "../../src/tsignal/convenient.ts"

export const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory)

export const
	fragment_renderer = new (ConvenientReactiveFragment_Render_Factory(ctx))(),
	component_renderer = new (ConvenientReactiveComponent_Render_Factory(ctx))(),
	html_renderer = new (ConvenientReactiveHTMLElement_Render_Factory(ctx))(),
	svg_renderer = new (ConvenientReactiveSVGElement_Render_Factory(ctx))()

export const { h, Fragment, pushZone, popZone, } = HyperZone.create(
	html_renderer,
	component_renderer,
	fragment_renderer,
)

import type { Fragment } from "./core/mod.ts"
import { ConstructorOf, DEBUG, bind_array_pop, bind_array_push, bind_map_get, bind_stack_seek, console_error } from "./deps.ts"
import { HyperRender, RenderKind } from "./typedefs.ts"


type HyperZoneChild = typeof PushZone | typeof PopZone | Node
type HyperZoneChildren = (HyperZoneChild | Array<HyperZoneChild>)[]

const
	PushZone = Symbol(DEBUG.MINIFY || "pushed a zone"),
	PopZone = Symbol(DEBUG.MINIFY || "popped a zone"),
	node_only_child_filter = (child: symbol | Node) => (typeof child !== "symbol")

export class HyperZone extends HyperRender<any, any> {
	protected renderers: Map<RenderKind, HyperRender> = new Map()

	pushZone: (...renderers: RenderKind[]) => typeof PushZone
	popZone: () => typeof PopZone
	seekZone: () => HyperRender[]

	constructor(...default_zone: HyperRender[]) {
		super("hyperzone rederer")
		default_zone.forEach((renderer) => { this.addRenderer(renderer) })
		const
			zone_stack: Array<HyperRender[]> = [],
			zone_stack_push = bind_array_push(zone_stack),
			zone_stack_pop = bind_array_pop(zone_stack),
			zone_stack_seek = bind_stack_seek(zone_stack),
			all_renderers_map_get = bind_map_get(this.renderers)
		this.pushZone = (...renderers: RenderKind[]): typeof PushZone => {
			zone_stack_push(renderers.map((renderer) => all_renderers_map_get(renderer)!))
			return PushZone
		}
		this.popZone = (): typeof PopZone => {
			zone_stack_pop()
			return PopZone
		}
		this.seekZone = (): HyperRender[] => {
			return zone_stack_seek() ?? default_zone
		}
	}

	addClass<CLS extends ConstructorOf<HyperRender, ARGS>, ARGS extends any[]>(renderer_class: CLS, ...args: ARGS): InstanceType<CLS> {
		const renderer = new renderer_class(...args)
		this.addRenderer(renderer)
		return renderer as any
	}

	addRenderer<R extends HyperRender>(renderer: R) {
		this.renderers.set(renderer.kind, renderer)
	}

	test(tag: any, props?: any): boolean {
		for (const renderer of this.seekZone()) {
			if (renderer.test(tag, props)) {
				return true
			}
		}
		return false
	}

	h(tag: typeof Fragment, props: null, ...children: HyperZoneChildren): Element[]
	h(tag: any, props: any, ...children: HyperZoneChildren): Element
	h(tag: any, props: any, ...children: HyperZoneChildren): undefined | Element | Element[] {
		for (const renderer of this.seekZone()) {
			if (renderer === undefined) {
				console_error(DEBUG.ERROR && "supposed renderer was not registered (its kind symbol is not registered)")
			}
			if (renderer.test(tag, props)) {
				const flat_children = children.flat(1).filter(node_only_child_filter)
				return renderer.h(tag, props, ...flat_children)
			}
		}
		console_error(DEBUG.ERROR && "failed to capture an appropriate renderer for tag:", tag)
	}
}

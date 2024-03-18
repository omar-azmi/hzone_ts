import { DEBUG, console_error } from "./deps.ts"
import type { Context } from "./tsignal_base/deps.ts"
import { Fragment, HyperRender } from "./typedefs.ts"


type HyperZoneChild = typeof PushZone | typeof PopZone | Node
type HyperZoneChildren = (HyperZoneChild | Array<HyperZoneChild>)[]
// type RenderGroupLibraries = "vanilla" | "tsignal" | "react" | "solid"
export interface HyperZoneContext {
	vanilla?: undefined
	tsignal?: { ctx: Context }
	react?: { createElement: any }
}

const
	PushZone = Symbol(DEBUG.MINIFY || "pushed a zone"),
	PopZone = Symbol(DEBUG.MINIFY || "popped a zone"),
	node_only_child_filter = (child: symbol | Node) => (typeof child !== "symbol")

export class HyperZone extends HyperRender<any, any> {
	public ctx: HyperZoneContext = {}
	protected zones: Array<HyperRender[]> = []

	constructor(...default_zone: HyperRender[]) {
		super()
		this.pushZone(...default_zone)
	}

	pushZone(...renderers: HyperRender[]): typeof PushZone {
		this.zones.push(renderers)
		return PushZone
	}
	popZone(): typeof PopZone {
		const zones = this.zones
		if (zones.length > 1) { zones.pop() }
		return PopZone
	}
	seekZone(): HyperRender[] {
		return this.zones.at(-1)!
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

	static create(...default_zone: HyperRender[]): ({
		h: HyperZone["h"]
		Fragment: typeof Fragment
		pushZone: HyperZone["pushZone"]
		popZone: HyperZone["popZone"]
	}) {
		const new_hyperzone = new this(...default_zone)
		return {
			h: new_hyperzone.bindMethod("h"),
			Fragment,
			pushZone: new_hyperzone.bindMethod("pushZone"),
			popZone: new_hyperzone.bindMethod("popZone"),
		}
	}
}

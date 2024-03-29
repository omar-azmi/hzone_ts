import type { HyperZoneConfigs, hzone_Config } from "../configs.ts"
import { DEBUG, console_error } from "../deps.ts"
import { DefaultProps, InlineDefaultProps, inlinePropsRemapper } from "../props.ts"
import { Fragment, HyperRender } from "../typedefs.ts"


type HyperZoneChild = typeof PushZone | typeof PopZone | Node
type HyperZoneChildren = (HyperZoneChild | Array<HyperZoneChild>)[]

const
	PushZone = Symbol(DEBUG.MINIFY || "pushed a zone"),
	PopZone = Symbol(DEBUG.MINIFY || "popped a zone"),
	node_only_child_filter = (child: symbol | Node) => (typeof child !== "symbol")


/** allows you to create a composite renderer that conditionally executes whichever renderer (in the current zone)
 * that passes the {@link HyperRender.test | `HyperRender.test(tag, props)`} method first. <br>
 * to move to a new zone of renderers, simply call the {@link pushZone | `pushZone`} method with the new renderers as the arguments. <br>
 * and once you are done with that collection of renderers, call {@link popZone | `popZone`} to move back to your previous zone.
 * (think of it like a stack).
*/
export class HyperZone extends HyperRender<any, any> {
	protected zones: Array<HyperRender[]> = []
	public configs: HyperZoneConfigs = {}

	constructor(config?: hzone_Config) {
		super()
		this.setDefaultZone(...(config?.default ?? []))
	}

	setDefaultZone(...default_zone: HyperRender[]) {
		this.zones[0] = default_zone
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

	static create(config?: hzone_Config): ({
		h: HyperZone["h"],
		Fragment: typeof Fragment,
		setDefaultZone: HyperZone["setDefaultZone"],
		pushZone: HyperZone["pushZone"],
		popZone: HyperZone["popZone"],
	}) {
		const new_hyperzone = new this(config)
		return {
			h: new_hyperzone.bindMethod("h"),
			Fragment,
			setDefaultZone: new_hyperzone.bindMethod("setDefaultZone"),
			pushZone: new_hyperzone.bindMethod("pushZone"),
			popZone: new_hyperzone.bindMethod("popZone"),
		}
	}
}

/** a subclass of {@link HyperZone | `HyperZone`}, which allows for the use of {@link InlineDefaultProps | inlined standard props},
 * instead of using the less friendly {@link DefaultProps | symbolic standard props}. <br>
 * this subclass simply remapps the inlined props into their symbolic version, and passes the output to the super class.
 * 
 * ### comparison:
 * 
 * #### inline:
 * ```tsx
 * <div
 *     some-attr="abc"
 *     some-other-attr="abc"
 *     on:click={(event) => {
 *         console.log("div clicked")
 *     }}
 * ></div>
 * ```
 * 
 * #### symbolic:
 * ```tsx
 * <div
 *     some-attr="abc"
 *     some-other-attr="abc"
 *     {...{ [EVENTS]: {
 *         click: (event) => {
 *             console.log("div clicked")
 *         }
 *     }}}
 * ></div>
 * ```
 * 
 * #### difference:
 * ```diff
 * <div
 *     some-attr="abc"
 *     some-other-attr="abc"
 * -   {...{ [EVENTS]: {
 * -   click:
 * +   on:click={
 *         (event) => {
 *             console.log("div clicked")
 *         }
 * +   }
 * -   }}}
 * ></div>
 * ```
*/
export class InlineHyperZone extends HyperZone {
	h(tag: typeof Fragment, props: null, ...children: HyperZoneChildren): Element[]
	h(tag: any, props: any, ...children: HyperZoneChildren): Element
	h(tag: any, props: any, ...children: HyperZoneChildren): Element | Element[] | undefined {
		return super.h(tag, inlinePropsRemapper(props), ...children)
	}
}

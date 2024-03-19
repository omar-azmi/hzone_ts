import { isFunction } from "../deps.ts"
import { normalizeAttrProps, stringify, stringifyAttrValue } from "../funcdefs.ts"
import { HyperZone } from "../hyperzone.ts"
import { AttrValue, ComponentGenerator, Fragment, Props, Stylable, StyleProps, TextValue } from "../typedefs.ts"
import { Accessor, Context, CreateEffect, DynamicStylable, EffectSignal_Factory, FragmentTagComponent, HTMLTagComponent, MaybeAccessor, TsignalStyleProps, SVGTagComponent, VanillaComponentRender } from "./deps.ts"
import { ReactiveDynamicStylable } from "./styling.ts"


const
	isAccessor_AttrValue = isFunction as ((obj: any) => obj is Accessor<AttrValue>),
	isAccessor_TextValue = isFunction as ((obj: any) => obj is Accessor<TextValue>),
	isAccessor_MemberValue = isFunction as ((obj: any) => obj is Accessor<any>)


export interface ComponentRenderConfig {
	ctx?: Context
}

export class TsignalComponentRender<G extends ComponentGenerator = ComponentGenerator> extends VanillaComponentRender<G> {
	public ctx: Context
	protected createEffect: CreateEffect

	constructor(hyperzone_renderer?: HyperZone)
	constructor(config?: ComponentRenderConfig)
	constructor(config?: HyperZone | ComponentRenderConfig) {
		super()
		const
			config_is_hyperzone = config instanceof HyperZone,
			signal_ctx: Context = (config_is_hyperzone
				? config.configs.tsignal?.ctx
				: config?.ctx) ?? new Context()
		if (config instanceof HyperZone) {
			(config.configs.tsignal ??= {}).ctx = signal_ctx
		}
		this.createEffect = signal_ctx.addClass(EffectSignal_Factory)
		this.ctx = signal_ctx
	}

	protected addAttr(element: Element, attribute_node: Attr, attribute_value?: MaybeAccessor<AttrValue>): Attr
	protected addAttr(element: Element, attribute_name: string, attribute_value?: MaybeAccessor<AttrValue>): Attr
	protected addAttr(element: Element, attribute: Attr | string, value?: MaybeAccessor<AttrValue>): Attr {
		const
			value_is_accessor = isAccessor_AttrValue(value),
			initial_value = value_is_accessor ? value() : value
		const attr = super.addAttr(element, attribute as any, initial_value)
		if (value_is_accessor) {
			this.createEffect((id) => {
				const
					old_value = attr.nodeValue,
					new_value = stringifyAttrValue(value(id)),
					value_has_changed = new_value !== old_value
				if (value_has_changed || id) {
					if (!new_value) {
						// the attribute must be detached from its current parent (`ownerElement`), as its value has changed to `null`.
						(attr.ownerElement ?? element).removeAttributeNode(attr)
					} else if (!old_value) {
						// the attribute must be rettached, as its value is no longer a `null`.
						// but we also make sure that the attribute node does not already have a parent.
						// TODO: consider the consequences of not reattaching attribute if it already has a parent,
						//       instead of kicking it out of its current parent, and appending it to the original `element` parent.
						attr.nodeValue = new_value
						element.setAttributeNode(attr)
					}
					attr.nodeValue = new_value
				}
				return !value_has_changed
			}, { defer: false })
		}
		return attr
	}

	protected setMember<E = Element>(element: E, key: keyof E, value: MaybeAccessor<E[keyof E]>): void {
		const
			value_is_accessor = isAccessor_MemberValue(value),
			initial_value = value_is_accessor ? value() : value
		super.setMember(element, key, initial_value)
		if (value_is_accessor) {
			this.createEffect((id) => {
				const
					old_value = element[key],
					new_value = value(id),
					value_has_changed = new_value !== old_value
				if (value_has_changed || id) {
					// we make a comparison between the old and the new values because certain member value assignments are expensive.
					// for example, each `HTMLInputElement.value` assignment creates a "dead" node in the memory.
					// you can witness it yourself in `/examples/3/`, whereby if you open devtools and head over to "Performance monitor".
					// you'll see the number of "DOM Nodes" gradually increase up to additional 800 nodes, until the garbage-collections kicks in,
					// and kills the additional 800 nodes. and the process then repeats. but if you disable the input element's value modifying signal,
					// then there won't be any increase in the number of "DOM Nodes" over time.
					element[key] = new_value
				}
				return !value_has_changed
			}, { defer: false })
		}
	}

	protected setStyle(element: Stylable, style: TsignalStyleProps | MaybeAccessor<StyleProps>): DynamicStylable {
		const
			style_is_accessor = isFunction(style),
			dynamic_stylable = style_is_accessor
				? new DynamicStylable(element)
				: new ReactiveDynamicStylable(this.createEffect, element)
		if (style_is_accessor) {
			this.createEffect((id) => { dynamic_stylable.setStyle(style(id)) }, { defer: false })
		} else {
			(dynamic_stylable as ReactiveDynamicStylable).setStyle(style as TsignalStyleProps)
		}
		return dynamic_stylable
	}

	protected processChild(child: MaybeAccessor<TextValue> | Node): string | Node {
		if (isAccessor_TextValue(child)) {
			const text = document.createTextNode("")
			this.createEffect((id) => {
				const
					old_value = text.nodeValue,
					new_value = child(id)
				text.nodeValue = stringify(new_value)
				return new_value === old_value
			}, { defer: false })
			return text
		}
		return child instanceof Node ? child : stringify(child) ?? ""
	}
}

export class TsignalHTMLRender extends TsignalComponentRender<typeof HTMLTagComponent> {
	test(tag: any, props?: any): boolean { return typeof tag === "string" }

	// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
	h<TAG extends keyof HTMLElementTagNameMap>(tag: TAG, props?: null | Props<AttrProps>, ...children: (string | Node)[]): HTMLElementTagNameMap[TAG] {
		return super.h(HTMLTagComponent, { tag, ...normalizeAttrProps(props) }, ...children) as HTMLElementTagNameMap[TAG]
	}
}

/**
 * > [!IMPORTANT]
 * > note that svg attributes are case sensitive, most notably the "viewBox" and "preserveAspectRatio" attributes must have the exact casing.
*/
export class TsignalSVGRender extends TsignalComponentRender<typeof SVGTagComponent> {
	test(tag: any, props?: any): boolean { return typeof tag === "string" }

	// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
	h<TAG extends keyof SVGElementTagNameMap>(tag: TAG, props?: null | Props<AttrProps>, ...children: (string | Node)[]): SVGElementTagNameMap[TAG] {
		return super.h(SVGTagComponent, { tag, ...normalizeAttrProps(props) }, ...children) as SVGElementTagNameMap[TAG]
	}
}

export class TsignalFragmentRender extends TsignalComponentRender {
	test(tag: any, props?: any): boolean { return tag === Fragment }

	// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: Fragment` as the first argument instead of `component: ComponentGenerator`
	h(tag: Fragment, props?: null, ...children: (string | Node)[]): Element[] {
		return super.h(FragmentTagComponent, {}, ...children)
	}
}

import { Accessor, Context, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
import { Component_Render, Fragment, FragmentTagComponent, HTMLTagComponent, SVGTagComponent } from "../core/renderers.ts"
import { isFunction } from "../deps.ts"
import { normalizeAttrProps, stringify, stringifyAttrValue } from "../funcdefs.ts"
import { AttrValue, ComponentGenerator, Props, TextValue } from "../typedefs.ts"


export type MaybeAccessor<T> = T | Accessor<T>
const
	isAccessor_AttrValue = isFunction as ((obj: any) => obj is Accessor<AttrValue>),
	isAccessor_TextValue = isFunction as ((obj: any) => obj is Accessor<TextValue>)


export const ReactiveComponent_Render_Factory = (ctx: Context) => {
	const createEffect = ctx.addClass(EffectSignal_Factory)

	return class ReactiveComponent_Render<G extends ComponentGenerator = ComponentGenerator> extends Component_Render<G> {
		protected addAttr(element: Element, attribute_node: Attr, attribute_value?: MaybeAccessor<AttrValue>): Attr
		protected addAttr(element: Element, attribute_name: string, attribute_value?: MaybeAccessor<AttrValue>): Attr
		protected addAttr(element: Element, attribute: Attr | string, value?: MaybeAccessor<AttrValue>): Attr {
			const
				value_is_accessor = isAccessor_AttrValue(value),
				initial_value = value_is_accessor ? value() : value
			const attr = super.addAttr(element, attribute as any, initial_value)
			if (value_is_accessor) {
				createEffect((id) => {
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

		protected processChild(child: MaybeAccessor<TextValue> | Node): string | Node {
			if (isAccessor_TextValue(child)) {
				const text = document.createTextNode("")
				createEffect((id) => {
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
}

export const ReactiveHTMLElement_Render_Factory = (ctx: Context) => {
	return class ReactiveHTMLElement_Render extends ReactiveComponent_Render_Factory(ctx)<typeof HTMLTagComponent> {
		test(tag: any, props?: any): boolean { return typeof tag === "string" }

		// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
		h<TAG extends keyof HTMLElementTagNameMap>(tag: TAG, props?: null | Props<AttrProps>, ...children: (string | Node)[]): HTMLElementTagNameMap[TAG] {
			return super.h(HTMLTagComponent, { tag, ...normalizeAttrProps(props) }, ...children) as HTMLElementTagNameMap[TAG]
		}
	}
}

/**
 * > [!IMPORTANT]
 * > note that svg attributes are case sensitive, most notably the "viewBox" and "preserveAspectRatio" attributes must have the exact casing.
*/
export const ReactiveSVGElement_Render_Factory = (ctx: Context) => {
	return class ReactiveSVGElement_Render extends ReactiveComponent_Render_Factory(ctx)<typeof SVGTagComponent> {
		test(tag: any, props?: any): boolean { return typeof tag === "string" }

		// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
		h<TAG extends keyof SVGElementTagNameMap>(tag: TAG, props?: null | Props<AttrProps>, ...children: (string | Node)[]): SVGElementTagNameMap[TAG] {
			return super.h(SVGTagComponent, { tag, ...normalizeAttrProps(props) }, ...children) as SVGElementTagNameMap[TAG]
		}
	}
}

export const ReactiveFragment_Render_Factory = (ctx: Context) => {
	return class ReactiveFragment_Render extends ReactiveComponent_Render_Factory(ctx) {
		test(tag: any, props?: any): boolean { return tag === Fragment }

		// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: Fragment` as the first argument instead of `component: ComponentGenerator`
		h(tag: Fragment, props?: null, ...children: (string | Node)[]): Element[] {
			return super.h(FragmentTagComponent, {}, ...children)
		}
	}
}

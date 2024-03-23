/** a minimal implementation of JSX runtime element creation. <br>
 * to use in `esbuild`'s javascript build API, you will need to do one of the following options (or do both):
 * 
 * 1) option 1 (preferred): <br>
 *   for JSX to work with your IDE's LSP, and for esbuild to automatically discover the hyperscript functions,
 *   you will need to include the following two comment lines at the top of your `.tsx` script:
 * ```tsx
 * /** \@jsx h *\/
 * /** \@jsxFrag hf *\/
 * ```
 * 
 * 2) option 2 (no LSP support): <br>
 *   in the esbuild build options (`BuildOptions`), set `jsxFactory = "h"` and `jsxFragment = "hf"`.
 * ```ts
 * import { build, stop } from "https://deno.land/x/esbuild/mod.js"
 * build({
 *     entryPoints: ["./path/to/your/script.tsx"],
 *     jsxFactory: "h",
 *     jsxFragment: "Fragment",
 *     // other build options
 *     minify: true,
 * })
 * stop()
 * ```
 * 
 * and now in your `.jsx` script, you should:
 * - import `createHyperScript` from this module
 * - create a reactive signal `Context`
 * - call `createHyperScript` with the signal context `ctx` as the argument
 * - the returned tuple will contain 3 elements:
 *     - the first element should be named `h` (which is the name you declare as `\@jsx h` in **option 1** or `jsxFactory = "h"` in **option 2**)
 *     - the second element should be named `hf` (which is the name you declare as `\@jsxFrag hf` in **option 1** or `jsxFragment = "hf"` in **option 2**)
 *     - the third can be named anything
 * 
 * @example
 * ```tsx
 * // the `\@jsx h` comment comes here, but I can't show multiline comments in this documentation.
 * // the `\@jsxFrag hf` comment comes here, but I can't show multiline comments in this documentation.
 * 
 * import { createHyperScript } from "./path/to/tsignal/jsx/hyperscript.ts"
 * import { Context } from "./path/to/tsignal/mod.ts"
 * 
 * const ctx = new Context()
 * const [h, hf, namespaceStack] = createHyperScript(ctx)
 * 
 * const my_elem = <div>Hello world</div>
 * const my_fragment_elems = <>
 *     <span>World<span>
 *     <span>Hello<span>
 * </>
 * const my_elem2 = <div>...my_fragment_elems</div>
 * document.body.appendChild(my_elem)
 * document.body.appendChild(my_elem2)
 * 
 * // when creating svgs or xml, you will have to change the DOM namespace, so that the correct kinds of `Node`s are created.
 * namespaceStack.push("svg")
 * const my_svg = <svg viewBox="0 0 200 200">
 *     <g transform="translate(100, 50)">
 *         <text text-anchor="middle">SVG says Hi!</text>
 *         <text y="25" text-anchor="middle">SVG stands for "SUGOI! Vector Graphics"</text>
 *     </g>
 * </svg>
 * namespaceStack.pop()
 * ```
 * 
 * @module
*/

import { array_isArray, dom_customElements, isFunction, object_entries } from "../deps.ts"
import { FragmentTagComponent, HTMLTagComponent, SVGTagComponent, is_nullable, stringifyAttrValue } from "../funcdefs.ts"
import { ATTRS, AttrProps, EVENTS, EventFn, EventProps, MEMBERS, MemberProps, ONCLEAN, ONINIT, Props, STYLE, StyleProps, normalizeAttrProps } from "../props.ts"
import { AttrValue, ComponentGenerator, Fragment, HyperRender, Stylable } from "../typedefs.ts"
import { DynamicStylable } from "./styling.ts"


export class VanillaComponentRender<G extends ComponentGenerator = ComponentGenerator> extends HyperRender<G> {
	test(tag: any, props?: any): boolean { return isFunction(tag) }

	h<
		C extends G,
		P extends (C extends ComponentGenerator<infer PROPS> ? PROPS : undefined | null | object) = any
	>(component: C, props: Props<P>, ...children: (string | Node)[]): ReturnType<C> {
		const {
			[ATTRS]: attr_props = {},
			[EVENTS]: event_props = {},
			[MEMBERS]: member_props = {},
			[STYLE]: style,
			[ONINIT]: oninit_fn,
			[ONCLEAN]: onclean_fn,
			...rest_props
		} = props ?? {} as Props<P>
		children = children.map((child) => this.processChild(child))
		const component_node = component(rest_props) as ReturnType<C>
		if (array_isArray(component_node)) {
			component_node.push(...children as (string | Element)[])
			return component_node
		}
		for (const [attr_name, attr_value] of object_entries(attr_props as AttrProps)) {
			this.addAttr(component_node, attr_name, attr_value)
		}
		for (const [event_name, event_fn_or_tuple] of object_entries(event_props as EventProps)) {
			const [event_fn, event_options] = array_isArray(event_fn_or_tuple) ? event_fn_or_tuple : [event_fn_or_tuple]
			this.addEvent(component_node, event_name, event_fn, event_options)
		}
		for (const [member_key, member_value] of object_entries(member_props as MemberProps)) {
			this.setMember(component_node, member_key as any, member_value as any)
		}
		if (style) { this.setStyle(component_node as unknown as Stylable, style) }
		if (oninit_fn) { this.runOnInit(component_node, oninit_fn) }
		// TODO: implement the cleanup mechanism and how this will get signaled that the element has been permanently detached
		// if (onclean_fn) { this.runOnClean(component_node, oninit_fn) }
		component_node.append(...children)
		return component_node
	}

	protected addAttr(element: Element, attribute_node: Attr, attribute_value?: AttrValue): Attr
	protected addAttr(element: Element, attribute_name: string, attribute_value?: AttrValue): Attr
	protected addAttr(element: Element, attribute: Attr | string, value?: AttrValue): Attr {
		const
			is_existing_node = attribute instanceof Attr,
			attr_value = stringifyAttrValue(value),
			attr_value_is_null = is_nullable(attr_value),
			attr: Attr = is_existing_node
				? attribute
				: (
					element.setAttribute(attribute, attr_value ?? ""),
					element.getAttributeNode(attribute)!
				)
		if (is_existing_node && !attr_value_is_null) {
			attr.nodeValue = attr_value
			element.setAttributeNode(attr)
		}
		if (attr_value_is_null) {
			// if the `value` was falsy (`AttrFalsy`), we immediately detach the attribute node that was just added.
			element.removeAttributeNode(attr)
			attr.nodeValue = attr_value
		}
		return attr
	}

	protected addEvent(
		element: Element,
		event_name: string,
		event_fn: EventFn<any>,
		options?: boolean | AddEventListenerOptions
	): void {
		element.addEventListener(event_name, event_fn, options)
	}

	protected setMember<E = Element>(element: E, key: keyof E, value: E[typeof key]): void {
		element[key] = value
	}

	protected setStyle(element: Stylable, style: StyleProps): DynamicStylable {
		const dynamic_stylable = new DynamicStylable(element)
		dynamic_stylable.setStyle(style)
		return dynamic_stylable
	}

	protected runOnInit<E = Element>(element: E, init_fn: (element: E) => void) {
		init_fn(element)
	}

	protected runOnClean<E = Element>(element: E, clean_fn: (element: E) => void) {
		// TODO: think thoroughly how cleaning up should be implemented, and how this will get signaled when the `element` is detached permanently.
		clean_fn(element)
	}

	protected processChild(child: string | Node): string | Node {
		return child
	}

	// TODO: add an `onDispose` or `onDelete` overridable method. and maybe also add `onInit` overridable method.
}

export class VanillaHTMLRender extends VanillaComponentRender<typeof HTMLTagComponent> {
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
export class VanillaSVGRender extends VanillaComponentRender<typeof SVGTagComponent> {
	test(tag: any, props?: any): boolean { return typeof tag === "string" }

	// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
	h<TAG extends keyof SVGElementTagNameMap>(tag: TAG, props?: null | Props<AttrProps>, ...children: (string | Node)[]): SVGElementTagNameMap[TAG] {
		return super.h(SVGTagComponent, { tag, ...normalizeAttrProps(props) }, ...children) as SVGElementTagNameMap[TAG]
	}
}

export type TemplateProps = {
	id: `${string}-${string}`
	is?: string
	shallow?: boolean,
	sheets?: CSSStyleSheet[]
}

export class VanillaTemplateRender extends VanillaComponentRender<(props: Props<Partial<TemplateProps>>) => HTMLTemplateElement> {
	test(tag: any, props?: any): boolean { return tag === "template" }

	// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
	h(tag: "template", props: TemplateProps, ...children: (string | Node)[]): HTMLTemplateElement {
		const
			{ id, is, shallow = false, sheets = [] } = props,
			template = document.createElement("template"),
			template_content = template.content,
			template_constructor = class extends HTMLElement {
				constructor() {
					super()
					// this.append(...template_content.cloneNode(!shallow).childNodes as unknown as ChildNode[])
					const shadow = this.attachShadow({ mode: "open" })
					shadow.adoptedStyleSheets.push(...sheets)
					shadow.appendChild(
						template_content.cloneNode(!shallow)
					)
				}
			}
		dom_customElements.define(id, template_constructor, { extends: is })
		// append the children to the template's content `DocumentFragment`
		super.h((() => template_content as any), {}, ...children)
		return template
	}
}

export class VanillaFragmentRender extends VanillaComponentRender {
	test(tag: any, props?: any): boolean { return tag === Fragment }

	// @ts-ignore: we are breaking subclassing inheritance rules by having `tag: Fragment` as the first argument instead of `component: ComponentGenerator`
	h(tag: Fragment, props?: null, ...children: (string | Node)[]): Element[] {
		return super.h(FragmentTagComponent, {}, ...children)
	}
}

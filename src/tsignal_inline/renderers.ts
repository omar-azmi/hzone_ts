import { isFunction } from "../deps.ts"
import { inlinePropsRemapper } from "../dom_core/mod.ts"
import type { Context, MaybeAccessor } from "../tsignal_base/deps.ts"
import { ReactiveComponent_Render_Factory, ReactiveFragment_Render_Factory, ReactiveHTMLElement_Render_Factory, ReactiveSVGElement_Render_Factory } from "../tsignal_base/renderers.ts"
import { ATTRS, ComponentGenerator, Props, STYLE } from "../typedefs.ts"
import { DefaultElementProps } from "./jsx.ts"


/** this version of the props remapper intercepts the `[STYLE]` prop, and changes it into an attribute prop (under `[ATTRS]`)
 * if it is found to be either a `string` or a reactive signal accessor to a string (i.e. of type {@link MaybeAccessor | `MaybeAccessor<string>` })
*/
const inline_props_remapper: typeof inlinePropsRemapper = (props): Props<any> => {
	const { [STYLE]: style_props, ...rest_props } = inlinePropsRemapper(props)
	// see the note in {@link InlineStyleProps}. this is the part where we differentiate between `MaybeAccessor<string>`, and the other assugnable types
	const
		style_is_accessor = isFunction(style_props),
		style_is_string = typeof (style_is_accessor ? style_props() : style_props) === "string"
	if (style_is_string) { rest_props[ATTRS].style = style_props }
	return style_is_string
		? rest_props
		: { [STYLE]: style_props, ...rest_props }
}

export const ConvenientReactiveComponent_Render_Factory = (ctx: Context) => {
	const base_class = ReactiveComponent_Render_Factory(ctx)
	return class ConvenientReactiveComponent_Render<G extends ComponentGenerator = ComponentGenerator> extends base_class<G> {
		h<
			C extends G,
			P extends (C extends ComponentGenerator<infer PROPS> ? PROPS : undefined | null | object) = any
		>(component: C, props: Props<P & DefaultElementProps>, ...children: (string | Node)[]): ReturnType<C> {
			return super.h(component, inline_props_remapper(props), ...children)
		}
	}
}

export const ConvenientReactiveHTMLElement_Render_Factory = (ctx: Context) => {
	const base_class = ReactiveHTMLElement_Render_Factory(ctx)
	return class ConvenientReactiveHTMLElement_Render_Factory extends base_class {
		h<TAG extends keyof HTMLElementTagNameMap>(tag: TAG, props?: null | Props<DefaultElementProps>, ...children: (string | Node)[]): HTMLElementTagNameMap[TAG] {
			return super.h(tag, inline_props_remapper(props!), ...children)
		}
	}
}

export const ConvenientReactiveSVGElement_Render_Factory = (ctx: Context) => {
	const base_class = ReactiveSVGElement_Render_Factory(ctx)
	return class ConvenientReactiveSVGElement_Render_Factory extends base_class {
		h<TAG extends keyof SVGElementTagNameMap>(tag: TAG, props?: null | Props<DefaultElementProps>, ...children: (string | Node)[]): SVGElementTagNameMap[TAG] {
			return super.h(tag, inline_props_remapper(props!), ...children)
		}
	}
}

export const ConvenientReactiveFragment_Render_Factory = ReactiveFragment_Render_Factory

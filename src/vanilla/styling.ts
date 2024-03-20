import { ConstructorOf, object_assign, object_entries, object_fromEntries } from "../deps.ts"
import { StyleProps } from "../props.ts"
import { Stylable } from "../typedefs.ts"


export class DynamicStylable {
	protected parent: Stylable

	constructor(stylable_object: Stylable) {
		this.parent = stylable_object
	}

	setStyle(style: StyleProps) {
		// css variables must be set via `setProperty()` method, otherwise they don't work when applied via `Object.assign`
		const object_style = this.parent.style
		style = object_fromEntries(
			object_entries(style).filter(([key, value]) => {
				if (!key.startsWith("--")) { return true }
				if (value !== undefined) {
					object_style.setProperty(key, value)
				}
				return false
			})
		)
		object_assign(object_style, style)
	}

	clearStyle() {
		const
			object_style = this.parent.style,
			all_keys = [...(object_style as unknown as Iterable<string>)],
			style = object_fromEntries(
				all_keys.filter((key) => {
					if (!key.startsWith("--")) { return true }
					object_style.removeProperty(key)
					return false
				}).map((non_var_key) => ([non_var_key, ""]))
			)
		object_assign(object_style, style)
	}
}

type Selector = string

export class DynamicStyleSheet<STYLE_CONTROLLER extends DynamicStylable> {
	protected readonly sheet: CSSStyleSheet & { cssRules: Iterable<CSSStyleRule> }
	protected stylables: Map<Selector, STYLE_CONTROLLER>
	protected style_cls: ConstructorOf<STYLE_CONTROLLER>

	constructor(sheet: CSSStyleSheet = new CSSStyleSheet(), style_controller_class: ConstructorOf<STYLE_CONTROLLER> = DynamicStylable as any) {
		this.sheet = sheet as any
		this.style_cls = style_controller_class
		const selector_and_stylable_pairs = [
			...sheet.cssRules as unknown as Array<CSSStyleRule>
		].map((rule) => {
			return [rule.selectorText as Selector, new style_controller_class(rule)] as const
		})
		this.stylables = new Map(selector_and_stylable_pairs)
	}

	getSheet() { return this.sheet }

	getRule(selector: Selector): STYLE_CONTROLLER | undefined {
		return this.stylables.get(selector)
	}

	setRule(selector: Selector, style: StyleProps = {}): STYLE_CONTROLLER {
		let rule_controller = this.getRule(selector)
		if (!rule_controller) {
			const
				sheet = this.sheet,
				style_class = this.style_cls
			sheet.replaceSync(selector + " { }\n")
			rule_controller = new style_class(
				[...sheet.cssRules].find((rule) => rule.selectorText === selector)
			)!
			this.stylables.set(selector, rule_controller)
		}
		rule_controller.setStyle(style)
		return rule_controller
	}

	delRule(selector: Selector): boolean {
		const stylables = this.stylables
		stylables.get(selector)?.clearStyle()
		return stylables.delete(selector)
	}

	renameSelector(selector: Selector, new_selector: Selector): STYLE_CONTROLLER | undefined {
		const
			stylables = this.stylables,
			rule_controller = stylables.get(selector)
		if (!rule_controller) {
			return
		}
		// @ts-ignore: accessing protected member. perhaps you should implement a "rule_controller.getParent()" public method instead.
		rule_controller.parent.selectorText = new_selector
		stylables.delete(selector)
		stylables.set(new_selector, rule_controller)
		return rule_controller
	}
}

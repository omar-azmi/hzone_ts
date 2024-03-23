import { isFunction, object_entries, object_fromEntries } from "../deps.ts"
import { StyleProps } from "../props.ts"
import { Stylable } from "../typedefs.ts"
import { CreateEffect, DynamicStylable, TsignalStyleProps } from "./deps.ts"


export class TsignalDynamicStylable extends DynamicStylable {
	private createEffect: CreateEffect

	constructor(createEffect: CreateEffect, stylable_object: Stylable) {
		super(stylable_object)
		this.createEffect = createEffect
	}

	setStyle(style: TsignalStyleProps) {
		const
			object_style = this.parent.style,
			createEffect = this.createEffect
		style = object_fromEntries(
			object_entries(style).filter(([key, value]) => {
				// we filter out all accessors, keeping only static styles remaining in `styles`
				if (isFunction(value)) {
					// css variables must be set via `setProperty()` method, otherwise string indexing works for both camelCased and kebab-cased css properties.
					if (key.startsWith("--")) {
						createEffect((id) => { object_style.setProperty(key, value(id) ?? null) }, { defer: false })
					} else {
						createEffect((id) => { object_style[key as any] = value(id) ?? "" }, { defer: false })
					}
					return false
				}
				return true
			})
		)
		super.setStyle(style as StyleProps)
	}
}

// type Selector = string
// TODO
// export class TsignalDynamicStyleSheet extends DynamicStyleSheet<any> { }

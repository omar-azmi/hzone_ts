import { isFunction, object_entries, object_fromEntries } from "../deps.ts"
import { Stylable, StyleProps } from "../typedefs.ts"
import { CreateEffect, DynamicStylable, ReactiveStyleProps } from "./deps.ts"


export class ReactiveDynamicStylable extends DynamicStylable {
	private createEffect: CreateEffect

	constructor(createEffect: CreateEffect, stylable_object: Stylable) {
		super(stylable_object)
		this.createEffect = createEffect
	}

	setStyle(style: ReactiveStyleProps) {
		const
			object_style = this.parent.style,
			createEffect = this.createEffect
		style = object_fromEntries(
			object_entries(style).filter(([key, value]) => {
				// we filter out all accessors, keeping only static styles remaining in `styles`
				if (isFunction(value)) {
					createEffect((id) => { object_style.setProperty(key, value(id) ?? null) }, { defer: false })
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
// export class ReactiveDynamicStyleSheet extends DynamicStyleSheet<any> { }

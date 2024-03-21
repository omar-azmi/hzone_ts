import { Props } from "./props.ts"
import { AttrValue, Stringifiable } from "./typedefs.ts"


export const
	nullable_to_null = (value: any): Exclude<typeof value, undefined> => {
		return value === undefined ? null : value
	},
	nullable_to_undefined = (value: any): Exclude<typeof value, null> => {
		return value === null ? undefined : value
	},
	is_nullable = (value: any): value is (null | undefined) => {
		return value === undefined || value === null
	},
	is_boolean = (value: any): value is boolean => {
		return value === true || value === false
	},
	stringify = (value?: Stringifiable | null | undefined): string | null => {
		return is_nullable(value) ? null : value.toString()
	},
	stringifyAttrValue = (value: AttrValue): string | null => {
		return is_boolean(value)
			? (value ? "" : null)
			: stringify(value)
	}

export const
	HTMLTagComponent = <TAG extends keyof HTMLElementTagNameMap = any>(props?: Props<{ tag?: TAG }>): HTMLElementTagNameMap[TAG] => document.createElement(props!.tag!),
	SVGTagComponent = <TAG extends keyof SVGElementTagNameMap = any>(props?: Props<{ tag?: TAG }>): SVGElementTagNameMap[TAG] => document.createElementNS("http://www.w3.org/2000/svg", props!.tag!),
	FragmentTagComponent = (props?: any) => [] as Element[]

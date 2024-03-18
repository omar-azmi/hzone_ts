import { ADVANCED_EVENTS, ATTRS, AttrProps, EVENTS, EXECUTE, MEMBERS, STYLE } from "./symbol_props.ts"
import { AttrValue, Props, Stringifiable } from "./typedefs.ts"


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

/** place top level props into the {@link ATTRS | `props[ATTRS]`} field. this is useful for HTMLElement and SVGElement component generators. <br>
 * 
 * @example
 * ```ts
 * const normalized_props = normalizeAttrProps({
 * 	width: 50,
 * 	height: 30,
 * 	[ATTRS]: {
 * 		height: 40,
 * 		style: "background-color: red;",
 * 	},
 * 	[EVENTS]: { click: () => { console.log("you suck") } }
 * })
 * // this will now produce: the following equivalent structure:
 * normalized_props === {
 * 	[ATTRS]: {
 * 		width: 50,
 * 		height: 40, // notice that the thing in `[ATTRS]` has a higher precedence.
 * 		style: "background-color: red;",
 * 	},
 * 	[EVENTS]: { click: () => { console.log("you suck") } }
 * }
 * ```
*/
export const normalizeAttrProps = (props?: null | Props<AttrProps>): Props<{}> => {
	const {
		[EVENTS]: event_props,
		[ADVANCED_EVENTS]: advanced_events_props,
		[MEMBERS]: member_props,
		[STYLE]: style_props,
		[EXECUTE]: execute_props,
		[ATTRS]: other_attr_props,
		...attr_props
	} = props ?? {}
	return {
		[EVENTS]: event_props,
		[ADVANCED_EVENTS]: advanced_events_props,
		[MEMBERS]: member_props,
		[STYLE]: style_props,
		[EXECUTE]: execute_props,
		[ATTRS]: { ...attr_props, ...other_attr_props },
	}
}

export type { HTMLTagNameAttributesMap } from "./html_attributes_map.ts"
export type { SVGTagNameAttributesMap } from "./svg_attributes_map.ts"
import type { IntrinsicElements } from "../tsignal/convenient.ts"
import type { HTMLTagNameAttributesMap } from "./html_attributes_map.ts"
import type { SVGTagNameAttributesMap } from "./svg_attributes_map.ts"

export type TagNameMap<TagNames extends string> = { [tag_name in TagNames]: any }

export type HTMLTagNames = keyof HTMLElementTagNameMap

/** see {@link IntrinsicElements | `IntrinsicElements` of the tsignal module} to understand how this is being used. <br>
 * what this utility type does is that it lets you set a mapped type of the props accepted by each of you HTMLElementTag (as `TagPropsMap`),
 * and then lets you set the default type for each html attribute (usually a `string`, since that's what's natively supported with no frameworks).
*/
export type IntrinsicHTMLElements_Factory<
	TagPropsMap extends TagNameMap<HTMLTagNames>,
	AttributeType extends any
> = {
		[TagName in HTMLTagNames]:
		& TagPropsMap[TagName]
		& Partial<Record<HTMLTagNameAttributesMap[TagName], AttributeType>>
	}

export type SVGTagNames = keyof SVGElementTagNameMap

/** see {@link IntrinsicElements | `IntrinsicElements` of the tsignal module} to understand how this is being used.
 * what this utility type does is that it lets you set a mapped type of the props accepted by each of you SVGElementTag (as `TagPropsMap`),
 * and then lets you set the default type for each html attribute (usually a `string`, since that's what's natively supported with no frameworks).
*/
export type IntrinsicSVGElements_Factory<
	TagPropsMap extends TagNameMap<SVGTagNames>,
	AttributeType extends any
> = {
		[TagName in SVGTagNames]:
		& TagPropsMap[TagName]
		& Partial<Record<SVGTagNameAttributesMap[TagName], AttributeType>>
	}

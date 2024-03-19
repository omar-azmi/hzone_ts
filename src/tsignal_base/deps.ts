export { Context, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
export type { Accessor } from "jsr:@oazmi/tsignal"
export { FragmentTagComponent, HTMLTagComponent, SVGTagComponent, VanillaComponentRender } from "../vanilla/renderers.ts"
export { DynamicStylable } from "../vanilla/styling.ts"
import type { Accessor, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
import { StyleProps } from "../typedefs.ts"


export type MaybeAccessor<T> = T | Accessor<T>
export type TsignalStyleProps = { [K in keyof StyleProps]: MaybeAccessor<StyleProps[K]> }
export type HTMLElementUniqueMembers<E extends Element> = Omit<E, keyof Element | keyof GlobalEventHandlers | keyof ElementCSSInlineStyle>
export type CreateEffect = ReturnType<typeof EffectSignal_Factory>["create"]

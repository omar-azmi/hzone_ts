export { Context, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
export type { Accessor } from "jsr:@oazmi/tsignal"
export { Component_Render, FragmentTagComponent, HTMLTagComponent, SVGTagComponent } from "../core/renderers.ts"
export { DynamicStylable } from "../core/styling.ts"
import type { Accessor, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
import { StyleProps } from "../typedefs.ts"


export type MaybeAccessor<T> = T | Accessor<T>
export type ReactiveStyleProps = { [K in keyof StyleProps]: MaybeAccessor<StyleProps[K]> }
export type HTMLElementUniqueMembers<E extends HTMLElement> = Omit<E, keyof Element | keyof GlobalEventHandlers | keyof ElementCSSInlineStyle>
export type CreateEffect = ReturnType<typeof EffectSignal_Factory>["create"]

export { Context, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
export type { Accessor } from "jsr:@oazmi/tsignal"
export { DynamicStylable, VanillaComponentRender } from "../vanilla/mod.ts"
import type { Accessor, EffectSignal_Factory } from "jsr:@oazmi/tsignal"
import { StyleProps } from "../props.ts"


export type MaybeAccessor<T> = T | Accessor<T>
export type TsignalStyleProps = { [K in keyof StyleProps]: MaybeAccessor<StyleProps[K]> }
export type CreateEffect = ReturnType<typeof EffectSignal_Factory>["create"]

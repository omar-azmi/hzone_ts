export type { Accessor } from "npm:solid-js"
export { DynamicStylable, VanillaComponentRender } from "../vanilla/mod.ts"
import type { Accessor, createEffect } from "npm:solid-js"

export type MaybeAccessor<T> = T | Accessor<T>
export type CreateEffect = typeof createEffect

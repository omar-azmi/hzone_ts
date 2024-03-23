/** each "framework" must have its component renderer constructor's configurations options saved in here.
 * 
 * @module
*/

import type { HyperZone } from "./hzone/mod.ts"
import type { CreateEffect } from "./solid/deps.ts"
import type { Context } from "./tsignal/deps.ts"
import type { HyperRender } from "./typedefs.ts"

/** each "framework" must have its component renderer constructor's configurations options saved in here. <br>
 * these configurations get saved into {@link HyperZone | `HyperZone`}, and can be passed to new renderer constructor.
*/
export interface HyperZoneConfigs {
	hzone?: hzone_Config
	vanilla?: vanilla_Config
	tsignal?: tsignal_Config
	solid?: solid_Config
}

/** {@link HyperZone | `HyperZone`}'s constructor arguments. */
export interface hzone_Config {
	/** specify the default collection of renderers when popped out of all zones. */
	default?: HyperRender[]
}

/** the `VanillaComponentRender` takes no constructor arguments. */
export interface vanilla_Config { }

/** the `TsignalComponentRender` needs a signal `Context` to which your signals will operate on.
 * if you give a different context from the one that your signals originate from, then you'll run into a stack overflow.
*/
export interface tsignal_Config {
	ctx?: Context
}

/** the `SolidComponentRender` needs a `createEffect` function so that it can react to your SolidJS signals. */
export interface solid_Config {
	createEffect: CreateEffect
}

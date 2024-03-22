import type { CreateEffect } from "./solid/deps.ts"
import type { Context } from "./tsignal/deps.ts"
import type { HyperRender } from "./typedefs.ts"


export interface HyperZoneConfigs {
	hzone?: hzone_Config
	vanilla?: vanilla_Config
	tsignal?: tsignal_Config
	solid?: solid_Config
}

export interface hzone_Config {
	default?: HyperRender[]
}

export interface vanilla_Config { }

export interface tsignal_Config {
	ctx?: Context
}

export interface solid_Config {
	createEffect: CreateEffect
}

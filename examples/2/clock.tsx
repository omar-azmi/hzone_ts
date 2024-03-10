/** @jsx h */
/** @jsxFrag Fragment */

import { ATTRS, Accessor, COMP_ZONE, ComponentGenerator, FRAG_ZONE, Fragment, SVG_ZONE, createMemo, h, popZone, pushZone } from "./deps.ts"
import { Hand } from "./hands.tsx"
import { Lines } from "./lines.tsx"

type ClockFaceProps = {
	hour: Accessor<string>
	minute: Accessor<string>
	second: Accessor<string>
	subsecond: Accessor<string>
}

export const ClockFace: ComponentGenerator<ClockFaceProps> = (props: ClockFaceProps) => {
	pushZone(SVG_ZONE, COMP_ZONE, FRAG_ZONE)
	const element = <svg viewBox="0 0 200 200" width="30vmin">
		<g transform="translate(100, 100)">
			{/* static */}
			<circle class="text-neutral-900" r={99} fill="white" stroke="currentColor" />
			<Lines numberOfLines={60} class="subsecond" length={2} width={1} />
			<Lines numberOfLines={12} class="hour" length={5} width={2} />
			{/* dynamic */}
			<Hand rotate={props.subsecond} {...{ [ATTRS]: { class: "subsecond" } }} length={85} width={5} />
			<Hand rotate={props.hour} {...{ [ATTRS]: { class: "hour" } }} length={50} width={4} />
			<Hand rotate={props.minute} {...{ [ATTRS]: { class: "minute" } }} length={70} width={3} />
			<Hand rotate={props.second} {...{ [ATTRS]: { class: "second" } }} length={80} width={2} />
		</g>
	</svg>
	popZone()
	return element
}

// TODO-TSIGNAL_TS: I just realized that it may be a good idea to allow `ctx.onDelete` to contain an array of disposal functions,
// instead of just one, since there could be multiple places that may need clearing up.
export const Clock = ({ getTime }: { getTime: Accessor<number> }) => {
	const rotate = (rotate: number, deg_steps = 360 / 60) => `rotate(${((rotate * 360) / deg_steps | 0) * deg_steps})`

	const [, getSubsecond] = createMemo((id) => rotate(getTime(id) % 1, 0.1), { defer: false })
	const [, getSecond] = createMemo((id) => rotate((getTime(id) % 60) / 60), { defer: false })
	const [, getMinute] = createMemo((id) => rotate(((getTime(id) / 60) % 60) / 60), { defer: false })
	const [, getHour] = createMemo((id) => rotate(((getTime(id) / 60 / 60) % 12) / 12, 360 / 12), { defer: false })

	return <div class="clock">
		<ClockFace hour={getHour} minute={getMinute} second={getSecond} subsecond={getSubsecond} />
	</div>
}

/** @jsx h */
/** @jsxFrag Fragment */

import { DynamicStylable } from "../../src/mod.ts"
import { Clock } from "../2_inline/clock.tsx"
import { Fragment, createMemo, createState, ctx, h, throttlingEquals } from "../2_inline/deps.ts"


let seconds_since_epoch_and_midnight = new Date().setHours(0, 0, 0, 0) / 1000
const getSecondsSinceMidnight = (): number => Date.now() / 1000 - seconds_since_epoch_and_midnight
let dt = 0
let time = getSecondsSinceMidnight()
const
	[idCurrentTime, getCurrentTime, setCurrentTime] = createState<number>(getSecondsSinceMidnight()),
	[, isTimeSlow, setTimeSlow] = createState(false),
	[, getDt] = createMemo((id) => {
		ctx.onInit(id, () => getCurrentTime(id))
		return dt
	}),
	[, getTime] = createMemo((id) => {
		return (time += getDt(id))
	})

const dispose = setInterval(requestAnimationFrame, 15, () => {
	setCurrentTime((prev_time) => {
		const current_time = getSecondsSinceMidnight()
		if (prev_time !== undefined) { dt = current_time - prev_time }
		if (isTimeSlow()) { dt /= 30 }
		return current_time
	})
})
ctx.onDelete(idCurrentTime, () => clearInterval(dispose))

let prev_timeout: undefined | number = undefined
const slow_down_time = <div init={(element) => {
	const dynamic_style = new DynamicStylable(element)
	dynamic_style.setStyle({
		display: "flex",
		flexDirection: "column",
		flexWrap: "nowrap",
		alignItems: "stretch",
	})
}}>
	<button on:click={(event) => {
		clearTimeout(prev_timeout)
		setTimeSlow((prev_value) => !prev_value)
		prev_timeout = setTimeout(() => setTimeSlow(false), 5000)
	}}>
		!! ZA WARUDO ??!!
		<br />
		TOKYO WA TOMARE!!
	</button>
	<br />
	<button>ROADO ROLLAAA</button>
</div>

let time_input_element_is_focused = false
const time_input_element = <input
	type="number"
	set:valueAsNumber={createMemo(getTime, {
		equals: throttlingEquals<number>(150, (v1, v2) => {
			const is_equal = v1 === v2
			if (!is_equal && isFinite(v2) && !time_input_element_is_focused) {
				return false
			}
			return true
		})
	})[1]}
	on:change={(event) => {
		time_input_element_is_focused = true
		const
			input_element = event.currentTarget as HTMLInputElement,
			seconds = input_element.valueAsNumber
		if (isFinite(seconds)) {
			seconds_since_epoch_and_midnight = Date.now() / 1000 - seconds
		}
	}}
	on:blur={(event) => { time_input_element_is_focused = false }}
	on:focus={(event) => { time_input_element_is_focused = true }}
/>


const change_time = <div style={{
	display: "flex",
	flexDirection: "column",
	flexWrap: "nowrap",
	alignItems: "stretch",
}}>
	<span attr:style="text-align: center;">change time</span>
	{time_input_element}
</div>

document.getElementById("root")!.append(
	<img src="../assets/jotaro_kujo.jpg"></img>,
	<div style={{
		display: "flex",
		flexDirection: "column",
		flexWrap: "nowrap",
		alignItems: "stretch",
		justifyContent: "center",
		width: "30vw",
	}}>
		{change_time}
		<Clock attr:style="align-self: center;" {...{ getTime }} />
		{slow_down_time}
	</div>,
	<img src="../assets/dio_brando.jpg"></img>,
)
export { getCurrentTime, idCurrentTime, setCurrentTime }


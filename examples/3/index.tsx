/** @jsx h */
/** @jsxFrag Fragment */

import { ATTRS, AttrProps, DynamicStylable, EVENTS, EventProps, MEMBERS, MemberProps, ONINIT } from "../../src/mod.ts"
import { MaybeAccessor } from "../../src/tsignal/mod.ts"
import { Clock } from "../2/clock.tsx"
import { Fragment, createMemo, createState, ctx, h, object_to_css_inline_style, throttlingEquals } from "../2/deps.ts"


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
const slow_down_time = <div {...{
	[ONINIT]: (element: HTMLDivElement) => {
		const dynamic_style = new DynamicStylable(element)
		dynamic_style.setStyle({
			display: "flex",
			flexDirection: "column",
			flexWrap: "nowrap",
			alignItems: "stretch",
		})
	},
}}>
	<button {...{
		[EVENTS]: {
			click(event) {
				clearTimeout(prev_timeout)
				setTimeSlow((prev_value) => !prev_value)
				prev_timeout = setTimeout(() => setTimeSlow(false), 5000)
			}
		} as EventProps
	}}>
		!! ZA WARUDO ??!!
		<br />
		TOKYO WA TOMARE!!
	</button>
	<br />
	<button>ROADO ROLLAAA</button>
</div>

let time_input_element_is_focused = false
const time_input_element: HTMLInputElement = <input type="number" {...{
	[MEMBERS]: {
		valueAsNumber: createMemo(getTime, {
			equals: throttlingEquals<number>(150, (v1, v2) => {
				const is_equal = v1 === v2
				if (!is_equal && isFinite(v2) && !time_input_element_is_focused) {
					return false
				}
				return true
			})
		})[1]
	} as MemberProps<{ [K in keyof HTMLInputElement]: MaybeAccessor<HTMLInputElement[K]> }>,
	[EVENTS]: {
		change(event) {
			time_input_element_is_focused = true
			const
				input_element = event.currentTarget as HTMLInputElement,
				seconds = input_element.valueAsNumber
			if (isFinite(seconds)) {
				seconds_since_epoch_and_midnight = Date.now() / 1000 - seconds
			}
		},
		blur(event) { time_input_element_is_focused = false },
		focus(event) { time_input_element_is_focused = true },
	} as EventProps
}} />


const change_time = <div style={object_to_css_inline_style({
	"display": "flex",
	"flex-direction": "column",
	"flex-wrap": "nowrap",
	"align-items": "stretch",
})}>
	<span style="text-align: center;">change time</span>
	{time_input_element}
</div>

document.getElementById("root")!.append(
	<img src="../assets/jotaro_kujo.jpg"></img>,
	<div style={object_to_css_inline_style({
		"display": "flex",
		"flex-direction": "column",
		"flex-wrap": "nowrap",
		"align-items": "stretch",
		"justify-content": "center",
		"width": "30vw",
	})}>
		{change_time}
		<Clock {...{
			getTime, [ATTRS]: {
				style: "align-self: center;"
			} as AttrProps
		}} />
		{slow_down_time}
	</div>,
	<img src="../assets/dio_brando.jpg"></img>,
)
export { getCurrentTime, idCurrentTime, setCurrentTime }


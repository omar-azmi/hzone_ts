/** @jsx h */
/** @jsxFrag Fragment */

import { ATTRS, AttrProps } from "../../src/mod.ts"
import { Clock } from "./clock.tsx"
import { Fragment, createState, ctx, h } from "./deps.ts"

let seconds_since_epoch_and_midnight = new Date().setHours(0, 0, 0, 0) / 1000
const getSecondsSinceMidnight = (): number => Date.now() / 1000 - seconds_since_epoch_and_midnight
const [idCurrentTime, getCurrentTime, setCurrentTime] = createState<number>(getSecondsSinceMidnight())

const dispose = setInterval(requestAnimationFrame, 15, () => {
	setCurrentTime(getSecondsSinceMidnight())
})
ctx.onDelete(idCurrentTime, () => clearInterval(dispose))

document.getElementById("root")!.appendChild(<Clock getTime={getCurrentTime} {...{
	[ATTRS]: {
		style: "align-self: center;"
	} as AttrProps
}} />)

export { getCurrentTime, idCurrentTime, setCurrentTime }


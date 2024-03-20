/** @jsx h */
/** @jsxFrag Fragment */

import { Clock } from "./clock.tsx"
import { Fragment, createState, ctx, h } from "./deps.ts"


const seconds_since_epoch_and_midnight = new Date().setHours(0, 0, 0, 0) / 1000
const getSecondsSinceMidnight = (): number => Date.now() / 1000 - seconds_since_epoch_and_midnight
const [idCurrentTime, getCurrentTime, setCurrentTime] = createState<number>(getSecondsSinceMidnight())

const dispose = setInterval(requestAnimationFrame, 15, () => {
	setCurrentTime(getSecondsSinceMidnight())
})
ctx.onDelete(idCurrentTime, () => clearInterval(dispose))

document.getElementById("root")!.appendChild(<Clock
	attr:style="align-self: center;"
	getTime={getCurrentTime}
/>)

export { getCurrentTime, idCurrentTime, setCurrentTime }


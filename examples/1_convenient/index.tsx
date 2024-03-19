/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { InlineHyperZone, VanillaComponentRender, VanillaFragmentRender, VanillaSVGElementRender } from "../../src/mod.ts"
import { TsignalHTMLRender } from "../../src/tsignal_base/mod.ts"
import { ReactiveComponentProps } from "../../src/tsignal_inline/mod.ts"


const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory),
	reactive_html_renderer = new TsignalHTMLRender({ ctx })

const {
	h,
	Fragment,
	pushZone,
	popZone,
} = InlineHyperZone.create({
	default: [
		new VanillaFragmentRender(),
		reactive_html_renderer,
		new VanillaComponentRender()
	]
})

const svg_renderer = new VanillaSVGElementRender()

type MyDivProps = ReactiveComponentProps<{ width?: number, height?: number }>
const MyDiv = ({ width = 100, height = 50 }: MyDivProps = {}) => {
	const [, getTime, setTime] = createState(Date.now() / 1000)
	setInterval(() => {
		setTime((Date.now() / 1000) | 0)
	}, 500)

	return <div>
		<div>
			<span>Hello</span>
			<span>World</span>
		</div>
		{pushZone(svg_renderer)}
		<svg width={`${width}px`} height={`${height}px`} viewBox={`0 0 ${width} ${height}`} attr:style="user-select: none;"><g>
			<text text-anchor="left" y={height / 2}>NOICEEE SVG!</text>
		</g></svg>
		{popZone()}
		<>
			<div>
				<div>Present Day, Present Time: {getTime}</div>
				<span>ZA </span>
				<span>WARUDO!</span>
			</div>
			<button on:click={() => setTime((prev_time) => (prev_time ?? 0) - 10)}>
				TOKYO WA TOMARE!
			</button>
		</>
	</div>
}

/** renders into:
const a = h("div", { width: 150, [ATTRS]: { style: "background-color: red;" } },
	h("div", null,
		h("span", null, "Hello"),
		h("span", null, "World"),
	),
	pushZone(SVG_ZONE),
	h("svg", { width: "150px", height: "50px", viewBox: "0 0 150 50", style: "user-select: none;" },
		h("g", null,
			h("text", { "text-anchor": "middle", y: "25" }, "NOICEEE SVG!")
		)
	),
	popZone(),
	h(Fragment, null,
		h("div", null,
			"Present Day, Present Time: ",
			getTime,
			h("span", null, "ZA "),
			h("span", null, "WARUDO!"),
		),
		h("button", {[EVENTS]: {
			click() { setTime((prev_time) => (prev_time ?? 0) - 10) },
		}}, "TOKYO WA TOMARE!"),
	)
)
*/

document.body.appendChild(<MyDiv width={150} style={{ backgroundColor: "yellow" }} />)

/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { ATTRS, Component_Render, EVENTS, Fragment, Fragment_Render, HyperScope, SVGElement_Render } from "../../src/mod.ts"
import { ReactiveHTMLElement_Render_Factory } from "../../src/signal.ts"

const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory),
	ReactiveHTMLElement_Render = ReactiveHTMLElement_Render_Factory(ctx)

const
	hyperscope = new HyperScope(
		new Fragment_Render("fragment component jsx renderer"),
		new ReactiveHTMLElement_Render("reactive html jsx renderer"),
		new Component_Render("component jsx renderer"),
	),
	svg_renderer = hyperscope.addClass(SVGElement_Render, "svg jsx renderer"),
	SVG_SCOPE = svg_renderer.kind

const
	h = hyperscope.h.bind(hyperscope),
	{ pushScope, popScope } = hyperscope

const MyDiv = ({ width = 100, height = 50 } = {}) => {
	const [, getTime, setTime] = createState(Date.now() / 1000)
	setInterval(() => {
		setTime((Date.now() / 1000) | 0)
	}, 500)

	return <div>
		<div>
			<span>Hello</span>
			<span>World</span>
		</div>
		{pushScope(SVG_SCOPE)}
		<svg width={`${width}px`} height={`${height}px`} viewBox={`0 0 ${width} ${height}`} style="user-select: none;"><g>
			<text text-anchor="left" y={height / 2}>NOICEEE SVG!</text>
		</g></svg>
		{popScope()}
		<>
			<div>
				<div>Present Day, Present Time: {getTime}</div>
				<span>ZA </span>
				<span>WARUDO!</span>
			</div>
			<button {...{
				[EVENTS]: {
					click() {
						setTime((prev_time) => (prev_time ?? 0) - 10)
					},
				}
			}} >TOKYO WA TOMARE!</button>
		</>
	</div>
}

/** renders into:
const a = h("div", { width: 150, [ATTRS]: { style: "background-color: red;" } },
	h("div", null,
		h("span", null, "Hello"),
		h("span", null, "World"),
	),
	pushScope(SVG_SCOPE),
	h("svg", { width: "150px", height: "50px", viewBox: "0 0 150 50", style: "user-select: none;" },
		h("g", null,
			h("text", { "text-anchor": "middle", y: "25" }, "NOICEEE SVG!")
		)
	),
	popScope(),
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

document.body.appendChild(<MyDiv width={150} {...{ [ATTRS]: { "style": "background-color: yellow;" } }} />)

/** @jsx h */
/** @jsxFrag Fragment */

import { Accessor, ComponentGenerator, Fragment, TsignalInlineComponentProps, h } from "./deps.ts"


type HandProps = {
	rotate: string | Accessor<string>
	length: number
	width: number
	fixed?: boolean
}

export const Hand: ComponentGenerator<TsignalInlineComponentProps<HandProps>> = (props: HandProps) => {
	const { rotate, length, width, fixed } = props
	return <line
		y1={fixed ? length - 95 : 0}
		y2={-(fixed ? 95 : length)}
		stroke="currentColor"
		stroke-width={width}
		stroke-linecap="round"
		transform={rotate}
	/>
}

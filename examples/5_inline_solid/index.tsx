/** @jsx h */
/** @jsxFrag Fragment */

import { createEffect, createSignal } from "npm:solid-js"
import { InlineHyperZone } from "../../src/mod.ts"
import { SolidFragmentRender, SolidHTMLRender } from "../../src/solid/mod.ts"

const fragment_renderer = new SolidFragmentRender({ createEffect })
const html_renderer = new SolidHTMLRender({ createEffect })
const { h, Fragment } = InlineHyperZone.create({ default: [fragment_renderer, html_renderer] })
const [getMyButtonIsDisabled, setMyButtonIsDisabled] = createSignal(false)

const my_button = <button
	style={{ backgroundColor: "green" }}
	set:disabled={getMyButtonIsDisabled}
	on:click={[(mouse_event) => {
		const the_button = mouse_event.currentTarget as HTMLButtonElement
		console.log("KABOOM! you are already dead!")
		setMyButtonIsDisabled(true)
		the_button.style.backgroundColor = "red"
		the_button.textContent = "You are now officially a T3RR0RI5T."

		const [getNumberOfDenials, setNumberOfDenials] = createSignal(0)
		const government_response_div = <div></div> as HTMLDivElement
		const government_response = <>
			Nope, you are deemed irredeemable.
			<br />
			Punishment: 20 years in
			<a href="https://en.wikipedia.org/wiki/Abu_Ghraib_prison">Abu-Ghraib prison.</a>
		</>

		let first_run = true
		the_button.append(...<>
			<br />
			<button
				attr:style="background-color: blue;"
				on:click={() => {
					if (first_run) {
						createEffect(() => {
							console.log(`DENIED for the ${getNumberOfDenials()}th time`)
							government_response_div.replaceChildren(...government_response)
						})
						first_run = false
					}
					setNumberOfDenials((prev_value) => (prev_value + 1))
				}}
			>
				Click here to redeem yourself to the US Government.
			</button>
			<br />
			{government_response_div}
		</>)
	}, { once: true }]}
>
	this button logs only once, <br />
	and then turns red, <br />
	in addition to becoming disabled.
</button>

document.body.append(my_button)

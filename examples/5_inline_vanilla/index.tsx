/** @jsx h */
/** @jsxFrag Fragment */

import { InlineHyperZone } from "../../src/mod.ts"
import { VanillaFragmentRender, VanillaHTMLRender } from "../../src/vanilla/mod.ts"

const fragment_renderer = new VanillaFragmentRender()
const html_renderer = new VanillaHTMLRender()
const { h, Fragment } = InlineHyperZone.create({ default: [fragment_renderer, html_renderer] })

const my_button = <button
	style={{ backgroundColor: "green" }}
	set:disabled={false}
	on:click={[(mouse_event) => {
		const the_button = mouse_event.currentTarget as HTMLButtonElement
		console.log("KABOOM! you are already dead!")
		the_button.style.backgroundColor = "red"
		the_button.disabled = true
		the_button.textContent = "You are now officially a T3RR0RI5T."
		const government_response_div = <div></div> as HTMLDivElement
		const government_response = <>
			Nope, you are deemed irredeemable.
			<br />
			Punishment: 20 years in
			<a href="https://en.wikipedia.org/wiki/Abu_Ghraib_prison">Abu-Ghraib prison.</a>
		</>
		let denial_counter = 0
		the_button.append(...<>
			<br />
			<button
				attr:style="background-color: blue;"
				on:click={() => {
					government_response_div.replaceChildren(...government_response)
					console.log(`DENIED for the ${denial_counter++}th time`)
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

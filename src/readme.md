# Hzone (HyperZone)
A HyperScript runtime for creating Reactive JSX DOM components, with the ability to dynamically change framework environments (aka zones) through a stack based system.
This allows the library to be extended to practically any framework, and it also nullifies JSX parsing ambiguities.

The library provides two types of JSX syntax, one is *symbol* based, the other is *inline* prefix based.
They are equivalent, and only the symbol-based version needs to be defined by the extending library to be able to make use of the inline version.
The inline syntax is much more readable and also provides better jsx-highlighting in your IDE, while the symbol version is far easier for a custom reactive library to adopt to.

## Non-mandatory examples:

### Create a button that logs when clicked in Vanilla javascript (TSX)
```tsx
/** @jsx h */
/** @jsxFrag Fragment */

import { InlineHyperZone } from "jsr:@oazmi/hzone"
import { VanillaFragmentRender, VanillaHTMLRender } from "jsr:@oazmi/hzone/vanilla"

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
		const government_response_div = <div></div>
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
```

### The same previous example, but using *symbol* props
<details>
<summary>click to expand</summary>

```tsx
/** @jsx h */
/** @jsxFrag Fragment */

import { ATTRS, EVENTS, HyperZone, MEMBERS, STYLE } from "jsr:@oazmi/hzone"
import { VanillaFragmentRender, VanillaHTMLRender } from "jsr:@oazmi/hzone/vanilla"

const fragment_renderer = new VanillaFragmentRender()
const html_renderer = new VanillaHTMLRender()
const { h, Fragment } = HyperZone.create({ default: [fragment_renderer, html_renderer] })

const my_button = <button {...{
	[STYLE]: { backgroundColor: "green" },
	[MEMBERS]: { disabled: false },
	[EVENTS]: {
		click: [(mouse_event) => {
			const the_button = mouse_event.currentTarget as HTMLButtonElement
			console.log("KABOOM! you are already dead!")
			the_button.style.backgroundColor = "red"
			the_button.disabled = true
			the_button.textContent = "You are now officially a T3RR0RI5T."
			const government_response_div = <div></div>
			const government_response = <>
				Nope, you are deemed irredeemable.
				<br />
				Punishment: 20 years in
				<a href="https://en.wikipedia.org/wiki/Abu_Ghraib_prison">Abu-Ghraib prison.</a>
			</>
			let denial_counter = 0
			the_button.append(...<>
				<br />
				<button {...{
					[ATTRS]: { style: "background-color: blue;" },
					[EVENTS]: {
						click() {
							government_response_div.replaceChildren(...government_response)
							console.log(`DENIED for the ${denial_counter++}th time`)
						}
					}
				}}>
					Click here to redeem yourself to the US Government.
				</button>
				<br />
				{government_response_div}
			</>)
		}, { once: true }]
	},
}}>
	this button logs only once, <br />
	and then turns red, <br />
	in addition to becoming disabled.
</button >

document.body.append(my_button)
```
</details>


## Source Code Organization

```txt
/examples/*/        example files.
/src/               source directory.
/src/hzone/*.ts     source files `HyperZone` and `InlineHyperZone`.
/src/vanilla/*.ts   source files `VanillaComponentRender` and its derivatives.
/src/tsignal/*.ts   source files `TsignalComponentRender` and its derivatives,
                    for using with `jsr:@oazmi/tsignal` reactive signals library.
/src/dom_typedefs/  contains information for html and svg attributes,
                    for typescript autocomplete.
/src/configs.ts     each "framework" must have its component constructor's
                    configurations options saved in here.
/src/props.ts       exports the symbols for symbol props, and the name-prefixes for
                    inline props, in addition to the `Props` interface that must be
					accepted by all components.
/src/typedefs.ts    useful types for abstraction.
/test/*.ts          test files.
```

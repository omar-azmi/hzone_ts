/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { Component_Render, DynamicStyleSheet, Fragment_Render, HyperZone, TemplateElement_Render } from "../../src/mod.ts"
import { ReactiveHTMLElement_Render_Factory } from "../../src/tsignal/mod.ts"


const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory),
	ReactiveHTMLElement_Render = ReactiveHTMLElement_Render_Factory(ctx)

const { h, Fragment, } = HyperZone.create(
	new Fragment_Render(),
	// `TemplateElement_Render` needs to be higher than any `HTMLElement_Render`, as `HTMLElement_Render` captures all strings.
	new TemplateElement_Render(),
	new ReactiveHTMLElement_Render(),
	new Component_Render(),
)

// DONE: a much better way of changing single css declarations via js:
// - https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Using_dynamic_styling_information
// - https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet
// TODO: implement a user-friendly shared (or global) attribute on <style> tags when used inside of `<template>`, or perhapse implement a global style zone/renderer

const [, getParagraphText, setParagraphText] = createState("My Paragraph Template")
const my_template_style = new DynamicStyleSheet()
my_template_style.setRule("p", {
	color: "white",
	backgroundColor: "#666",
	padding: `${5}px`
})

const my_template = <template id="my-paragraph" sheets={[my_template_style.getSheet(),]}>
	<p>{getParagraphText}</p>
	<slot name="slot-1">
		<p>Default Text</p>
	</slot>
</template> as HTMLTemplateElement
console.log(my_template)
// globalThis.customElements.define()

const MyParagraph = () => {
	return <my-paragraph />
}

/** renders into:
*/

document.body.append(
	<MyParagraph on:click={"HEHE"}>
		<div slot="slot-1">YAHAHA!! you found me</div>
	</MyParagraph>,
	<MyParagraph>
		<p slot="slot-1">another paragraph</p>
		<p>ILLEGAL CHILD, BEGONE!! AND DO NOT SHOW YOUR FACE!</p>
	</MyParagraph>,
	<MyParagraph />,
)

// notice that reactivity of the template's children is not not cloned.
setTimeout(() => {
	setParagraphText("Paragraph text has been changed after 2000ms")
}, 2000)

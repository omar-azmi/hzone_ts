/** @jsx h */
/** @jsxFrag Fragment */

import { Context, MemoSignal_Factory, StateSignal_Factory } from "jsr:@oazmi/tsignal"
import { Component_Render, Fragment, Fragment_Render, HyperZone, Stringifiable, TemplateElement_Render, stringify } from "../../src/mod.ts"
import { ReactiveHTMLElement_Render_Factory } from "../../src/tsignal/mod.ts"


const
	ctx = new Context(),
	createState = ctx.addClass(StateSignal_Factory),
	createMemo = ctx.addClass(MemoSignal_Factory),
	ReactiveHTMLElement_Render = ReactiveHTMLElement_Render_Factory(ctx)

const
	hyperzone = new HyperZone(
		new Fragment_Render("fragment component jsx renderer"),
		// `TemplateElement_Render` needs to be higher than any `HTMLElement_Render`, as `HTMLElement_Render` captures all strings.
		new TemplateElement_Render("template element generator"),
		new ReactiveHTMLElement_Render("reactive html jsx renderer"),
		new Component_Render("component jsx renderer"),
	)

const
	h = hyperzone.h.bind(hyperzone),
	{ pushZone, popZone } = hyperzone

/** a reactive css declaration/statement */
const dec = (strings: TemplateStringsArray, ...values: Stringifiable[]): string => {
	const
		output: string[] = [strings[0],],
		len = strings.length
	for (let i = 1; i < len; i++) {
		output.push(stringify(values[i - 1]) ?? "")
		output.push(strings[i])
	}
	output.push(output.pop()! + ";")
	return output.join("")
}

// TODO: a much better way of changing single css declarations via js:
// - https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Using_dynamic_styling_information
// - https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/CSSStyleSheet


const css_rule = (selector: string, declarations: string[]) => {
	return selector + "{\n" + declarations.join(";\n\t") + "}\n"
}

// const style_literal = (selector: string) => (rule: TemplateStringsArray, ...values: any[]) => `${selector} {\n${rule}\n}`
// TODO: implement shared (or global) attribute on <style> tags when used inside of `<template>`, or perhapse implement a global style zone/renderer

const [, getParagraphText, setParagraphText] = createState("My Paragraph Template")
const my_template = <template id="my-paragraph">
	<style shared>
		{css_rule("p", [
			"color: white",
			dec`background-color: #${666}`,
			dec`padding: ${5}px`,
		])}
	</style>
	<p>{getParagraphText}</p>
	<slot name="slot-1">
		<p>Default Text</p>
	</slot>
</template> as HTMLTemplateElement

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
	<MyParagraph />
)

// notice that reactivity of the template's children is not not cloned.
setTimeout(() => {
	setParagraphText("Paragraph text has been changed after 2000ms")
}, 2000)

export { bindMethodToSelfByName } from "jsr:@oazmi/kitchensink@0.7.5/binder"
export { array_isArray, console_error, number_parseInt, object_assign, object_entries, object_fromEntries } from "jsr:@oazmi/kitchensink@0.7.5/builtin_aliases_deps"
export { isFunction } from "jsr:@oazmi/kitchensink@0.7.5/struct"
export type { ConstructorOf } from "jsr:@oazmi/kitchensink@0.7.5/typedefs"


/** flags used for minifying (or eliminating) debugging logs and asserts, when an intelligent bundler, such as `esbuild`, is used. */
export const enum DEBUG {
	LOG = 0,
	ASSERT = 0,
	ERROR = 0,
	PRODUCTION = 1,
	MINIFY = 1,
}

export const dom_customElements = globalThis.customElements

export type PreserveStringKeyAndValues<T> = { [K in keyof T as (K extends string ? T[K] extends string ? K : never : never)]: T[K] }


// TODO: add a `[REFS]` symbol in `DefaultProps`, which will allow the user to set the props of user-named child components inside of the component generator.
/* @example
```tsx
const ComponentA = ({name: string}) => {
	return <div>
		Hello Mr. {name}
	</div>
}
const ComponentA_REF = Symbol(reference attributes for any ComponentA)
const ComponentB = ({ age: number }) => {
	// the props is implicitly of the type: `{ age: number, [REFS]: { [ComponentA_REF]: { name: string } }}`
	// if `props[REFS]` exists, then the renderer will push its config into the stack of that specific reference's (`ComponentA_REF`'s) default props.
	return <div>
		<ComponentA />.
		Your age is {age}.
	</div>
	// the renderer should now pop the `ComponentA_REF`'s default config stack, if `props[REFS][ComponentA_REF]` was previously pushed.
}
const my_div = <ComponentB age=81 {...{[REFS]: { [ComponentA_REF]: { name: string } }}} />
```
I think this feature should be implemented inside of the `processChild` method.
*/

// PARTIAL (not user friendly yet): add dedicated style manipulation
// DONE (it's now accessible via `[MEMBERS]` symbol): add dedicated element property manipulation, such as: `HTMLInputElement.value` and `HTMLElement.style`.
//       these things are different from their equivalent attribute nodes, but they are coupled. although the properties hold the "true" value.
// TODO: create a core `Component_Render` for `<template>` types, or support the more generic web-components model.
//       they've got their own set of rules for cloning (shadow root and stuff) and appending (template_dom.content.append),
//       so the standard html component generator/renderer is not suitable for it.
// DONE: purge the use of symbols to change scopes, and instead plug in the instances of the render classes directly into the zone.
// TODO: implement classList convenience property key for reactive classes
// TODO: purge `[ADVANCED_EVENTS]` and replace it with `[EVENTS]`, and make the base component class take care of inferring which kind it is.

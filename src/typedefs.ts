import type { Component_Render } from "./mod.ts"

/** any object or primitive that implements the `toString` method. */
export type Stringifiable = { toString(): string }

/** a truthy value assigned to the attribute of an `Element` will get converted to an empty string `""`,
 * so that it renders as an attribute without a value. (for instance, the `checked` attribute of `<input type="checkbox" checked />`)
*/
export type AttrTruthy = "" | true

/** a falsy value assigned to the attribute of an `Element` will cause it to detach. <br>
 * but when converted to non-falsy value, then it will get reattached to its original parent element.
*/
export type AttrFalsy = null | undefined | false

/** the value assignable to any attribute of an `Element`. <br>
 * this is specifically for {@link Component_Render | `Component_Render`} and its subclasses.
*/
export type AttrValue = Stringifiable | AttrTruthy | AttrFalsy

/** the value assignable to any `TextNode` */
export type TextValue = Stringifiable | null | undefined

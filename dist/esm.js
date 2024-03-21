var is_nullable = (value) => value == null, is_boolean = (value) => value === true || value === false, stringify = (value) => is_nullable(value) ? null : value.toString(), stringifyAttrValue = (value) => is_boolean(value) ? value ? "" : null : stringify(value), HTMLTagComponent = (props) => document.createElement(props.tag), SVGTagComponent = (props) => document.createElementNS("http://www.w3.org/2000/svg", props.tag), FragmentTagComponent = (props) => [];
var string_fromCharCode = String.fromCharCode;
var {
  from: array_from,
  isArray: array_isArray,
  of: array_of
} = Array, {
  MAX_VALUE: number_MAX_VALUE,
  NEGATIVE_INFINITY: number_NEGATIVE_INFINITY,
  POSITIVE_INFINITY: number_POSITIVE_INFINITY,
  isFinite: number_isFinite,
  isInteger: number_isInteger,
  isNaN: number_isNaN,
  parseFloat: number_parseFloat,
  parseInt: number_parseInt
} = Number, {
  random: math_random
} = Math, {
  assign: object_assign,
  defineProperty: object_defineProperty,
  entries: object_entries,
  fromEntries: object_fromEntries,
  keys: object_keys,
  getPrototypeOf: object_getPrototypeOf,
  values: object_values
} = Object, date_now = Date.now, {
  iterator: symbol_iterator,
  toStringTag: symbol_toStringTag
} = Symbol;
var {
  assert: console_assert,
  clear: console_clear,
  debug: console_debug,
  dir: console_dir,
  error: console_error,
  log: console_log,
  table: console_table
} = console, {
  now: performance_now
} = performance;
var isFunction = (obj) => typeof obj == "function";
var bindMethodToSelfByName = (self, method_name, ...args) => self[method_name].bind(self, ...args);
var dom_customElements = globalThis.customElements;
var ATTRS = Symbol(1), EVENTS = Symbol(1), MEMBERS = Symbol(1), STYLE = Symbol(1), ONINIT = Symbol(1), ONCLEAN = Symbol(1), normalizeAttrProps = (props) => {
  let {
    [EVENTS]: event_props,
    [MEMBERS]: member_props,
    [STYLE]: style_props,
    [ONINIT]: oninit_fn,
    [ONCLEAN]: onclean_fn,
    [ATTRS]: other_attr_props,
    ...attr_props
  } = props ?? {};
  return {
    [EVENTS]: event_props,
    [MEMBERS]: member_props,
    [STYLE]: style_props,
    [ONINIT]: oninit_fn,
    [ONCLEAN]: onclean_fn,
    [ATTRS]: { ...attr_props, ...other_attr_props }
  };
}, inlinePropsRemapper = (props) => {
  let {
    // [STYLE]: style_props, // do not use the `[STYLE]` symbol prop key for inline hyperzone rendering
    [ATTRS]: attr_props = {},
    [EVENTS]: event_props = {},
    [MEMBERS]: member_props = {},
    style: style_props,
    init: oninit_fn,
    clean: onclean_fn,
    ...rest_props
  } = props ?? {}, component_props = object_fromEntries(
    object_entries(rest_props).filter(([key, value]) => {
      if (key.startsWith("on:"))
        event_props[key.slice(3)] = value;
      else if (key.startsWith("set:"))
        member_props[key.slice(4)] = value;
      else if (key.startsWith("attr:"))
        attr_props[key.slice(5)] = value;
      else
        return true;
    })
  );
  return object_assign(component_props, {
    [ATTRS]: attr_props,
    [EVENTS]: event_props,
    [MEMBERS]: member_props,
    [STYLE]: style_props,
    [ONINIT]: oninit_fn,
    [ONCLEAN]: onclean_fn
  });
};
var HyperRender = class {
  constructor(config) {
  }
  /** convenience method for generating instance-bound closures out of prototype methods.
   * only for internal use.
  */
  bindMethod(method_name) {
    return bindMethodToSelfByName(this, method_name);
  }
}, Fragment = Symbol(1);
var PushZone = Symbol(1), PopZone = Symbol(1), node_only_child_filter = (child) => typeof child != "symbol", HyperZone = class extends HyperRender {
  zones = [];
  configs = {};
  constructor(config) {
    super(), this.setDefaultZone(...config?.default ?? []);
  }
  setDefaultZone(...default_zone) {
    this.zones[0] = default_zone;
  }
  pushZone(...renderers) {
    return this.zones.push(renderers), PushZone;
  }
  popZone() {
    let zones = this.zones;
    return zones.length > 1 && zones.pop(), PopZone;
  }
  seekZone() {
    return this.zones.at(-1);
  }
  test(tag, props) {
    for (let renderer of this.seekZone())
      if (renderer.test(tag, props))
        return true;
    return false;
  }
  h(tag, props, ...children) {
    for (let renderer of this.seekZone())
      if (renderer === void 0 && console_error(0), renderer.test(tag, props)) {
        let flat_children = children.flat(1).filter(node_only_child_filter);
        return renderer.h(tag, props, ...flat_children);
      }
    console_error(0, tag);
  }
  static create(config) {
    let new_hyperzone = new this(config);
    return {
      h: new_hyperzone.bindMethod("h"),
      Fragment,
      setDefaultZone: new_hyperzone.bindMethod("setDefaultZone"),
      pushZone: new_hyperzone.bindMethod("pushZone"),
      popZone: new_hyperzone.bindMethod("popZone")
    };
  }
}, InlineHyperZone = class extends HyperZone {
  h(tag, props, ...children) {
    return super.h(tag, inlinePropsRemapper(props), ...children);
  }
};
var DynamicStylable = class {
  parent;
  constructor(stylable_object) {
    this.parent = stylable_object;
  }
  setStyle(style) {
    let object_style = this.parent.style;
    style = object_fromEntries(
      object_entries(style).filter(([key, value]) => key.startsWith("--") ? (value !== void 0 && object_style.setProperty(key, value), false) : true)
    ), object_assign(object_style, style);
  }
  clearStyle() {
    let object_style = this.parent.style, all_keys = [...object_style], style = object_fromEntries(
      all_keys.filter((key) => key.startsWith("--") ? (object_style.removeProperty(key), false) : true).map((non_var_key) => [non_var_key, ""])
    );
    object_assign(object_style, style);
  }
}, DynamicStyleSheet = class {
  sheet;
  stylables;
  style_cls;
  constructor(sheet = new CSSStyleSheet(), style_controller_class = DynamicStylable) {
    this.sheet = sheet, this.style_cls = style_controller_class;
    let selector_and_stylable_pairs = [
      ...sheet.cssRules
    ].map((rule) => [rule.selectorText, new style_controller_class(rule)]);
    this.stylables = new Map(selector_and_stylable_pairs);
  }
  getSheet() {
    return this.sheet;
  }
  getRule(selector) {
    return this.stylables.get(selector);
  }
  setRule(selector, style = {}) {
    let rule_controller = this.getRule(selector);
    if (!rule_controller) {
      let sheet = this.sheet, style_class = this.style_cls;
      sheet.replaceSync(selector + ` { }
`), rule_controller = new style_class(
        [...sheet.cssRules].find((rule) => rule.selectorText === selector)
      ), this.stylables.set(selector, rule_controller);
    }
    return rule_controller.setStyle(style), rule_controller;
  }
  delRule(selector) {
    let stylables = this.stylables;
    return stylables.get(selector)?.clearStyle(), stylables.delete(selector);
  }
  renameSelector(selector, new_selector) {
    let stylables = this.stylables, rule_controller = stylables.get(selector);
    if (rule_controller)
      return rule_controller.parent.selectorText = new_selector, stylables.delete(selector), stylables.set(new_selector, rule_controller), rule_controller;
  }
};
var VanillaComponentRender = class extends HyperRender {
  test(tag, props) {
    return isFunction(tag);
  }
  h(component, props, ...children) {
    let {
      [ATTRS]: attr_props = {},
      [EVENTS]: event_props = {},
      [MEMBERS]: member_props = {},
      [STYLE]: style,
      [ONINIT]: oninit_fn,
      [ONCLEAN]: onclean_fn,
      ...rest_props
    } = props ?? {};
    children = children.map((child) => this.processChild(child));
    let component_node = component(rest_props);
    if (array_isArray(component_node))
      return component_node.push(...children), component_node;
    for (let [attr_name, attr_value] of object_entries(attr_props))
      this.addAttr(component_node, attr_name, attr_value);
    for (let [event_name, event_fn_or_tuple] of object_entries(event_props)) {
      let [event_fn, event_options] = array_isArray(event_fn_or_tuple) ? event_fn_or_tuple : [event_fn_or_tuple];
      this.addEvent(component_node, event_name, event_fn, event_options);
    }
    for (let [member_key, member_value] of object_entries(member_props))
      this.setMember(component_node, member_key, member_value);
    return style && this.setStyle(component_node, style), oninit_fn && this.runOnInit(component_node, oninit_fn), component_node.append(...children), component_node;
  }
  addAttr(element, attribute, value) {
    let is_existing_node = attribute instanceof Attr, attr_value = stringifyAttrValue(value), attr_value_is_null = is_nullable(attr_value), attr = is_existing_node ? attribute : (element.setAttribute(attribute, attr_value ?? ""), element.getAttributeNode(attribute));
    return is_existing_node && !attr_value_is_null && (attr.nodeValue = attr_value, element.setAttributeNode(attr)), attr_value_is_null && (element.removeAttributeNode(attr), attr.nodeValue = attr_value), attr;
  }
  addEvent(element, event_name, event_fn, options) {
    element.addEventListener(event_name, event_fn, options);
  }
  setMember(element, key, value) {
    element[key] = value;
  }
  setStyle(element, style) {
    let dynamic_stylable = new DynamicStylable(element);
    return dynamic_stylable.setStyle(style), dynamic_stylable;
  }
  runOnInit(element, init_fn) {
    init_fn(element);
  }
  runOnClean(element, clean_fn) {
    clean_fn(element);
  }
  processChild(child) {
    return child;
  }
  // TODO: add an `onDispose` or `onDelete` overridable method. and maybe also add `onInit` overridable method.
}, VanillaHTMLRender = class extends VanillaComponentRender {
  test(tag, props) {
    return typeof tag == "string";
  }
  // @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
  h(tag, props, ...children) {
    return super.h(HTMLTagComponent, { tag, ...normalizeAttrProps(props) }, ...children);
  }
}, VanillaSVGElementRender = class extends VanillaComponentRender {
  test(tag, props) {
    return typeof tag == "string";
  }
  // @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
  h(tag, props, ...children) {
    return super.h(SVGTagComponent, { tag, ...normalizeAttrProps(props) }, ...children);
  }
}, VanillaTemplateRender = class extends VanillaComponentRender {
  test(tag, props) {
    return tag === "template";
  }
  // @ts-ignore: we are breaking subclassing inheritance rules by having `tag: string` as the first argument instead of `component: ComponentGenerator`
  h(tag, props, ...children) {
    let { id, is, shallow = false, sheets = [] } = props, template = document.createElement("template"), template_content = template.content, template_constructor = class extends HTMLElement {
      constructor() {
        super();
        let shadow = this.attachShadow({ mode: "open" });
        shadow.adoptedStyleSheets.push(...sheets), shadow.appendChild(
          template_content.cloneNode(!shallow)
        );
      }
    };
    return dom_customElements.define(id, template_constructor, { extends: is }), super.h(() => template_content, {}, ...children), template;
  }
}, VanillaFragmentRender = class extends VanillaComponentRender {
  test(tag, props) {
    return tag === Fragment;
  }
  // @ts-ignore: we are breaking subclassing inheritance rules by having `tag: Fragment` as the first argument instead of `component: ComponentGenerator`
  h(tag, props, ...children) {
    return super.h(FragmentTagComponent, {}, ...children);
  }
};
export {
  ATTRS,
  DynamicStylable,
  DynamicStyleSheet,
  EVENTS,
  HyperZone,
  InlineHyperZone,
  MEMBERS,
  ONCLEAN,
  ONINIT,
  STYLE,
  VanillaComponentRender,
  VanillaFragmentRender,
  VanillaHTMLRender,
  VanillaSVGElementRender,
  VanillaTemplateRender,
  inlinePropsRemapper,
  normalizeAttrProps,
  stringify,
  stringifyAttrValue
};

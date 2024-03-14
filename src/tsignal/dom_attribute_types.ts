
export type HTMLGlobalAttributes =
	| "accesskey" | "autocapitalize" | "autofocus" | "class" | "contenteditable" | `data-${string}` | "dir" | "draggable" | "enterkeyhint" | "exportparts"
	| "hidden" | "id" | "inert" | "inputmode" | "is" | "itemid" | "itemprop" | "itemref" | "itemscope" | "itemtype" | "lang" | "nonce"
	| "part" | "popover" | "role" | "slot" | "spellcheck" | "style" | "tabindex" | "title" | "translate" | "virtualkeyboardpolicy"

export type HTMLElementTagSpecificAttributes = {
	[TagName in keyof HTMLElementTagNameMap]:
	TagName extends keyof HTMLElementTagSpecificNonGlobalAttributes
	? HTMLGlobalAttributes | HTMLElementTagSpecificNonGlobalAttributes[TagName]
	: HTMLGlobalAttributes
}

export type GlobalStyleAttributes =
	| "fill" | "stroke" | "transform" | `stroke-${string}`

export type SVGGlobalAttributes =
	| "class" | "id" | "lang" | "style" | "tabindex" | GlobalStyleAttributes

export type SVGElementTagSpecificAttributes = {
	[TagName in keyof SVGElementTagNameMap]:
	TagName extends keyof SVGElementTagSpecificNonGlobalAttributes
	? SVGGlobalAttributes | SVGElementTagSpecificNonGlobalAttributes[TagName]
	: SVGGlobalAttributes
}

type HTMLElementTagSpecificNonGlobalAttributes = {
	"a":
	| "download" | "href" | "hreflang" | "ping" | "referrerpolicy" | "rel" | "target" | "type" | "charset" | "coords"
	| "name" | "rev" | "shape"

	"area": | "alt" | "coords" | "download" | "href" | "ping" | "referrerpolicy" | "rel" | "shape" | "target"

	"audio":
	| "autoplay" | "controls" | "controlslist" | "crossorigin" | "anonymous" | "use-credentials" | "disableremoteplayback" | "loop"
	| "muted" | "preload" | "src" | "htmlmediaelement.audiotracks" | "htmlmediaelement.videotracks" | "htmlmediaelement.texttracks"

	"base": | "href" | "target"

	"blockquote": | "cite"

	"body":
	| "alink" | "background" | "bgcolor" | "bottommargin" | "leftmargin" | "link" | "onafterprint" | "onbeforeprint"
	| "onbeforeunload" | "onblur" | "onerror" | "onfocus" | "onhashchange" | "onlanguagechange" | "onload" | "onmessage"
	| "onoffline" | "ononline" | "onpopstate" | "onredo" | "onresize" | "onstorage" | "onundo" | "onunload" | "rightmargin"
	| "text" | "topmargin" | "vlink"

	"br": | "clear"

	"button":
	| "autofocus" | "disabled" | "form" | "formaction" | "formenctype" | "formmethod" | "formnovalidate"
	| "formtarget" | "name" | "popovertarget" | "popovertargetaction" | "hide" | "show" | "toggle" | "type" | "value"

	"canvas": | "height" | "moz-opaque" | "width"

	"caption": | "align"

	"col": | "span" | "align" | "bgcolor" | "char" | "charoff" | "valign" | "width"

	"colgroup": | "span" | "align" | "bgcolor" | "char" | "charoff" | "valign" | "width"

	"data": | "value"

	"del": | "cite" | "datetime"

	"details": | "open"

	"dialog": | "open" | "starting-style" | "display" | "overlay" | "transition-behavior"

	"embed": | "height" | "src" | "type" | "width"

	"fieldset": | "disabled" | "form" | "name"

	"form":
	| "accept" | "accept-charset" | "autocapitalize" | "autocomplete" | "name" | "rel" | "action" | "enctype"
	| "method" | "novalidate" | "target"

	"head": | "profile"

	"hr": | "align" | "color" | "noshade" | "size" | "width"

	"html": | "manifest" | "version" | "xmlns"

	"iframe":
	| "allow" | "allowfullscreen" | "allowpaymentrequest" | "browsingtopics" | "credentialless" | "csp" | "height"
	| "loading" | "eager" | "lazy" | "name" | "referrerpolicy" | "no-referrer" | "no-referrer-when-downgrade"
	| "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin"
	| "unsafe-url" | "sandbox" | "allow-downloads" | "allow-downloads-without-user-activation" | "allow-forms"
	| "allow-modals" | "allow-orientation-lock" | "allow-pointer-lock" | "allow-popups" | "allow-popups-to-escape-sandbox"
	| "allow-presentation" | "allow-same-origin" | "allow-scripts" | "allow-storage-access-by-user-activation"
	| "allow-top-navigation" | "allow-top-navigation-by-user-activation" | "allow-top-navigation-to-custom-protocols"
	| "src" | "srcdoc" | "width" | "align" | "frameborder" | "longdesc" | "marginheight" | "marginwidth" | "scrolling"
	| "auto" | "yes" | "no"

	"img":
	| "alt" | "crossorigin" | "anonymous" | "use-credentials" | "decoding" | "sync" | "async" | "auto" | "elementtiming"
	| "fetchpriority" | "high" | "low" | "auto_2" | "height" | "ismap" | "loading" | "eager" | "lazy" | "referrerpolicy"
	| "sizes" | "src" | "srcset" | "width" | "usemap" | "align" | "top" | "middle" | "bottom" | "left" | "right"
	| "border" | "hspace" | "longdesc" | "name" | "vspace"

	"input":
	| "accept" | "alt" | "autocapitalize" | "autocomplete" | "autofocus" | "capture" | "checked" | "dirname" | "disabled"
	| "form" | "formaction" | "formenctype" | "formmethod" | "formnovalidate" | "formtarget" | "height" | "id"
	| "inputmode" | "list" | "max" | "maxlength" | "min" | "minlength" | "multiple" | "name" | "pattern" | "placeholder"
	| "popovertarget" | "popovertargetaction" | "hide" | "show" | "toggle" | "readonly" | "required" | "size" | "src"
	| "step" | "tabindex" | "title" | "type" | "value" | "width" | "autocorrect" | "on" | "off" | "incremental" | "orient"
	| "results" | "webkitdirectory" | "checkvalidity" | "reportvalidity" | "select" | "setcustomvalidity" | "setrangetext"
	| "setselectionrange" | "showpicker" | "stepdown" | "stepup"

	"ins": | "cite" | "datetime"

	"label": | "for"

	"li": | "value" | "type"

	"link":
	| "as" | "blocking" | "crossorigin" | "anonymous" | "use-credentials" | "disabled" | "fetchpriority" | "high"
	| "low" | "auto" | "href" | "hreflang" | "imagesizes" | "imagesrcset" | "integrity" | "media" | "referrerpolicy"
	| "rel" | "sizes" | "title" | "type" | "methods" | "target" | "charset" | "rev"

	"map": | "name"

	"meta": | "charset" | "content" | "http-equiv" | "name"

	"meter": | "value" | "min" | "max" | "low" | "high" | "optimum" | "form"

	"object":
	| "archive" | "border" | "classid" | "codebase" | "codetype" | "data" | "declare" | "form" | "height" | "name"
	| "standby" | "type" | "usemap" | "width"

	"ol": | "reversed" | "start" | "type"

	"optgroup": | "disabled" | "label"

	"option": | "disabled" | "label" | "selected" | "value"

	"output": | "for" | "form" | "name"

	"pre": | "cols" | "width" | "wrap"

	"progress": | "max" | "value"

	"q": | "cite"

	"script":
	| "async" | "blocking" | "crossorigin" | "defer" | "fetchpriority" | "high" | "low" | "auto" | "integrity" | "nomodule"
	| "nonce" | "referrerpolicy" | "src" | "type" | "attribute_is_not_set_default_an_empty_string_or_a_javascript_mime_type"
	| "importmap" | "module" | "speculationrules" | "any_other_value" | "charset" | "language"

	"select": | "autocomplete" | "autofocus" | "disabled" | "form" | "multiple" | "name" | "required" | "size"

	"slot": | "name"

	"source": | "type" | "src" | "srcset" | "sizes" | "media" | "height" | "width"

	"style": | "blocking" | "media" | "nonce" | "title" | "type"

	"table": | "align" | "bgcolor" | "border" | "cellpadding" | "cellspacing" | "frame" | "rules" | "summary" | "width"

	"tbody": | "align" | "bgcolor" | "char" | "charoff" | "valign"

	"td":
	| "colspan" | "headers" | "rowspan" | "abbr" | "align" | "axis" | "bgcolor" | "char" | "charoff" | "height" | "scope"
	| "valign" | "width"

	"template": | "shadowrootmode" | "open" | "closed"

	"textarea":
	| "autocapitalize" | "autocomplete" | "autocorrect" | "on" | "off" | "autofocus" | "cols" | "dirname" | "disabled"
	| "form" | "maxlength" | "minlength" | "name" | "placeholder" | "readonly" | "required" | "rows" | "spellcheck" | "wrap"

	"tfoot": | "align" | "bgcolor" | "char" | "charoff" | "valign"

	"th":
	| "abbr" | "colspan" | "headers" | "rowspan" | "scope" | "align" | "axis" | "bgcolor" | "char" | "charoff" | "height"
	| "valign" | "width"

	"thead": | "align" | "bgcolor" | "char" | "charoff" | "valign"

	"time":
	| "datetime" | "a_valid_year_string" | "a_valid_month_string" | "a_valid_date_string" | "a_valid_yearless_date_string"
	| "a_valid_week_string" | "a_valid_time_string" | "a_valid_local_date_and_time_string"
	| "a_valid_global_date_and_time_string" | "a_valid_duration_string"

	"tr": | "align" | "bgcolor" | "char" | "charoff" | "valign"

	"track": | "default" | "kind" | "label" | "src" | "srclang"

	"ul": | "compact" | "type"

	"video":
	| "autoplay" | "controls" | "controlslist" | "crossorigin" | "anonymous" | "use-credentials" | "disablepictureinpicture"
	| "disableremoteplayback" | "height" | "loop" | "muted" | "playsinline" | "poster" | "preload" | "src" | "width"
	| "htmlmediaelement.audiotracks" | "htmlmediaelement.videotracks" | "htmlmediaelement.texttracks"
}

type SVGElementTagSpecificNonGlobalAttributes = {
	a: | "download" | "href" | "hreflang" | "ping" | "referrerpolicy" | "rel" | "target" | "type"

	animateMotion:
	| "keypoints" | "path" | "rotate"
	// animation timing attributes
	| "begin" | "dur" | "end" | "min" | "max" | "restart" | "repeatCount" | "repeatDur" | "fill"
	// animation value attributes
	| "calcMode" | "values" | "keyTimes" | "keySplines" | "from" | "to" | "by"
	// other animation attributes
	| "attributeName" | "additive" | "accumulate"
	// animation event attributes
	| "onbegin" | "onend" | "onrepeat"

	animateTransform: | "by" | "from" | "to" | "type"

	circle: | "cx" | "cy" | "r" | "pathlength"

	clipPath: | "clipPathUnits"

	ellipse: | "cx" | "cy" | "rx" | "ry" | "pathLength"

	feBlend: | "in" | "in2" | "mode"

	feColorMatrix: | "in" | "type" | "values"

	feComponentTransfer: | "in"

	feComposite: | "in" | "in2" | "operator" | "k1" | "k2" | "k3" | "k4" | "operator"

	feConvolveMatrix:
	| "in" | "order" | "kernelMatrix" | "divisor" | "bias" | "targetX" | "targetY" | "edgeMode"
	| "kernelUnitLength" | "preserveAlpha"

	feDiffuseLighting: | "in" | "surfaceScale" | "diffuseConstant" | "kernelUnitLength"

	feDisplacementMap: | "in" | "in2" | "scale" | "xChannelSelector" | "yChannelSelector"

	feDistantLight: | "azimuth" | "elevation"

	feDropShadow: | "dx" | "dy" | "stdDeviation"

	feFlood: | "flood-color" | "flood-opacity"

	feGaussianBlur: | "in" | "stdDeviation" | "edgeMode"

	feImage: | "crossorigin" | "preserveAspectRatio" | "xlink:href"

	feMergeNode: | "in"

	feMorphology: | "in" | "operator" | "radius"

	feOffset: | "in" | "dx" | "dy"

	fePointLight: | "x" | "y" | "z"

	feSpecularLighting: | "in" | "surfaceScale" | "specularConstant" | "specularExponent" | "kernelUnitLength"

	feSpotLight: | "x" | "y" | "z" | "pointsAtX" | "pointsAtY" | "pointsAtZ" | "specularExponent" | "limitingConeAngle"

	feTile: | "in"

	feTurbulence: | "baseFrequency" | "numOctaves" | "seed" | "stitchTiles" | "type"

	filter: | "x" | "y" | "width" | "height" | "filterUnits" | "primitiveUnits" | "xlink:href"

	foreignObject: | "height" | "width" | "x" | "y"

	image: | "x" | "y" | "width" | "height" | "href" | "xlink:href" | "preserveAspectRatio" | "crossorigin" | "decoding"

	line: | "x1" | "x2" | "y1" | "y2" | "pathLength"

	linearGradient: | "gradientUnits" | "gradientTransform" | "href" | "spreadMethod" | "x1" | "x2" | "y1" | "y2"

	marker: | "markerHeight" | "markerUnits" | "markerWidth" | "orient" | "preserveAspectRatio" | "refX" | "refY" | "viewBox"

	mask: | "height" | "maskContentUnits" | "maskUnits" | "x" | "y" | "width"

	mpath: | "xlink:href"

	path: | "d" | "pathLength"

	pattern:
	| "height" | "href" | "patternContentUnits" | "patternTransform" | "patternUnits" | "preserveAspectRatio" | "viewBox"
	| "width" | "x" | "y"

	polyon: | "points" | "pathLength"

	polyonLine: | "points" | "pathLength"

	radialGradient:
	| "cx" | "cy" | "fr" | "fx" | "fy" | "gradientUnits" | "gradientTransform" | "href" | "r" | "spreadMethod"

	rect: | "x" | "y" | "width" | "height" | "rx" | "ry" | "pathLength"

	script: | "crossorigin" | "href" | "type"

	set: | "to"

	stop: | "offset" | "stop-color" | "stop-opacity"

	style: | "type" | "media" | "title"

	svg: | "baseProfile" | "height" | "preserveAspectRatio" | "version" | "viewBox" | "width" | "x" | "y"

	symbol: | "height" | "preserveAspectRatio" | "refX" | "refY" | "viewBox" | "width" | "x" | "y"

	text: | "x" | "y" | "dx" | "dy" | "rotate" | "lengthAdjust" | "textLength" | "systemLanguage"

	textPath: | "href" | "lengthAdjust" | "method" | "path" | "side" | "spacing" | "startOffset" | "textLength"

	tspan: | "x" | "y" | "dx" | "dy" | "rotate" | "lengthAdjust" | "textLength"

	use: | "href" | "x" | "y" | "width" | "height"

	view: | "viewBox" | "preserveAspectRatio" | "zoomAndPan"
}

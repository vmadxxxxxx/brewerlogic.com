/*!
 * brewerlogic - 1.0.0 - 2014-03-03 16:02:03
 * Development Build
 * https://github.com/brewerlogic.com
 *
 */
//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
var Zepto = function() {
    var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter, document = window.document, elementDisplay = {}, classCache = {}, getComputedStyle = document.defaultView.getComputedStyle, cssNumber = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    }, fragmentRE = /^\s*<(\w+|!)[^>]*>/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, // special attributes that should be get/set via method calls
    methodAttributes = [ "val", "css", "html", "text", "data", "width", "height", "offset" ], adjacencyOperators = [ "after", "prepend", "before", "append" ], table = document.createElement("table"), tableRow = document.createElement("tr"), containers = {
        tr: document.createElement("tbody"),
        tbody: table,
        thead: table,
        tfoot: table,
        td: tableRow,
        th: tableRow,
        "*": document.createElement("div")
    }, readyRE = /complete|loaded|interactive/, classSelectorRE = /^\.([\w-]+)$/, idSelectorRE = /^#([\w-]*)$/, tagSelectorRE = /^[\w-]+$/, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq, tempParent = document.createElement("div");
    zepto.matches = function(element, selector) {
        if (!element || element.nodeType !== 1) return false;
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
        if (matchesSelector) return matchesSelector.call(element, selector);
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent;
        if (temp) (parent = tempParent).appendChild(element);
        match = ~zepto.qsa(parent, selector).indexOf(element);
        temp && tempParent.removeChild(element);
        return match;
    };
    function type(obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
    }
    function isFunction(value) {
        return type(value) == "function";
    }
    function isWindow(obj) {
        return obj != null && obj == obj.window;
    }
    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }
    function isObject(obj) {
        return type(obj) == "object";
    }
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
    }
    function isArray(value) {
        return value instanceof Array;
    }
    function likeArray(obj) {
        return typeof obj.length == "number";
    }
    function compact(array) {
        return filter.call(array, function(item) {
            return item != null;
        });
    }
    function flatten(array) {
        return array.length > 0 ? $.fn.concat.apply([], array) : array;
    }
    camelize = function(str) {
        return str.replace(/-+(.)?/g, function(match, chr) {
            return chr ? chr.toUpperCase() : "";
        });
    };
    function dasherize(str) {
        return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
    }
    uniq = function(array) {
        return filter.call(array, function(item, idx) {
            return array.indexOf(item) == idx;
        });
    };
    function classRE(name) {
        return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)");
    }
    function maybeAddPx(name, value) {
        return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
    }
    function defaultDisplay(nodeName) {
        var element, display;
        if (!elementDisplay[nodeName]) {
            element = document.createElement(nodeName);
            document.body.appendChild(element);
            display = getComputedStyle(element, "").getPropertyValue("display");
            element.parentNode.removeChild(element);
            display == "none" && (display = "block");
            elementDisplay[nodeName] = display;
        }
        return elementDisplay[nodeName];
    }
    function children(element) {
        return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
            if (node.nodeType == 1) return node;
        });
    }
    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overriden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    zepto.fragment = function(html, name, properties) {
        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
        if (!(name in containers)) name = "*";
        var nodes, dom, container = containers[name];
        container.innerHTML = "" + html;
        dom = $.each(slice.call(container.childNodes), function() {
            container.removeChild(this);
        });
        if (isPlainObject(properties)) {
            nodes = $(dom);
            $.each(properties, function(key, value) {
                if (methodAttributes.indexOf(key) > -1) nodes[key](value); else nodes.attr(key, value);
            });
        }
        return dom;
    };
    // `$.zepto.Z` swaps out the prototype of the given `dom` array
    // of nodes with `$.fn` and thus supplying all the Zepto functions
    // to the array. Note that `__proto__` is not supported on Internet
    // Explorer. This method can be overriden in plugins.
    zepto.Z = function(dom, selector) {
        dom = dom || [];
        dom.__proto__ = $.fn;
        dom.selector = selector || "";
        return dom;
    };
    // `$.zepto.isZ` should return `true` if the given object is a Zepto
    // collection. This method can be overriden in plugins.
    zepto.isZ = function(object) {
        return object instanceof zepto.Z;
    };
    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
    // takes a CSS selector and an optional context (and handles various
    // special cases).
    // This method can be overriden in plugins.
    zepto.init = function(selector, context) {
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z(); else if (isFunction(selector)) return $(document).ready(selector); else if (zepto.isZ(selector)) return selector; else {
            var dom;
            // normalize array if an array of nodes is given
            if (isArray(selector)) dom = compact(selector); else if (isObject(selector)) dom = [ isPlainObject(selector) ? $.extend({}, selector) : selector ], 
            selector = null; else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), 
            selector = null; else if (context !== undefined) return $(context).find(selector); else dom = zepto.qsa(document, selector);
            // create a new Zepto collection from the nodes found
            return zepto.Z(dom, selector);
        }
    };
    // `$` will be the base `Zepto` object. When calling this
    // function just call `$.zepto.init, which makes the implementation
    // details of selecting nodes and creating Zepto collections
    // patchable in plugins.
    $ = function(selector, context) {
        return zepto.init(selector, context);
    };
    function extend(target, source, deep) {
        for (key in source) if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
            if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
            extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) target[key] = source[key];
    }
    // Copy all but undefined properties from one or more
    // objects to the `target` object.
    $.extend = function(target) {
        var deep, args = slice.call(arguments, 1);
        if (typeof target == "boolean") {
            deep = target;
            target = args.shift();
        }
        args.forEach(function(arg) {
            extend(target, arg, deep);
        });
        return target;
    };
    // `$.zepto.qsa` is Zepto's CSS selector implementation which
    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
    // This method can be overriden in plugins.
    zepto.qsa = function(element, selector) {
        var found;
        return isDocument(element) && idSelectorRE.test(selector) ? (found = element.getElementById(RegExp.$1)) ? [ found ] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : slice.call(classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : element.querySelectorAll(selector));
    };
    function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector);
    }
    $.contains = function(parent, node) {
        return parent !== node && parent.contains(node);
    };
    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }
    function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
    }
    // access className property while respecting SVGAnimatedString
    function className(node, value) {
        var klass = node.className, svg = klass && klass.baseVal !== undefined;
        if (value === undefined) return svg ? klass.baseVal : klass;
        svg ? klass.baseVal = value : node.className = value;
    }
    // "true"  => true
    // "false" => false
    // "null"  => null
    // "42"    => 42
    // "42.5"  => 42.5
    // JSON    => parse if valid
    // String  => self
    function deserializeValue(value) {
        var num;
        try {
            return value ? value == "true" || (value == "false" ? false : value == "null" ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
        } catch (e) {
            return value;
        }
    }
    $.type = type;
    $.isFunction = isFunction;
    $.isWindow = isWindow;
    $.isArray = isArray;
    $.isPlainObject = isPlainObject;
    $.isEmptyObject = function(obj) {
        var name;
        for (name in obj) return false;
        return true;
    };
    $.inArray = function(elem, array, i) {
        return emptyArray.indexOf.call(array, elem, i);
    };
    $.camelCase = camelize;
    $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str);
    };
    // plugin compatibility
    $.uuid = 0;
    $.support = {};
    $.expr = {};
    $.map = function(elements, callback) {
        var value, values = [], i, key;
        if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null) values.push(value);
        } else for (key in elements) {
            value = callback(elements[key], key);
            if (value != null) values.push(value);
        }
        return flatten(values);
    };
    $.each = function(elements, callback) {
        var i, key;
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++) if (callback.call(elements[i], i, elements[i]) === false) return elements;
        } else {
            for (key in elements) if (callback.call(elements[key], key, elements[key]) === false) return elements;
        }
        return elements;
    };
    $.grep = function(elements, callback) {
        return filter.call(elements, callback);
    };
    if (window.JSON) $.parseJSON = JSON.parse;
    // Populate the class2type map
    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    // Define methods that will be available on all
    // Zepto collections
    $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,
        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn) {
            return $($.map(this, function(el, i) {
                return fn.call(el, i, el);
            }));
        },
        slice: function() {
            return $(slice.apply(this, arguments));
        },
        ready: function(callback) {
            if (readyRE.test(document.readyState)) callback($); else document.addEventListener("DOMContentLoaded", function() {
                callback($);
            }, false);
            return this;
        },
        get: function(idx) {
            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
        },
        toArray: function() {
            return this.get();
        },
        size: function() {
            return this.length;
        },
        remove: function() {
            return this.each(function() {
                if (this.parentNode != null) this.parentNode.removeChild(this);
            });
        },
        each: function(callback) {
            emptyArray.every.call(this, function(el, idx) {
                return callback.call(el, idx, el) !== false;
            });
            return this;
        },
        filter: function(selector) {
            if (isFunction(selector)) return this.not(this.not(selector));
            return $(filter.call(this, function(element) {
                return zepto.matches(element, selector);
            }));
        },
        add: function(selector, context) {
            return $(uniq(this.concat($(selector, context))));
        },
        is: function(selector) {
            return this.length > 0 && zepto.matches(this[0], selector);
        },
        not: function(selector) {
            var nodes = [];
            if (isFunction(selector) && selector.call !== undefined) this.each(function(idx) {
                if (!selector.call(this, idx)) nodes.push(this);
            }); else {
                var excludes = typeof selector == "string" ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                this.forEach(function(el) {
                    if (excludes.indexOf(el) < 0) nodes.push(el);
                });
            }
            return $(nodes);
        },
        has: function(selector) {
            return this.filter(function() {
                return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
            });
        },
        eq: function(idx) {
            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
        },
        first: function() {
            var el = this[0];
            return el && !isObject(el) ? el : $(el);
        },
        last: function() {
            var el = this[this.length - 1];
            return el && !isObject(el) ? el : $(el);
        },
        find: function(selector) {
            var result, $this = this;
            if (typeof selector == "object") result = $(selector).filter(function() {
                var node = this;
                return emptyArray.some.call($this, function(parent) {
                    return $.contains(parent, node);
                });
            }); else if (this.length == 1) result = $(zepto.qsa(this[0], selector)); else result = this.map(function() {
                return zepto.qsa(this, selector);
            });
            return result;
        },
        closest: function(selector, context) {
            var node = this[0], collection = false;
            if (typeof selector == "object") collection = $(selector);
            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) node = node !== context && !isDocument(node) && node.parentNode;
            return $(node);
        },
        parents: function(selector) {
            var ancestors = [], nodes = this;
            while (nodes.length > 0) nodes = $.map(nodes, function(node) {
                if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                    ancestors.push(node);
                    return node;
                }
            });
            return filtered(ancestors, selector);
        },
        parent: function(selector) {
            return filtered(uniq(this.pluck("parentNode")), selector);
        },
        children: function(selector) {
            return filtered(this.map(function() {
                return children(this);
            }), selector);
        },
        contents: function() {
            return this.map(function() {
                return slice.call(this.childNodes);
            });
        },
        siblings: function(selector) {
            return filtered(this.map(function(i, el) {
                return filter.call(children(el.parentNode), function(child) {
                    return child !== el;
                });
            }), selector);
        },
        empty: function() {
            return this.each(function() {
                this.innerHTML = "";
            });
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property) {
            return $.map(this, function(el) {
                return el[property];
            });
        },
        show: function() {
            return this.each(function() {
                this.style.display == "none" && (this.style.display = null);
                if (getComputedStyle(this, "").getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
            });
        },
        replaceWith: function(newContent) {
            return this.before(newContent).remove();
        },
        wrap: function(structure) {
            var func = isFunction(structure);
            if (this[0] && !func) var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
            return this.each(function(index) {
                $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
            });
        },
        wrapAll: function(structure) {
            if (this[0]) {
                $(this[0]).before(structure = $(structure));
                var children;
                // drill down to the inmost element
                while ((children = structure.children()).length) structure = children.first();
                $(structure).append(this);
            }
            return this;
        },
        wrapInner: function(structure) {
            var func = isFunction(structure);
            return this.each(function(index) {
                var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
                contents.length ? contents.wrapAll(dom) : self.append(dom);
            });
        },
        unwrap: function() {
            this.parent().each(function() {
                $(this).replaceWith($(this).children());
            });
            return this;
        },
        clone: function() {
            return this.map(function() {
                return this.cloneNode(true);
            });
        },
        hide: function() {
            return this.css("display", "none");
        },
        toggle: function(setting) {
            return this.each(function() {
                var el = $(this);
                (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
            });
        },
        prev: function(selector) {
            return $(this.pluck("previousElementSibling")).filter(selector || "*");
        },
        next: function(selector) {
            return $(this.pluck("nextElementSibling")).filter(selector || "*");
        },
        html: function(html) {
            return html === undefined ? this.length > 0 ? this[0].innerHTML : null : this.each(function(idx) {
                var originHtml = this.innerHTML;
                $(this).empty().append(funcArg(this, html, idx, originHtml));
            });
        },
        text: function(text) {
            return text === undefined ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                this.textContent = text;
            });
        },
        attr: function(name, value) {
            var result;
            return typeof name == "string" && value === undefined ? this.length == 0 || this[0].nodeType !== 1 ? undefined : name == "value" && this[0].nodeName == "INPUT" ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function(idx) {
                if (this.nodeType !== 1) return;
                if (isObject(name)) for (key in name) setAttribute(this, key, name[key]); else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
            });
        },
        removeAttr: function(name) {
            return this.each(function() {
                this.nodeType === 1 && setAttribute(this, name);
            });
        },
        prop: function(name, value) {
            return value === undefined ? this[0] && this[0][name] : this.each(function(idx) {
                this[name] = funcArg(this, value, idx, this[name]);
            });
        },
        data: function(name, value) {
            var data = this.attr("data-" + dasherize(name), value);
            return data !== null ? deserializeValue(data) : undefined;
        },
        val: function(value) {
            return value === undefined ? this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function(o) {
                return this.selected;
            }).pluck("value") : this[0].value) : this.each(function(idx) {
                this.value = funcArg(this, value, idx, this.value);
            });
        },
        offset: function(coordinates) {
            if (coordinates) return this.each(function(index) {
                var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {
                    top: coords.top - parentOffset.top,
                    left: coords.left - parentOffset.left
                };
                if ($this.css("position") == "static") props["position"] = "relative";
                $this.css(props);
            });
            if (this.length == 0) return null;
            var obj = this[0].getBoundingClientRect();
            return {
                left: obj.left + window.pageXOffset,
                top: obj.top + window.pageYOffset,
                width: Math.round(obj.width),
                height: Math.round(obj.height)
            };
        },
        css: function(property, value) {
            if (arguments.length < 2 && typeof property == "string") return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], "").getPropertyValue(property));
            var css = "";
            if (type(property) == "string") {
                if (!value && value !== 0) this.each(function() {
                    this.style.removeProperty(dasherize(property));
                }); else css = dasherize(property) + ":" + maybeAddPx(property, value);
            } else {
                for (key in property) if (!property[key] && property[key] !== 0) this.each(function() {
                    this.style.removeProperty(dasherize(key));
                }); else css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";";
            }
            return this.each(function() {
                this.style.cssText += ";" + css;
            });
        },
        index: function(element) {
            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
        },
        hasClass: function(name) {
            return emptyArray.some.call(this, function(el) {
                return this.test(className(el));
            }, classRE(name));
        },
        addClass: function(name) {
            return this.each(function(idx) {
                classList = [];
                var cls = className(this), newName = funcArg(this, name, idx, cls);
                newName.split(/\s+/g).forEach(function(klass) {
                    if (!$(this).hasClass(klass)) classList.push(klass);
                }, this);
                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
            });
        },
        removeClass: function(name) {
            return this.each(function(idx) {
                if (name === undefined) return className(this, "");
                classList = className(this);
                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                    classList = classList.replace(classRE(klass), " ");
                });
                className(this, classList.trim());
            });
        },
        toggleClass: function(name, when) {
            return this.each(function(idx) {
                var $this = $(this), names = funcArg(this, name, idx, className(this));
                names.split(/\s+/g).forEach(function(klass) {
                    (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
                });
            });
        },
        scrollTop: function() {
            if (!this.length) return;
            return "scrollTop" in this[0] ? this[0].scrollTop : this[0].scrollY;
        },
        position: function() {
            if (!this.length) return;
            var elem = this[0], // Get *real* offsetParent
            offsetParent = this.offsetParent(), // Get correct offsets
            offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
                top: 0,
                left: 0
            } : offsetParent.offset();
            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat($(elem).css("margin-top")) || 0;
            offset.left -= parseFloat($(elem).css("margin-left")) || 0;
            // Add offsetParent borders
            parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0;
            parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0;
            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var parent = this.offsetParent || document.body;
                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") parent = parent.offsetParent;
                return parent;
            });
        }
    };
    // for now
    $.fn.detach = $.fn.remove;
    [ "width", "height" ].forEach(function(dimension) {
        $.fn[dimension] = function(value) {
            var offset, el = this[0], Dimension = dimension.replace(/./, function(m) {
                return m[0].toUpperCase();
            });
            if (value === undefined) return isWindow(el) ? el["inner" + Dimension] : isDocument(el) ? el.documentElement["offset" + Dimension] : (offset = this.offset()) && offset[dimension]; else return this.each(function(idx) {
                el = $(this);
                el.css(dimension, funcArg(this, value, idx, el[dimension]()));
            });
        };
    });
    function traverseNode(node, fun) {
        fun(node);
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun);
    }
    // Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2;
        //=> prepend, append
        $.fn[operator] = function() {
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType, nodes = $.map(arguments, function(arg) {
                argType = type(arg);
                return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg);
            }), parent, copyByClone = this.length > 1;
            if (nodes.length < 1) return this;
            return this.each(function(_, target) {
                parent = inside ? target : target.parentNode;
                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
                nodes.forEach(function(node) {
                    if (copyByClone) node = node.cloneNode(true); else if (!parent) return $(node).remove();
                    traverseNode(parent.insertBefore(node, target), function(el) {
                        if (el.nodeName != null && el.nodeName.toUpperCase() === "SCRIPT" && (!el.type || el.type === "text/javascript") && !el.src) window["eval"].call(window, el.innerHTML);
                    });
                });
            });
        };
        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
            $(html)[operator](this);
            return this;
        };
    });
    zepto.Z.prototype = $.fn;
    // Export internal API functions in the `$.zepto` namespace
    zepto.uniq = uniq;
    zepto.deserializeValue = deserializeValue;
    $.zepto = zepto;
    return $;
}();

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto;

"$" in window || (window.$ = Zepto);

(function($) {
    var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents = {}, hover = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents";
    function zid(element) {
        return element._zid || (element._zid = _zid++);
    }
    function findHandlers(element, event, fn, selector) {
        event = parse(event);
        if (event.ns) var matcher = matcherFor(event.ns);
        return (handlers[zid(element)] || []).filter(function(handler) {
            return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
        });
    }
    function parse(event) {
        var parts = ("" + event).split(".");
        return {
            e: parts[0],
            ns: parts.slice(1).sort().join(" ")
        };
    }
    function matcherFor(ns) {
        return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)");
    }
    function eachEvent(events, fn, iterator) {
        if ($.type(events) != "string") $.each(events, iterator); else events.split(/\s/).forEach(function(type) {
            iterator(type, fn);
        });
    }
    function eventCapture(handler, captureSetting) {
        return handler.del && (handler.e == "focus" || handler.e == "blur") || !!captureSetting;
    }
    function realEvent(type) {
        return hover[type] || type;
    }
    function add(element, events, fn, selector, getDelegate, capture) {
        var id = zid(element), set = handlers[id] || (handlers[id] = []);
        eachEvent(events, fn, function(event, fn) {
            var handler = parse(event);
            handler.fn = fn;
            handler.sel = selector;
            // emulate mouseenter, mouseleave
            if (handler.e in hover) fn = function(e) {
                var related = e.relatedTarget;
                if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
            };
            handler.del = getDelegate && getDelegate(fn, event);
            var callback = handler.del || fn;
            handler.proxy = function(e) {
                var result = callback.apply(element, [ e ].concat(e.data));
                if (result === false) e.preventDefault(), e.stopPropagation();
                return result;
            };
            handler.i = set.length;
            set.push(handler);
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
        });
    }
    function remove(element, events, fn, selector, capture) {
        var id = zid(element);
        eachEvent(events || "", fn, function(event, fn) {
            findHandlers(element, event, fn, selector).forEach(function(handler) {
                delete handlers[id][handler.i];
                element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
            });
        });
    }
    $.event = {
        add: add,
        remove: remove
    };
    $.proxy = function(fn, context) {
        if ($.isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, arguments);
            };
            proxyFn._zid = zid(fn);
            return proxyFn;
        } else if (typeof context == "string") {
            return $.proxy(fn[context], fn);
        } else {
            throw new TypeError("expected function");
        }
    };
    $.fn.bind = function(event, callback) {
        return this.each(function() {
            add(this, event, callback);
        });
    };
    $.fn.unbind = function(event, callback) {
        return this.each(function() {
            remove(this, event, callback);
        });
    };
    $.fn.one = function(event, callback) {
        return this.each(function(i, element) {
            add(this, event, callback, null, function(fn, type) {
                return function() {
                    var result = fn.apply(element, arguments);
                    remove(element, type, fn);
                    return result;
                };
            });
        });
    };
    var returnTrue = function() {
        return true;
    }, returnFalse = function() {
        return false;
    }, ignoreProperties = /^([A-Z]|layer[XY]$)/, eventMethods = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
    };
    function createProxy(event) {
        var key, proxy = {
            originalEvent: event
        };
        for (key in event) if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
        $.each(eventMethods, function(name, predicate) {
            proxy[name] = function() {
                this[predicate] = returnTrue;
                return event[name].apply(event, arguments);
            };
            proxy[predicate] = returnFalse;
        });
        return proxy;
    }
    // emulates the 'defaultPrevented' property for browsers that have none
    function fix(event) {
        if (!("defaultPrevented" in event)) {
            event.defaultPrevented = false;
            var prevent = event.preventDefault;
            event.preventDefault = function() {
                this.defaultPrevented = true;
                prevent.call(this);
            };
        }
    }
    $.fn.delegate = function(selector, event, callback) {
        return this.each(function(i, element) {
            add(element, event, callback, selector, function(fn) {
                return function(e) {
                    var evt, match = $(e.target).closest(selector, element).get(0);
                    if (match) {
                        evt = $.extend(createProxy(e), {
                            currentTarget: match,
                            liveFired: element
                        });
                        return fn.apply(match, [ evt ].concat([].slice.call(arguments, 1)));
                    }
                };
            });
        });
    };
    $.fn.undelegate = function(selector, event, callback) {
        return this.each(function() {
            remove(this, event, callback, selector);
        });
    };
    $.fn.live = function(event, callback) {
        $(document.body).delegate(this.selector, event, callback);
        return this;
    };
    $.fn.die = function(event, callback) {
        $(document.body).undelegate(this.selector, event, callback);
        return this;
    };
    $.fn.on = function(event, selector, callback) {
        return !selector || $.isFunction(selector) ? this.bind(event, selector || callback) : this.delegate(selector, event, callback);
    };
    $.fn.off = function(event, selector, callback) {
        return !selector || $.isFunction(selector) ? this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
    };
    $.fn.trigger = function(event, data) {
        if (typeof event == "string" || $.isPlainObject(event)) event = $.Event(event);
        fix(event);
        event.data = data;
        return this.each(function() {
            // items in the collection might not be DOM elements
            // (todo: possibly support events on plain old objects)
            if ("dispatchEvent" in this) this.dispatchEvent(event);
        });
    };
    // triggers event handlers on current element just as if an event occurred,
    // doesn't trigger an actual event, doesn't bubble
    $.fn.triggerHandler = function(event, data) {
        var e, result;
        this.each(function(i, element) {
            e = createProxy(typeof event == "string" ? $.Event(event) : event);
            e.data = data;
            e.target = element;
            $.each(findHandlers(element, event.type || event), function(i, handler) {
                result = handler.proxy(e);
                if (e.isImmediatePropagationStopped()) return false;
            });
        });
        return result;
    };
    ("focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select keydown keypress keyup error").split(" ").forEach(function(event) {
        $.fn[event] = function(callback) {
            return callback ? this.bind(event, callback) : this.trigger(event);
        };
    });
    [ "focus", "blur" ].forEach(function(name) {
        $.fn[name] = function(callback) {
            if (callback) this.bind(name, callback); else this.each(function() {
                try {
                    this[name]();
                } catch (e) {}
            });
            return this;
        };
    });
    $.Event = function(type, props) {
        if (typeof type != "string") props = type, type = props.type;
        var event = document.createEvent(specialEvents[type] || "Events"), bubbles = true;
        if (props) for (var name in props) name == "bubbles" ? bubbles = !!props[name] : event[name] = props[name];
        event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
        event.isDefaultPrevented = function() {
            return this.defaultPrevented;
        };
        return event;
    };
})(Zepto);

(function($) {
    var jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
    // trigger a custom event and return false if it was cancelled
    function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName);
        $(context).trigger(event, data);
        return !event.defaultPrevented;
    }
    // trigger an Ajax "global" event
    function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data);
    }
    // Number of active Ajax requests
    $.active = 0;
    function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, "ajaxStart");
    }
    function ajaxStop(settings) {
        if (settings.global && !--$.active) triggerGlobal(settings, null, "ajaxStop");
    }
    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
    function ajaxBeforeSend(xhr, settings) {
        var context = settings.context;
        if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, "ajaxBeforeSend", [ xhr, settings ]) === false) return false;
        triggerGlobal(settings, context, "ajaxSend", [ xhr, settings ]);
    }
    function ajaxSuccess(data, xhr, settings) {
        var context = settings.context, status = "success";
        settings.success.call(context, data, status, xhr);
        triggerGlobal(settings, context, "ajaxSuccess", [ xhr, settings, data ]);
        ajaxComplete(status, xhr, settings);
    }
    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings) {
        var context = settings.context;
        settings.error.call(context, xhr, type, error);
        triggerGlobal(settings, context, "ajaxError", [ xhr, settings, error ]);
        ajaxComplete(type, xhr, settings);
    }
    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context;
        settings.complete.call(context, xhr, status);
        triggerGlobal(settings, context, "ajaxComplete", [ xhr, settings ]);
        ajaxStop(settings);
    }
    // Empty function, used as default callback
    function empty() {}
    $.ajaxJSONP = function(options) {
        if (!("type" in options)) return $.ajax(options);
        var callbackName = "jsonp" + ++jsonpID, script = document.createElement("script"), cleanup = function() {
            clearTimeout(abortTimeout);
            $(script).remove();
            delete window[callbackName];
        }, abort = function(type) {
            cleanup();
            // In case of manual abort or timeout, keep an empty function as callback
            // so that the SCRIPT tag that eventually loads won't result in an error.
            if (!type || type == "timeout") window[callbackName] = empty;
            ajaxError(null, type || "abort", xhr, options);
        }, xhr = {
            abort: abort
        }, abortTimeout;
        if (ajaxBeforeSend(xhr, options) === false) {
            abort("abort");
            return false;
        }
        window[callbackName] = function(data) {
            cleanup();
            ajaxSuccess(data, xhr, options);
        };
        script.onerror = function() {
            abort("error");
        };
        script.src = options.url.replace(/=\?/, "=" + callbackName);
        $("head").append(script);
        if (options.timeout > 0) abortTimeout = setTimeout(function() {
            abort("timeout");
        }, options.timeout);
        return xhr;
    };
    $.ajaxSettings = {
        // Default type of request
        type: "GET",
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function() {
            return new window.XMLHttpRequest();
        },
        // MIME types mapping
        accepts: {
            script: "text/javascript, application/javascript",
            json: jsonType,
            xml: "application/xml, text/xml",
            html: htmlType,
            text: "text/plain"
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
    };
    function mimeToDataType(mime) {
        if (mime) mime = mime.split(";", 2)[0];
        return mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text";
    }
    function appendQuery(url, query) {
        return (url + "&" + query).replace(/[&?]{1,2}/, "?");
    }
    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
        if (options.data && (!options.type || options.type.toUpperCase() == "GET")) options.url = appendQuery(options.url, options.data);
    }
    $.ajax = function(options) {
        var settings = $.extend({}, options || {});
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
        ajaxStart(settings);
        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
        if (!settings.url) settings.url = window.location.toString();
        serializeData(settings);
        if (settings.cache === false) settings.url = appendQuery(settings.url, "_=" + Date.now());
        var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url);
        if (dataType == "jsonp" || hasPlaceholder) {
            if (!hasPlaceholder) settings.url = appendQuery(settings.url, "callback=?");
            return $.ajaxJSONP(settings);
        }
        var mime = settings.accepts[dataType], baseHeaders = {}, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), abortTimeout;
        if (!settings.crossDomain) baseHeaders["X-Requested-With"] = "XMLHttpRequest";
        if (mime) {
            baseHeaders["Accept"] = mime;
            if (mime.indexOf(",") > -1) mime = mime.split(",", 2)[0];
            xhr.overrideMimeType && xhr.overrideMimeType(mime);
        }
        if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != "GET") baseHeaders["Content-Type"] = settings.contentType || "application/x-www-form-urlencoded";
        settings.headers = $.extend(baseHeaders, settings.headers || {});
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);
                var result, error = false;
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") {
                    dataType = dataType || mimeToDataType(xhr.getResponseHeader("content-type"));
                    result = xhr.responseText;
                    try {
                        // http://perfectionkills.com/global-eval-what-are-the-options/
                        if (dataType == "script") (1, eval)(result); else if (dataType == "xml") result = xhr.responseXML; else if (dataType == "json") result = blankRE.test(result) ? null : $.parseJSON(result);
                    } catch (e) {
                        error = e;
                    }
                    if (error) ajaxError(error, "parsererror", xhr, settings); else ajaxSuccess(result, xhr, settings);
                } else {
                    ajaxError(null, xhr.status ? "error" : "abort", xhr, settings);
                }
            }
        };
        var async = "async" in settings ? settings.async : true;
        xhr.open(settings.type, settings.url, async);
        for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name]);
        if (ajaxBeforeSend(xhr, settings) === false) {
            xhr.abort();
            return false;
        }
        if (settings.timeout > 0) abortTimeout = setTimeout(function() {
            xhr.onreadystatechange = empty;
            xhr.abort();
            ajaxError(null, "timeout", xhr, settings);
        }, settings.timeout);
        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null);
        return xhr;
    };
    // handle optional data/success arguments
    function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data);
        return {
            url: url,
            data: hasData ? data : undefined,
            success: !hasData ? data : $.isFunction(success) ? success : undefined,
            dataType: hasData ? dataType || success : success
        };
    }
    $.get = function(url, data, success, dataType) {
        return $.ajax(parseArguments.apply(null, arguments));
    };
    $.post = function(url, data, success, dataType) {
        var options = parseArguments.apply(null, arguments);
        options.type = "POST";
        return $.ajax(options);
    };
    $.getJSON = function(url, data, success) {
        var options = parseArguments.apply(null, arguments);
        options.dataType = "json";
        return $.ajax(options);
    };
    $.fn.load = function(url, data, success) {
        if (!this.length) return this;
        var self = this, parts = url.split(/\s/), selector, options = parseArguments(url, data, success), callback = options.success;
        if (parts.length > 1) options.url = parts[0], selector = parts[1];
        options.success = function(response) {
            self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response);
            callback && callback.apply(self, arguments);
        };
        $.ajax(options);
        return this;
    };
    var escape = encodeURIComponent;
    function serialize(params, obj, traditional, scope) {
        var type, array = $.isArray(obj);
        $.each(obj, function(key, value) {
            type = $.type(value);
            if (scope) key = traditional ? scope : scope + "[" + (array ? "" : key) + "]";
            // handle data in serializeArray() format
            if (!scope && array) params.add(value.name, value.value); else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key); else params.add(key, value);
        });
    }
    $.param = function(obj, traditional) {
        var params = [];
        params.add = function(k, v) {
            this.push(escape(k) + "=" + escape(v));
        };
        serialize(params, obj, traditional);
        return params.join("&").replace(/%20/g, "+");
    };
})(Zepto);

(function($) {
    var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches;
    function visible(elem) {
        elem = $(elem);
        return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
    }
    // Implements a subset from:
    // http://api.jquery.com/category/selectors/jquery-selector-extensions/
    //
    // Each filter function receives the current index, all nodes in the
    // considered set, and a value if there were parentheses. The value
    // of `this` is the node currently being considered. The function returns the
    // resulting node(s), null, or undefined.
    //
    // Complex selectors are not supported:
    //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
    //   ul.inner:first > li
    var filters = $.expr[":"] = {
        visible: function() {
            if (visible(this)) return this;
        },
        hidden: function() {
            if (!visible(this)) return this;
        },
        selected: function() {
            if (this.selected) return this;
        },
        checked: function() {
            if (this.checked) return this;
        },
        parent: function() {
            return this.parentNode;
        },
        first: function(idx) {
            if (idx === 0) return this;
        },
        last: function(idx, nodes) {
            if (idx === nodes.length - 1) return this;
        },
        eq: function(idx, _, value) {
            if (idx === value) return this;
        },
        contains: function(idx, _, text) {
            if ($(this).text().indexOf(text) > -1) return this;
        },
        has: function(idx, _, sel) {
            if (zepto.qsa(this, sel).length) return this;
        }
    };
    var filterRe = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"), childRe = /^\s*>/, classTag = "Zepto" + +new Date();
    function process(sel, fn) {
        // quote the hash in `a[href^=#]` expression
        sel = sel.replace(/=#\]/g, '="#"]');
        var filter, arg, match = filterRe.exec(sel);
        if (match && match[2] in filters) {
            filter = filters[match[2]], arg = match[3];
            sel = match[1];
            if (arg) {
                var num = Number(arg);
                if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, ""); else arg = num;
            }
        }
        return fn(sel, filter, arg);
    }
    zepto.qsa = function(node, selector) {
        return process(selector, function(sel, filter, arg) {
            try {
                var taggedParent;
                if (!sel && filter) sel = "*"; else if (childRe.test(sel)) // support "> *" child queries by tagging the parent node with a
                // unique class and prepending that classname onto the selector
                taggedParent = $(node).addClass(classTag), sel = "." + classTag + " " + sel;
                var nodes = oldQsa(node, sel);
            } catch (e) {
                console.error("error performing selector: %o", selector);
                throw e;
            } finally {
                if (taggedParent) taggedParent.removeClass(classTag);
            }
            return !filter ? nodes : zepto.uniq($.map(nodes, function(n, i) {
                return filter.call(n, i, nodes, arg);
            }));
        });
    };
    zepto.matches = function(node, selector) {
        return process(selector, function(sel, filter, arg) {
            return (!sel || oldMatches(node, sel)) && (!filter || filter.call(node, null, arg) === node);
        });
    };
})(Zepto);

(function(w, undefined) {
    "use strict";
    var ILID = ("il" + Math.random()).replace(/0\./g, "");
    var EVENTS = "load error";
    var ALLOWED_NODE_TYPES = [ 1, // ELEMENT_NODE
    9, // DOCUMENT_NODE
    11 ];
    /**
	 * Return type of the value.
	 *
	 * @param  {Mixed} value
	 *
	 * @return {String}
	 */
    function type(value) {
        if (value == null) {
            return String(value);
        }
        if (typeof value === "object" || typeof value === "function") {
            return value instanceof w.NodeList && "nodelist" || value instanceof w.HTMLCollection && "htmlcollection" || Object.prototype.toString.call(value).match(/\s([a-z]+)/i)[1].toLowerCase();
        }
        return typeof value;
    }
    /**
	 * Convert array-like objects into an array.
	 *
	 * @param  {Mixed} collection
	 *
	 * @return {Array}
	 */
    function toArray(collection) {
        switch (type(collection)) {
          case "array":
            return collection;

          case "undefined":
            return [];

          case "nodelist":
          case "htmlcollection":
          case "arguments":
            var arr = [];
            for (var i = 0, l = collection.length; i < l; i++) {
                if (i in collection) {
                    arr.push(collection[i]);
                }
            }
            return arr;

          default:
            return [ collection ];
        }
    }
    /**
	 * Check whether the value is in an array.
	 *
	 * @param  {Mixed} value
	 * @param  {Array} array
	 *
	 * @return {Boolean}
	 */
    function inArray(value, array) {
        if (type(array) !== "array") {
            return -1;
        }
        if (array.indexOf) {
            return array.indexOf(value);
        }
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }
    /**
	 * Callback proxy.
	 *
	 * Ensures that callback will receive a specific context.
	 *
	 * @param {Mixed}    context
	 * @param {Function} callback
	 */
    function proxy(context, callback) {
        return function() {
            return callback.apply(context, arguments);
        };
    }
    /**
	 * Add event listeners to element.
	 *
	 * @param  {Node}     element
	 * @param  {Event}    eventName
	 * @param  {Function} handler
	 *
	 * @return {Void}
	 */
    function bind(element, eventName, handler) {
        listener(element, eventName, handler);
    }
    /**
	 * Remove event listeners from element.
	 *
	 * @param  {Node}     element
	 * @param  {Event}    eventName
	 * @param  {Function} handler
	 *
	 * @return {Void}
	 */
    function unbind(element, eventName, handler) {
        listener(element, eventName, handler, 1);
    }
    /**
	 * Manage element event listeners.
	 *
	 * @param  {Node}     element
	 * @param  {Event}    eventName
	 * @param  {Function} handler
	 * @param  {Bool}     remove
	 *
	 * @return {Void}
	 */
    function listener(element, eventName, handler, remove) {
        var events = eventName.split(" ");
        for (var i = 0, l = events.length; i < l; i++) {
            if (element.addEventListener) {
                element[remove ? "removeEventListener" : "addEventListener"](events[i], handler, false);
            } else if (element.attachEvent) {
                element[remove ? "detachEvent" : "attachEvent"]("on" + events[i], handler);
            }
        }
    }
    /**
	 * Callbacks handler.
	 */
    function Callbacks() {
        var self = this;
        var callbacks = {};
        var i, l;
        /**
		 * Registers callbacks.
		 *
		 * @param  {Mixed} name
		 * @param  {Mixed} fn
		 *
		 * @return {Void}
		 */
        self.on = function(name, fn) {
            callbacks[name] = callbacks[name] || [];
            if (type(fn) === "function" && inArray(fn, callbacks[name]) === -1) {
                callbacks[name].push(fn);
            }
        };
        /**
		 * Remove one or all callbacks.
		 *
		 * @param  {String} name
		 * @param  {Mixed}  fn
		 *
		 * @return {Void}
		 */
        self.off = function(name, fn) {
            callbacks[name] = callbacks[name] || [];
            if (fn === undefined) {
                callbacks[name].length = 0;
            } else {
                var index = inArray(fn, callbacks[name]);
                if (index !== -1) {
                    callbacks[name].splice(index, 1);
                }
            }
        };
        /**
		 * Trigger callbacks for event.
		 *
		 * @param  {String} name
		 * @param  {Mixed}  context
		 * @param  {Mixed}  argN
		 *
		 * @return {Void}
		 */
        self.trigger = function(name, context) {
            if (callbacks[name]) {
                for (i = 0, l = callbacks[name].length; i < l; i++) {
                    callbacks[name][i].apply(context, Array.prototype.slice.call(arguments, 2));
                }
            }
        };
    }
    /**
	 * Executes callback(s) when images have finished with loading.
	 *
	 * @param  {NodeList} collection Collection of containers, images, or both.
	 * @param  {Function} options    ImagesLoaded options.
	 *
	 * @return {Void}
	 */
    function ImagesLoaded(collection, options) {
        // Fill unassigned options with defaults
        options = options || {};
        for (var key in ImagesLoaded.defaults) {
            if (!options.hasOwnProperty(key)) {
                options[key] = ImagesLoaded.defaults[key];
            }
        }
        // Private variables
        var self = this instanceof ImagesLoaded ? this : {};
        var callbacks = new Callbacks();
        var tIndex;
        // Element holders
        self.images = [];
        self.loaded = [];
        self.pending = [];
        self.proper = [];
        self.broken = [];
        // States
        self.isPending = true;
        self.isDone = false;
        self.isFailed = false;
        // Extract images
        collection = toArray(collection);
        for (var c = 0, cl = collection.length; c < cl; c++) {
            if (collection[c].nodeName === "IMG") {
                self.images.push(collection[c]);
            } else if (inArray(collection[c].nodeType, ALLOWED_NODE_TYPES) !== -1) {
                self.images = self.images.concat(toArray(collection[c].getElementsByTagName("img")));
            }
        }
        /**
		 * Registers or executes callback for done state.
		 *
		 * @param  {Function} callback
		 *
		 * @return {ImagesLoaded}
		 */
        self.done = function(callback) {
            if (self.isPending) {
                callbacks.on("done", callback);
            } else if (self.isDone && type(callback) === "function") {
                callback.call(self);
            }
            return self;
        };
        /**
		 * Registers or executes callback for fail state.
		 *
		 * @param  {Function} callback
		 *
		 * @return {ImagesLoaded}
		 */
        self.fail = function(callback) {
            if (self.isPending) {
                callbacks.on("fail", callback);
            } else if (self.isFailed && type(callback) === "function") {
                callback.call(self);
            }
            return self;
        };
        /**
		 * Registers or executes callback for done state.
		 *
		 * @param  {Function} callback
		 *
		 * @return {ImagesLoaded}
		 */
        self.always = function(callback) {
            if (self.isPending) {
                callbacks.on("always", callback);
            } else if (type(callback) === "function") {
                callback.call(self);
            }
            return self;
        };
        /**
		 * Registers or executes callback for done state.
		 *
		 * @param  {Function} callback
		 *
		 * @return {ImagesLoaded}
		 */
        self.progress = function(callback) {
            if (self.isPending) {
                callbacks.on("progress", callback);
            }
            // Retroactivity
            for (var i = 0, l = self.loaded.length; i < l; i++) {
                callback.call(self, self.loaded[i], self.loaded[i][ILID].isBroken);
            }
            return self;
        };
        /**
		 * Executes proper callbacks when all images has finished with loading.
		 *
		 * @return {Void}
		 */
        function doneLoading() {
            if (!self.isPending) {
                return;
            }
            // Clear timeout
            clearTimeout(tIndex);
            // Mark states
            self.isPending = false;
            self.isDone = self.images.length === self.proper.length;
            self.isFailed = !self.isDone;
            // Trigger callbacks
            callbacks.trigger(self.isDone ? "done" : "fail", self);
            callbacks.trigger("always", self);
        }
        /**
		 * Terminates the determination process prematurely.
		 *
		 * @return {Void}
		 */
        function terminate() {
            // Mark still pending images as broken
            while (self.pending.length) {
                imgLoaded(self.pending[0], 1);
            }
        }
        /**
		 * Image load event handler.
		 *
		 * @param  {Event} event
		 *
		 * @return {Void}
		 */
        function imgLoadedHandler(event) {
            /*jshint validthis:true */
            event = event || w.event;
            // Unbind loaded handler from temporary image
            unbind(this[ILID].tmpImg, EVENTS, imgLoadedHandler);
            // Leave the temporary image for garbage collection
            this[ILID].tmpImg = null;
            // Don't proceed if image is already loaded
            if (inArray(this, self.loaded) === -1) {
                imgLoaded(this, event.type !== "load");
            }
        }
        /**
		 * Mark image as loaded.
		 *
		 * @param  {Node}    img      Image element.
		 * @param  {Boolean} isBroken Whether the image is broken.
		 *
		 * @return {Void}
		 */
        function imgLoaded(img, isBroken) {
            var pendingIndex = inArray(img, self.pending);
            if (pendingIndex === -1) {
                return;
            } else {
                self.pending.splice(pendingIndex, 1);
            }
            // Store element in loaded images array
            self.loaded.push(img);
            // Keep track of broken and properly loaded images
            self[isBroken ? "broken" : "proper"].push(img);
            // Cache image state for future calls
            img[ILID].isBroken = isBroken;
            img[ILID].src = img.src;
            // Trigger progress callback
            setTimeout(function() {
                callbacks.trigger("progress", self, img, isBroken);
            });
            // Call doneLoading
            if (self.images.length === self.loaded.length) {
                setTimeout(doneLoading);
            }
        }
        /**
		 * Checks the status of all images.
		 *
		 * @return {Void}
		 */
        function check() {
            // If no images, trigger immediately
            if (!self.images.length) {
                doneLoading();
                return;
            }
            // Actually check the images
            var img;
            for (var i = 0, il = self.images.length; i < il; i++) {
                img = self.images[i];
                img[ILID] = img[ILID] || {};
                // Add image to pending array
                self.pending.push(img);
                // Find out whether this image has been already checked for status.
                // If it was, and src has not changed, call imgLoaded.
                if (img[ILID].isBroken !== undefined && img[ILID].src === img.src) {
                    imgLoaded(img, img[ILID].isBroken);
                    continue;
                }
                // If complete is true and browser supports natural sizes,
                // try to check for image status manually.
                if (img.complete && img.naturalWidth !== undefined) {
                    imgLoaded(img, img.naturalWidth === 0);
                    continue;
                }
                // If none of the checks above matched, simulate loading on detached element.
                img[ILID].tmpImg = document.createElement("img");
                bind(img[ILID].tmpImg, EVENTS, proxy(img, imgLoadedHandler));
                img[ILID].tmpImg.src = img.src;
            }
        }
        // Defer the images check to next process tick to give people time to bind progress callbacks.
        setTimeout(check);
        // Set the timeout
        setTimeout(terminate, options.timeout);
        // Return the instance
        return self;
    }
    // Default options
    ImagesLoaded.defaults = {
        timeout: 1e4
    };
    // Expose globally
    w.ImagesLoaded = ImagesLoaded;
})(window);

(function(window, document, undefined) {
    (function(h) {
        h.className = h.className.replace("no-js", "js");
        if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch) h.className += " touch";
    })(document.documentElement);
    window.Site = {
        basePath: document.body.getAttribute("data-base-url"),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        template: '<figure class="ri"><img src="{{img_url}}" alt="{{img_alt}}"><figcaption></figure>'
    };
    var b = document.documentElement;
    b.setAttribute("data-useragent", Site.userAgent);
    b.setAttribute("data-platform", Site.platform);
    // Better (faster) touch event handling
    // issues with scrolling and replacing the click event type
    var clickEventType = "click";
    // ('ontouchstart' in window ? 'touchend' : 'click');
    /**
	 * Converts a URL query string to a javascript object
	 *
	 * @author Adam Brewer - @adamcbrewer - adamcbrewer.com
	 *
	 *		Usage: "?test=true&something=false".queryToObj(?);
	 *
	 *		Output: {test: true, something: false}
	 *
	 */
    String.prototype.queryToObj = function(strip) {
        strip = strip || "?";
        var string = this.replace(strip, ""), obj = {}, queryParams = string.split("&"), i = 0, l = queryParams.length;
        for (i; i < l; i++) {
            var params = queryParams[i].split("="), k = params[0], v = params[1];
            obj[k] = v;
        }
        return obj;
    };
    Zepto(function($) {
        /**
		 * Vars, gotta 'ave 'em!
		 *
		 */
        var toggles = $("[data-toggle]"), toggleTargets = $("[data-toggle-target]"), toggleImgs = $("[data-toggle-img]"), toggleAbout = $("[data-toggle-about]"), targetAbout = $('[data-target="about"]'), workItems = $(".work-item"), i = 0;
        /**
		 * Keyboard events to remove/close anything we might want
		 *
		 */
        $(document).on("keyup", function(evt) {
            if (evt.keyCode === 27) {
                closeOthers(null);
                if (supportsHistoryApi()) history.pushState({}, null, Site.basePath + "/");
                // clear the history
                if (window.arnie && window.arnie.audio) {
                    arnie.audio.parentNode.removeChild(arnie.audio);
                    arnie.img.parentNode.removeChild(arnie.img);
                }
            }
        });
        /**
		 * Toggling the about section
		 *
		 */
        // toggleAbout.on('click', function (evt) {
        // 	evt.preventDefault();
        // 	targetAbout.toggleClass('closed');
        // 	if ( targetAbout.hasClass('closed') ) closeOthers(null);
        // 	window.scroll(0, targetAbout[0].offsetTop);
        // });
        /**
		 * Event listeners for toggling view states on portfolio items
		 *
		 */
        toggles.on("click", openProject);
        /**
		 * History popstate listeners
		 *
		 */
        if (supportsHistoryApi()) {
            window.onpopstate = function(evt) {
                var state = evt.state;
                if (state && state.target) {
                    openProject(state.target);
                }
            };
        }
        /**
		 * Close all the sections when the page has loaded
		 *
		 */
        workItems.addClass("closed");
        /**
		 * Open a project based on the target attr which
		 * is based off the projects.js object in settings
		 *
		 */
        function openProject(evt) {
            var target = evt, wasClosed = true;
            if (evt.target) {
                if (evt.target.href) return;
                // don't do anything if we're clikcing links
                evt.preventDefault();
                target = this.getAttribute("data-toggle");
            }
            targetEl = $('[data-toggle-target="' + target + '"]');
            // load in images if we're opening for the first time
            // and only open te section when that's happened
            if (targetEl.hasClass("closed") && !targetEl.hasClass("images-loaded")) {
                targetEl.addClass("loading");
                loadImages(target, targetEl, function() {
                    targetEl.addClass("images-loaded");
                    targetEl.removeClass("loading");
                });
            }
            if (!targetEl.hasClass("closed")) wasClosed = false;
            targetEl.toggleClass("closed");
            closeOthers(targetEl);
            if (supportsHistoryApi()) history.pushState({
                target: target
            }, target, Site.basePath + "?project=" + target);
            if (wasClosed) window.scroll(0, targetEl[0].offsetTop);
        }
        function closeOthers(el) {
            if (el) {
                toggleTargets.not(el).addClass("closed");
            } else {
                toggleTargets.addClass("closed");
            }
        }
        /**
		 * load in the images for a project if opened for the first time
		 *
		 */
        function loadImages(target, container, callback) {
            if (Site.projects) {
                if (Site.projects[target]) {
                    makeImages(Site.projects[target], container, callback);
                }
            } else {
                $.getJSON("projects.json", function(projects) {
                    Site.projects = projects;
                    if (Site.projects[target]) {
                        makeImages(Site.projects[target], container, callback);
                    }
                });
            }
        }
        function makeImages(project, container, callback) {
            var images = project.images, $ul = $('<ul class="work-images-list"></ul>'), $imgCont = container.find('[data-view="images"]');
            for (i in images) {
                var $li = $('<li class="work-image"></li>'), innerHtml = Site.template.replace("{{img_url}}", images[i].url).replace("{{img_alt}}", images[i].alt);
                $li.append(innerHtml);
                $ul.append($li);
            }
            $imgCont.append($ul);
            ImagesLoaded($imgCont[0]).done(callback);
        }
        /**
		 * load the linked project on window load
		 *
		 */
        var queryString = window.location.search || null;
        if (queryString && queryString.length) {
            var query = queryString.queryToObj("?");
            if (query.project) {
                // a little buffer to fix the window.scroll
                // jumping to the wrong position
                setTimeout(function() {
                    openProject(query.project);
                }, 800);
            }
        }
        /**
		 * if browser haz History API
		 *
		 */
        function supportsHistoryApi() {
            return !!(window.history && history.pushState);
        }
        /**
		 * Konamin Code!
		 *
		 */
        var konami = function(f, a) {
            document.onkeyup = function(e) {
                /113302022928$/.test(a += [ (e || self.event).keyCode - 37 ]) && f();
            };
        };
        konami(function() {
            var arnie = window.arnie = {};
            arnie.audio = document.createElement("audio");
            arnie.audio.src = Site.basePath + "/assets/audio/arnie.mp3";
            document.body.appendChild(arnie.audio);
            arnie.audio.play();
            arnie.img = document.createElement("img");
            arnie.img.src = Site.basePath + "/assets/img/arnie.png";
            arnie.img.classList.add("arnie");
            document.body.appendChild(arnie.img);
            setTimeout(function() {
                arnie.img.classList.add("show");
            }, 200);
        });
        console.info("Hi developers! Source @ http://github.com/adamcbrewer/brewerlogic.com");
        console.info("This site is Konami code friendly");
    });
})(window, document);
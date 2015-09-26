/// <reference path="../_definitions.d.ts" />
define(["require", "exports", "knockout"], function (require, exports, ko) {
    exports.isIE = 0;
    //#region Knockout Utilities
    /** Create value accessor for custom bindings. */
    function createAccessor(value) {
        return function () { return value; };
    }
    exports.createAccessor = createAccessor;
    /** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
    function createObservable(value, _default) {
        if (isNullOrUndefined(value)) {
            return ko.observable(_default);
        }
        if (ko.isSubscribable(value)) {
            return value;
        }
        return ko.observable(value);
    }
    exports.createObservable = createObservable;
    /** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
    function createObservableArray(value, mapFunction, context) {
        if (typeof value === "undefined") {
            return ko.observableArray();
        }
        if (ko.isSubscribable(value) && Array.isArray(value())) {
            return value;
        }
        if (Array.isArray(value) && is(mapFunction, "function")) {
            value = value.map(mapFunction, context);
        }
        return ko.observableArray(value);
    }
    exports.createObservableArray = createObservableArray;
    //#endregion
    //#region Check Methods
    /** Test if value is of the specified type. */
    function is(obj, type) {
        return typeof obj === type;
    }
    exports.is = is;
    /** Test if value is of one of the specified types. */
    function isOf(obj) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        var objType = typeof obj;
        return types.some(function (t) { return t === objType; });
    }
    exports.isOf = isOf;
    /** Test if value is an object. */
    function isObject(obj) {
        var objType = typeof obj;
        return objType === "function" || objType === "object" && !!obj;
    }
    exports.isObject = isObject;
    /** Test if value is a date. */
    function isDate(value) {
        return (/\d{2,4}-\d{2}-\d{2}[T -_]\d{2}:\d{2}:\d{2}/).test(value);
    }
    exports.isDate = isDate;
    /** Test if value is null or undefined. */
    function isNullOrUndefined(value) {
        return typeof value === "undefined" || value === null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;
    /** Test if value is null or a white space. */
    function isNullOrWhiteSpace(value) {
        return !value || (/^\s*$/).test(value);
    }
    exports.isNullOrWhiteSpace = isNullOrWhiteSpace;
    //#endregion
    //#region Utility Methods
    /** Make inheritance operation. */
    function inherits(obj, base, prototype) {
        if (is(base.constructor, "function")) {
            //Normal Inheritance 
            obj.prototype = new base();
            obj.prototype.constructor = obj;
            obj.prototype.parent = base.prototype;
        }
        else {
            //Pure Virtual Inheritance 
            obj.prototype = base;
            obj.prototype.constructor = obj;
            obj.prototype.parent = base;
        }
        if (prototype) {
            ko.utils.extend(obj.prototype, prototype);
        }
        return obj;
    }
    exports.inherits = inherits;
    /** Execute callback methods in a safe DOM modification environment. Usefull when creating HTML5 Application. */
    function unsafe(callback) {
        if (typeof MSApp === "undefined" || !MSApp.execUnsafeLocalFunction) {
            return callback.call(null);
        }
        else {
            return MSApp.execUnsafeLocalFunction(callback);
        }
    }
    exports.unsafe = unsafe;
    /** Get current window size. */
    function getWindowSize() {
        var winW = 630, winH = 460;
        if (document.body && document.body.offsetWidth) {
            winW = document.body.offsetWidth;
            winH = document.body.offsetHeight;
        }
        if (document.compatMode === "CSS1Compat" && document.documentElement && document.documentElement.offsetWidth) {
            winW = document.documentElement.offsetWidth;
            winH = document.documentElement.offsetHeight;
        }
        if (window.innerWidth && window.innerHeight) {
            winW = window.innerWidth;
            winH = window.innerHeight;
        }
        return {
            width: winW,
            height: winH
        };
    }
    exports.getWindowSize = getWindowSize;
    /** Check if node is in DOM */
    function isNodeInDOM(node) {
        var ancestor = node;
        while (ancestor.parentNode) {
            ancestor = ancestor.parentNode;
        }
        // ancestor should be a document
        return !!ancestor.body;
    }
    exports.isNodeInDOM = isNodeInDOM;
    /** Get query strings. If a key is specified, returns only query string for specified key. */
    function getQueryString(key) {
        var dictionary = {}, qs = window.location.search.replace("?", ""), pairs = qs.split("&");
        pairs.forEach(function (val) {
            var pair = val.split("=");
            dictionary[pair[0]] = pair[1];
        });
        if (key) {
            return dictionary[key];
        }
        return dictionary;
    }
    exports.getQueryString = getQueryString;
    //#endregion
    //#region String Methods
    /** Format text by using a format template */
    function format(text) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return text.replace(/\{+-?[0-9]+(:[^}]+)?\}+/g, function (tag) {
            var match = tag.match(/(\{+)(-?[0-9]+)(:([^\}]+))?(\}+)/), index = parseInt(match[2], 10), value = args[index];
            if (match[1].length > 1 && match[5].length > 1) {
                return "{" + index + (match[3] || "") + "}";
            }
            if (typeof value === "undefined") {
                value = "";
            }
            if (match[3]) {
                switch (match[4]) {
                    case "U":
                        return value.toString().toUpperCase();
                    case "u":
                        return value.toString().toLowerCase();
                    default:
                        if (window.Globalize) {
                            return Globalize.format(value, match[4]);
                        }
                        break;
                }
            }
            return value;
        });
    }
    exports.format = format;
    /** Fill given text with given char while text length < given length */
    function str_pad(text, length, char, right) {
        if (right === void 0) { right = false; }
        var str = "" + text;
        while (str.length < length) {
            str = right ? str + char : char + str;
        }
        return str;
    }
    exports.str_pad = str_pad;
    /**
     * Take the difference between one array and a number of other arrays.
     * Only the elements present in just the first array will remain.
     **/
    function arrayDiff(array) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        array = array || [];
        var tmp = [], rest = tmp.concat.apply(tmp, others);
        return array.filter(function (item) { return rest.indexOf(item) === -1; });
    }
    exports.arrayDiff = arrayDiff;
    function arrayCompare(array1, array2) {
        return {
            added: arrayDiff(array2, array1),
            removed: arrayDiff(array1, array2)
        };
    }
    exports.arrayCompare = arrayCompare;
    function arrayEquals(array1, array2) {
        var report = arrayCompare(array1, array2);
        return report.added.length === 0 && report.removed.length === 0;
    }
    exports.arrayEquals = arrayEquals;
});
//#endregion

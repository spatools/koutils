(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ko = require("knockout");
    exports.isIE = 0;
    exports.canUseSymbols = typeof Symbol === "function";
    //#region Knockout Utilities
    /** Create value accessor for custom bindings. */
    function createAccessor(value) {
        return function () { return value; };
    }
    exports.createAccessor = createAccessor;
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
        if (Array.isArray(value) && typeof mapFunction === "function") {
            value = value.map(mapFunction, context);
        }
        return ko.observableArray(value);
    }
    exports.createObservableArray = createObservableArray;
    function createSymbol(identifier) {
        return exports.canUseSymbols ? Symbol(identifier) : identifier;
    }
    exports.createSymbol = createSymbol;
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
    /** Check if node is in DOM */
    function isNodeInDOM(node) {
        if (!node) {
            return false;
        }
        var ancestor = node;
        while (ancestor.parentNode) {
            ancestor = ancestor.parentNode;
        }
        // ancestor should be a document
        return !!ancestor.body;
    }
    exports.isNodeInDOM = isNodeInDOM;
    //#endregion
    //#region String Methods
    /** Format text by using a format template */
    function format(text) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return text.replace(/\{+-?[0-9]+(:[^}]+)?\}+/g, function (tag) {
            var match = tag.match(/(\{+)(-?[0-9]+)(:([^}]+))?(}+)/);
            if (!match)
                return tag;
            var index = parseInt(match[2], 10);
            var value = args[index];
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
                        if (typeof Globalize !== "undefined") {
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

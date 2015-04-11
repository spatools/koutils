/// <reference path="../_definitions.d.ts" />

import ko = require("knockout");

export interface Size {
    width: number;
    height: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Position {
    top: number;
    left: number;
}

export interface ObservablePosition {
    top: KnockoutObservable<number>;
    left: KnockoutObservable<number>;
}

export var isIE = /*@cc_on!@*/0;

//#region Knockout Utilities

/** Create value accessor for custom bindings. */
export function createAccessor<T>(value: T): () => T {
    return () => value;
}

/** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
export function createObservable<T>(value: any, _default?: T): KnockoutObservable<T> {
    if (isNullOrUndefined(value)) {
        return ko.observable(_default);
    }

    if (ko.isSubscribable(value)) {
        return value;
    }

    return ko.observable(value);
}

/** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
export function createObservableArray(value: any, mapFunction?: (obj: any) => any, context?: any): KnockoutObservableArray<any> {
    if (typeof value === "undefined") {
        return ko.observableArray();
    }

    if (ko.isSubscribable(value) && is(value(), "array")) {
        return value;
    }

    if (is(value, "array") && is(mapFunction, "function")) {
        value = value.map(mapFunction, context);
    }

    return ko.observableArray(value);
}

//#endregion

//#region Check Methods

/** Test if value is of the specified type. */
export function is(obj: any, type: string): boolean {
    return typeof obj === type;
}
/** Test if value is of one of the specified types. */
export function isOf(obj: any, ...types: string[]): boolean {
    var objType = typeof obj;
    return types.some(t => t === objType);
}

/** Test if value is an object. */
export function isObject(obj: any): boolean {
    var objType = typeof obj;
    return objType === "function" || objType === "object" && !!obj;
}

/** Test if value is a date. */
export function isDate(value: string): boolean {
    return (/\d{2,4}-\d{2}-\d{2}[T -_]\d{2}:\d{2}:\d{2}/).test(value);
}

/** Test if value is null or undefined. */
export function isNullOrUndefined(value: any): boolean {
    return typeof value === "undefined" || value === null;
}

/** Test if value is null or a white space. */
export function isNullOrWhiteSpace(value: string): boolean {
    return !value || (/^\s*$/).test(value);
}

//#endregion

//#region Utility Methods

/** Make inheritance operation. */
export function inherits(obj: any, base: any, prototype: any): any {
    if (is(base.constructor, "function")) {
        //Normal Inheritance 
        obj.prototype = new base();
        obj.prototype.constructor = obj;
        obj.prototype.parent = base.prototype;
    } else {
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

/** Execute callback methods in a safe DOM modification environment. Usefull when creating HTML5 Application. */
export function unsafe<T>(callback: () => T): T {
    if (typeof MSApp === "undefined") {
        return callback.call(null);
    } else {
        return MSApp.execUnsafeLocalFunction(callback);
    }
}

/** Get current window size. */
export function getWindowSize(): Size {
    var winW: number = 630,
        winH: number = 460;

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

/** Check if node is in DOM */
export function isNodeInDOM(node: Node): boolean {
    var ancestor = node;

    while (ancestor.parentNode) {
        ancestor = ancestor.parentNode;
    }

    // ancestor should be a document
    return !!(<Document>ancestor).body;
}

/** Get query strings. If a key is specified, returns only query string for specified key. */
export function getQueryString(key: string): any {
    var dictionary = {},
        qs = window.location.search.replace("?", ""),
        pairs = qs.split("&");

    pairs.forEach(val => {
        var pair = val.split("=");
        dictionary[pair[0]] = pair[1];
    });

    if (key) {
        return dictionary[key];
    }

    return dictionary;
}

//#endregion

//#region String Methods

/** Format text by using a format template */
export function format(text: string, ...args: any[]): string {
    return text.replace(/\{+-?[0-9]+(:[^}]+)?\}+/g, tag => {
        var match = tag.match(/(\{+)(-?[0-9]+)(:([^\}]+))?(\}+)/),
            index = parseInt(match[2], 10),
            value = args[index];

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

/** Fill given text with given char while text length < given length */
export function str_pad(text: string, length: number, char: string, right: boolean = false): string {
    var str: string = "" + text;
    while (str.length < length) {
        str = right ? str + char : char + str;
    }

    return str;
}

//#endregion

//#region Array Methods

export interface ArrayComparison {
    added: any[];
    removed: any[];
}

/** 
 * Take the difference between one array and a number of other arrays. 
 * Only the elements present in just the first array will remain.
 **/
export function arrayDiff(array: any[], ...others: any[]): any[] {
    array = array || [];

    var tmp = [],
        rest = tmp.concat.apply(tmp, others);

    return array.filter(item => rest.indexOf(item) === -1);
}

export function arrayCompare(array1: any[], array2: any[]): ArrayComparison {
    return {
        added: arrayDiff(array2, array1),
        removed: arrayDiff(array1, array2),
    };
}

export function arrayEquals(array1: any[], array2: any[]): boolean {
    var report = arrayCompare(array1, array2);
    return report.added.length === 0 && report.removed.length === 0;
}

//#endregion

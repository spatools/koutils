import * as ko from "knockout";

export const isIE = /*@cc_on!@*/0;
export const canUseSymbols = typeof Symbol === "function";

//#region Knockout Utilities

/** Create value accessor for custom bindings. */
export function createAccessor<T>(value: T): () => T {
    return () => value;
}

/** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
export function createObservable<T>(value: any, _default?: T): ko.Observable<T> {
    if (isNullOrUndefined(value)) {
        return ko.observable(_default);
    }

    if (ko.isSubscribable(value)) {
        return value as any;
    }

    return ko.observable(value);
}

/** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
export function createObservableArray(value: any, mapFunction?: (obj: any) => any, context?: any): ko.ObservableArray<any> {
    if (typeof value === "undefined") {
        return ko.observableArray();
    }

    if (ko.isSubscribable(value) && Array.isArray(value())) {
        return value as any;
    }

    if (Array.isArray(value) && is(mapFunction, "function")) {
        value = value.map(mapFunction, context);
    }

    return ko.observableArray(value);
}

export function createSymbol(identifier: string): symbol | string {
    return canUseSymbols ? Symbol(identifier) : identifier;
}

//#endregion

//#region Check Methods

/** Test if value is of the specified type. */
export function is(obj: any, type: string): boolean {
    return typeof obj === type;
}
/** Test if value is of one of the specified types. */
export function isOf(obj: any, ...types: string[]): boolean {
    const objType = typeof obj;
    return types.some(t => t === objType);
}

/** Test if value is an object. */
export function isObject(obj: any): boolean {
    const objType = typeof obj;
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

/** Check if node is in DOM */
export function isNodeInDOM(node: Node): boolean {
    if (!node) {
        return false;
    }

    let ancestor = node;
    while (ancestor.parentNode) {
        ancestor = ancestor.parentNode;
    }

    // ancestor should be a document
    return !!(<Document>ancestor).body;
}

//#endregion

//#region String Methods

/** Format text by using a format template */
export function format(text: string, ...args: any[]): string {
    return text.replace(/\{+-?[0-9]+(:[^}]+)?\}+/g, tag => {
        const
            match = tag.match(/(\{+)(-?[0-9]+)(:([^}]+))?(}+)/),
            index = parseInt(match[2], 10);
        let value = args[index];

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

/** Fill given text with given char while text length < given length */
export function str_pad(text: string, length: number, char: string, right: boolean = false): string {
    let str: string = "" + text;
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

    const
        tmp = [],
        rest = tmp.concat.apply(tmp, others);

    return array.filter(item => rest.indexOf(item) === -1);
}

export function arrayCompare(array1: any[], array2: any[]): ArrayComparison {
    return {
        added: arrayDiff(array2, array1),
        removed: arrayDiff(array1, array2)
    };
}

export function arrayEquals(array1: any[], array2: any[]): boolean {
    const report = arrayCompare(array1, array2);
    return report.added.length === 0 && report.removed.length === 0;
}

//#endregion

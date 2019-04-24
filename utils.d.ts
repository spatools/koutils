import * as ko from "knockout";
export declare const isIE = 0;
export declare const canUseSymbols: boolean;
/** Create value accessor for custom bindings. */
export declare function createAccessor<T>(value: T): () => T;
/** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
export declare function createObservable<T>(value: any, _default: T): ko.Observable<T>;
export declare function createObservable<T>(value: any, _default?: T): ko.Observable<T | undefined>;
/** Return an observable from value (or _default if undefined). If value is subscribable, returns value directly. */
export declare function createObservableArray(value: any, mapFunction?: (obj: any) => any, context?: any): ko.ObservableArray<any>;
export declare function createSymbol(identifier: string): symbol | string;
/** Test if value is of the specified type. */
export declare function is(obj: any, type: string): boolean;
/** Test if value is of one of the specified types. */
export declare function isOf(obj: any, ...types: string[]): boolean;
/** Test if value is an object. */
export declare function isObject(obj: any): boolean;
/** Test if value is a date. */
export declare function isDate(value: string): boolean;
/** Test if value is null or undefined. */
export declare function isNullOrUndefined(value: any): boolean;
/** Test if value is null or a white space. */
export declare function isNullOrWhiteSpace(value: string): boolean;
/** Make inheritance operation. */
export declare function inherits(obj: any, base: any, prototype: any): any;
/** Check if node is in DOM */
export declare function isNodeInDOM(node: Node): boolean;
/** Format text by using a format template */
export declare function format(text: string, ...args: any[]): string;
/** Fill given text with given char while text length < given length */
export declare function str_pad(text: string, length: number, char: string, right?: boolean): string;
export interface ArrayComparison {
    added: any[];
    removed: any[];
}
/**
 * Take the difference between one array and a number of other arrays.
 * Only the elements present in just the first array will remain.
 **/
export declare function arrayDiff(array: any[], ...others: any[]): any[];
export declare function arrayCompare(array1: any[], array2: any[]): ArrayComparison;
export declare function arrayEquals(array1: any[], array2: any[]): boolean;

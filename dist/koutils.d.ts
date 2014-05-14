/// <reference path="../../../typings/knockout/knockout.d.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

interface UnderscoreStatic {
    sum<T>(list: _.List<T>, iterator: _.ListIterator<T, number>, context?: any): number;
    sum<T>(object: _.Dictionary<T>, iterator: _.ObjectIterator<T, number>, context?: any): number;

    average<T>(list: _.List<T>, iterator: _.ListIterator<T, number>, context?: any): number;
    average<T>(object: _.Dictionary<T>, iterator: _.ObjectIterator<T, number>, context?: any): number;

    count<T>(list: _.List<T>, iterator?: _.ListIterator<T, boolean>, context?: any): number;
    count<T>(object: _.Dictionary<T>, iterator?: _.ObjectIterator<T, boolean>, context?: any): number;

    filterMap<T, TResult>(list: _.List<T>, iterator: _.ListIterator<T, TResult>, context?: any): TResult[];
    filterMap<T, TResult>(object: _.Dictionary<T>, iterator: _.ObjectIterator<T, TResult>, context?: any): TResult[];

    index<T>(list: _.List<T>, iterator: _.ListIterator<T, boolean>, context?: any): number;
    index<T>(object: _.Dictionary<T>, iterator: _.ObjectIterator<T, boolean>, context?: any): number;

    partialEnd<T>(func: () => T, ...args: any[]): () => T;
}

interface KnockoutUnderscoreArrayFunctions<T> {
    each(iterator: _.ListIterator<T, void>, context?: any): void;
    map<TResult>(iterator: _.ListIterator<T, TResult>, context?: any): TResult[];
    filterMap<TResult>(iterator?: _.ListIterator<T, TResult>, context?: any): TResult[];
    reduce<TResult>(iterator: _.MemoIterator<T, TResult>, memo: TResult, context?: any): TResult;
    find(iterator: _.ListIterator<T, boolean>, context?: any): T;
    filter(iterator: _.ListIterator<T, boolean>, context?: any): T[];
    reject(iterator: _.ListIterator<T, boolean>, context?: any): T[];
    sum(iterator: _.ListIterator<T, number>, context?: any): number;
    average(iterator: _.ListIterator<T, number>, context?: any): number;
    all(iterator: _.ListIterator<T, boolean>, context?: any): boolean;
    any(iterator: _.ListIterator<T, boolean>, context?: any): boolean;
    contains(value: T): boolean;
    max(iterator: _.ListIterator<T, number>, context?: any): T;
    min(iterator: _.ListIterator<T, number>, context?: any): T;
    sortBy<TSort>(iterator: _.ListIterator<T, TSort>, context?: any): T[];
    groupBy(iterator: _.ListIterator<T, any>, context?: any): { [key: string]: any[]; };
    toArray(): any[];
    count(iterator: _.ListIterator<T, boolean>, context?: any): number;
    index(iterator?: _.ListIterator<T, boolean>, context?: any): number;
    size(): number;
    first(): T;
    last(): T;
    initial(n?: number): T[];
    rest(index?: number): T[];
    compact(): T[];
    flatten(shallow?: boolean): any;
    without(...values: T[]): T[];
    union(...arrays: T[][]): T[];
    intersection(...arrays: T[][]): T[];
    difference(...others: T[][]): T[];
    uniq<TSort>(isSorted?: boolean, iterator?: _.ListIterator<T, TSort>, context?: any): T[];
    zip(...arrays: any[][]): any[][];
    indexOf(value: T, isSorted?: boolean): number;
    lastIndexOf(value: T, from?: number): number;

    _each(iterator: _.ListIterator<T, void>, context?: any): KnockoutComputed<void>;
    _map<TResult>(iterator: _.ListIterator<T, TResult>, context?: any): KnockoutComputed<TResult[]>;
    _filterMap<TResult>(iterator?: _.ListIterator<T, TResult>, context?: any): KnockoutComputed<TResult[]>;
    _reduce<TResult>(iterator: _.MemoIterator<T, TResult>, memo: TResult, context?: any): KnockoutComputed<TResult>;
    _find(iterator: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<T>;
    _filter(iterator: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<T[]>;
    _reject(iterator: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<T[]>;
    _sum(iterator: _.ListIterator<T, number>, context?: any): KnockoutComputed<number>;
    _average(iterator: _.ListIterator<T, number>, context?: any): KnockoutComputed<number>;
    _all(iterator: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<boolean>;
    _any(iterator: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<boolean>;
    _contains(value: T): boolean;
    _max(iterator: _.ListIterator<T, number>, context?: any): KnockoutComputed<T>;
    _min(iterator: _.ListIterator<T, number>, context?: any): KnockoutComputed<T>;
    _sortBy<T, TSort>(iterator: _.ListIterator<T, TSort>, context?: any): KnockoutComputed<T[]>;
    _groupBy(iterator: (element: T, index?: number, list?: T[]) => string, context?: any): KnockoutComputed<{ [key: string]: any[]; }>;
    _toArray(): any[];
    _count(iterator: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<number>;
    _index(iterator?: _.ListIterator<T, boolean>, context?: any): KnockoutComputed<number>;
    _size(): KnockoutComputed<number>;
    _first(): KnockoutComputed<T>;
    _last(): KnockoutComputed<T>;
    _initial(n?: number): KnockoutComputed<T[]>;
    _rest(index?: number): KnockoutComputed<T[]>;
    _compact(): KnockoutComputed<T[]>;
    _flatten(shallow?: boolean): KnockoutComputed<any>;
    _without(...values: T[]): KnockoutComputed<T[]>;
    _union(...arrays: T[][]): KnockoutComputed<T[]>;
    _intersection(...arrays: T[][]): KnockoutComputed<T[]>;
    _difference(...others: T[][]): KnockoutComputed<T[]>;
    _uniq<TSort>(isSorted?: boolean, iterator?: _.ListIterator<T, TSort>, context?: any): KnockoutComputed<T[]>;
    _zip(...arrays: any[][]): KnockoutComputed<any[][]>;
    _indexOf(value: T, isSorted?: boolean): KnockoutComputed<number>;
    _lastIndexOf(value: T, from?: number): KnockoutComputed<number>;
}

interface KnockoutUnderscoreObjectsFunctions<T> {
    keys(): string[];
    values(): any[];
    clone(object: T): T;
    isEmpty(object: any): boolean;

    _keys(): KnockoutComputed<string[]>;
    _values(): KnockoutComputed<any[]>;
    _clone(object: T): KnockoutComputed<T>;
    _isEmpty(object: any): KnockoutComputed<boolean>;
}

interface KnockoutObservableArrayFunctions<T> extends KnockoutUnderscoreArrayFunctions<T> {
    indexOf(value: T, isSorted?: boolean): number;
    lastIndexOf(value: T, from?: number): number;
}

interface KnockoutExtenders {
    moment: (target: any, options: Object) => any;
    momentDuration: (target: any, options: any) => any;
    delay: (target: any, delay: number) => any;
    cnotify: (target: any, notifyWhen: any) => any;
    cthrottle: (target: any, timeout: number) => any;
    //notify: (target: any, notifyWhen: string, customEqualityComparer: (v1: any, v2: any) => number) => any;
}

interface KnockoutBindingHandlers {
    date: KnockoutBindingHandler;
}

declare module "koutils/changetracker" {
class ChangeTracker {
    private hashFunction;
    private params;
    private tracked;
    private lastData;
    private isModified;
    public hasChanges: KnockoutComputed<boolean>;
    constructor(object: any, isAlreadyModified?: boolean, hashFunction?: (obj: any, params?: any) => string, params?: any);
    public reset(): void;
}
export = ChangeTracker;
}

declare module "koutils/extenders" {
}

declare module "koutils/observable" {
export interface KnockoutHistoryObservableStatic {
    fn: KnockoutHistoryObservableFunctions<any>;
<T>    (initialValue: T): KnockoutHistoryObservable<T>;
}
export interface KnockoutHistoryObservableFunctions<T> {
    back(): T;
    next(): T;
    replace(value: T): void;
    reset(value?: T): void;
}
export interface KnockoutHistoryObservable<T> extends KnockoutHistoryObservableFunctions<T> {
    (): T;
    (value: T): KnockoutHistoryObservable<T>;
    latestValues: KnockoutObservableArray<T>;
    selectedIndex: KnockoutObservable<number>;
    canGoBack: KnockoutComputed<boolean>;
    canGoForward: KnockoutComputed<boolean>;
}
export var history: KnockoutHistoryObservableStatic;
export interface KnockoutValidatedRule {
    rule: string;
    params: any;
    message?: string;
    condition?: () => boolean;
}
export interface KnockoutValidatedErrors {
    (): string[];
    showAllMessages(): void;
    showAllMessages(show: boolean): void;
}
export interface KnockoutValidatedObservable<T> extends KnockoutObservable<T> {
    isValid: KnockoutComputed<boolean>;
    error?: string;
    errors?: KnockoutValidatedErrors;
    isValidating?: KnockoutObservable<boolean>;
    isModified?: KnockoutObservable<boolean>;
    rules?: KnockoutObservableArray<KnockoutValidatedRule>;
    _disposeValidation? (): void;
}
export function validated<T>(initialValue: T): KnockoutValidatedObservable<T>;
}

declare module "koutils/underscore" {
export var objects: {
    [key: string]: Function;
};
export var collections: {
    [key: string]: Function;
};
export function addToSubscribable<T>(val: KnockoutSubscribable<T>): void;
export function addToPrototype(val: any): void;
}

declare module "koutils/utils" {
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
export var isIE: number;
export function createAccessor<T>(value: T): () => T;
export function createObservable<T>(value: any, _default?: T): KnockoutObservable<T>;
export function createObservableArray(value: any, mapFunction?: (obj: any) => any, context?: any): KnockoutObservableArray<any>;
export function isDate(value: string): boolean;
export function isNullOrWhiteSpace(value: string): boolean;
export function inherits(obj: any, base: any, prototype: any): any;
export function unsafe<T>(callback: () => T): T;
export function getWindowSize(): Size;
export function getQueryString(key: string): any;
export function format(text: string, ...args: any[]): string;
export function str_pad(text: string, length: number, char: string, right?: boolean): string;
export interface ArrayComparison {
    added: any[];
    removed: any[];
}
export function arrayCompare(array1: any[], array2: any[]): ArrayComparison;
export function arrayEquals(array1: any[], array2: any[]): boolean;
}

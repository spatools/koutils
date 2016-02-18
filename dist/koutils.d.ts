/// <reference path="../../../typings/knockout/knockout.d.ts" />

declare module KoUtils {

    interface Thenable<T> {
        then<U>(onResolve: (result: T) => Thenable<U>);
        then<U>(onResolve: (result: T) => U);

        then<U>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => Thenable<U>);
        then<U>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => U);
        then<U>(onResolve: (result: T) => U, onReject: (error: Error) => Thenable<U>);
        then<U>(onResolve: (result: T) => U, onReject: (error: Error) => U);

        then<U, V>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => Thenable<V>);
        then<U, V>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => V);
        then<U, V>(onResolve: (result: T) => U, onReject: (error: Error) => Thenable<V>);
        then<U, V>(onResolve: (result: T) => U, onReject: (error: Error) => V);
    }

}

interface KnockoutComputed<T> {
    getSubscriptionsCount(event?: string): number;
}

interface KnockoutExtenders {
    delay: (target: any, delay: number) => any;
    cthrottle: (target: any, timeout: number) => any;
    sync: (target: any) => any;
    // notify: (target: any, notifyWhen: string | ((v1: any, v2: any) => number)) => any;
}

interface KnockoutBindingHandlers {
    purify: KnockoutBindingHandler;
}

declare module "koutils/changetracker" {
class ChangeTracker {
    private hashFunction;
    private params;
    private tracked;
    private lastData;
    private isModified;
    hasChanges: KnockoutComputed<boolean>;
    constructor(object: any, isAlreadyModified?: boolean, hashFunction?: (obj: any, params?: any) => string, params?: any);
    forceChange(): void;
    reset(): void;
    dispose(): void;
}
export = ChangeTracker;
}

declare module "koutils/extenders" {
}

declare module "koutils/observable" {
import purifier = require("koutils/purifier");
export interface KnockoutHistoryObservableStatic {
    fn: KnockoutHistoryObservableFunctions<any>;
    <T>(initialValue: T): KnockoutHistoryObservable<T>;
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
    _disposeValidation?(): void;
}
export function validated<T>(initialValue: T): KnockoutValidatedObservable<T>;
export function simulated<T>(element: Element, getter: () => T): KnockoutObservable<T>;
export function asyncComputed<T>(evaluator: () => KoUtils.Thenable<T> | any, options?: purifier.UnpromiseOptions<T>): KnockoutComputed<T>;
}

declare module "koutils/purifier" {
export interface UnpromiseOptions<T> {
    initialValue?: T;
    errorValue?: T | any;
    owner?: any;
}
export function purify<T>(pureComputed: KnockoutComputed<T>, evaluator: () => any, owner?: any): KnockoutComputed<T>;
export function unpromise<T>(evaluator: () => KoUtils.Thenable<T> | any, options?: UnpromiseOptions<T>): KnockoutComputed<T>;
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
export function is(obj: any, type: string): boolean;
export function isOf(obj: any, ...types: string[]): boolean;
export function isObject(obj: any): boolean;
export function isDate(value: string): boolean;
export function isNullOrUndefined(value: any): boolean;
export function isNullOrWhiteSpace(value: string): boolean;
export function inherits(obj: any, base: any, prototype: any): any;
export function unsafe<T>(callback: () => T): T;
export function getWindowSize(): Size;
export function isNodeInDOM(node: Node): boolean;
export function getQueryString(key: string): any;
export function format(text: string, ...args: any[]): string;
export function str_pad(text: string, length: number, char: string, right?: boolean): string;
export interface ArrayComparison {
    added: any[];
    removed: any[];
}
export function arrayDiff(array: any[], ...others: any[]): any[];
export function arrayCompare(array1: any[], array2: any[]): ArrayComparison;
export function arrayEquals(array1: any[], array2: any[]): boolean;
}

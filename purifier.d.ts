import * as ko from "knockout";
export interface Thenable<T> {
    then<U>(onResolve: (result: T) => Thenable<U>): any;
    then<U>(onResolve: (result: T) => U): any;
    then<U>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => Thenable<U>): any;
    then<U>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => U): any;
    then<U>(onResolve: (result: T) => U, onReject: (error: Error) => Thenable<U>): any;
    then<U>(onResolve: (result: T) => U, onReject: (error: Error) => U): any;
    then<U, V>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => Thenable<V>): any;
    then<U, V>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => V): any;
    then<U, V>(onResolve: (result: T) => U, onReject: (error: Error) => Thenable<V>): any;
    then<U, V>(onResolve: (result: T) => U, onReject: (error: Error) => V): any;
}
export interface UnpromiseOptions<T> {
    initialValue?: T;
    errorValue?: T | any;
    owner?: any;
}
declare module "knockout" {
    interface BindingHandlers {
        purify: {
            init(): BindingHandlerControlsDescendant;
            update(element: Node, valueAccessor: () => any);
        };
    }
    interface VirtualElementsAllowedBindings {
        purify: boolean;
    }
}
export declare function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U): ko.PureComputed<U>;
export declare function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U, owner: any): ko.PureComputed<U>;
export declare function unpromise(evaluator: () => any | Thenable<any>): ko.PureComputed<any>;
export declare function unpromise(evaluator: () => any | Thenable<any>, options: UnpromiseOptions<any>): ko.PureComputed<any>;
export declare function unpromise<T>(evaluator: () => T | Thenable<T>): ko.PureComputed<T>;
export declare function unpromise<T>(evaluator: () => T | Thenable<T>, options: UnpromiseOptions<T>): ko.PureComputed<T>;

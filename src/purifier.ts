import * as ko from "knockout";

export interface Thenable<T> {
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

export interface UnpromiseOptions<T> {
    initialValue?: T;
    errorValue?: T|any;
    owner?: any;
}

declare module "knockout" {
    export interface BindingHandlers {
        purify: {
            init(): BindingHandlerControlsDescendant;
            update(element: Node, valueAccessor: () => any);
        }
    }
    
    export interface VirtualElementsAllowedBindings {
        purify: boolean;
    }
}

function noop() {
    return true;
}

export function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U): ko.PureComputed<U>;
export function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U, owner: any): ko.PureComputed<U>;
export function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U, owner?: any): ko.PureComputed<U> {
    var internalComputed = ko.pureComputed(evaluator, owner),
        disposable;

    function wake() {
        if (!disposable) {
            disposable = internalComputed.subscribe(noop);
        }
    }
    function sleep() {
        if (disposable) {
            disposable.dispose();
            disposable = null;
        }
    }

    // Should we start in the awake state? 
    if (pureComputed.getSubscriptionsCount("change") !== 0) {
        wake();
    }

    pureComputed.subscribe(wake, null, "awake");
    pureComputed.subscribe(sleep, null, "asleep");

    return internalComputed;
}

export function unpromise(evaluator: () => any | Thenable<any>): ko.PureComputed<any>;
export function unpromise(evaluator: () => any | Thenable<any>, options: UnpromiseOptions<any>): ko.PureComputed<any>;
export function unpromise<T>(evaluator: () => T | Thenable<T>): ko.PureComputed<T>
export function unpromise<T>(evaluator: () => T | Thenable<T>, options: UnpromiseOptions<T>): ko.PureComputed<T>
export function unpromise<T>(evaluator: () => T | Thenable<T>, options?: UnpromiseOptions<T>): ko.PureComputed<T> {
    options = options || {};

    var latestValue = ko.observable(options.initialValue),
        errorValue = options.errorValue || options.initialValue,
        owner = options.owner,

        waitingOn = 0,
        pureComputed = ko.pureComputed<T>(latestValue);

    purify(pureComputed, function () {
        var prom = evaluator.call(owner),
            current = ++waitingOn;

        if (prom.then) {
            prom.then(
                res => {
                    if (current === waitingOn) {
                        latestValue(res);
                    }
                },
                () => {
                    if (current === waitingOn) {
                        latestValue(errorValue);
                    }
                });
        }
        else {
            latestValue(prom);
        }
    });

    return pureComputed;
}

ko.bindingHandlers.purify = {
    init: function () {
        return { controlsDescendantBindings: true };
    },
    update: function (element: Node, valueAccessor: () => any) {
        // Unwrap recursively - so binding can be to an array, etc.
        ko.toJS(valueAccessor());
    }
};

ko.virtualElements.allowedBindings.purify = true;

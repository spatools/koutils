import * as ko from "knockout";

export interface UnpromiseOptions<T> {
    initialValue?: T;
    errorValue?: T | any;
    owner?: any;
}

declare module "knockout" {
    export interface BindingHandlers {
        purify: {
            init(): BindingHandlerControlsDescendant;
            update(element: Node, valueAccessor: () => any): void;
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
    const internalComputed = ko.pureComputed(evaluator, owner);
    let disposable: ko.Subscription | null;

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

export function unpromise(evaluator: () => any | PromiseLike<any>): ko.PureComputed<any>;
export function unpromise(evaluator: () => any | PromiseLike<any>, options: UnpromiseOptions<any>): ko.PureComputed<any>;
export function unpromise<T>(evaluator: () => T | PromiseLike<T>): ko.PureComputed<T | undefined>;
export function unpromise<T>(evaluator: () => T | PromiseLike<T>, options: UnpromiseOptions<T> & { latestValue: T }): ko.PureComputed<T>;
export function unpromise<T>(evaluator: () => T | PromiseLike<T>, options: UnpromiseOptions<T>): ko.PureComputed<T | undefined>;
export function unpromise<T>(evaluator: () => T | PromiseLike<T>, options?: UnpromiseOptions<T>): ko.PureComputed<T | undefined> {
    options = options || {};

    const
        latestValue = ko.observable(options.initialValue),
        errorValue = options.errorValue || options.initialValue,
        owner = options.owner,

        pureComputed = ko.pureComputed<T | undefined>(latestValue);

    let waitingOn = 0;

    purify(pureComputed, function () {
        var prom = evaluator.call(owner),
            current = ++waitingOn;

        if (isPromiseLike(prom)) {
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

function isPromiseLike(p: any): p is PromiseLike<any> {
    return typeof p.then === "function";
}

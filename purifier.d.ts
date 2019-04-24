import * as ko from "knockout";
export interface UnpromiseOptions<T> {
    initialValue?: T;
    errorValue?: T | any;
    owner?: any;
}
declare module "knockout" {
    interface BindingHandlers {
        purify: {
            init(): BindingHandlerControlsDescendant;
            update(element: Node, valueAccessor: () => any): void;
        };
    }
    interface VirtualElementsAllowedBindings {
        purify: boolean;
    }
}
export declare function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U): ko.PureComputed<U>;
export declare function purify<T, U>(pureComputed: ko.PureComputed<T>, evaluator: () => U, owner: any): ko.PureComputed<U>;
export declare function unpromise(evaluator: () => any | PromiseLike<any>): ko.PureComputed<any>;
export declare function unpromise(evaluator: () => any | PromiseLike<any>, options: UnpromiseOptions<any>): ko.PureComputed<any>;
export declare function unpromise<T>(evaluator: () => T | PromiseLike<T>): ko.PureComputed<T | undefined>;
export declare function unpromise<T>(evaluator: () => T | PromiseLike<T>, options: UnpromiseOptions<T> & {
    latestValue: T;
}): ko.PureComputed<T>;
export declare function unpromise<T>(evaluator: () => T | PromiseLike<T>, options: UnpromiseOptions<T>): ko.PureComputed<T | undefined>;

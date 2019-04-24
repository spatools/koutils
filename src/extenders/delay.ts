import * as ko from "knockout";
import { createSymbol } from "../utils";

declare module "knockout" {
    export interface Extenders {
        delay<T>(target: ko.Subscribable<T>, delay: number): utils.DelayedSubscribable<T, typeof target>;
    }

    export module utils {
        export type DelayedSubscribable<T, U extends Subscribable<T>> = U & DelayedObservableExtension<T>;
        export type DelayedObservable<T> = DelayedSubscribable<T, Observable<T>>;

        export interface DelayedObservableExtension<T> {
            immediate: Observable<T>;
            dispose(): void;
        }
    }

    export interface ObservableExtenderOptions {
        delay?: number;
    }
}

ko.extenders.delay = delay;

function delay<T>(target: ko.Subscribable<T>, delay: number): delay.DelayedSubscribable<T, typeof target> {
    const
        timerProp = createSymbol("timer"),
        subsProp = createSymbol("subs"),
        disposeProp = createSymbol("oldDispose"),
        t = target as typeof target & delay.DelayedObservableExtension<T>,
        subs = [] as { dispose: Function }[];

    (<any>t)[subsProp] = subs;
    (<any>t)[disposeProp] = t.dispose;

    t.immediate = ko.observable(target());
    t.dispose = dispose;

    subs.push(t.subscribe(t.immediate));
    subs.push(t.immediate.subscribe(onImmediateChanged));

    return t;

    function onImmediateChanged(newValue: T) {
        if (newValue !== t()) {
            if ((<any>t)[timerProp]) {
                clearTimeout((<any>t)[timerProp]);
            }

            (<any>t)[timerProp] = setTimeout(() => target(newValue), delay);
        }
    }

    function dispose() {
        if (t.immediate) {
            delete t.immediate;
        }

        if ((<any>t)[timerProp]) {
            clearTimeout((<any>t)[timerProp]);
            delete (<any>t)[timerProp];
        }

        if ((<any>t)[subsProp]) {
            (<any>t)[subsProp].forEach((sub: ko.Subscription) => { sub.dispose(); });
            delete (<any>t)[subsProp];
        }

        if ((<any>t)[disposeProp]) {
            (<any>t)[disposeProp].call(t);
            t.dispose = (<any>t)[disposeProp];
            delete (<any>t)[disposeProp];
        }
        else {
            delete t.dispose;
        }
    }
}

module delay {
    export type DelayedSubscribable<T, U extends ko.Subscribable<T>> = U & DelayedObservableExtension<T>;
    export type DelayedObservable<T> = DelayedSubscribable<T, ko.Observable<T>>;

    export interface DelayedObservableExtension<T> {
        immediate: ko.Observable<T>;
        dispose(): void;
    }
}

export = delay;

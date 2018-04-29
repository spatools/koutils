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
        subs = [];

    t[subsProp] = subs;
    t[disposeProp] = t.dispose;

    t.immediate = ko.observable(target());
    t.dispose = dispose;

    subs.push(t.subscribe(t.immediate));
    subs.push(t.immediate.subscribe(onImmediateChanged));

    return t;

    function onImmediateChanged(newValue: T) {
        if (newValue !== t()) {
            if (t[timerProp]) {
                clearTimeout(t[timerProp]);
            }

            t[timerProp] = setTimeout(() => target(newValue), delay);
        }
    }

    function dispose() {
        if (t.immediate) {
            delete t.immediate;
        }

        if (t[timerProp]) {
            clearTimeout(t[timerProp]);
            delete t[timerProp];
        }

        if (t[subsProp]) {
            t[subsProp].forEach(sub => { sub.dispose(); });
            delete t[subsProp];
        }

        if (t[disposeProp]) {
            t[disposeProp].call(t);
            t.dispose = t[disposeProp];
            delete t[disposeProp];
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

import * as ko from "knockout";
import { createSymbol } from "./utils";

export type ObservableOrComputed<T> = ko.Observable<T> | ko.Computed<T>;

export type DelayedSubscribable<T, U extends ko.Subscribable<T>> = U & DelayedObservableExtension<T>;
export type DelayedObservable<T> = DelayedSubscribable<T, ko.Observable<T>>;

export interface DelayedObservableExtension<T> {
    immediate: ko.Observable<T>;
    dispose(): void;
} 

declare module "knockout" {
    export interface Extenders {
        delay<T>(target: ko.Subscribable<T>, delay: number): DelayedSubscribable<T, typeof target>;
        sync<T>(target: ko.Subscribable<T>): typeof target;
    }
}

const extenders = ko.extenders;
extenders.delay = delay;
extenders.notify = notify;
extenders.sync = sync;

export function delay<T>(target: ko.Subscribable<T>, delay: number): typeof target & DelayedObservableExtension<T> {
    const 
        timerProp = createSymbol("timer"),
        subsProp = createSymbol("subs"),
        disposeProp = createSymbol("oldDispose"),
        t = target as typeof target & DelayedObservableExtension<T>,
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

export function notify<T>(target: ObservableOrComputed<T>, notifyWhen: string | ((a: T, b: T) => boolean)): typeof target {
    if (typeof notifyWhen === "function") { // custom
        target.equalityComparer = notifyWhen;
        return target;
    }
    
    switch (notifyWhen) {
        case "always":
            target.equalityComparer = () => false;
            break;
        case "manual":
            target.equalityComparer = () => true;
            break;
        case "reference":
            target.equalityComparer = (a, b) => a === b;
            break;
        default:
            //case "primitive":
            target.equalityComparer = ko.observable.fn.equalityComparer;
            break;
    }

    return target;
}

export function sync<T>(target: ko.Subscribable<T>): typeof target {
    if (target.notifySubscribers !== ko.subscribable.fn.notifySubscribers) {
        target.notifySubscribers = ko.subscribable.fn.notifySubscribers;
    }

    return target;
}
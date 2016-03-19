import * as ko from "knockout";
import { createSymbol } from "./utils";

type ObservableOrComputed<T> = ko.Observable<T> | ko.Computed<T>;
export interface DelayedObservable<T> {
    immediate: ko.Observable<T>;
    dispose(): void;
} 

declare module "knockout" {
    export interface Extenders {
        delay<T>(target: ko.Subscribable<T>, delay: number): typeof target & DelayedObservable<T>;
        sync<T>(target: ko.Subscribable<T>): typeof target;
    }
}

const extenders = ko.extenders;

extenders.delay = function <T>(target: ko.Subscribable<T>, delay: number): typeof target & DelayedObservable<T> {
    const 
        timerProp = createSymbol("timer"),
        subsProp = createSymbol("subs"),
        disposeProp = createSymbol("oldDispose"),
        t = target as typeof target & DelayedObservable<T>,
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
            t.immediate = null;
        }
        
        if (t[subsProp]) {
            t[subsProp].forEach(sub => { sub.dispose(); });
            t[subsProp] = null;
        }
        
        if (t[disposeProp]) {
            t[disposeProp].call(t);
            t.dispose = t[disposeProp];
            t[disposeProp] = null;
        }
    }
};

extenders.notify = function <T>(target: ObservableOrComputed<T>, notifyWhen: string | ((a: T, b: T) => boolean)): typeof target {
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
};

ko.extenders.sync = function <T>(target: ko.Subscribable<T>): typeof target {
    
    if (target["_origNotifySubscribers"]) {
        target.notifySubscribers = target["_origNotifySubscribers"];
    }
    else if (target["limit"] && target["_deferUpdates"]) {
        target["limit"](cb => cb);
    }

    return target;
};

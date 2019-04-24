import * as ko from "knockout";
declare module "knockout" {
    interface Extenders {
        delay<T>(target: ko.Subscribable<T>, delay: number): utils.DelayedSubscribable<T, typeof target>;
    }
    module utils {
        type DelayedSubscribable<T, U extends Subscribable<T>> = U & DelayedObservableExtension<T>;
        type DelayedObservable<T> = DelayedSubscribable<T, Observable<T>>;
        interface DelayedObservableExtension<T> {
            immediate: Observable<T>;
            dispose(): void;
        }
    }
    interface ObservableExtenderOptions {
        delay?: number;
    }
}
declare function delay<T>(target: ko.Subscribable<T>, delay: number): delay.DelayedSubscribable<T, typeof target>;
declare module delay {
    type DelayedSubscribable<T, U extends ko.Subscribable<T>> = U & DelayedObservableExtension<T>;
    type DelayedObservable<T> = DelayedSubscribable<T, ko.Observable<T>>;
    interface DelayedObservableExtension<T> {
        immediate: ko.Observable<T>;
        dispose(): void;
    }
}
export = delay;

import * as ko from "knockout";
import * as _delay from "./extenders/delay";
import * as _notify from "./extenders/notify";
import * as _sync from "./extenders/sync";
export declare type DelayedSubscribable<T, U extends ko.Subscribable<T>> = _delay.DelayedSubscribable<T, U>;
export declare type DelayedObservable<T> = _delay.DelayedObservable<T>;
export import delay = _delay;
export import notify = _notify;
export import sync = _sync;

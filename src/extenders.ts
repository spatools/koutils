import * as ko from "knockout";
import * as _delay from "./extenders/delay";
import * as _notify from "./extenders/notify";
import * as _sync from "./extenders/sync";

export type DelayedSubscribable<T, U extends ko.Subscribable<T>> = _delay.DelayedSubscribable<T, U>;
export type DelayedObservable<T> = _delay.DelayedObservable<T>;
export const delay = _delay;

export const notify = _notify;

export const sync = _sync;
import * as _history from "./observable/history";
import * as _simulated from "./observable/simulated";
import * as _validated from "./observable/validated";
export { unpromise as asyncComputed } from "./purifier";
export declare type HistoryObservable<T> = _history.HistoryObservable<T>;
export import history = _history;
export declare type SimulatedObservable<T> = _simulated.SimulatedObservable<T>;
export import simulated = _simulated;
export declare type ValidatedObservable<T> = _validated.ValidatedObservable<T>;
export import validated = _validated;
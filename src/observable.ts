﻿import * as _history from "./observable/history";
import * as _simulated from "./observable/simulated";
import * as _validated from "./observable/validated";

export { unpromise as asyncComputed } from "./purifier";

export type HistoryObservable<T> = _history.HistoryObservable<T>;
export const history = _history;

export type SimulatedObservable<T> = _simulated.SimulatedObservable<T>;
export const simulated = _simulated;

export type ValidatedObservable<T> = _validated.ValidatedObservable<T>;
export const validated = _validated;
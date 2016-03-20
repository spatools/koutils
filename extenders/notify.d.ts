import * as ko from "knockout";
declare function notify<T>(target: notify.ObservableOrComputed<T>, notifyWhen: string | ((a: T, b: T) => boolean)): typeof target;
declare module notify {
    type ObservableOrComputed<T> = ko.Observable<T> | ko.Computed<T>;
}
export = notify;

import * as ko from "knockout";
declare function history<T>(initialValue?: T): history.HistoryObservable<T>;
declare module history {
    interface HistoryObservable<T> extends ko.PureComputed<T> {
        latestValues: ko.ObservableArray<T>;
        selectedIndex: ko.Observable<number>;
        canGoBack: ko.PureComputed<boolean>;
        canGoNext: ko.PureComputed<boolean>;
        back(): T;
        next(): T;
        replace(value: T): void;
        reset(value?: T): void;
    }
    module fn {
        function back(): any;
        function next(): any;
        function replace(value: any): void;
        function reset(value?: any): void;
    }
}
export = history;

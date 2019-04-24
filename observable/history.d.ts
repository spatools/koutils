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
        function back(this: history.HistoryObservable<any>): any;
        function next(this: history.HistoryObservable<any>): any;
        function replace(this: history.HistoryObservable<any>, value: any): void;
        function reset(this: history.HistoryObservable<any>, value?: any): void;
    }
}
export = history;

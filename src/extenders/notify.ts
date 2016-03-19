import * as ko from "knockout";

ko.extenders.notify = notify;

function notify<T>(target: notify.ObservableOrComputed<T>, notifyWhen: string | ((a: T, b: T) => boolean)): typeof target {
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
module notify {
    export type ObservableOrComputed<T> = ko.Observable<T> | ko.Computed<T>;
}

export = notify;
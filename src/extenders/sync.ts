import * as ko from "knockout";

declare module "knockout" {
    export interface Extenders {
        sync<T>(target: sync.Subscribable<T>): typeof target;
    }
}

ko.extenders.sync = sync;

function sync<T>(target: sync.Subscribable<T>): typeof target {
    if (target.notifySubscribers !== ko.subscribable.fn.notifySubscribers) {
        target.notifySubscribers = ko.subscribable.fn.notifySubscribers;
    }

    return target;
}
module sync {
    export type Subscribable<T> = ko.Subscribable<T>;
}

export = sync;
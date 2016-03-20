import * as ko from "knockout";
declare module "knockout" {
    interface Extenders {
        sync<T>(target: Subscribable<T>): typeof target;
    }
}
declare function sync<T>(target: sync.Subscribable<T>): typeof target;
declare module sync {
    type Subscribable<T> = ko.Subscribable<T>;
}
export = sync;

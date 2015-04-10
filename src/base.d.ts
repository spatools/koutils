/// <reference path="../typings/knockout/knockout.d.ts" />

declare module KoUtils {

    interface Thenable<T> {
        then<U>(onResolve: (result: T) => Thenable<U>);
        then<U>(onResolve: (result: T) => U);

        then<U>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => Thenable<U>);
        then<U>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => U);
        then<U>(onResolve: (result: T) => U, onReject: (error: Error) => Thenable<U>);
        then<U>(onResolve: (result: T) => U, onReject: (error: Error) => U);

        then<U, V>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => Thenable<V>);
        then<U, V>(onResolve: (result: T) => Thenable<U>, onReject: (error: Error) => V);
        then<U, V>(onResolve: (result: T) => U, onReject: (error: Error) => Thenable<V>);
        then<U, V>(onResolve: (result: T) => U, onReject: (error: Error) => V);
    }

}

interface KnockoutComputed<T> {
    getSubscriptionsCount(event?: string): number;
}

interface KnockoutExtenders {
    delay: (target: any, delay: number) => any;
    cnotify: (target: any, notifyWhen: any) => any;
    cthrottle: (target: any, timeout: number) => any;
    //notify: (target: any, notifyWhen: string, customEqualityComparer: (v1: any, v2: any) => number) => any;
}

interface KnockoutBindingHandlers {
    purify: KnockoutBindingHandler;
}

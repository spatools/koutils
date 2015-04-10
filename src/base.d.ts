/// <reference path="../typings/knockout/knockout.d.ts" />

interface KnockoutExtenders {
    delay: (target: any, delay: number) => any;
    cnotify: (target: any, notifyWhen: any) => any;
    cthrottle: (target: any, timeout: number) => any;
    //notify: (target: any, notifyWhen: string, customEqualityComparer: (v1: any, v2: any) => number) => any;
}


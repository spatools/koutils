﻿/// <reference path="../_definitions.d.ts" />

import ko = require("knockout");

const extenders = <any>ko.extenders;

extenders.delay = function (target: any, delay: number): any {
    const value = target();

    target.timer = null;
    target.immediate = ko.observable(value);

    target.subscribe(target.immediate);
    target.immediate.subscribe(function (newValue) {
        if (newValue !== target()) {
            if (target.timer) {
                clearTimeout(target.timer);
            }

            target.timer = setTimeout(() => target(newValue), delay);
        }
    });

    return target;
};

extenders.notify = function (target: any, notifyWhen: any): any {
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
};

extenders.cthrottle = function (target: any, timeout: number): any {
    target.throttleEvaluation = timeout;
    return target;
};

ko.extenders.sync = function (target: any): any {
    if (target._origNotifySubscribers) {
        target.notifySubscribers = target._origNotifySubscribers;
    }
    else if (target.limit && target._deferUpdates) {
        target.limit(cb => cb);
    }

    return target;
};

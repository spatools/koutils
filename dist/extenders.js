/// <reference path="../_definitions.d.ts" />
define(["require", "exports", "knockout"], function (require, exports, ko) {
    var extenders = ko.extenders;
    extenders.delay = function (target, delay) {
        var value = target();
        target.timer = null;
        target.immediate = ko.observable(value);
        target.subscribe(target.immediate);
        target.immediate.subscribe(function (newValue) {
            if (newValue !== target()) {
                if (target.timer) {
                    clearTimeout(target.timer);
                }
                target.timer = setTimeout(function () { return target(newValue); }, delay);
            }
        });
        return target;
    };
    extenders.notify = function (target, notifyWhen) {
        if (typeof notifyWhen === "function") {
            target.equalityComparer = notifyWhen;
            return target;
        }
        switch (notifyWhen) {
            case "always":
                target.equalityComparer = function () { return false; };
                break;
            case "manual":
                target.equalityComparer = function () { return true; };
                break;
            case "reference":
                target.equalityComparer = function (a, b) { return a === b; };
                break;
            default:
                //case "primitive":
                target.equalityComparer = ko.observable.fn.equalityComparer;
                break;
        }
        return target;
    };
    extenders.cthrottle = function (target, timeout) {
        target.throttleEvaluation = timeout;
        return target;
    };
});

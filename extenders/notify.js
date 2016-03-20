(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = require("knockout");
    ko.extenders.notify = notify;
    function notify(target, notifyWhen) {
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
    }
    return notify;
});

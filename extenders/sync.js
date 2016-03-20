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
    ko.extenders.sync = sync;
    function sync(target) {
        if (target.notifySubscribers !== ko.subscribable.fn.notifySubscribers) {
            target.notifySubscribers = ko.subscribable.fn.notifySubscribers;
        }
        return target;
    }
    return sync;
});

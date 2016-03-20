(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./extenders/delay", "./extenders/notify", "./extenders/sync"], factory);
    }
})(function (require, exports) {
    "use strict";
    var _delay = require("./extenders/delay");
    var _notify = require("./extenders/notify");
    var _sync = require("./extenders/sync");
    exports.delay = _delay;
    exports.notify = _notify;
    exports.sync = _sync;
});

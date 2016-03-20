(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./changetracker", "./extenders", "./observable", "./purifier", "./utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    var _changeTracker = require("./changetracker");
    exports.ChangeTracker = _changeTracker;
    var _extenders = require("./extenders");
    exports.extenders = _extenders;
    __export(require("./observable"));
    __export(require("./purifier"));
    __export(require("./utils"));
});

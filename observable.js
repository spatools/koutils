(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./observable/history", "./observable/simulated", "./observable/validated", "./purifier"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _history = require("./observable/history");
    var _simulated = require("./observable/simulated");
    var _validated = require("./observable/validated");
    var purifier_1 = require("./purifier");
    exports.asyncComputed = purifier_1.unpromise;
    exports.history = _history;
    exports.simulated = _simulated;
    exports.validated = _validated;
});

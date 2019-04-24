(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "knockout", "../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = require("knockout");
    var utils_1 = require("../utils");
    ko.extenders.delay = delay;
    function delay(target, delay) {
        var timerProp = utils_1.createSymbol("timer"), subsProp = utils_1.createSymbol("subs"), disposeProp = utils_1.createSymbol("oldDispose"), t = target, subs = [];
        t[subsProp] = subs;
        t[disposeProp] = t.dispose;
        t.immediate = ko.observable(target());
        t.dispose = dispose;
        subs.push(t.subscribe(t.immediate));
        subs.push(t.immediate.subscribe(onImmediateChanged));
        return t;
        function onImmediateChanged(newValue) {
            if (newValue !== t()) {
                if (t[timerProp]) {
                    clearTimeout(t[timerProp]);
                }
                t[timerProp] = setTimeout(function () { return target(newValue); }, delay);
            }
        }
        function dispose() {
            if (t.immediate) {
                delete t.immediate;
            }
            if (t[timerProp]) {
                clearTimeout(t[timerProp]);
                delete t[timerProp];
            }
            if (t[subsProp]) {
                t[subsProp].forEach(function (sub) { sub.dispose(); });
                delete t[subsProp];
            }
            if (t[disposeProp]) {
                t[disposeProp].call(t);
                t.dispose = t[disposeProp];
                delete t[disposeProp];
            }
            else {
                delete t.dispose;
            }
        }
    }
    return delay;
});

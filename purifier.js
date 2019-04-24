(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "knockout"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ko = require("knockout");
    function noop() {
        return true;
    }
    function purify(pureComputed, evaluator, owner) {
        var internalComputed = ko.pureComputed(evaluator, owner);
        var disposable;
        function wake() {
            if (!disposable) {
                disposable = internalComputed.subscribe(noop);
            }
        }
        function sleep() {
            if (disposable) {
                disposable.dispose();
                disposable = null;
            }
        }
        // Should we start in the awake state? 
        if (pureComputed.getSubscriptionsCount("change") !== 0) {
            wake();
        }
        pureComputed.subscribe(wake, null, "awake");
        pureComputed.subscribe(sleep, null, "asleep");
        return internalComputed;
    }
    exports.purify = purify;
    function unpromise(evaluator, options) {
        options = options || {};
        var latestValue = ko.observable(options.initialValue), errorValue = options.errorValue || options.initialValue, owner = options.owner, pureComputed = ko.pureComputed(latestValue);
        var waitingOn = 0;
        purify(pureComputed, function () {
            var prom = evaluator.call(owner), current = ++waitingOn;
            if (isPromiseLike(prom)) {
                prom.then(function (res) {
                    if (current === waitingOn) {
                        latestValue(res);
                    }
                }, function () {
                    if (current === waitingOn) {
                        latestValue(errorValue);
                    }
                });
            }
            else {
                latestValue(prom);
            }
        });
        return pureComputed;
    }
    exports.unpromise = unpromise;
    ko.bindingHandlers.purify = {
        init: function () {
            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor) {
            // Unwrap recursively - so binding can be to an array, etc.
            ko.toJS(valueAccessor());
        }
    };
    ko.virtualElements.allowedBindings.purify = true;
    function isPromiseLike(p) {
        return typeof p.then === "function";
    }
});

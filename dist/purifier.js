define(["require", "exports", "knockout"], function (require, exports, ko) {
    function noop() {
        return true;
    }
    function purify(pureComputed, evaluator, owner) {
        var internalComputed = ko.pureComputed(evaluator, owner), disposable;
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
        var latestValue = ko.observable(options.initialValue), errorValue = options.errorValue || options.initialValue, owner = options.owner, waitingOn = 0, pureComputed = ko.pureComputed(latestValue);
        purify(pureComputed, function () {
            var prom = evaluator.call(owner), current = ++waitingOn;
            if (prom.then) {
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
            ko.toJS(valueAccessor());
        }
    };
    ko.virtualElements.allowedBindings.purify = true;
});

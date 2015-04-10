/// <reference path="../_definitions.d.ts" />
/// <amd-dependency path="./underscore" />
define(["require", "exports", "knockout", "./purifier", "./utils", "./underscore"], function (require, exports, ko, purifier, utils) {
    exports.history = (function () {
        var historyObservable = function (initialValue) {
            var self = {
                latestValues: ko.observableArray([initialValue]),
                selectedIndex: ko.observable(0)
            };
            self.canGoBack = ko.pureComputed(function () { return self.selectedIndex() > 0; });
            self.canGoNext = ko.pureComputed(function () { return self.selectedIndex() < self.latestValues.size() - 1; });
            ko.utils.extend(self, historyObservable.fn);
            var result = ko.computed({
                read: function () {
                    var index = self.selectedIndex(), values = self.latestValues();
                    if (index > values.length) {
                        index = 0;
                    }
                    return values[index];
                },
                write: function (value) {
                    var index = self.selectedIndex();
                    if (value !== self.latestValues()[index]) {
                        if (index !== self.latestValues.size() - 1) {
                            self.latestValues.splice(index + 1);
                        }
                        self.latestValues.push(value);
                        self.selectedIndex(index + 1);
                    }
                }
            }).extend({ cnotify: "reference" });
            ko.utils.extend(result, self);
            return result;
        };
        historyObservable.fn = {
            back: function () {
                if (this.canGoBack()) {
                    this.selectedIndex(this.selectedIndex() - 1);
                }
                return this();
            },
            next: function () {
                if (this.canGoNext()) {
                    this.selectedIndex(this.selectedIndex() + 1);
                }
                return this();
            },
            replace: function (value) {
                var superNotify = ko.subscribable.fn.notifySubscribers.bind(this), oldValue = this();
                var index = this.selectedIndex();
                this.latestValues.valueWillMutate();
                this.latestValues()[index] = value;
                this.latestValues.valueHasMutated();
            },
            reset: function (value) {
                if (!value)
                    value = this();
                this.latestValues.splice(0, this.latestValues().length, value);
                this.selectedIndex(0);
            }
        };
        return historyObservable;
    })();
    function validated(initialValue) {
        var obsv = ko.observable(initialValue), isValid = ko.observable(true), subscription;
        obsv.subscribe(function (newValue) {
            obsv.errors = ko.validation.group(newValue || {});
            isValid(obsv.errors().length === 0);
            subscription.dispose();
            subscription = obsv.errors.subscribe(function (errors) { return isValid(errors.length === 0); });
        });
        obsv.errors = ko.validation.group(initialValue || {});
        isValid(obsv.errors().length === 0);
        obsv.isValid = ko.computed(function () { return isValid(); });
        subscription = obsv.errors.subscribe(function (errors) { return isValid(errors.length === 0); });
        return obsv;
    }
    exports.validated = validated;
    var timer = null, items = [];
    function check() {
        items = items.filter(function (item) { return utils.isNodeInDOM(item.element); });
        if (items.length === 0) {
            clearInterval(timer);
            timer = null;
            return;
        }
        items.forEach(function (item) {
            item.observable(item.getter());
        });
    }
    function simulated(element, getter) {
        var obs = ko.observable(getter());
        items.push({ observable: obs, getter: getter, element: element });
        if (timer === null) {
            timer = setInterval(check, 100);
        }
        return obs;
    }
    exports.simulated = simulated;
    //#endregion
    //#region Async Computed
    function asyncComputed(evaluator, options) {
        return purifier.unpromise(evaluator, options);
    }
    exports.asyncComputed = asyncComputed;
});
//#endregion

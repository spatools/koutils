/*eslint no-unused-vars: [0], no-redeclare: [0] */
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
    function history(initialValue) {
        var self = {
            latestValues: ko.observableArray([initialValue]),
            selectedIndex: ko.observable(0),
            canGoBack: ko.pureComputed(function () { return self.selectedIndex() > 0; }),
            canGoNext: ko.pureComputed(function () { return self.selectedIndex() < self.latestValues().length - 1; })
        };
        ko.utils.extend(self, history.fn);
        var result = ko.pureComputed({
            read: function () {
                var values = self.latestValues();
                var index = self.selectedIndex();
                if (index > values.length) {
                    index = 0;
                }
                return values[index];
            },
            write: function (value) {
                var index = self.selectedIndex(), values = self.latestValues();
                if (value !== values[index]) {
                    if (index !== values.length - 1) {
                        values.splice(index + 1);
                    }
                    values.push(value);
                    self.selectedIndex(index + 1);
                }
            }
        }).extend({ notify: "reference" });
        ko.utils.extend(result, self);
        var oldDispose = result.dispose;
        result.dispose = function () {
            oldDispose.call(this);
            this.canGoBack.dispose();
            this.canGoNext.dispose();
        };
        return result;
    }
    var history;
    (function (history) {
        var fn;
        (function (fn) {
            function back() {
                if (this.canGoBack()) {
                    this.selectedIndex(this.selectedIndex() - 1);
                }
                return this();
            }
            fn.back = back;
            function next() {
                if (this.canGoNext()) {
                    this.selectedIndex(this.selectedIndex() + 1);
                }
                return this();
            }
            fn.next = next;
            function replace(value) {
                var index = this.selectedIndex();
                this.latestValues.valueWillMutate();
                this.latestValues()[index] = value;
                this.latestValues.valueHasMutated();
            }
            fn.replace = replace;
            function reset(value) {
                if (value === void 0) { value = this(); }
                var values = this.latestValues();
                this.latestValues.splice(0, values.length, value);
                this.selectedIndex(0);
            }
            fn.reset = reset;
        })(fn = history.fn || (history.fn = {}));
    })(history || (history = {}));
    return history;
});

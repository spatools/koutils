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
    var ko = require("knockout");
    var ChangeTracker = /** @class */ (function () {
        function ChangeTracker(object, isAlreadyModified, hashFunction, params) {
            if (isAlreadyModified === void 0) { isAlreadyModified = false; }
            if (hashFunction === void 0) { hashFunction = ko.toJSON; }
            this.hashFunction = hashFunction;
            this.params = params;
            this.tracked = object;
            this.lastData = ko.observable();
            this.isModified = ko.observable(isAlreadyModified);
            this.shouldWait = shouldWait(object);
            this.isWaiting = ko.observable(this.shouldWait);
            this.setLastData();
            this.hasChanges = ko.computed(function () {
                return this.isModified() || (!this.isWaiting() && this.getHash() !== this.lastData());
            }, this);
        }
        ChangeTracker.prototype.forceChange = function () {
            this.isModified(true);
        };
        ChangeTracker.prototype.reset = function () {
            this.setLastData();
            this.isModified(false);
        };
        ChangeTracker.prototype.dispose = function () {
            this.hasChanges.dispose();
            this.lastData(null);
            this.isModified(false);
            this.tracked = null;
            this.params = null;
        };
        ChangeTracker.prototype.getHash = function () {
            return this.hashFunction(this.tracked, this.params);
        };
        ChangeTracker.prototype.setLastData = function () {
            var _this = this;
            if (!this.shouldWait) {
                this.lastData(this.getHash());
                return;
            }
            this.isWaiting(true);
            ko.tasks.schedule(function () {
                _this.lastData(_this.getHash());
                _this.isWaiting(false);
            });
        };
        return ChangeTracker;
    }());
    function shouldWait(obj) {
        if (!ko.tasks) {
            return false;
        }
        if (ko.options && ko.options.deferUpdates) {
            return true;
        }
        if (typeof obj === "object") {
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && ko.isComputed(obj[key]) &&
                    obj[key].notifySubscribers !== ko.subscribable.fn.notifySubscribers) {
                    return true;
                }
            }
        }
        return false;
    }
    return ChangeTracker;
});

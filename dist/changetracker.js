/// <reference path="../_definitions.d.ts" />
define(["require", "exports", "knockout"], function (require, exports, ko) {
    var ChangeTracker = (function () {
        function ChangeTracker(object, isAlreadyModified, hashFunction, params) {
            if (isAlreadyModified === void 0) { isAlreadyModified = false; }
            if (hashFunction === void 0) { hashFunction = ko.toJSON; }
            this.hashFunction = hashFunction;
            this.params = params;
            this.tracked = object;
            this.lastData = ko.observable(hashFunction(object, params));
            this.isModified = ko.observable(isAlreadyModified);
            this.hasChanges = ko.computed(function () {
                return this.isModified() || this.hashFunction(this.tracked, this.params) !== this.lastData();
            }, this);
        }
        ChangeTracker.prototype.forceChange = function () {
            this.isModified(true);
        };
        ChangeTracker.prototype.reset = function () {
            this.lastData(this.hashFunction(this.tracked, this.params));
            this.isModified(false);
        };
        ChangeTracker.prototype.dispose = function () {
            this.hasChanges.dispose();
            this.hasChanges = null;
            this.lastData(null);
            this.isModified(false);
            this.tracked = null;
            this.params = null;
            this.hashFunction = null;
        };
        return ChangeTracker;
    })();
    return ChangeTracker;
});

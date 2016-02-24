define(["require", "exports", "knockout"], function (require, exports, ko) {
    var ChangeTracker = (function () {
        function ChangeTracker(object, isAlreadyModified, hashFunction, params) {
            if (isAlreadyModified === void 0) { isAlreadyModified = false; }
            if (hashFunction === void 0) { hashFunction = ko.toJSON; }
            this.hashFunction = hashFunction;
            this.params = params;
            this.tracked = object;
            this.lastData = ko.observable();
            this.isModified = ko.observable(isAlreadyModified);
            this.isWaiting = ko.observable(!!ko.tasks);
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
            this.hasChanges = null;
            this.lastData(null);
            this.isModified(false);
            this.tracked = null;
            this.params = null;
            this.hashFunction = null;
        };
        ChangeTracker.prototype.getHash = function () {
            return this.hashFunction(this.tracked, this.params);
        };
        ChangeTracker.prototype.setLastData = function () {
            var _this = this;
            if (!ko.tasks) {
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
    })();
    return ChangeTracker;
});

/*eslint no-unused-vars: [0], no-redeclare: [0] */
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "knockout", "../utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    var ko = require("knockout");
    var utils_1 = require("../utils");
    function simulated(element, getter, owner) {
        var item = simulated.add(element, owner ? getter.bind(owner) : getter);
        return item.observable;
    }
    var simulated;
    (function (simulated) {
        var timer = null, items = [];
        function add(element, getter) {
            var item = {
                observable: ko.observable(getter(element)),
                getter: getter, element: element, dispose: dispose
            };
            item.observable.dispose = item.dispose.bind(item);
            items.push(item);
            if (timer === null) {
                timer = setInterval(check, 100);
            }
            return item;
            function dispose() {
                var i = items.indexOf(this);
                if (i === -1) {
                    return;
                }
                items.splice(i, 1);
                if (timer !== null && items.length === 0) {
                    clearInterval(timer);
                    timer = null;
                }
            }
        }
        simulated.add = add;
        function check() {
            items = items.filter(function (item) { return utils_1.isNodeInDOM(item.element); });
            if (items.length === 0) {
                clearInterval(timer);
                timer = null;
                return;
            }
            items.forEach(function (item) { item.observable(item.getter(item.element)); });
        }
    })(simulated || (simulated = {}));
    return simulated;
});

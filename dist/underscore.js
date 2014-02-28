define(["require", "exports", "knockout", "underscore"], function(require, exports, ko, _) {
    var p = Array.prototype;

    _.mixin({
        sum: function (list, iterator, context) {
            var result = 0;

            _.each(list, function () {
                result += iterator.apply(context, arguments);
            });

            return result;
        },
        average: function (list, iterator, context) {
            var sum = 0, count = 0;

            _.each(list, function () {
                sum += iterator.apply(context, arguments);
                count++;
            });

            return sum / count;
        },
        count: function (list, iterator, context) {
            if (!iterator) {
                return _.size(list);
            }

            return _.filter(list, iterator, context).length;
        },
        filterMap: function (list, iterator, context) {
            var result = [];

            _.each(list, function () {
                var item = iterator.apply(context, arguments);
                if (item) {
                    result.push(item);
                }
            });

            return result;
        },
        index: function (list, iterator, context) {
            var result = -1;
            _.find(list, function (value, index) {
                if (iterator.apply(context, arguments) === true) {
                    result = index;
                    return true;
                }

                return false;
            });

            return result;
        },
        partialEnd: function (func) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                args[_i] = arguments[_i + 1];
            }
            return function () {
                return func.apply(this, p.slice.call(arguments).concat(args));
            };
        }
    });

    exports.objects = {};
    exports.collections = {};

    _.each(["keys", "values", "clone", "isEmpty"], function (method) {
        exports.objects["_" + method] = function () {
            var args = arguments;
            return ko.computed(function () {
                return this[method].apply(this, args);
            }, this);
        };
        exports.objects[method] = function () {
            p.unshift.call(arguments, this());
            return _[method].apply(_, arguments);
        };
    });
    _.each(["each", "map", "filterMap", "reduce", "find", "filter", "reject", "sum", "average", "all", "any", "contains", "max", "min", "sortBy", "groupBy", "toArray", "count", "size", "index"], function (method) {
        exports.collections["_" + method] = function () {
            var args = arguments;
            return ko.computed(function () {
                return this[method].apply(this, args);
            }, this);
        };
        exports.collections[method] = function () {
            p.unshift.call(arguments, this());
            return _[method].apply(_, arguments);
        };
    });
    _.each(["first", "initial", "last", "rest", "compact", "flatten", "without", "union", "intersection", "difference", "uniq", "zip", "indexOf", "lastIndexOf"], function (method) {
        exports.collections["_" + method] = function () {
            var args = arguments;
            return ko.computed(function () {
                return this[method].apply(this, args);
            }, this);
        };
        exports.collections[method] = function () {
            var value = this();
            p.unshift.call(arguments, _.isArray(value) ? value : _.values(value));
            return _[method].apply(_, arguments);
        };
    });

    function addToSubscribable(val) {
        ko.utils.extend(val, exports.collections);
    }
    exports.addToSubscribable = addToSubscribable;

    function addToPrototype(val) {
        ko.utils.extend(val, exports.collections);
    }
    exports.addToPrototype = addToPrototype;

    ko.utils.extend(ko.observableArray.fn, exports.collections);
});

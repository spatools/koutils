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
    var utils = require("../utils");
    function validated(initialValue) {
        var errorSubProp = utils.createSymbol("errorSub"), globalSubProp = utils.createSymbol("globalSub"), obsv = ko.observable(initialValue), isValid = ko.observable(true);
        obsv[globalSubProp] = obsv.subscribe(onValueChanged);
        onValueChanged(initialValue);
        obsv.isValid = ko.pureComputed(isValid);
        obsv.dispose = dispose;
        return obsv;
        function onValueChanged(newValue) {
            obsv.errors = ko.validation.group(newValue || {});
            isValid(obsv.errors().length === 0);
            if (obsv[errorSubProp]) {
                obsv[errorSubProp].dispose();
            }
            obsv[errorSubProp] = obsv.errors.subscribe(onErrorsChanged);
        }
        function onErrorsChanged(errors) {
            isValid(errors.length === 0);
        }
        function dispose() {
            if (obsv[globalSubProp]) {
                obsv[globalSubProp].dispose();
                obsv[globalSubProp] = null;
            }
            if (obsv[errorSubProp]) {
                obsv[errorSubProp].dispose();
                obsv[errorSubProp] = null;
            }
            if (obsv.isValid) {
                obsv.isValid.dispose();
                obsv.isValid = null;
            }
        }
    }
    return validated;
});

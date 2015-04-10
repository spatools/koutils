import ko = require("knockout");

export interface UnpromiseOptions<T> {
    initialValue?: T;
    errorValue?: T|any;
    owner?: any;
}

function noop() {
    return true;
}

export function purify<T>(pureComputed: KnockoutComputed<T>, evaluator: () => any, owner?: any): KnockoutComputed<T> {
    var internalComputed = ko.pureComputed(evaluator, owner),
        disposable;

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

export function unpromise<T>(evaluator: () => KoUtils.Thenable<T>|any, options?: UnpromiseOptions<T>): KnockoutComputed<T> {
    options = options || {};

    var latestValue = ko.observable(options.initialValue),
        errorValue = options.errorValue || options.initialValue,
        owner = options.owner,

        waitingOn = 0,
        pureComputed = ko.pureComputed<T>(latestValue);

    purify(pureComputed, function () {
        var prom = evaluator.call(owner),
            current = ++waitingOn;

        if (prom.then) {
            prom.then(
                res => {
                    if (current === waitingOn) {
                        latestValue(res);
                    }
                },
                () => {
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

ko.bindingHandlers.purify = {
    init: function () {
        return { controlsDescendantBindings: true };
    },
    update: function (element, valueAccessor) {
        // Unwrap recursively - so binding can be to an array, etc.
        ko.toJS(valueAccessor());
    }
};

ko.virtualElements.allowedBindings["purify"] = true;

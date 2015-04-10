/// <reference path="../_definitions.d.ts" />
/// <amd-dependency path="./underscore" />

import ko = require("knockout");
import utils = require("./utils");

//#region History Observable

export interface KnockoutHistoryObservableStatic {
    fn: KnockoutHistoryObservableFunctions<any>;
    <T>(initialValue: T): KnockoutHistoryObservable<T>;
}

export interface KnockoutHistoryObservableFunctions<T> {
    back(): T;
    next(): T;
    replace(value: T): void;
    reset(value?: T): void;
}

export interface KnockoutHistoryObservable<T> extends KnockoutHistoryObservableFunctions<T> {
    (): T;
    (value: T): KnockoutHistoryObservable<T>;

    latestValues: KnockoutObservableArray<T>;
    selectedIndex: KnockoutObservable<number>;

    canGoBack: KnockoutComputed<boolean>;
    canGoForward: KnockoutComputed<boolean>;
}

export var history: KnockoutHistoryObservableStatic = (function () {
    var historyObservable: any = function <T>(initialValue: T): KnockoutHistoryObservable<T> {
        var self: any = {
            latestValues: ko.observableArray([initialValue]),
            selectedIndex: ko.observable(0)
        };

        self.canGoBack = ko.pureComputed(() => self.selectedIndex() > 0);
        self.canGoNext = ko.pureComputed(() => self.selectedIndex() < self.latestValues.size() - 1);

        ko.utils.extend(self, historyObservable.fn);

        var result: any = ko.computed({
            read: () => {
                var index = self.selectedIndex(),
                    values = self.latestValues();

                if (index > values.length) {
                    index = 0;
                }

                return values[index];
            },
            write: (value: any) => {
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
        replace: function (value: any): void {
            var superNotify = ko.subscribable.fn.notifySubscribers.bind(this),
                oldValue = this();

            var index = this.selectedIndex();
            this.latestValues.valueWillMutate();
            this.latestValues()[index] = value;
            this.latestValues.valueHasMutated();
        },
        reset: function (value?: any): void {
            if (!value)
                value = this();

            this.latestValues.splice(0, this.latestValues().length, value);
            this.selectedIndex(0);
        }
    };

    return historyObservable;
})();

//#endregion

//#region Validated Observable
export interface KnockoutValidatedRule {
    rule: string;
    params: any;
    message?: string;
    condition?: () => boolean;
}

export interface KnockoutValidatedErrors {
    (): string[];
    showAllMessages(): void;
    showAllMessages(show: boolean): void;
}

export interface KnockoutValidatedObservable<T> extends KnockoutObservable<T> {
    isValid: KnockoutComputed<boolean>;
    error?: string;
    errors?: KnockoutValidatedErrors;

    isValidating?: KnockoutObservable<boolean>;
    isModified?: KnockoutObservable<boolean>;
    rules?: KnockoutObservableArray<KnockoutValidatedRule>;

    _disposeValidation? (): void;
}

export function validated<T>(initialValue: T): KnockoutValidatedObservable<T> {
    var obsv: any = ko.observable<T>(initialValue),
        isValid = ko.observable(true),
        subscription: KnockoutSubscription;

    obsv.subscribe(function (newValue) {
        obsv.errors = (<any>ko).validation.group(newValue || {});
        isValid(obsv.errors().length === 0);

        subscription.dispose();
        subscription = obsv.errors.subscribe((errors: string[]) => isValid(errors.length === 0));
    });

    obsv.errors = (<any>ko).validation.group(initialValue || {});
    isValid(obsv.errors().length === 0);

    obsv.isValid = ko.computed(() => isValid());
    subscription = obsv.errors.subscribe((errors: string[]) => isValid(errors.length === 0));

    return obsv;
}

//#endregion

//#region Simulated Observable

interface SimulatedItems<T> {
    observable: KnockoutObservable<T>;
    getter: () => T;
    element: Element;
}

var timer: number = null,
    items: SimulatedItems<any>[] = [];

function check() {
    items = items.filter(item => utils.isNodeInDOM(item.element));

    if (items.length === 0) {
        clearInterval(timer);
        timer = null;
        return;
    }

    items.forEach(item => { item.observable(item.getter()); });
}

export function simulated<T>(element: Element, getter: () => T): KnockoutObservable<T> {
    var obs = ko.observable(getter());

    items.push({ observable: obs, getter: getter, element: element });

    if (timer === null) {
        timer = setInterval(check, 100);
    }

    return obs;

}

//#endregion

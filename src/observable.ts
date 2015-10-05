/// <reference path="../_definitions.d.ts" />

import ko = require("knockout");
import purifier = require("./purifier");
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
        self.canGoNext = ko.pureComputed(() => self.selectedIndex() < self.latestValues().length - 1);

        ko.utils.extend(self, historyObservable.fn);

        var result: any = ko.pureComputed({
            read: () => {
                const values = self.latestValues();
                let index = self.selectedIndex();

                if (index > values.length) {
                    index = 0;
                }

                return values[index];
            },
            write: (value: any) => {
                const
                    index = self.selectedIndex(),
                    values = self.latestValues();

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
            const index = this.selectedIndex();

            this.latestValues.valueWillMutate();
            this.latestValues()[index] = value;
            this.latestValues.valueHasMutated();
        },
        reset: function (value?: any): void {
            if (!value)
                value = this();

            const values = this.latestValues();
            this.latestValues.splice(0, values.length, value);

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

    obsv.isValid = ko.pureComputed(isValid);
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

var timer: any = null,
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

//#region Async Computed

export function asyncComputed<T>(evaluator: () => KoUtils.Thenable<T>|any, options?: purifier.UnpromiseOptions<T>): KnockoutComputed<T> {
    return purifier.unpromise<T>(evaluator, options);
}

//#endregion

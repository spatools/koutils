/*eslint no-unused-vars: [0], no-redeclare: [0] */

import * as ko from "knockout";
import * as purifier from "./purifier";
import * as utils from "utils";

//#region History Observable

export interface HistoryObservable<T> extends ko.PureComputed<T> {
    latestValues: ko.ObservableArray<T>;
    selectedIndex: ko.Observable<number>;

    canGoBack: ko.PureComputed<boolean>;
    canGoForward: ko.PureComputed<boolean>;
    
    back(): T;
    next(): T;
    replace(value: T): void;
    reset(value?: T): void;
}

export function history<T>(initialValue: T): HistoryObservable<T> {
    const self = {
        latestValues: ko.observableArray([initialValue]),
        selectedIndex: ko.observable(0),
        canGoBack: ko.pureComputed(() => self.selectedIndex() > 0),
        canGoNext: ko.pureComputed(() => self.selectedIndex() < self.latestValues().length - 1)
    };

    ko.utils.extend(self, history.fn);

    const result: any = ko.pureComputed({
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
}

export module history {
    export module fn {
        export function back() {
            if (this.canGoBack()) {
                this.selectedIndex(this.selectedIndex() - 1);
            }

            return this();
        }
        
        export function next() {
            if (this.canGoNext()) {
                this.selectedIndex(this.selectedIndex() + 1);
            }

            return this();
        }
        
        export function replace(value: any): void {
            const index = this.selectedIndex();

            this.latestValues.valueWillMutate();
            this.latestValues()[index] = value;
            this.latestValues.valueHasMutated();
        }
        
        export function reset(value?: any): void {
            if (!value)
                value = this();

            const values = this.latestValues();
            this.latestValues.splice(0, values.length, value);

            this.selectedIndex(0);
        }
    }
}

//#endregion

//#region Validated Observable

export interface ValidatedRule {
    rule: string;
    params: any;
    message?: string;
    condition?: () => boolean;
}

export interface ValidatedErrors {
    (): string[];
    showAllMessages(): void;
    showAllMessages(show: boolean): void;
}

export interface ValidatedObservable<T> extends ko.Observable<T> {
    isValid: ko.PureComputed<boolean>;
    error?: string;
    errors?: ValidatedErrors;

    isValidating?: ko.Observable<boolean>;
    isModified?: ko.Observable<boolean>;
    rules?: ko.ObservableArray<ValidatedRule>;

    _disposeValidation? (): void;
    dispose(): void;
}

export function validated<T>(initialValue: T): ValidatedObservable<T> {
    const
        errorSubProp = utils.createSymbol("errorSub"),
        globalSubProp = utils.createSymbol("globalSub"),
        
        obsv: any = ko.observable<T>(initialValue),
        isValid = ko.observable(true);
    
    obsv[globalSubProp] = obsv.subscribe(onValueChanged);
    onValueChanged(initialValue);
    
    obsv.isValid = ko.pureComputed(isValid);
    
    return obsv;
    
    function onValueChanged(newValue: T) {
        obsv.errors = (<any>ko).validation.group(newValue || {});
        isValid(obsv.errors().length === 0);
        
        if (obsv[errorSubProp]) {
            obsv[errorSubProp].dispose();
        }
        
        obsv[errorSubProp] = obsv.errors.subscribe(onErrorsChanged);
    }
    
    function onErrorsChanged(errors: string[]) {
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

//#endregion

//#region Simulated Observable

export function simulated<T>(element: Element, getter: () => T): ko.Observable<T> {
    const item = simulated.add(element, getter);
    return item.observable;
}

export module simulated {
    let 
        timer = null,
        items: SimulatedItems<any>[] = [];

   export interface SimulatedItems<T> {
        observable: ko.Observable<T>;
        getter: () => T;
        element: Element;
    }

    export function add<T>(element: Element, getter: () => T): SimulatedItems<T> {
        const item = { 
            observable: ko.observable(getter()), 
            getter, element 
        };

        items.push(item);

        if (timer === null) {
            timer = setInterval(check, 100);
        }
        
        return item;
    }
    
    function check() {
        items = items.filter(item => utils.isNodeInDOM(item.element));

        if (items.length === 0) {
            clearInterval(timer);
            timer = null;
            return;
        }

        items.forEach(item => { item.observable(item.getter()); });
    }
}

//#endregion

//#region Async Computed

export function asyncComputed<T>(evaluator: () => T | purifier.Thenable<T>, options?: purifier.UnpromiseOptions<T>): ko.PureComputed<T> {
    return purifier.unpromise<T>(evaluator, options);
}

//#endregion

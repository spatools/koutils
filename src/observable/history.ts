/*eslint no-unused-vars: [0], no-redeclare: [0] */

import * as ko from "knockout";

function history<T>(initialValue?: T): history.HistoryObservable<T> {
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
    
    const oldDispose = result.dispose;
    result.dispose = function() {
        oldDispose.call(this);
        this.canGoBack.dispose();
        this.canGoNext.dispose();
    };

    return result;
}

module history {
        
    export interface HistoryObservable<T> extends ko.PureComputed<T> {
        latestValues: ko.ObservableArray<T>;
        selectedIndex: ko.Observable<number>;

        canGoBack: ko.PureComputed<boolean>;
        canGoNext: ko.PureComputed<boolean>;
        
        back(): T;
        next(): T;
        replace(value: T): void;
        reset(value?: T): void;
    }

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
        
        export function reset(value: any = this()): void {
            const values = this.latestValues();
            this.latestValues.splice(0, values.length, value);

            this.selectedIndex(0);
        }
    }
}

export = history;

/// <reference path="../_definitions.d.ts" />

import ko = require("knockout");

class ChangeTracker {
    private tracked: any;
    private lastData: KnockoutObservable<string>;
    private isModified: KnockoutObservable<boolean>;
    private isWaiting: KnockoutObservable<boolean>;

    public hasChanges: KnockoutComputed<boolean>;

    constructor(
        object: any,
        isAlreadyModified: boolean = false,
        private hashFunction: (obj: any, params?: any) => string = ko.toJSON,
        private params?: any
    ) {
            this.tracked = object;
            this.lastData = ko.observable<string>();
            this.isModified = ko.observable(isAlreadyModified);

            this.isWaiting = ko.observable(!!(<any>ko).tasks);
            this.setLastData();

            this.hasChanges = ko.computed<boolean>(function () {
                return this.isModified() || (!this.isWaiting() && this.getHash() !== this.lastData());
            }, this);
    }

    public forceChange() {
        this.isModified(true);
    }

    public reset() {
        this.setLastData();
        this.isModified(false);
    }

    public dispose() {
        this.hasChanges.dispose();
        this.hasChanges = null;

        this.lastData(null);
        this.isModified(false);

        this.tracked = null;
        this.params = null;
        this.hashFunction = null;
    }

    private getHash() {
        return this.hashFunction(this.tracked, this.params);
    }

    private setLastData() {
        if (!(<any>ko).tasks) {
            this.lastData(this.getHash());
            return;
        }

        this.isWaiting(true);

        (<any>ko).tasks.schedule(() => {
            this.lastData(this.getHash());
            this.isWaiting(false);
        });
    }
}

export = ChangeTracker;

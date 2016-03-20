import * as ko from "knockout";

class ChangeTracker {
    private tracked: any;
    private shouldWait: boolean;
    private lastData: ko.Observable<string>;
    private isModified: ko.Observable<boolean>;
    private isWaiting: ko.Observable<boolean>;

    public hasChanges: ko.Computed<boolean>;

    constructor(
        object: any,
        isAlreadyModified: boolean = false,
        private hashFunction: (obj: any, params?: any) => string = ko.toJSON,
        private params?: any
    ) {
            this.tracked = object;
            this.lastData = ko.observable<string>();
            this.isModified = ko.observable(isAlreadyModified);

            this.shouldWait = shouldWait(object);
            this.isWaiting = ko.observable(this.shouldWait);
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
        if (!this.shouldWait) {
            this.lastData(this.getHash());
            return;
        }

        this.isWaiting(true);

        ko.tasks.schedule(() => {
            this.lastData(this.getHash());
            this.isWaiting(false);
        });
    }
}

export = ChangeTracker;

function shouldWait(obj: any): boolean {
    if (!ko.tasks) {
        return false;
    }
    
    if (ko.options && ko.options.deferUpdates) {
        return true;
    }
    
    if (typeof obj === "object") {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && ko.isComputed(obj[key]) && 
                obj[key].notifySubscribers !== ko.subscribable.fn.notifySubscribers) {
                return true;
            }
        }
    }
    
    return false;
}

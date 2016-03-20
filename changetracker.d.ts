import * as ko from "knockout";
declare class ChangeTracker {
    private hashFunction;
    private params;
    private tracked;
    private shouldWait;
    private lastData;
    private isModified;
    private isWaiting;
    hasChanges: ko.Computed<boolean>;
    constructor(object: any, isAlreadyModified?: boolean, hashFunction?: (obj: any, params?: any) => string, params?: any);
    forceChange(): void;
    reset(): void;
    dispose(): void;
    private getHash();
    private setLastData();
}
export = ChangeTracker;

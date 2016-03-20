import * as ko from "knockout";
declare function validated<T>(initialValue: T): validated.ValidatedObservable<T>;
declare module validated {
    interface ValidatedRule {
        rule: string;
        params: any;
        message?: string;
        condition?: () => boolean;
    }
    interface ValidatedErrors {
        (): string[];
        showAllMessages(): void;
        showAllMessages(show: boolean): void;
    }
    interface ValidatedObservable<T> extends ko.Observable<T> {
        isValid: ko.PureComputed<boolean>;
        error?: string;
        errors?: ValidatedErrors;
        isValidating?: ko.Observable<boolean>;
        isModified?: ko.Observable<boolean>;
        rules?: ko.ObservableArray<ValidatedRule>;
        _disposeValidation?(): void;
        dispose(): void;
    }
}
export = validated;

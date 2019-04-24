import * as ko from "knockout";
import * as utils from "../utils";

function validated<T>(initialValue: T): validated.ValidatedObservable<T> {
    const
        errorSubProp = utils.createSymbol("errorSub"),
        globalSubProp = utils.createSymbol("globalSub"),

        obsv: any = ko.observable<T>(initialValue),
        isValid = ko.observable(true);

    obsv[globalSubProp] = obsv.subscribe(onValueChanged);
    onValueChanged(initialValue);

    obsv.isValid = ko.pureComputed(isValid);
    obsv.dispose = dispose;

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
module validated {

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

        _disposeValidation?(): void;
        dispose(): void;
    }

}

export = validated;
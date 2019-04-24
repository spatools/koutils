import * as ko from "knockout";
declare function simulated<T>(element: Element, getter: (element: Element) => T, owner?: any): simulated.SimulatedObservable<T>;
declare module simulated {
    interface SimulatedItems<T> {
        observable: SimulatedObservable<T>;
        getter: (element: Element) => T;
        element: Element;
        dispose(): void;
    }
    interface SimulatedObservable<T> extends ko.Observable<T> {
        dispose(): void;
    }
    function add<T>(element: Element, getter: (element: Element) => T): SimulatedItems<T>;
}
export = simulated;

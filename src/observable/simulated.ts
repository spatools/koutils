/*eslint no-unused-vars: [0], no-redeclare: [0] */

import * as ko from "knockout";
import { isNodeInDOM } from "../utils";

function simulated<T>(element: Element, getter: (element: Element) => T, owner?: any): simulated.SimulatedObservable<T> {
    const item = simulated.add<T>(element, owner ? getter.bind(owner) : getter);
    return item.observable;
}

module simulated {
    let
        timer = null as number | null,
        items: SimulatedItems<any>[] = [];

    export interface SimulatedItems<T> {
        observable: SimulatedObservable<T>;
        getter: (element: Element) => T;
        element: Element;
        dispose(): void;
    }

    export interface SimulatedObservable<T> extends ko.Observable<T> {
        dispose(): void;
    }

    export function add<T>(element: Element, getter: (element: Element) => T): SimulatedItems<T> {
        const item = {
            observable: ko.observable(getter(element)) as SimulatedObservable<T>,
            getter, element, dispose
        };

        item.observable.dispose = item.dispose.bind(item);

        items.push(item);

        if (timer === null) {
            timer = setInterval(check, 100);
        }

        return item;

        function dispose(this: SimulatedItems<any>) {
            const i = items.indexOf(this);
            if (i === -1) { return; }

            items.splice(i, 1);

            if (timer !== null && items.length === 0) {
                clearInterval(timer);
                timer = null;
            }
        }
    }

    function check() {
        items = items.filter(item => isNodeInDOM(item.element));

        if (items.length === 0 && timer) {
            clearInterval(timer);
            timer = null;
            return;
        }

        items.forEach(item => { item.observable(item.getter(item.element)); });
    }
}

export = simulated;

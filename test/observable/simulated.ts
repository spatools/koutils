import * as simulatedObservable from "../../src/observable/simulated";
import { isNodeInDOM } from "../../src/utils";
import * as ko from "knockout";
import * as sinon from "sinon";

describe("observable/simulated", () => {
    let div: HTMLDivElement;
    let simu: simulatedObservable.SimulatedObservable<any>;

    beforeEach(() => {
        div = document.createElement("div");
        div.style.width = "250px";
        div.style.height = "250px";

        document.body.appendChild(div);
    });

    afterEach(() => {
        if (div) {
            if (isNodeInDOM(div)) {
                div.parentNode.removeChild(div);
            }

            div = null;
        }

        if (simu) {
            simu.dispose();
            simu = null;
        }
    });

    it("should accept an element and a getter function", () => {
        simu = simulatedObservable(div, () => div.clientWidth);
    });

    it("should accept a owner argument which is bound to getter functiton", () => {
        const self = {};
        simu = simulatedObservable(div, function() { self.should.equal(this); }, self);
    });

    it("should evaluate getter function immediately", () => {
        simu = simulatedObservable(div, () => div.clientWidth);
        simu().should.equal(250);
    });

    it("should reevaluate getter function every about 100 milliseconds", (done) => {
        simu = simulatedObservable(div, () => div.clientWidth);
        simu().should.equal(250);

        div.style.width = "350px";

        setTimeout(() => {
            simu().should.equal(350);
            done();
        }, 150);
    });

    it("should stop reevaluation if element is no more in DOM", (done) => {
        const spy = sinon.spy(() => div.clientWidth);
        simu = simulatedObservable(div, spy);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, div);

        div.style.width = "350px";

        setTimeout(() => {
            sinon.assert.calledTwice(spy);
            sinon.assert.alwaysCalledWith(spy, div);

            div.style.width = "450px";
            div.parentNode.removeChild(div);

            setTimeout(() => {
                sinon.assert.calledTwice(spy);

                done();
            }, 150);
        }, 150);
    });

    it("should stop reevaluation if dispose function is called", (done) => {
        const spy = sinon.spy(() => div.clientWidth);
        simu = simulatedObservable(div, spy);

        sinon.assert.calledOnce(spy);
        sinon.assert.calledWith(spy, div);

        div.style.width = "350px";

        setTimeout(() => {
            sinon.assert.calledTwice(spy);
            sinon.assert.alwaysCalledWith(spy, div);

            div.style.width = "450px";
            simu.dispose();

            setTimeout(() => {
                sinon.assert.calledTwice(spy);

                done();
            }, 150);
        }, 150);
    });
});

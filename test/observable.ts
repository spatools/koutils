import * as observable from "../src/observable";

describe("observable", () => {

    ["history", "simulated", "validated"].forEach(obsType => {
        describe(obsType, () => {

            it("should be a redirection of observable/" + obsType, () => {
                observable[obsType].should.equal(require("../src/observable/" + obsType));
            });

        });
    });

    describe("asyncComputed", () => {

        it("should be a redirection of purifier.unpromise", () => {
            observable.asyncComputed.should.equal(require("../src/purifier")["unpromise"]);
        });

    });
});

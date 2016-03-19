import * as extenders from "../src/extenders";
import * as ko from "knockout";
import * as sinon from "sinon";

describe("extenders", () => {
    
    ["delay", "notify", "sync"].forEach(extType => {
        describe(extType, () => {

            it("should be a redirection of extenders/" + extType, () => {
                extenders[extType].should.equal(require("../src/extenders/" + extType));
            });

            it("should be available using ko.extenders." + extType, () => {
                extenders[extType].should.equal(ko.extenders[extType]);
            });

        });
    });

});
import * as syncExtender from "../../src/extenders/sync";
import * as ko from "knockout";
import * as sinon from "sinon";

describe("extenders/sync", () => {
    let sub: ko.Subscription;
    afterEach(() => {
        if (sub) {
            sub.dispose();
            sub = null;
        }
    });

    describe("sync", () => {

        it("shoud be available in ko.extenders", () => {
            ko.extenders.sync.should.be.a.Function;
            ko.extenders.sync.should.equal(syncExtender);
        });

        it("shoud return given subscribable", () => {
            const obs = ko.observable("test");
            obs.extend({ sync: true }).should.be.equal(obs);
        });

        it("should restore subscribable to its default state", () => {
            const
                obs = ko.observable("test").extend({ deferred: true }),
                spy = sinon.spy();

            sub = obs.subscribe(spy);

            obs("test 2");
            sinon.assert.notCalled(spy);

            obs.extend({ sync: true });
            obs("test 3");

            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, "test 3");
        });

    });

});
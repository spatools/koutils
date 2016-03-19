import * as purifier from "../src/purifier";
import * as utils from "../src/utils";
import * as ko from "knockout";
import * as sinon from "sinon";

describe("purifier", () => {
    let obs = ko.observable("value");
    let base: ko.PureComputed<number>;
    let pure: ko.PureComputed<string>;
    let subs: { dispose(): void; }[];
    
    beforeEach(() => {
        obs = ko.observable("value");
        base = ko.pureComputed<number>(ko.observable(Math.random()));
    });
    
    afterEach(() => {
        subs && subs.forEach(s => { s.dispose(); });
        pure && pure.dispose();
        base && base.dispose();
        
        subs = [];
        pure = base = obs = null;
    });
    
    describe("purify", () => {
        
        it("should create a new pureComputed", () => {
            pure = purifier.purify(base, () => obs());
            ko.isPureComputed(pure).should.be.ok;
        });
        
        it("should not awake created pureComputed while given pureComputed is not awake", () => {
            const spy = sinon.spy(() => obs());
            pure = purifier.purify(base, spy);
            
            obs("value_2");
            
            sinon.assert.notCalled(spy);
        });
        
        it("should awake created pureComputed when given pureComputed awake", () => {
            const spy = sinon.spy();
            pure = purifier.purify(base, () => spy(obs()));
            
            obs("value_2");
            sinon.assert.notCalled(spy);
            
            subs.push(base.subscribe(() => true));
            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, "value_2");
            
            obs("value_3");
            sinon.assert.calledTwice(spy);
            sinon.assert.calledWith(spy, "value_3");
        });
        
        it("should asleep created pureComputed when given pureComputed asleep", () => {
            const spy = sinon.spy();
            pure = purifier.purify(base, () => spy(obs()));
            
            obs("value_2");
            const sub = base.subscribe(() => true);
            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, "value_2");
            
            obs("value_3");
            sinon.assert.calledTwice(spy);
            sinon.assert.calledWith(spy, "value_3");
            
            sub.dispose();
            obs("value_4");
            
            sinon.assert.calledTwice(spy);
        });
        
        it("should start awaken if given pureComputed is active", () => {
            const spy = sinon.spy();
            const sub = base.subscribe(() => true);
            
            pure = purifier.purify(base, () => spy(obs()));
            
            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, "value");
            
            obs("value_2");
            sinon.assert.calledTwice(spy);
            sinon.assert.calledWith(spy, "value_2");
            
            sub.dispose();
            obs("value_3");
            
            sinon.assert.calledTwice(spy);
        });
        
    });
    
});
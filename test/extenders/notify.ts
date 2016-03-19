import * as notifyExtender from "../../src/extenders/notify";
import * as ko from "knockout";
import * as sinon from "sinon";

describe("extenders/notify", () => {
    let sub: ko.subscription<any>;
    afterEach(() => { 
        if (sub) {
            sub.dispose();
            sub = null;
        } 
    });

    describe("notify", () => {
        
        it("shoud be available in ko.extenders", () => {
            ko.extenders.notify.should.be.a.Function;
            ko.extenders.notify.should.equal(notifyExtender);
        });

        it("shoud return given subscribable", () => {
            const obs = ko.observable("test");
            obs.extend({ notify: "reference" }).should.be.equal(obs);
        });
        
        describe("when 'always' is passed as argument", () => {
            
            it("shoud notify subscribers if value is equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "always" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test");
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, "test");
            });
            
            it("shoud notify subscribers if value is not equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "always" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test 2");
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, "test 2");
            });
        });
        
        describe("when 'primitive' is passed as argument", () => {
            
            it("shoud not notify subscribers if value is primitive and equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "primitive" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test");
                
                sinon.assert.notCalled(spy);
            });
            
            it("shoud notify subscribers if value is primitive and not equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "primitive" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test 2");
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, "test 2");
            });
            
            it("shoud notify subscribers if values are equals but not primitive", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable(obj).extend({ notify: "primitive" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, obj);
            });
            
            it("shoud notify subscribers if values are not equals and not primitive", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable({ base: "test" }).extend({ notify: "primitive" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, obj);
            });
            
        });
        
        describe("when 'reference' is passed as argument", () => {
            
            it("shoud not notify subscribers if value is primitive and equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "reference" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test");
                
                sinon.assert.notCalled(spy);
            });
            
            it("shoud notify subscribers if value is primitive and not equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "reference" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test 2");
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, "test 2");
            });
            
            it("shoud not notify subscribers if values are reference equals", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable(obj).extend({ notify: "reference" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                sinon.assert.notCalled(spy);
            });
            
            it("shoud notify subscribers if values are not reference equals", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable({ base: "test" }).extend({ notify: "reference" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, obj);
            });
            
        });
        
        describe("when 'manual' is passed as argument", () => {
            
            it("shoud not notify subscribers if value is primitive and equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "manual" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test");
                
                sinon.assert.notCalled(spy);
            });
            
            it("shoud notify subscribers if value is primitive and not equal", () => {
                const 
                    obs = ko.observable("test").extend({ notify: "manual" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs("test 2");
                
                sinon.assert.notCalled(spy);
            });
            
            it("shoud not notify subscribers if values are reference equals", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable(obj).extend({ notify: "manual" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                sinon.assert.notCalled(spy);
            });
            
            it("shoud notify subscribers if values are not reference equals", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable({ base: "test" }).extend({ notify: "manual" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                sinon.assert.notCalled(spy);
            });

            it("shoud notify subscribers if notifySubscribers function is called", () => {
                const 
                    obj = { test: "test" },
                    obs = ko.observable({ base: "test" }).extend({ notify: "manual" }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(obj);
                
                obs.notifySubscribers(obj)
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, obj );
            });
            
        });
        
        
        describe("when a function is passed as argument", () => {
            function customEquality(oldValue, newValue) {
                return newValue <= oldValue;
            }
            
            it("shoud notify subscribers if given function returns true.", () => {
                const 
                    obs = ko.observable(1).extend({ notify: customEquality }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(2);
                
                sinon.assert.calledOnce(spy);
                sinon.assert.calledWith(spy, 2);
            });

            it("shoud not notify subscribers if given function returns false.", () => {
                const 
                    obs = ko.observable(2).extend({ notify: customEquality }),
                    spy = sinon.spy();
                
                sub = obs.subscribe(spy);
                obs(1);
                
                sinon.assert.notCalled(spy);
            });
            
        });
    });

});
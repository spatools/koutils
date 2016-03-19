import * as delayExtender from "../../src/extenders/delay";
import * as ko from "knockout";

describe("extenders/delay", () => {
    let sub: ko.subscription<any>;
    afterEach(() => { 
        if (sub) {
            sub.dispose();
            sub = null;
        } 
    });

    describe("delay", () => {

        it("shoud be available in ko.extenders", () => {
            ko.extenders.delay.should.be.a.Function;
            ko.extenders.delay.should.equal(delayExtender);
        });

        it("shoud return given subscribable", () => {
            const obs = ko.observable("test");
            obs.extend({ delay: 10 }).should.be.equal(obs);
        });

        it("should add immediate and dispose to given subscribable", () => {
            const obs = ko.observable("test").extend({ delay: 10 }) as delayExtender.DelayedObservable<string>;
            obs.immediate.should.be.a.Function;
            ko.isSubscribable(obs.immediate).should.be.true;

            obs.dispose.should.be.a.Function;
        });

        describe("when immediate observable is changed", () => {

            it("should wait before setting source observable", () => {
                const obs = ko.observable("test").extend({ delay: 10 }) as delayExtender.DelayedObservable<string>;
                obs.immediate("test 2");

                obs().should.equal("test");
            });
            
            it("should set value after given duration", (done) => {
                const obs = ko.observable("test").extend({ delay: 10 }) as delayExtender.DelayedObservable<string>;
                obs.immediate("test 2");
                
                setTimeout(() => {
                    obs().should.equal("test 2");
                    done();
                }, 15);
            });
            
        });

        describe("when dispose is called", () => {

            it("should release every extensions applied by extender", () => {
                const obs = ko.observable("test").extend({ delay: 10 }) as delayExtender.DelayedObservable<string>;
                obs.dispose();
                
                should(obs.immediate).be.empty;
                should(obs.dispose).be.empty;
            });
            
            it("should stop immediately value propagation", (done) => {
                const obs = ko.observable("test").extend({ delay: 10 }) as delayExtender.DelayedObservable<string>;
                obs.immediate("test 2");
                
                setTimeout(() => {
                    obs().should.equal("test");
                    done();
                }, 15);

                obs.dispose();
            });
            
        });

    });

});
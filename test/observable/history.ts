import * as historyObservable from "../../src/observable/history";
import * as ko from "knockout";

describe("observable/history", () => {
    let hist: historyObservable.HistoryObservable<any>;
    afterEach(() => {
        if (hist) {
            hist.dispose();
            hist = null;
        }
    });

    describe("creation", () => {

        it("should accept a initialValue argument", () => {
            hist = historyObservable("value");
            hist().should.equal("value");
        });

        it("should be undefined if no initialValue argument is provided", () => {
            hist = historyObservable();
            should(hist()).be.empty;
        });

        it("should return a valid subscribable", () => {
            hist = historyObservable();
            ko.isSubscribable(hist).should.be.ok;
        });

        it("should start with only initial value", () => {
            hist = historyObservable();
            hist.selectedIndex().should.equal(0);
            hist.latestValues().length.should.equal(1);

            hist.canGoBack().should.not.be.ok;
            hist.canGoNext().should.not.be.ok;
        });

    });

    describe("adding values", () => {

        it("should add newValue to latestValues and move selectedIndex", () => {
            hist = historyObservable();

            for (let i = 0; i < 5; i++) {
                hist(`test_${i}`);

                hist.latestValues().length.should.equal(i + 2);
                hist.selectedIndex().should.equal(i + 1);

                hist().should.equal(`test_${i}`);
            }
        });

        it("should remove all values after current selectedIndex", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");
            hist("test_3");

            hist.selectedIndex(1);
            hist("test_4");

            hist.latestValues().length.should.equal(3);
            hist.latestValues().should.match(["test", "test_1", "test_4"]);

            hist.selectedIndex().should.equal(2);

            hist().should.equal("test_4");
        });

    });

    describe("canGoBack", () => {

        it("should be true if selectedIndex is greater than 0", () => {
            hist = historyObservable("test");

            hist.canGoBack().should.not.be.ok;

            hist("test_1");

            hist.canGoBack().should.be.ok;
        });

        it("should go back to false if selectedIndex go back to 0", () => {
            hist = historyObservable("test");
            hist("test_1");

            hist.canGoBack().should.be.ok;

            hist.selectedIndex(0);

            hist.canGoBack().should.not.be.ok;
        });

    });

    describe("canGoNext", () => {

        it("should be true if selectedIndex is not set to last entry in history", () => {
            hist = historyObservable("test");

            hist("test_1");
            hist.canGoNext().should.not.be.ok;

            hist("test_2");
            hist.canGoNext().should.not.be.ok;

            hist.selectedIndex(0);

            hist.canGoNext().should.be.ok;
        });

        it("should go back to false if selectedIndex go back to last entry", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist.selectedIndex(0);

            hist.canGoNext().should.be.ok;

            hist.selectedIndex(1);

            hist.canGoNext().should.not.be.ok;
        });

        it("should go back to false if a new entry is added to history", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist.selectedIndex(0);

            hist.canGoNext().should.be.ok;

            hist("test_2");

            hist.canGoNext().should.not.be.ok;
        });

    });

    describe("back", () => {

        it("should move selectedIndex to previous index", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.back();

            hist.selectedIndex().should.equal(1);
        });

        it("should not move selectedIndex if already at the beginning of history", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.selectedIndex(0);
            hist.back();

            hist.selectedIndex().should.equal(0);
        });

    });

    describe("next", () => {

        it("should move selectedIndex to next index", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.selectedIndex(0);
            hist.next();

            hist.selectedIndex().should.equal(1);
        });

        it("should not move selectedIndex if already at the end of history", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.next();

            hist.selectedIndex().should.equal(2);
        });

    });

    describe("replace", () => {

        it("should replace current value with the specified one", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.selectedIndex(1);
            hist.replace("test_1_edited");

            hist().should.equal("test_1_edited");
            hist.latestValues().should.match(["test", "test_1_edited", "test_2"]);
        });

        it("should not change selectedIndex nor latestValues length", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.selectedIndex(1);
            hist.replace("test_1_edited");

            hist.selectedIndex().should.equal(1);
            hist.latestValues().length.should.equal(3);
        });

    });

    describe("reset", () => {

        it("should remove all previous entries and restart with given value", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");
            hist("test_3");

            hist.reset("test_initial");

            hist().should.equal("test_initial");
            hist.selectedIndex().should.equal(0);
            hist.latestValues().length.should.equal(1);
        });

        it("should restart with current value if no initialValue is specified", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");

            hist.reset();

            hist().should.equal("test_2");
            hist.selectedIndex().should.equal(0);
            hist.latestValues().length.should.equal(1);
        });

    });

    describe("dispose", () => {

        it("should dispose every computed", () => {
            hist = historyObservable("test");
            hist("test_1");
            hist("test_2");
            hist("test_3");

            hist.dispose();

            hist.canGoBack.isActive().should.not.be.ok();
            hist.canGoNext.isActive().should.not.be.ok();
            hist.isActive().should.not.be.ok();
        });

    });

});

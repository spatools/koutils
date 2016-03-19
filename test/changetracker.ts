import * as ko from "knockout";
import * as commonHelpers from "./helpers/common";
import ChangeTracker = require("../src/changetracker");

describe("ChangeTracker", () => {

    describe("hasChanges method", () => {

        it("should not detect changes when nothing change", () => {
            var note = commonHelpers.createNote(),
                tracker = new ChangeTracker(note),

                hasChanges = tracker.hasChanges();

            hasChanges.should.be.not.ok;
        });

        it("should detect changes when something change", () => {
            var note = commonHelpers.createNote(),
                tracker = new ChangeTracker(note),

                hasChanges = tracker.hasChanges();

            hasChanges.should.be.not.ok;

            note.title("Note #2");

            hasChanges = tracker.hasChanges();
            hasChanges.should.be.ok;
        });
    });

    describe("reset method", () => {

        it("should reset tracker with current value", () => {
            var note = commonHelpers.createNote(),
                tracker = new ChangeTracker(note),

                hasChanges = tracker.hasChanges();

            hasChanges.should.be.not.ok;

            note.title("Note #2");

            hasChanges = tracker.hasChanges();
            hasChanges.should.be.ok;

            tracker.reset();

            hasChanges = tracker.hasChanges();
            hasChanges.should.be.not.ok;
        });

    });

    describe("alreadyModified argument", () => {

        it("should detect changes immediately", () => {
            var note = commonHelpers.createNote(),
                tracker = new ChangeTracker(note, true),

                hasChanges = tracker.hasChanges();

            hasChanges.should.be.ok;
        });

        it("should not detect changes anymore after a reset call", () => {
            var note = commonHelpers.createNote(),
                tracker = new ChangeTracker(note, true),

                hasChanges = tracker.hasChanges();

            hasChanges.should.be.ok;

            tracker.reset();

            hasChanges = tracker.hasChanges();
            hasChanges.should.be.not.ok;
        });

    });
});

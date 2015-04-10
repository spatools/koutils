//// <reference path="../_definitions.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/should/should.d.ts" />
/// <reference path="../typings/sinon/sinon.d.ts" />

import ko = require("knockout");
import utils = require("../src/utils");
import commonHelpers = require("./helpers/common");

describe("Utils Module", () => {

    describe("createAccessor", () => {

        it("should return a Function which result is given param", () => {
            var value = commonHelpers.createNote(),
                accessor = utils.createAccessor(value);

            accessor.should.be.a.Function;
            accessor().should.equal(value);
        });

    });

    describe("createObservable", () => {

        it("should return an observable containing given value if not a subscribable", () => {
            var value = commonHelpers.createNote(),
                result = utils.createObservable(value);

            ko.isSubscribable(result).should.be.ok;
            result().should.equal(value);
        });

        it("should return same value if given parameter is an observable", () => {
            var value = ko.observable("flux"),
                result = utils.createObservable(value);

            ko.isSubscribable(result).should.be.ok;
            result.should.equal(value);
        });

        it("should return same value if given parameter is a computed", () => {
            var val = ko.observable("flux"),
                value = ko.computed(val),
                result = utils.createObservable(value);

            ko.isSubscribable(result).should.be.ok;
            result.should.equal(value);
        });

    });

    describe("createObservableArray", () => {

        it("should return an observable containing given value if not a subscribable", () => {
            var value = commonHelpers.createNoteArray(),
                result = utils.createObservable(value);

            ko.isSubscribable(result).should.be.ok;
            result().should.equal(value);
        });

        it("should return same value if given parameter is an observable", () => {
            var value = ko.observable(commonHelpers.createNoteArray()),
                result = utils.createObservable(value);

            ko.isSubscribable(result).should.be.ok;
            result.should.equal(value);
        });

        it("should return same value if given parameter is a computed", () => {
            var val = ko.observable(commonHelpers.createNoteArray()),
                value = ko.computed(val),
                result = utils.createObservable(value);

            ko.isSubscribable(result).should.be.ok;
            result.should.equal(value);
        });

    });

    describe("is", () => {

        it("should return true if value is of the specified type", () => {
            var str = "a string value",
                num = 123,
                bool = true,
                fn = () => null,
                obj = {},
                undef,
                nul = null;

            utils.is(str, "string").should.be.ok;
            utils.is(num, "number").should.be.ok;
            utils.is(bool, "boolean").should.be.ok;
            utils.is(fn, "function").should.be.ok;
            utils.is(obj, "object").should.be.ok;
            utils.is(undef, "undefined").should.be.ok;
            utils.is(nul, "object").should.be.ok;
        });

        it("should return false if value is not of the specified type", () => {
            var str = "a string value",
                num = 123,
                bool = true,
                fn = () => null,
                obj = {},
                undef,
                nul = null;

            utils.is(str, "number").should.not.be.ok;
            utils.is(num, "boolean").should.not.be.ok;
            utils.is(bool, "function").should.not.be.ok;
            utils.is(fn, "object").should.not.be.ok;
            utils.is(obj, "test").should.not.be.ok;
            utils.is(undef, "string").should.not.be.ok;
            utils.is(nul, "test").should.not.be.ok;
        });

    });

    describe("isOf", () => {

        it("should return true if value is of one of the specified types", () => {
            var str = "a string value",
                num = 123,
                bool = true,
                fn = () => null,
                obj = {},
                undef,
                nul = null;

            utils.isOf(str, "string", "number", "boolean").should.be.ok;
            utils.isOf(num, "string", "number", "boolean").should.be.ok;
            utils.isOf(bool, "string", "number", "boolean").should.be.ok;
            utils.isOf(fn, "function", "object").should.be.ok;
            utils.isOf(obj, "function", "object").should.be.ok;
            utils.isOf(undef, "undefined").should.be.ok;
            utils.isOf(nul, "function", "object").should.be.ok;
        });

        it("should return false if value is not of the specified type", () => {
            var str = "a string value",
                num = 123,
                bool = true,
                fn = () => null,
                obj = {},
                undef,
                nul = null;

            utils.isOf(str, "number", "boolean").should.not.be.ok;
            utils.isOf(num, "boolean", "string").should.not.be.ok;
            utils.isOf(bool, "function", "object").should.not.be.ok;
            utils.isOf(fn, "object", "string").should.not.be.ok;
            utils.isOf(obj, "test", "test2").should.not.be.ok;
            utils.isOf(undef, "string", "boolean").should.not.be.ok;
            utils.isOf(nul, "test", "test2").should.not.be.ok;
        });

    });

    describe("isDate", () => {

        it("should return true if value is a valid ISO Date", () => {
            var value = "1970-01-01T00:00:00";

            utils.isDate(value).should.be.ok;
        });

        it("should return false if value is not a valid ISO Date", () => {
            var a = "1970", b = "bla", c = "true";

            utils.isDate(a).should.not.be.ok;
            utils.isDate(b).should.not.be.ok;
            utils.isDate(c).should.not.be.ok;
        });

    });

    describe("isNullOrUndefined", () => {

        it("should return true if value is null or undefined", () => {
            var a = null, b;

            utils.isNullOrUndefined(a).should.be.ok;
            utils.isNullOrUndefined(b).should.be.ok;
        });

        it("should return false if value is any other thing", () => {
            var a = "a", b = true, c = {}, d = () => null, e = 1;

            utils.isNullOrUndefined(a).should.not.be.ok;
            utils.isNullOrUndefined(b).should.not.be.ok;
            utils.isNullOrUndefined(c).should.not.be.ok;
            utils.isNullOrUndefined(d).should.not.be.ok;
            utils.isNullOrUndefined(e).should.not.be.ok;
        });

    });

    describe("isNullOrWhiteSpace", () => {

        it("should return true if value is null or contains only whitespaces", () => {
            var a = null, b = " ", c = "", d = "  ";

            utils.isNullOrWhiteSpace(a).should.be.ok;
            utils.isNullOrWhiteSpace(b).should.be.ok;
            utils.isNullOrWhiteSpace(c).should.be.ok;
            utils.isNullOrWhiteSpace(d).should.be.ok;
        });

        it("should return false if value contains any other character", () => {
            var a = "a", b = " b", c = "  cddef";

            utils.isNullOrWhiteSpace(a).should.not.be.ok;
            utils.isNullOrWhiteSpace(b).should.not.be.ok;
            utils.isNullOrWhiteSpace(c).should.not.be.ok;
        });

    });

    describe("inherits", () => {

        it("should create a real inheritance between the two given objects", () => {
            var TestType = utils.inherits(
                function () {
                    this.prop2 = "prop2";
                },
                commonHelpers.SampleClass,
                {
                    do2: function () {
                        return "do2";
                    }
                }
            );

            var test = new TestType();
            test.should.be.instanceOf(commonHelpers.SampleClass);
        });

        it("should call super constructor when contruct derived type", () => {
            var TestType = utils.inherits(
                function () {
                    this.prop2 = "prop2";
                },
                commonHelpers.SampleClass,
                {
                    do2: function () {
                        return "do2";
                    }
                }
            );

            var test = new TestType();

            test.should.have.properties("prop1", "prop2");
            test.prop1.should.equal("prop1");
            test.prop2.should.equal("prop2");
        });

        it("shoud have both prototypes' methods in derived type", () => {
            var TestType = utils.inherits(
                function () {
                    this.prop2 = "prop2";
                },
                commonHelpers.SampleClass,
                {
                    do2: function () {
                        return "do2";
                    }
                }
                );

            var test = new TestType();

            test.should.have.properties("do1", "do2");
            test.do1.should.be.a.Function;
            test.do2.should.be.a.Function;

            test.do1().should.be.equal("do1");
            test.do2().should.be.equal("do2");
        });

    });

    describe("getWindowSize", () => {

        it("should return a valid size with width and height typed as Number", () => {
            var size = utils.getWindowSize();

            size.width.should.be.a.Number;
            size.height.should.be.a.Number;
        });

        it("should return a valid size with width and height >= 0", () => {
            var size = utils.getWindowSize();

            size.width.should.be.greaterThan(-1);
            size.height.should.be.greaterThan(-1);
        });

    });

    describe("format", () => {

        it("should return a formatted string by replacing every {N} tag with given values", () => {
            var value1 = utils.format("{0}", "Hello", "World"),
                value2 = utils.format("{1}", "Hello", "World"),
                value3 = utils.format("{0} {1}", "Hello", "World");

            value1.should.equal("Hello");
            value2.should.equal("World");
            value3.should.equal("Hello World");
        });

        it("should allow {{N}} syntax by replacing by {N}", () => {
            var value1 = utils.format("{{this is a test}}", "Hello", "World"),
                value2 = utils.format("{{0}} {0}{1}", "Hello", "World");

            value1.should.equal("{{this is a test}}");
            value2.should.equal("{0} HelloWorld");
        });

        it("should uppercase value formatted using {N:U} syntax", () => {
            var value1 = utils.format("{0:U}", "Hello", "World"),
                value2 = utils.format("{0} {1:U}", "Hello", "World");

            value1.should.equal("HELLO");
            value2.should.equal("Hello WORLD");
        });

        it("should lowercase value formatted using {N:u} syntax", () => {
            var value1 = utils.format("{0:u}", "Hello", "World"),
                value2 = utils.format("{0} {1:u}", "Hello", "World");

            value1.should.equal("hello");
            value2.should.equal("Hello world");
        });

    });

    describe("str_pad", () => {

        it("should create a string of given size", () => {
            var value1 = utils.str_pad("1", 9, "0"),
                value2 = utils.str_pad("1", 5, "0"),
                value3 = utils.str_pad("1", 3, "0", true);

            value1.length.should.equal(9);
            value2.length.should.equal(5);
            value3.length.should.equal(3);
        });

        it("should add given character to the result string", () => {
            var value1 = utils.str_pad("1", 9, "0"),
                value2 = utils.str_pad("11", 5, "#"),
                value3 = utils.str_pad("1111", 3, "0");

            value1.should.equal("000000001");
            value2.should.equal("###11");
            value3.should.equal("1111");
        });

        it("should add given character to the right of result string if specified", () => {
            var value1 = utils.str_pad("1", 9, "0", true),
                value2 = utils.str_pad("11", 5, "0", true),
                value3 = utils.str_pad("1111", 3, "0", true);

            value1.should.equal("100000000");
            value2.should.equal("11000");
            value3.should.equal("1111");
        });

    });

    describe("arrayEquals", () => {

        it("should return true when arrays have exact same values", () => {
            var obj1 = { prop: "value" },
                obj2 = { prop: "eulav" },
                obj3 = { prop: "lueva" },
                obj4 = { prop: "eluav" };

            var array1 = [obj1, obj2, obj3, obj4],
                array2 = [obj1, obj2],
                array3 = [obj2, obj3],
                array4 = [obj1, obj3];

            var diff1 = utils.arrayDiff(array1, array2, array3, array4);
            diff1.length.should.equal(1);
            diff1[0].should.equal(obj4);

            var diff2 = utils.arrayDiff(array1, array3);
            diff2.length.should.equal(2);
            diff2[0].should.equal(obj1);
            diff2[1].should.equal(obj4);

            var diff3 = utils.arrayDiff(array2, array1);
            diff3.length.should.equal(0);
        });

    });

    describe("arrayCompare", () => {

        it("should find removed values", () => {
            var obj1 = { prop: "value" },
                obj2 = { prop: "eulav" },
                obj3 = { prop: "lueva" },
                obj4 = { prop: "eluav" };

            var array1 = [obj1, obj2, obj3, obj4],
                array2 = [obj1, obj2, obj4],
                result = utils.arrayCompare(array1, array2);

            result.added.length.should.equal(0);
            result.removed.length.should.equal(1);

            result.removed[0].should.equal(obj3);
        });

        it("should find added values", () => {
            var obj1 = { prop: "value" },
                obj2 = { prop: "eulav" },
                obj3 = { prop: "lueva" },
                obj4 = { prop: "eluav" };

            var array1 = [obj1, obj4],
                array2 = [obj1, obj2, obj3, obj4],
                result = utils.arrayCompare(array1, array2);

            result.added.length.should.equal(2);
            result.removed.length.should.equal(0);

            result.added[0].should.equal(obj2);
            result.added[1].should.equal(obj3);
        });

        it("should find both added and removed values", () => {
            var obj1 = { prop: "value" },
                obj2 = { prop: "eulav" },
                obj3 = { prop: "lueva" },
                obj4 = { prop: "eluav" };

            var array1 = [obj1, obj2, obj3],
                array2 = [obj1, obj2, obj4],
                result = utils.arrayCompare(array1, array2);

            result.added.length.should.equal(1);
            result.removed.length.should.equal(1);

            result.added[0].should.equal(obj4);
            result.removed[0].should.equal(obj3);
        });

    });

    describe("arrayEquals", () => {

        it("should return true when arrays have exact same values", () => {
            var obj1 = { prop: "value" },
                obj2 = { prop: "eulav" },
                obj3 = { prop: "lueva" },
                obj4 = { prop: "eluav" };

            var array1 = [obj1, obj2, obj3],
                array2 = [obj1, obj2, obj4],
                array3 = [obj1, obj2, obj3],
                array4 = [obj1, obj2, obj4];

            utils.arrayEquals(array1, array2).should.not.be.ok;
            utils.arrayEquals(array3, array4).should.not.be.ok;

            utils.arrayEquals(array1, array3).should.be.ok;
            utils.arrayEquals(array2, array4).should.be.ok;
        });

    });
});

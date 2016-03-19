requirejs.config({
    //baseUrl: "../",

    paths: {
        "knockout": "../bower_components/knockout/dist/knockout.debug",

        "mocha": "../bower_components/mocha/mocha",
        "should": "../bower_components/should/should",
        "sinon": "../bower_components/sinon/sinon"
    },

    shim: {
        mocha: {
            exports: "mocha"
        }
    }
});

(<any>window).console = window.console || function () { return; };
(<any>window).notrack = true;

var tests = [
    "changetracker",
    "utils"
];

require(tests, function () {
    mocha.run();
});

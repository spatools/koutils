const __karma__ = (<any>window).__karma__;
const TEST_REGEXP = /(test)\/(.*)\.js$/i;
const REPLACE_REGEXP = /(^\/base\/)|(\.js$)/g;

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: "/base",

    paths: {
        "knockout": "bower_components/knockout/dist/knockout.debug"
    },

    deps: Object.keys(__karma__.files)
            .filter(file => TEST_REGEXP.test(file) && file.indexOf("config") === -1 && file.indexOf("helpers") === -1)
            .map(file => file.replace(REPLACE_REGEXP, "")),
    
    callback: __karma__.start
});

/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/underscore/underscore.d.ts" />
/// <reference path="typings/globalize/globalize.d.ts" />
/// <reference path="src/underscore.d.ts" />

interface Window {
    Globalize: GlobalizeStatic;
}

interface Function {
    result?: any; // Memoization Pattern
}
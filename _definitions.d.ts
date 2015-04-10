﻿/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="typings/globalize/globalize.d.ts" />
/// <reference path="src/base.d.ts" />

interface Window {
    Globalize: GlobalizeStatic;
}

interface Function {
    result?: any; // Memoization Pattern
}
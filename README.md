# KoUtils [![Build Status](https://travis-ci.org/spatools/koutils.png)](https://travis-ci.org/spatools/koutils) [![Bower version](https://badge.fury.io/bo/koutils.png)](http://badge.fury.io/bo/koutils) [![NuGet version](https://badge.fury.io/nu/koutils.png)](http://badge.fury.io/nu/koutils)

Knockout Utilities Extensions to simplify Knockout app development.

## Installation

Using Bower:

```console
$ bower install koutils --save
```

Using NPM: 

```console
$ npm install koutils --save
```

Using NuGet: 

```console
$ Install-Package KoUtils
```

## Usage

You could use koutils in different context.

### Browser (AMD)

First configure [Require.JS](http://requirejs.org):

```javascript
requirejs.config({
    paths: {
        knockout: 'path/to/knockout',
        koutils: 'path/to/koutils'
    }
});
```

Then load modules independently

```javascript
define(["koutils/changetracker"], function(ChangeTracker) {
    var obs = ko.observable(),
        tracker = new ChangeTracker(obs);

    tracker.hasChanges(); // false

    obs("newValue");

    tracker.hasChanges(); // true
});
```

Or load koutils entirely (not recommended):

```javascript
define(["koutils"], function(koutils) {
    var obs = ko.observable(),
        tracker = new koutils.ChangeTracker(obs);

    tracker.hasChanges(); // false

    obs("newValue");

    tracker.hasChanges(); // true
});
```

### Browser / Node (CommonJS)

Import modules independently in the Node.js way:

```javascript
var ko = require("knockout");
var ChangeTracker = require("koutils/changetracker");

var obs = ko.observable(),
    tracker = new ChangeTracker(obs);

tracker.hasChanges(); // false

obs("newValue");

tracker.hasChanges(); // true
```

Or load koutils entirely (not recommended in browser);

```javascript
var ko = require("knockout");
var koutils = require("koutils");

var obs = ko.observable(),
    tracker = new koutils.ChangeTracker(obs);

tracker.hasChanges(); // false

obs("newValue");

tracker.hasChanges(); // true
```

[//] # (### Browser (with built file))
[//] # ()
[//] # (Include built script in your HTML file.)
[//] # ()
[//] # (```html)
[//] # (<script type="text/javascript" src="path/to/knockout.js"></script>)
[//] # (<script type="text/javascript" src="path/to/koutils.js"></script>)
[//] # (```)
[//] # ()
[//] # (Then use the global `koutils` to access modules:)
[//] # ()
[//] # (```javascript)
[//] # (var obs = ko.observable(),)
[//] # (    tracker = new koutils.ChangeTracker(obs);)
[//] # ()
[//] # (tracker.hasChanges(); // false)
[//] # ()
[//] # (obs("newValue");)
[//] # ()
[//] # (tracker.hasChanges(); // true)
[//] # (```)

## Documentation

Documentation is hosted on 
[Github Wiki](https://github.com/spatools/koutils/wiki)
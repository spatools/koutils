# KoUtils [![Build Status](https://travis-ci.org/spatools/koutils.png)](https://travis-ci.org/spatools/koutils) [![Bower version](https://badge.fury.io/bo/koutils.png)](http://badge.fury.io/bo/koutils)

Knockout Utilities Extensions to simplify Knockout app development.

## Installation

Using Bower:

```console
$ bower install koutils --save
```

Using NuGet: 

```console
$ Install-Package KoUtils
```

## Usage

You could use geomath in different context.

### Browser (with built file)

Include built script in your HTML file.

```html
<script type="text/javascript" src="path/to/knockout.js"></script>
<script type="text/javascript" src="path/to/underscore.js"></script>
<script type="text/javascript" src="path/to/koutils.min.js"></script>
```

### Browser (AMD from source)

#### Configure RequireJS.

```javascript
requirejs.config({
    paths: {
        knockout: 'path/to/knockout',
        underscore: 'path/to/underscore',
        koutils: 'path/to/koutils'
    }
});
```

#### Load modules

```javascript
define(["koutils/changetracker"], function(changeTracker) {
    var obs = ko.observable(),
        tracker = new changeTracker(obs);

    tracker.hasChanges(); // false

    obs("newValue");

    tracker.hasChanges(); // true
});
```

## Documentation

For now documentation can be found in code.
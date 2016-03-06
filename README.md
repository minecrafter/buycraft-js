# buycraft-js

This is a simple wrapper for the [new Buycraft API](https://blog.buycraft.net/introducing-the-public-beta-of-the-new-bukkit-plugin/).

## Installation

    npm install --save buycraft-js

## Usage

```js
var BuycraftAPI = require('buycraft-js');
var client = new BuycraftAPI('secret');

bc.information(function(err, info) {
    if (err) {
        console.log(err);
    } else {
        console.log(info);
    }
});
```
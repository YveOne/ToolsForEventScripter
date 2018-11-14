
/*jslint browser */
/*global require, getPath */

(function () {
    "use strict";

    var required = [];
    require.once = require.once || function (f) {
        var p = getPath(f).getAbsolutePath();
        if (required.indexOf(p) === -1) {
            required.push(p);
            require(f);
        }
    };
}());

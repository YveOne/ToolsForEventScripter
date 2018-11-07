
/*jslint browser, long */
/*global  */

(function () {
    "use strict";

    Array.random = Array.random || function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };
    Array.isArray = Array.isArray || function (arr) {
        return Object.prototype.toString.call(arr) === "[object Array]";
    };
}());

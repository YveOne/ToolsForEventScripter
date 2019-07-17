
/*jslint browser, long */
/*global  */

Array.isArray = Array.isArray || function (arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
};

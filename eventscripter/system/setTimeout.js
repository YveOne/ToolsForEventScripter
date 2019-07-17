/*jslint browser */
/*global callAsync, sleep, JD_HOME */
function setTimeout() {
    "use strict";

    var args = [];
    Array.prototype.push.apply(args, arguments); // (...args) not working in jd2

    if (args.length === 0) {
        return;
    }

    var func = args.shift();
    var time = args.shift() || 0;

    callAsync(function() {
        sleep(time);
        func.apply(null, args);
    }, JD_HOME + "/eventscripter/system/bin/dummy.bat");
}

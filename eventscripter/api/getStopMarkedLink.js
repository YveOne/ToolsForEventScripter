/*jslint browser, long */
/*global callAPI */
(function () {
    "use strict";

    callAPI.getStopMarkedLink = function () {
        return callAPI("downloadsV2", "getStopMarkedLink");
    };
}());
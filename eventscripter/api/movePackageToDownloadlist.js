/*jslint browser, long */
/*global callAPI */
(function () {
    "use strict";

    callAPI.movePackageToDownloadlist = function (packageUUID) {
        return callAPI("linkgrabberv2", "moveToDownloadlist", [], [packageUUID]);
    };
}());
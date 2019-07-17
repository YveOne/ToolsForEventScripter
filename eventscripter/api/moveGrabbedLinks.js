/*jslint browser, long */
/*global callAPI */
(function () {
    "use strict";

    callAPI.moveGrabbedLinks = function (linkUUIDs, afterLinkUUID, packageUUID) {
        return callAPI("linkgrabberv2", "moveLinks", linkUUIDs, afterLinkUUID, packageUUID);
    };
}());
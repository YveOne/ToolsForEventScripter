
/*jslint browser, long */
/*global callAPI */

(function () {
    "use strict";
    callAPI.setMaxSimultaneDownloads = function (v) {
        return callAPI("config", "set", "org.jdownloader.settings.GeneralSettings", null, "maxsimultanedownloads", v);
    };
}());

/*jslint browser, long */
/*global callAPI, JD_HOME, readFile */

var InternetConnectionSettings = (function () {
    "use strict";

    var proxiesFile = JD_HOME + "/cfg/org.jdownloader.settings.InternetConnectionSettings.customproxylist.json";

    function getCustomProxyList(onlyEnabled) {
        var ret = [];
        var pList = JSON.parse(readFile(proxiesFile));
        pList.shift(); // first one is "no proxy"
        pList.forEach(function (proxy) {
            if (onlyEnabled && !proxy.enabled) {
                return;
            }
            proxy = proxy.proxy;
            ret.push(proxy.type.toLowerCase() + "://" + proxy.address + ":" + proxy.port);
        });
        return ret;
    }

    return {
        getCustomProxyList: getCustomProxyList
    };

}());

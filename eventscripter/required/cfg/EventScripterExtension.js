
/*jslint browser, long */
/*global callAPI, JD_HOME, readFile, getPath */

var EventScripterExtension = (function () {
    "use strict";

    var scriptsFile = JD_HOME + "/cfg/org.jdownloader.extensions.eventscripter.EventScripterExtension.scripts.json";

    function getScriptByName(scriptName) {
        scriptName = scriptName.toLowerCase();
        var ret = null;
        if (getPath(scriptsFile).exists()) {
            JSON.parse(readFile(scriptsFile)).some(function (script) {
                if (scriptName === script.name.toLowerCase()) {
                    ret = script;
                    return true;
                }
                return false;
            });
        }
        return ret;
    }

    return {
        getScriptByName: getScriptByName
    };

}());

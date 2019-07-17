/*jslint browser, long */
/*global getEnvironment, callSync, JD_HOME, alert */
function confirm(message) {
    "use strict";

    message = message.replace("\r", "\\r");
    message = message.replace("\n", "\\n");
    var env = getEnvironment();
    switch (env.getOSFamily()) {
    case "WINDOWS":
        return !(!callSync(JD_HOME + "/eventscripter/system/bin/confirm.bat", "JD2 - EventScripter", message));
    default:
        alert("Soryy, your OS is yet not supported for confirm()");
    }
}
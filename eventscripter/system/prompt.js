/*jslint browser, long */
/*global getEnvironment, callSync, JD_HOME, alert */
function prompt(text, defaultText) {
    "use strict";

    text = text.replace("\r", "\\r");
    text = text.replace("\n", "\\n");
    var env = getEnvironment();
    var ret = null;
    switch (env.getOSFamily()) {
    case "WINDOWS":
        ret = callSync(JD_HOME + "/eventscripter/system/bin/prompt.bat", "JD2 - EventScripter", text, defaultText);
        ret = (
            (ret)
            ? ret.substring(1, ret.length - 2)
            : null
        ); // remove the leading "1". Its just a dummy to catch the null return
        break;
    default:
        alert("Sorry, your OS is yet not supported for ExDialog-prompt()");
    }
    return ret;
}
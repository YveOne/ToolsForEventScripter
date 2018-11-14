
/*jslint browser, long, convert */
/*global sleep, getProperty, setProperty, getEnvironment, callAsync, callSync, JD_HOME, alert, getPath, writeFile */

function global(k, v) {
    "use strict";

    return (
        (v === undefined)
        ? (getProperty(k, true) || null)
        : setProperty(k, v, true)
    );
}

function local(k, v) {
    "use strict";

    return (
        (v === undefined)
        ? (getProperty(k, false) || null)
        : setProperty(k, v, false)
    );
}

function time(asMiliseconds) {
    "use strict";

    return (
        asMiliseconds
        ? Date.now()
        : Math.floor(Date.now() / 1000)
    );
}

function thread(f, t) {
    "use strict";

    sleep(parseInt(t) || 0);
    callAsync(f, JD_HOME + "/eventscripter/required/funcs/bin/nothing.bat");
}

function overwriteFile(path, content) {
    "use strict";

    try {
        var file = getPath(path);
        if (file.exists()) {
            file.delete();
        }
        return writeFile(path, content, false);
    } catch (ignore) {
        return false;
    }
}

function confirm(message) {
    "use strict";

    message = message.replace("\r", "\\r");
    message = message.replace("\n", "\\n");
    var env = getEnvironment();
    switch (env.getOSFamily()) {
    case "WINDOWS":
        return !!callSync(JD_HOME + "/eventscripter/required/funcs/bin/confirm.bat", "JD2 - EventScripter", message);
    default:
        alert("Soryy, your OS is yet not supported for confirm()");
    }
}

function prompt(text, defaultText) {
    "use strict";

    text = text.replace("\r", "\\r");
    text = text.replace("\n", "\\n");
    var env = getEnvironment();
    var ret = null;
    switch (env.getOSFamily()) {
    case "WINDOWS":
        ret = callSync(JD_HOME + "/eventscripter/required/funcs/bin/prompt.bat", "JD2 - EventScripter", text, defaultText);
        ret = (
            (ret)
            ? ret.substring(1, ret.length - 2)
            : null
        );
        break;
    default:
        alert("Sorry, your OS is yet not supported for ExDialog-prompt()");
    }
    return ret;
}

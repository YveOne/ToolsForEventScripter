/*jslint browser */
/*global getPath, writeFile */
function overwriteFile(path, content) {
    "use strict";

    try {
        var file = getPath(path);
        if (file.exists()) {
            file.delete();
        }
        writeFile(path, content, false);
        return true;
    } catch (ignore) {
        return false;
    }
}

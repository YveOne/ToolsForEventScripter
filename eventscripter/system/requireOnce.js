/*jslint browser */
/*global getPath, require */
function requireOnce(file) {
    var path = getPath(file).getAbsolutePath();
    if (requireOnce.list.indexOf(path) === -1) {
        requireOnce.list.push(path);
        require(file);
    }
}
requireOnce.list = [];
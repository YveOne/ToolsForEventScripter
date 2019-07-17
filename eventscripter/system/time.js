/*jslint browser */
/*global  */
function time(asMiliseconds) {
    "use strict";

    return (
        asMiliseconds
        ? Date.now()
        : Math.floor(Date.now() / 1000)
    );
}
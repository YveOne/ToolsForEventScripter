/*jslint browser */
/*global getProperty, setProperty */
function local(k, v) {
    "use strict";

    return (
        (v === undefined)
        ? (getProperty(k, false) || null)
        : setProperty(k, v, false)
    );
}
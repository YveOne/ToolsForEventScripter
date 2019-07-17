/*jslint browser */
/*global getProperty, setProperty */
function global(k, v) {
    "use strict";

    return (
        (v === undefined)
        ? (getProperty(k, true) || null)
        : setProperty(k, v, true)
    );
}

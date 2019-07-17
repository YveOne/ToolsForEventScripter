/* paste this into your script editor:

disablePermissionChecks() // optional
require(JD_HOME + "/eventscripter/tests/setTimeout.js");

*/
// Trigger Required: "Interval"
// Options recommended: 10000ms, synchronous

require(JD_HOME + "/eventscripter/system/setTimeout.js");

function f(arr) {
    alert(arr.join(" "));
}

setTimeout(f, 5000, ["hello", "world"]);
alert("setTimeout() is not blocking!");

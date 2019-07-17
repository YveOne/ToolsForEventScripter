/* paste this into your script editor:

disablePermissionChecks() // optional
require(JD_HOME + "/eventscripter/tests/prompt.js");

*/
// Trigger Required: "Interval"
// Options recommended: 3000ms, synchronous

require(JD_HOME + "/eventscripter/system/prompt.js");

alert(prompt("title", "Hello world"));

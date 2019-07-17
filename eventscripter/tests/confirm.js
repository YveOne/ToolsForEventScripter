/* paste this into your script editor:

disablePermissionChecks() // optional
require(JD_HOME + "/eventscripter/tests/confirm.js");

*/
// Trigger Required: "Interval"
// Options recommended: 3000ms, synchronous

require(JD_HOME + "/eventscripter/system/confirm.js");

var ret = confirm("Confirm?");
alert(ret);

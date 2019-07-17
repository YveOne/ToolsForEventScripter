/* paste this into your script editor:

disablePermissionChecks() // optional
require(JD_HOME + "/eventscripter/tests/local.js");

*/
// Trigger Required: "Interval"
// Options recommended: 1000ms, synchronous

require(JD_HOME + "/eventscripter/system/local.js");

var counter = local("counter") || 0;
counter += 1;
alert(counter);
local("counter", counter);

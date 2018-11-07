/**
 * @file ProxyCleaner Class for JD2's EventScripter
 * @author Yvonne P. <contact@yveone.com>
 * @version 1.0
 */

/*jslint browser, long, for, this, multivar */
/*global
    require,
    JD_HOME,
    getPath,
    readFile,
    alert,
    overwriteFile,
    local,
    time
*/

require(JD_HOME + "/eventscripter/required/funcs/system.js");
require(JD_HOME + "/eventscripter/required/cfg/InternetConnectionSettings.js");

/**
 * Global properties
 */
var interval;

/**
 * New global function
 * ProxyCleaner({...cfg...});
 */
var ProxyCleaner = (function () {
    "use strict";

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UTILS

    function getLogDirectories() {
        var path = JD_HOME + "/logs";
        var ret = [];
        getPath(path).getChildren().forEach(function (dir) {
            if (dir.getName().match(/^\d+/)) {
                ret.push(dir);
            }
        });
        return ret;
    }

    function readLoggedProxies(logFiles) {
        var loggedProxies = {};

        var proxyRegex = /\|Proxy\:\{[\r\n]+([\S\s]*?)[\r\n]+\}(?:->([A-Z_]+))?[\r\n]+/g;
        var match;
        var proxyObject;
        var proxyFullAddr;
        var proxyStatus;
        var proxyData;
        var logText;

        logFiles.forEach(function (logFile) {
            logText = readFile(logFile);
            do {
                match = proxyRegex.exec(logText);
                if (match) {
                    try {
                        proxyObject = JSON.parse("{" + match[1] + "}").proxy.proxy;
                        if (proxyObject.address !== null) {
                            proxyFullAddr = proxyObject.type.toLowerCase() + "://" + proxyObject.address + ":" + proxyObject.port;
                            proxyStatus = match[2] || "CONNECTED";
                            proxyData = loggedProxies[proxyFullAddr] || {};
                            proxyData[proxyStatus] = (proxyData[proxyStatus] || 0) + 1;
                            loggedProxies[proxyFullAddr] = proxyData;
                        }
                    } catch (e) {
                        alert(e.message);
                        match = false;
                    }
                }
            } while (match);
        });

        return loggedProxies;
    }

    function JSONFile(filePath, defaultData) {
        this.filePath = filePath;
        this.data = defaultData || null;
    }
    JSONFile.prototype.load = function () {
        if (getPath(this.filePath).exists()) {
            this.data = JSON.parse(readFile(this.filePath));
        }
        return this.data;
    };
    JSONFile.prototype.save = function () {
        overwriteFile(this.filePath, JSON.stringify(this.data, undefined, 4));
    };

    // UTILS
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // CFG

    var seconds = 1000; //ms
    var minutes = 60 * seconds;
    var hours = 60 * minutes;
    var days = 24 * hours;

    var cfg = {
        scriptInterval: 1 * minutes,
        scriptInactiveTime: 10 * minutes,
        proxyBanTime: 30 * days,
        dataSaveDays: 10,
        needFinishCount: 1
    };

    var dataJSON = JD_HOME + "/eventscripter/ProxyCleaner/data.json";
    var proxiesJSON = JD_HOME + "/eventscripter/ProxyCleaner/proxies.json";
    var proxiesJS = JD_HOME + "/eventscripter/ProxyCleaner/proxies.js";

    var dataFile = new JSONFile(dataJSON, {
        lastLogTimestamp: 0
    });

    var proxiesFile = new JSONFile(proxiesJSON, {
    });

    // CFG
    //////////////////////////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // RUN

    return function (overwriteCfg) {

        Object.keys(overwriteCfg).forEach(function (k) {
            cfg[k] = overwriteCfg[k];
        });
        overwriteCfg = null;

        interval = cfg.scriptInterval;

        var session = local("session") || {
            inactiveTill: 0
        };

        if (session.inactiveTill >= time()) {
            return;
        }

        dataFile.load();
        var lastLogTimestamp = dataFile.data.lastLogTimestamp;
        var nextLogTimestamp = lastLogTimestamp;

        var logFiles = (function () {
            var logDirectories = getLogDirectories();
            var i, iEnd = logDirectories.length - 1; // -1 because: dont check current log dir

            var logDir, logDirName, logDirTimestamp, returnLogs, logAllPath, logCurPath, j;

            for (i = 0; i < iEnd; i += 1) {

                logDir = logDirectories[i];
                logDirName = logDir.getName();

                logDirTimestamp = parseInt(logDirName.split("_")[0]);
                if (logDirTimestamp > nextLogTimestamp) {
                    nextLogTimestamp = logDirTimestamp;

                    returnLogs = [];
                    logAllPath = logDir.getAbsolutePath() + "/jd.controlling.downloadcontroller.DownloadWatchDog.log";
                    j = 0;
                    while (true) {
                        logCurPath = logAllPath + "." + j;
                        if (getPath(logCurPath).exists()) {
                            returnLogs.push(logCurPath);
                        } else {
                            return returnLogs;
                        }
                        j += 1;
                    }
                }
            }
            return [];
        }());

        dataFile.data.lastLogTimestamp = nextLogTimestamp;
        dataFile.save();

        proxiesFile.load();

        // { "address": { "status":123, "status":123, ... } }
        var loggedProxies = readLoggedProxies(logFiles);
        // { "address": finished: [ {time:..., count... } ] }
        var allProxies = proxiesFile.data;

        var nowTimestamp = time();
        var logdayTimestamp = parseInt(nextLogTimestamp / days) * days;

        Object.keys(loggedProxies).forEach(function (proxAddr) {
            var proxData = allProxies[proxAddr] || {
                bannedTill: 0,
                bannedCount: 0,
                finishedList: [],
                finishedCount: 0
            };
            var loggedProxy = loggedProxies[proxAddr];
            if (loggedProxy.FINISHED === undefined || !proxData.finishedList.some(function (finishData) {
                if (finishData.time === logdayTimestamp) {
                    finishData.count += loggedProxy.FINISHED;
                    return true;
                }
                return false;
            })) {
                proxData.finishedList.push({
                    time: logdayTimestamp,
                    count: loggedProxy.FINISHED || 0
                });
            }
            allProxies[proxAddr] = proxData;
        });

        Object.keys(allProxies).forEach(function (proxAddr) {
            var proxData = allProxies[proxAddr];

            if (proxData.finishedList.length > cfg.dataSaveDays) {
                proxData.finishedList.splice(0, proxData.finishedList.length - cfg.dataSaveDays);
            }

            if (proxData.bannedTill && proxData.bannedTill < nowTimestamp) {
                proxData.bannedTill = 0;
                proxData.finishedList = [];
                proxData.finishedCount = 0;
            } else {
                proxData.finishedCount = 0;
                proxData.finishedList.forEach(function (finishData) {
                    proxData.finishedCount += finishData.count;
                });
            }

            if (!proxData.bannedTill) { // not banned
                if (proxData.finishedList.length === cfg.dataSaveDays) { // ban able
                    if (proxData.finishedCount < cfg.needFinishCount) { // poor proxy
                        proxData.bannedCount += 1;
                        proxData.bannedTill = nowTimestamp + (cfg.proxyBanTime * proxData.bannedCount);
                    } else { // good proxy ? ...
                        proxData.bannedCount = 0; // ... lets reset ban count
                    }
                }
            }
        });

        proxiesFile.save();
        overwriteFile(proxiesJS, "var proxies = " + JSON.stringify(proxiesFile.data, undefined, 4) + ";");

        if (nextLogTimestamp === lastLogTimestamp) {
            session.inactiveTill = time() + cfg.scriptInactiveTime;
            local("session", session);
        }

    };

}());

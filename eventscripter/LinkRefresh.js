/**
 * @file LinkRefresh Class for JD2's EventScripter
 * @author Yvonne P. <contact@yveone.com>
 * @version 1.1
 */

/*jslint browser, long, for */
/*global
    require,
    JD_HOME,
    local,
    getAverageSpeed,
    callAPI,
    getAllCrawledPackages,
    getAllDownloadLinks,
    getLinkStatusType,
    interval
*/

require(JD_HOME + "/eventscripter/required/funcs/getLinkStatus.js");
require(JD_HOME + "/eventscripter/required/funcs/system.js");
require(JD_HOME + "/eventscripter/required/funcs/arrays.js");
require(JD_HOME + "/eventscripter/required/api/getStopMarkedLink.js");
require(JD_HOME + "/eventscripter/required/api/moveGrabbedLinks.js");
require(JD_HOME + "/eventscripter/required/api/movePackageToDownloadlist.js");
require(JD_HOME + "/eventscripter/required/api/setMaxSimultaneDownloads.js");

/**
 * Global properties
 */
var interval;

/**
 * New global function
 * LinkRefresh({...cfg...});
 */
var LinkRefresh = (function () {
    "use strict";

    var kb = 1024;
    var mb = 1024 * 1024;
    var seconds = 1000;
    var minutes = 60 * seconds;

    var cfg = {

        scriptInterval: 1 * seconds,
        inactiveTime: 10 * minutes,

        minDownloadsRunning: 10,
        maxDownloadsRunning: 20,

        minDownloadSpeed: 0.5 * mb,
        maxDownloadSpeed: 1.0 * mb,

        handleSimultaneCount: true,
        abortCaptchaOnMaxSpeed: false,

        resetUnfinished: true,
        resetUnfinishedSize: 5 * mb,

        resumeOnErrorStatus: true,
        resumeOnErrorStatusTypes: {
            "errorPluginDefect": 10,
            "errorFileNotFound": 1
        },

        resumeSkipped: true,
        resumeSkippedAfter: 5 * minutes,

        abortSlow: true,
        abortSlowDelay: 30 * seconds,
        abortSlowSpeed: 30 * kb,

        refreshNullStatus: true,

        takeGrabbed: true,
        takeGrabbedWhen: 30,
        takeGrabbedRandom: true,
        takeGrabbedMoveToTop: ["sfv", "txt"],
        takeGrabbedEnabled: {
            "txt": false,
            "rev": false
        },
        takeGrabbedDisableLast: false
    };

    var session = local("session") || {
        curSimultane: 0,
        skippedTimes: {},
        resumeCounts: {},
        inactive: {
            grabber: 0
        }
    };

    function packetIsEnabled(p) {
        var packetLinks = p.getDownloadLinks();
        var packetLinksCount = packetLinks.length;
        var i;
        for (i = 0; i < packetLinksCount; i += 1) {
            if (!packetLinks[i].isEnabled()) {
                return false;
            }
        }
        return true;
    }

    function getEnabledCrawledPackages() {
        var ret = [];
        getAllCrawledPackages().forEach(function (p) {
            if (packetIsEnabled(p)) {
                ret.push(p);
            }
        });
        return ret;
    }

    function handleSimultaneDownloads() {
        var averageSpeed = getAverageSpeed();
        if (averageSpeed <= cfg.minDownloadSpeed && session.curSimultane !== cfg.maxDownloadsRunning) {
            session.curSimultane = cfg.maxDownloadsRunning;
            callAPI.setMaxSimultaneDownloads(session.curSimultane);
        } else {
            if (averageSpeed >= cfg.maxDownloadSpeed && session.curSimultane !== cfg.minDownloadsRunning) {
                session.curSimultane = cfg.minDownloadsRunning;
                callAPI.setMaxSimultaneDownloads(session.curSimultane);
            }
        }
    }

    function takeGrabbed() {
        var crawledPackages = getEnabledCrawledPackages();
        if (crawledPackages.length) {
            var packet = (
                cfg.takeGrabbedRandom
                ? Array.random(crawledPackages)
                : crawledPackages[0]
            );
            var packetLinks = packet.getDownloadLinks();
            var packetLinksCount = packetLinks.length;
            var packetLink;
            var packetName;
            var packetExt;
            var archives;
            var archiveLinks;
            var links2move = [];
            var i;

            for (i = 0; i < packetLinksCount; i += 1) {
                packetLink = packetLinks[i];
                packetName = packetLink.getName();
                packetExt = packetName.split(".").pop();
                if (cfg.takeGrabbedMoveToTop.indexOf(packetExt) !== -1) {
                    links2move.push(packetLink.getUUID());
                }
                if (cfg.takeGrabbedEnabled[packetExt] !== undefined) {
                    packetLink.setEnabled(cfg.takeGrabbedEnabled[packetExt]);
                }
            }

            if (links2move.length) {
                callAPI.moveGrabbedLinks(links2move, null, packet.getUUID());
            }

            if (cfg.takeGrabbedDisableLast) {
                archives = packet.getArchives();
                for (i = 0; i < archives.length; i += 1) {
                    archiveLinks = archives[i].getDownloadLinks();
                    archiveLinks[archiveLinks.length - 1].setEnabled(false);
                }
            }

            callAPI.movePackageToDownloadlist(packet.getUUID());
            return true;
        }
        return false;
    }

    return function (overwriteCfg) {

        Object.keys(overwriteCfg).forEach(function (k) {
            cfg[k] = overwriteCfg[k];
        });
        overwriteCfg = null;

        interval = cfg.scriptInterval;

        // local
        var allLinks = getAllDownloadLinks();
        var allCount = allLinks.length;
        var allCountReal = 0;
        var stopMarkedLink = callAPI.getStopMarkedLink();
        var skippedTimes = {};
        var averageSpeed = getAverageSpeed();
        var dateNow = Date.now();

        function handleLink(link) {

            if (!link.isEnabled() || link.isFinished()) {
                return;
            }

            allCountReal += 1;

            var linkUUID = link.getUUID();

            if (stopMarkedLink && stopMarkedLink.uuid === linkUUID) {
                return;
            }

            var linkStatusType = getLinkStatusType(link);

            if (linkStatusType === null) {

                if (cfg.refreshNullStatus && !link.isRunning()) {
                    link.setEnabled(false);
                    link.setEnabled(true);
                    // return;
                }

            } else {

                if (cfg.resumeOnErrorStatus && cfg.resumeOnErrorStatusTypes[linkStatusType] !== undefined) {

                    var k = linkStatusType + linkUUID;

                    var resumeCountsNow = session.resumeCounts[k] || 0;
                    var resumeCountsMax = cfg.resumeOnErrorStatusTypes[linkStatusType];

                    if (resumeCountsNow < resumeCountsMax) {
                        session.resumeCounts[k] = resumeCountsNow + 1;
                        link.resume();
                    }
                }

                if (cfg.resumeSkipped && linkStatusType === "skippedCaptchaRequired") {
                    var skippedTime = session.skippedTimes[linkUUID] || (-cfg.scriptInterval + 1);
                    if (skippedTime >= cfg.resumeSkippedAfter) {
                        link.resume();
                        // return;
                    } else {
                        skippedTimes[linkUUID] = skippedTime + cfg.scriptInterval;
                    }
                }

                if (cfg.abortCaptchaOnMaxSpeed && linkStatusType === "captcha" && averageSpeed >= cfg.maxDownloadSpeed) {
                    link.abort();
                    return;
                }

            }

            var linkDoneBytes = link.getBytesLoaded();
            var linkDonePercent = 1 / link.getBytesTotal() * linkDoneBytes;
            var linkDuration = link.getDownloadDuration();

            if (cfg.resetUnfinished && linkDuration === -1 && linkDonePercent < 1.00 && linkDoneBytes > 0) {
                if (!link.isResumeable() || linkDoneBytes <= cfg.resetUnfinishedSize) {
                    link.reset();
                    return;
                }
            }

            if (cfg.abortSlow && linkDonePercent < 0.98 && linkDuration > cfg.abortSlowDelay && link.getSpeed() < cfg.abortSlowSpeed) {
                link.abort();
                return;
            }

        }

        var i;
        for (i = 0; i < allCount; i += 1) {
            handleLink(allLinks[i]);
        }

        // handle simultan downloads by average speed
        if (cfg.handleSimultaneCount) {
            handleSimultaneDownloads();
        }

        // move crawled packages
        if (cfg.takeGrabbed && allCountReal <= cfg.takeGrabbedWhen && session.inactive.grabber < dateNow) {
            if (!takeGrabbed()) {
                session.inactive.grabber = dateNow + cfg.inactiveTime;
            }
        }

        session.skippedTimes = skippedTimes;
        local("session", session);

    };

}());

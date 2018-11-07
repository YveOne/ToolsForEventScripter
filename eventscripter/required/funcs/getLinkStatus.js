/**
 * @file Extended link status function for JD2's EventScripter
 * @author Yvonne P. <contact@yveone.com>
 * @version 1.0
 */

/*jslint browser, long, multivar, for */
/*global require, JD_HOME, getPath, readFile, writeFile */

var getLinkStatusInfo;
var getLinkStatusType;

(function () {
    "use strict";

    var stringsFile = JD_HOME + "/eventscripter/required/funcs/getLinkStatus/strings.json";

    if (!getPath(stringsFile).exists()) {
        (function () {

            function parseConfigs(text) {
                var lines = text.match(/[^\r\n]+/g);
                var linesCount = lines.length;
                var configs = {};
                var i, line, lineSplit;
                for (i = 0; i < linesCount; i += 1) {
                    line = lines[i];
                    lineSplit = line.split("=");
                    switch (true) {
                    case (line.substring(0, 1) === "#"):
                    case (lineSplit.length !== 2):
                        break;
                    default:
                        configs[lineSplit[0]] = lineSplit[1];
                    }
                }
                return configs;
            }

            function readConfigFile(path) {
                var file = getPath(path);
                return (
                    (file.exists() && file.isFile())
                    ? parseConfigs(readFile(path))
                    : null
                );
            }

            function mergeObjects(args) {
                var r = {};
                var l = args.length;
                var o, i;
                function forKinO(k) {
                    r[k] = o[k];
                }
                for (i = 0; i < l; i += 1) {
                    o = args[i];
                    Object.keys(o).forEach(forKinO);
                }
                return r;
            }

            var status = {
                error: "plugins_errors_error",                              // Fehler:
                errorDisconnect: "plugins_errors_disconnect",               // Verbindung trennen?
                errorHosterOffline: "plugins_errors_hosteroffline",         // Hoster offline?
                errorHosterProblem: "plugins_errors_hosterproblem",         // Hosterproblem?
                errorNoInternetConnection: "plugins_errors_nointernetconn", // Keine Internetverbindung?
                errorProxyAuthorization: "plugins_errors_proxy_auth",       // Proxy-Authentifikation fehlgeschlagen
                errorProxyConnection: "plugins_errors_proxy_connection",    // Proxy Verbindung fehlgeschlagen
                errorWrongPassword: "plugins_errors_wrongpassword",         // Passwort falsch
                errorWrongUsername: "plugins_errors_wrongusername",         // Falscher Benutzername!
                skipped: "DownloadLink_setSkipped_statusmessage",           // Übersprungen
                skippedNoAccount: "DownloadLink_setSkipped_statusmessage_account",                  // Übersprungen - Kein Account
                skippedCaptchaRequired: "DownloadLink_setSkipped_statusmessage_captcha",            // Übersprungen - Captcha-Eingabe erforderlich
                skippedDiskFull: "DownloadLink_setSkipped_statusmessage_disk_full",                 // Übersprungen - Festplatte ist voll
                skippedNoFFmpeg: "DownloadLink_setSkipped_statusmessage_ffmpeg",                    // Übersprungen - FFmpeg™ fehlt
                skippedNoFFprobe: "DownloadLink_setSkipped_statusmessage_ffprobe",                  // Übersprungen - FFprobe™ fehlt
                skippedFileExists: "DownloadLink_setSkipped_statusmessage_file_exists",             // Übersprungen - Datei existiert bereits
                skippedNoConnection: "DownloadLink_setSkipped_statusmessage_noconnectionavailable", // Übersprungen - Keine Verbindung
                skippedTooManyRetries: "DownloadLink_setSkipped_statusmessage_toomanyretries",      // Übersprungen - zu viele Einträge
                skippedRestartRequired: "DownloadLink_setSkipped_statusmessage_update_restart",     // Übersprungen - Neustart erforderlich
                skippedInvalidPath: "DownloadLink_setSkipped_statusmessage_invalid_path",           // Ungültiger Downloadpfad
                skippedNoPhantomJS: "DownloadLink_setSkipped_statusmessage_phantom",                // PhantomJS fehlt!
                errorPluginDefect: "downloadlink_status_error_defect",                  // Plugin veraltet
                errorDownloadLimit: "downloadlink_status_error_download_limit",         // Downloadlimit erreicht
                errorDownloadFailed: "downloadlink_status_error_downloadfailed",        // Download fehlgeschlagen
                errorFatal: "downloadlink_status_error_fatal",                          // Schwerwiegender Fehler
                errorFileExists: "downloadlink_status_error_file_exists",               // Datei ist vorhanden
                errorFileNotFound: "downloadlink_status_error_file_not_found",          // Datei nicht gefunden
                errorHosterTempUnavailable: "downloadlink_status_error_hoster_temp_unavailable",    // Download von diesem Hoster ist im Moment nicht möglich
                errorTempUnavailable: "downloadlink_status_error_temp_unavailable",                 // Kurzzeitig nicht verfügbar
                waiting: "gui_download_waittime_status2",               // %s1 warten
                waitingFor: "WaitForTrackerSlotPluginProcess",          // Warte auf %s1: %s2
                captcha: "gui_downloadview_statustext_jac",             // Captcha-Erkennung
                downloading: "download_connection_normal",              // Download
                starting: "TaskColumn_fillColumnHelper_starting",       // Starte...
                extractionError: "TaskColumn_getStringValue_extraction_error",                              // Entpackungsfehler
                extractionErrorCRC: "TaskColumn_getStringValue_extraction_error_crc",                       // Entpackungsfehler: CRC
                extractionErrorFileNotFound: "TaskColumn_getStringValue_extraction_error_file_not_found",   // Entpackungsfehler: Datei nicht gefunden
                extractionErrorDiskFull: "TaskColumn_getStringValue_extraction_error_space",                // Entpackungsfehler: Nicht genügend Speicherplatz
                extractionSuccess: "TaskColumn_getStringValue_extraction_success"                           // Entpacken OK
            };

            var data = {};

            var languageId = readConfigFile(JD_HOME + "/.install4j/install.prop");
            languageId = (
                languageId
                ? languageId.languageId
                : "end"
            );
            var jdStrings = mergeObjects([
                readConfigFile(JD_HOME + "/translations/org/jdownloader/gui/translate/GuiTranslation." + languageId + ".lng") || {},
                readConfigFile(JD_HOME + "/translations/org/jdownloader/translate/JdownloaderTranslation." + languageId + ".lng") || {}
            ]);

            function forKinStatus(k) {
                if (jdStrings[status[k]]) {
                    //                                           (     escape RegExp characters           )        (   replace %s1...   )
                    data[k] = "^" + (jdStrings[status[k]].replace(/[\-\[\]{}()*+!<=:?.\/\\\^$|#\s,]/g, "\\$&").replace(/(%s\d+)/ig, "(.+?)")) + "$";
                }
            }
            Object.keys(status).forEach(forKinStatus);

            writeFile(stringsFile, JSON.stringify(data, undefined, 4), false);

        }());
    }

    var strings = JSON.parse(readFile(stringsFile));

    getLinkStatusType = function (l) {
        var status = (
            (l !== null && l.getStatus)
            ? l.getStatus()
            : l
        );
        if (status !== null) {
            var ret;
            if (Object.keys(strings).some(function (k) {
                if (status.match(strings[k])) {
                    ret = k;
                    return true;
                }
                return false;
            })) {
                return ret;
            }
        }
        return null;
    };

    getLinkStatusInfo = function (l) {
        var status = (
            (l !== null && l.getStatus)
            ? l.getStatus()
            : l
        );
        if (status !== null) {
            var ret;
            if (Object.keys(strings).some(function (k) {
                var m = status.match(strings[k]);
                if (m) {
                    m[0] = k;
                    ret = m;
                    return true;
                }
                return false;
            })) {
                return ret;
            }
        }
        return null;
    };

}());

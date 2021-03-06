/* paste this into your script editor:

disablePermissionChecks() // optional
require(JD_HOME + "/eventscripter/tests/getLinkStatus.js");

*/
// Trigger Required: "Interval"
// Options recommended: 10000ms, synchronous

// it will ask some permissions at first run
// because it needs to read the language files of your JD installation
require(JD_HOME + "/eventscripter/system/getLinkStatus.js");

var links = getAllDownloadLinks();
alert("original:" + links[0].getStatus());
alert("status type: " + getLinkStatusType(links[0]));
alert("status info: " + getLinkStatusInfo(links[0]));

/**
 * The default 'getStatus()' function only provides a localized string.
 * Here is how to get more information:
 *
 * The function 'getLinkStatusType()' will just return an id for that status.
 * That id will be identical in all languages.
 * The function 'getLinkStatusInfo()' can provide more information by returning an array.
 * The value at index 0 will be the id. the rest is up to the status.
 *
 * But: Not all status types will get recognized by those functions (yet).
 * That's because for some status types the default 'getStatus()' function returns null.
 * And that's something that this lib can't do anything about =/
 *
 * Available status types:
 *
 * status type id              : jd string key                             , // default value (ger)
 *
 * error                       : "plugins_errors_error"                    , // Fehler:
 * errorDisconnect             : "plugins_errors_disconnect"               , // Verbindung trennen?
 * errorHosterOffline          : "plugins_errors_hosteroffline"            , // Hoster offline?
 * errorHosterProblem          : "plugins_errors_hosterproblem"            , // Hosterproblem?
 * errorNoInternetConnection   : "plugins_errors_nointernetconn"           , // Keine Internetverbindung?
 * errorProxyAuthorization     : "plugins_errors_proxy_auth"               , // Proxy-Authentifikation fehlgeschlagen
 * errorProxyConnection        : "plugins_errors_proxy_connection"         , // Proxy Verbindung fehlgeschlagen
 * errorWrongPassword          : "plugins_errors_wrongpassword"            , // Passwort falsch
 * errorWrongUsername          : "plugins_errors_wrongusername"            , // Falscher Benutzername!
 * skipped                     : "DownloadLink_setSkipped_statusmessage"                       , // �bersprungen
 * skippedNoAccount            : "DownloadLink_setSkipped_statusmessage_account"               , // �bersprungen - Kein Account
 * skippedCaptchaRequired      : "DownloadLink_setSkipped_statusmessage_captcha"               , // �bersprungen - Captcha-Eingabe erforderlich
 * skippedDiskFull             : "DownloadLink_setSkipped_statusmessage_disk_full"             , // �bersprungen - Festplatte ist voll
 * skippedNoFFmpeg             : "DownloadLink_setSkipped_statusmessage_ffmpeg"                , // �bersprungen - FFmpeg� fehlt
 * skippedNoFFprobe            : "DownloadLink_setSkipped_statusmessage_ffprobe"               , // �bersprungen - FFprobe� fehlt
 * skippedFileExists           : "DownloadLink_setSkipped_statusmessage_file_exists"           , // �bersprungen - Datei existiert bereits
 * skippedNoConnection         : "DownloadLink_setSkipped_statusmessage_noconnectionavailable" , // �bersprungen - Keine Verbindung
 * skippedTooManyRetries       : "DownloadLink_setSkipped_statusmessage_toomanyretries"        , // �bersprungen - zu viele Eintr�ge
 * skippedRestartRequired      : "DownloadLink_setSkipped_statusmessage_update_restart"        , // �bersprungen - Neustart erforderlich
 * skippedInvalidPath          : "DownloadLink_setSkipped_statusmessage_invalid_path"          , // Ung�ltiger Downloadpfad
 * skippedNoPhantomJS          : "DownloadLink_setSkipped_statusmessage_phantom"               , // PhantomJS fehlt!
 * errorPluginDefect           : "downloadlink_status_error_defect"                    , // Plugin veraltet
 * errorDownloadLimit          : "downloadlink_status_error_download_limit"            , // Downloadlimit erreicht
 * errorDownloadFailed         : "downloadlink_status_error_downloadfailed"            , // Download fehlgeschlagen
 * errorFatal                  : "downloadlink_status_error_fatal"                     , // Schwerwiegender Fehler
 * errorFileExists             : "downloadlink_status_error_file_exists"               , // Datei ist vorhanden
 * errorFileNotFound           : "downloadlink_status_error_file_not_found"            , // Datei nicht gefunden
 * errorHosterTempUnavailable  : "downloadlink_status_error_hoster_temp_unavailable"   , // Download von diesem Hoster ist im Moment nicht m�glich
 * errorTempUnavailable        : "downloadlink_status_error_temp_unavailable"          , // Kurzzeitig nicht verf�gbar
 * waiting                     : "gui_download_waittime_status2"       , // %s1 warten
 * waitingFor                  : "WaitForTrackerSlotPluginProcess"     , // Warte auf %s1: %s2
 * captcha                     : "gui_downloadview_statustext_jac"     , // Captcha-Erkennung
 * downloading                 : "download_connection_normal"          , // Download
 * starting                    : "TaskColumn_fillColumnHelper_starting"                        , // Starte...
 * extractionError             : "TaskColumn_getStringValue_extraction_error"                  , // Entpackungsfehler
 * extractionErrorCRC          : "TaskColumn_getStringValue_extraction_error_crc"              , // Entpackungsfehler: CRC
 * extractionErrorFileNotFound : "TaskColumn_getStringValue_extraction_error_file_not_found"   , // Entpackungsfehler: Datei nicht gefunden
 * extractionErrorDiskFull     : "TaskColumn_getStringValue_extraction_error_space"            , // Entpackungsfehler: Nicht gen�gend Speicherplatz
 * extractionSuccess           : "TaskColumn_getStringValue_extraction_success"                , // Entpacken OK
 *
 **/

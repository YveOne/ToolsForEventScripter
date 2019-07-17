@echo off
SETLOCAL EnableDelayedExpansion

SET _title=%~1
SET _text=%~2
SET _default=%~3

set _text=%_text:\r="&vbCr&"%
set _text=%_text:\n="&vbLf&"%

:uniqueTempVbs
set "vbsFileName=%TEMP%\~%RANDOM%.vbs"
if exist "%vbsFileName%" goto :uniqueTempVbs

ECHO Wscript.Echo Inputbox("!_text!","!_title!","!_default!")>%vbsFileName%
FOR /f "delims=/" %%G IN ('cscript //nologo %vbsFileName%') DO set _input=%%G
DEL %vbsFileName%

if "%_input%" NEQ "" (
    echo 1%_input%
)

ENDLOCAL
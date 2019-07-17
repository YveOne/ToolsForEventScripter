@echo off
SETLOCAL EnableDelayedExpansion

SET _title=%~1
SET _text=%~2

set _text=%_text:\r="&vbCr&"%
set _text=%_text:\n="&vbLf&"%

:uniqueTempVbs
set "vbsFileName=%TEMP%\~%RANDOM%.vbs"
if exist "%vbsFileName%" goto :uniqueTempVbs

ECHO Wscript.Echo MsgBox("!_text!",1,"!_title!")>%vbsFileName%
FOR /f "delims=/" %%G IN ('cscript //nologo %vbsFileName%') DO set _input=%%G
DEL %vbsFileName%

if "%_input%" EQU "1" (
    ECHO 1
)

ENDLOCAL
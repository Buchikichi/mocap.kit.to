@echo off
set CUR=%~dp0
set COMP=c:\applications\closure-compiler-v20170218.jar
set COMP_OPT=--compilation_level SIMPLE --warning_level DEFAULT
:set COMP_OPT=--compilation_level WHITESPACE_ONLY --warning_level DEFAULT

cd %CUR%
type lib\*.* cmudb-main.js > cmudb-all.txt
java -jar %COMP% %COMP_OPT% --js cmudb-all.txt --js_output_file cmudb-min.js
pause

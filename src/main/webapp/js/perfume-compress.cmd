@echo off
set CUR=%~dp0
set COMP=c:\applications\closure-compiler-v20170218.jar
set COMP_OPT=--compilation_level SIMPLE --warning_level DEFAULT

cd %CUR%
type lib\*.* perfume-main.js > perfume-all.txt
java -jar %COMP% %COMP_OPT% --js perfume-all.txt --js_output_file perfume-min.js
pause

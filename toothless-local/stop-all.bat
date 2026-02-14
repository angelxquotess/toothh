@echo off
chcp 65001 >nul
title Toothless - Stop All
echo.
echo Chiudo tutti i processi Toothless...
taskkill /FI "WINDOWTITLE eq Toothless*" /F >nul 2>&1
echo ✅ Processi chiusi!
pause

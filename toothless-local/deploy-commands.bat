@echo off
chcp 65001 >nul
title Toothless - Deploy Commands
echo.
echo ========================================
echo    🐉 TOOTHLESS v3.0
echo    Deploy Slash Commands
echo ========================================
echo.

cd /d "%~dp0bot"
node deploy-commands.js

echo.
echo ========================================
echo    ✅ COMANDI REGISTRATI!
echo ========================================
echo.
pause

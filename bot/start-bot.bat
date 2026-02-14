@echo off
chcp 65001 >nul
title Toothless Bot - Running
echo.
echo ========================================
echo    🐉 TOOTHLESS BOT v3.0
echo    Avvio Bot
echo ========================================
echo.

cd /d "%~dp0"

if not exist ".env" (
    echo ❌ File .env non trovato!
    echo Crea il file .env con il TOKEN del bot
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo ⚠️  Dipendenze non installate!
    echo Eseguo install.bat...
    echo.
    call install.bat
)

echo 🐉 Avvio Toothless Bot...
echo Premi Ctrl+C per fermare il bot
echo.
node index.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Il bot si è fermato con un errore!
    pause
)

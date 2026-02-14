@echo off
chcp 65001 >nul
title Toothless Bot - Deploy Commands
echo.
echo ========================================
echo    🐉 TOOTHLESS BOT v3.0
echo    Deploy Slash Commands
echo ========================================
echo.

cd /d "%~dp0"

if not exist ".env" (
    echo ❌ File .env non trovato!
    echo Crea il file .env con TOKEN e CLIENT_ID
    pause
    exit /b 1
)

echo 🚀 Registrando comandi su Discord...
echo.
node deploy-commands.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Errore durante il deploy!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    ✅ COMANDI REGISTRATI!
echo ========================================
echo.
echo I comandi slash sono ora disponibili su Discord.
echo Potrebbero essere necessari alcuni minuti per la propagazione.
echo.
pause

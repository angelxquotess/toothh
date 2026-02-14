@echo off
chcp 65001 >nul
title Toothless Bot - Installazione Dipendenze
echo.
echo ========================================
echo    🐉 TOOTHLESS BOT v3.0
echo    Installazione Dipendenze
echo ========================================
echo.

echo [1/3] Verifico Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js non trovato!
    echo Scaricalo da: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js trovato!
echo.

echo [2/3] Installo dipendenze bot...
cd /d "%~dp0"
npm install
if %errorlevel% neq 0 (
    echo ❌ Errore installazione dipendenze bot!
    pause
    exit /b 1
)
echo ✅ Dipendenze bot installate!
echo.

echo [3/3] Installo dipendenze dashboard...
if exist "..\frontend" (
    cd /d "%~dp0..\frontend"
    call npm install
    echo ✅ Dipendenze dashboard installate!
) else (
    echo ⚠️  Cartella frontend non trovata, skippo...
)
echo.

echo ========================================
echo    ✅ INSTALLAZIONE COMPLETATA!
echo ========================================
echo.
echo Prossimi passi:
echo 1. Configura il file .env con il tuo token
echo 2. Esegui deploy-commands.bat per registrare i comandi
echo 3. Esegui start-bot.bat per avviare il bot
echo.
pause

@echo off
chcp 65001 >nul
title Toothless - Installazione Completa
echo.
echo ========================================
echo    🐉 TOOTHLESS v3.0
echo    Installazione Completa
echo ========================================
echo.

echo [1/4] Verifico Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js non trovato!
    echo Scaricalo da: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js trovato!

echo [2/4] Verifico Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python non trovato!
    echo Scaricalo da: https://python.org/
    pause
    exit /b 1
)
echo ✅ Python trovato!
echo.

echo [3/4] Installo dipendenze Bot...
cd /d "%~dp0bot"
call npm install
echo ✅ Dipendenze bot installate!
echo.

echo [4/4] Installo dipendenze Dashboard...
cd /d "%~dp0backend"
pip install fastapi uvicorn httpx python-dotenv
echo ✅ Dipendenze backend installate!

cd /d "%~dp0frontend"
call npm install
echo ✅ Dipendenze frontend installate!
echo.

echo ========================================
echo    ✅ INSTALLAZIONE COMPLETATA!
echo ========================================
echo.
echo Prossimi passi:
echo 1. Esegui deploy-commands.bat per registrare i comandi
echo 2. Esegui start-all.bat per avviare tutto
echo.
pause

@echo off
chcp 65001 >nul
title Toothless - Avvio Completo
echo.
echo ========================================
echo    🐉 TOOTHLESS v3.0
echo    Avvio Bot + Dashboard
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Avvio Bot Discord...
start "Toothless Bot" cmd /k "cd /d "%~dp0" && node index.js"

echo [2/2] Avvio Dashboard...
if exist "..\frontend" (
    start "Toothless Dashboard" cmd /k "cd /d "%~dp0..\frontend" && npm start"
    echo.
    echo ✅ Bot e Dashboard avviati!
    echo.
    echo 📍 Dashboard: http://localhost:3000
    echo 📍 API Bot: http://localhost:3001
) else (
    echo ⚠️  Dashboard non trovata, avviato solo il bot
)

echo.
echo Premi un tasto per chiudere questa finestra...
pause >nul

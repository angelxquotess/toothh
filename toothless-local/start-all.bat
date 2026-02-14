@echo off
chcp 65001 >nul
title Toothless - Avvio Completo
echo.
echo ========================================
echo    🐉 TOOTHLESS v3.0
echo    Avvio Bot + Dashboard
echo ========================================
echo.

echo [1/3] Avvio Backend API...
start "Toothless Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
timeout /t 3 >nul

echo [2/3] Avvio Frontend Dashboard...
start "Toothless Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"
timeout /t 3 >nul

echo [3/3] Avvio Bot Discord...
start "Toothless Bot" cmd /k "cd /d "%~dp0bot" && node index.js"

echo.
echo ========================================
echo    ✅ TUTTO AVVIATO!
echo ========================================
echo.
echo 🌐 Dashboard: http://localhost:3000
echo 🔧 API Backend: http://localhost:8001
echo 🤖 Bot Discord: In esecuzione
echo.
echo Premi un tasto per chiudere questa finestra...
pause >nul

@echo off
title Krishi Sarathi (Development Mode)
echo ========================================================
echo  KRISHI SARATHI - Development Environment Launcher
echo  Starting Server (Port 5000) & Vite React (Port 3000)
echo ========================================================
echo.
start "Krishi Sarathi Server" cmd /k "cd server && npm start"
timeout /t 2 /nobreak >nul
start "Krishi Sarathi Client" cmd /k "cd client && npm run dev"
timeout /t 3 /nobreak >nul
echo Opening development frontend...
start http://localhost:3000

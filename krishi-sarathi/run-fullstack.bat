@echo off
title Krishi Sarathi - Smart Procurement Portal
echo ========================================================
echo  KRISHI SARATHI (कृषि सारथी) - Full-Stack Launcher
echo  Smart India Hackathon 2026 - Problem Statement: SIH26032
echo  Team: Off By One
echo ========================================================
echo.
echo Starting backend server with embedded frontend on port 5000...
cd server
start "Krishi Sarathi Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul
echo Opening Krishi Sarathi in your web browser...
start http://localhost:5000
echo Server is running! Press Ctrl+C in the server window to stop.

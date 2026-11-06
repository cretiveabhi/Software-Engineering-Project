@echo off
title Krishi Sarathi - Live Database Inspector
echo Inspecting Krishi Sarathi Database...
cd server
node inspect-db.js %1
pause

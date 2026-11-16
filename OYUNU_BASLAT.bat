@echo off
cd /d "%~dp0"
echo Komiser Rakun: Sapsal Kahramanlar ve Astro-Galaksi Destani baslatiliyor...
start "" "http://127.0.0.1:8089"
node server.mjs

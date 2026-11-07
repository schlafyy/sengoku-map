@echo off
rem Builds dist\Sengoku.exe (one file, no console). Needs: pip install pywebview pyinstaller
cd /d "%~dp0"
node test.js || exit /b 1
pyinstaller --noconfirm --onefile --windowed --name Sengoku --icon icon.ico ^
  --add-data "index.html;." --add-data "app.js;." --add-data "model.js;." --add-data "icon.png;." ^
  --add-data "data;data" --add-data "fonts;fonts" --add-data "images;images" --add-data "crests;crests" main.py

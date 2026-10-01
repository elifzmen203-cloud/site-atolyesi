@echo off
setlocal
echo [Site Atolyesi] Yayina hazirlaniyor...
call npm.cmd run build
if %errorlevel% neq 0 (
  echo [HATA] Derleme basarisiz oldu.
  exit /b %errorlevel%
)
call npm.cmd test
if %errorlevel% neq 0 (
  echo [HATA] Testler gecmedi.
  exit /b %errorlevel%
)
echo [Site Atolyesi] Git commit ve push yapiliyor...
git add -A
git commit -m "[yayin] canli guncelleme"
git push origin main
echo [Site Atolyesi] Push tamamlandi! GitHub Actions yayini baslatti.
echo Adres: https://elifzmen203-cloud.github.io/site-atolyesi/
pause

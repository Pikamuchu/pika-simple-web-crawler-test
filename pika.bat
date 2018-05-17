@echo off

set COMMAND=%1
set PARAMS=%2 %3 %4

if "%COMMAND%" == "start-chrome" (
  call scripts/start-chrome-headless.bat

) else if "%COMMAND%" == "stop-chrome" (
  call scripts/stop-chrome-headless.bat

) else if "%COMMAND%" == "crawler-test" (
  call scripts/start-chrome-headless.bat
  call npm run crawler-test -- %PARAMS%
  call scripts/stop-chrome-headless.bat

) else if "%COMMAND%" == "format" (
  call npm run prettier

) else (
  echo.
  echo Usage: pika [command]
  echo.
  echo where [command] is one of:
  echo    crawler-test [chunks] [data-file] - run the crawler test - also starts and stops chrome
  echo      - initial-url: Initial Url to open and parse links.
  echo      - chunks: Number of concurrent url calls. Default 2 
  echo    crawler-test-docker - run test using a chrome headless docker
  echo    start-chrome - start chrome in headless mode
  echo    stop-chrome - stop chrome
  echo    format - auto format project code using prettier

  exit /b 1
)

:end
@echo off
set localListeningPort=12345
set localSendingPort=5000
set seedPort=12345
set changeSeedPort=0
set seedIP=127.0.0.1
set numberOfNodes=4
set botid=1
set mode=LocalChain

REM Server.js has 6 parameters
REM 0. Mode (LocalChain)
REM 1. Bot ID
REM 2. LocalListeningPort
REM 3. LocalSendingPort
REM 4. SeedIP [OPT]
REM 5. SeedListeningPort [OPT]

REM Starting first node
start cmd /c "node server.js %mode% %botid% %LocalListeningPort% %LocalSendingPort%
set /A numberOfNodes=numberOfNodes-1

:TOP
timeout 6
if %numberOfNodes% EQU 0 goto STOP
echo number of nodes = %numberOfNodes%

set /A changeSeedPort=changeSeedPort+1
if %changeSeedPort% EQU 6 goto UPDATESEEDPORT

set /A botid=botid+1
set /A localListeningPort=localListeningPort+1
set /A localSendingPort=localSendingPort+1

echo New bot : %mode% - BOT%botid% Listening port %LocalListeningPort% - Sending Port %LocalSendingPort%  - IP Seed 127.0.0.1 -  Listening Port Seed %seedPort%
start cmd /c "node server.js %mode% %botid% %LocalListeningPort% %LocalSendingPort% %seedIP% %seedPort%"
set /A numberOfNodes=numberOfNodes-1

goto TOP

:UPDATESEEDPORT
set /A seedPort=seedPort+1
set /A changeSeedPort=0
goto TOP

:STOP

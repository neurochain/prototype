@echo off
set botid=1
set localListeningPort=12345
set localSendingPort=5000
set seedIP=127.0.0.1
set seedPort=12345
set connectorUDPPort=9876
set websocketPort=8080

set changeSeedPort=0
set numberOfNodes=3
REM Server.js has 6 parameters
REM 1. Bot ID
REM 2. LocalListeningPort
REM 3. LocalSendingPort
REM 4. SeedIP
REM 5. SeedListeningPort
REM 5. ConnectorUDPPort
REM 5. SeedListeningPort


REM Starting first node
REM start cmd /c "node server.js %botid% %LocalListeningPort% %LocalSendingPort% %connectorUDPPort% %websocketPort%
echo %botid% %LocalListeningPort% %LocalSendingPort% %seedIP% %seedPort% %connectorUDPPort% %websocketPort%
start cmd /c "node server.js %botid% %LocalListeningPort% %LocalSendingPort% %seedIP% %seedPort% %connectorUDPPort% %websocketPort%"
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
set /A connectorUDPPort= connectorUDPPort+1
set /A websocketPort = websocketPort+1

echo New bot :BOT%botid% Listening port %LocalListeningPort% - Sending Port %LocalSendingPort%  - IP Seed 127.0.0.1 -  Listening Port Seed %seedPort%
start cmd /c "node server.js %botid% %LocalListeningPort% %LocalSendingPort% %seedIP% %seedPort% %connectorUDPPort% %websocketPort%"
set /A numberOfNodes=numberOfNodes-1

goto TOP

:UPDATESEEDPORT
set /A seedPort=seedPort+1
set /A changeSeedPort=0
goto TOP

:STOP

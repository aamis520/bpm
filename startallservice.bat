call forever stopall
call forever start -e ./frame.log 	.\services\framework\app.js
call forever start -e ./engine.log 	.\services\engine\app.js
start "engine" /d"./frontend/engine/" cmd /k "npm run dev"
start "framework" /d"./frontend/framework/" cmd /k "npm run dev"
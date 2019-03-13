#!/bin/bash

sleep 1s
forever stopall
sleep 1s

ps -ef | grep 'build/dev-server.js' | grep -v grep | cut -c 9-15 | xargs kill -s 9
ps -ef | grep sails | grep -v grep | cut -c 9-15 | xargs kill -s 9

echo "========================="
echo "========================="
echo "========================="
echo "will start rewrite the confilg file, if you change the 'localhost' config to others, please do it manually again...."

sleep 2s

sed -i 's/localhost/192.168.6.22/' ./frontend/engine/src/Config.vue
sed -i 's/localhost/192.168.6.22/' ./frontend/framework/src/Config.vue

#chmod -R +x pc/

forever start -e ./engine.log 		./services/engine/app.js
forever start -e ./framework.log 	./services/framework/app.js

./frontend/engine/run.py &
./frontend/framework/run.py &

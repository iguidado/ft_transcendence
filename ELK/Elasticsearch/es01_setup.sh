#!/bin/sh

/usr/local/bin/docker-entrypoint.sh &

export PID=$!

echo '!!!!!!!!!!!!!!!!  PID of my entrypoint is ${PID}  !!!!!!!!!!!!!!!'

bash /usr/share/elasticsearch/config/policy_scripts/main.sh

wait ${PID};

#!/bin/sh

CMD="/usr/share/elasticsearch/config/policy_scripts/slm_policy/list_policy.sh"

docker exec -it es01 "${CMD}" | jq

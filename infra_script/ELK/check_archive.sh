#!/bin/sh

CMD="/usr/share/elasticsearch/config/policy_scripts/slm_policy/check_archive.sh"

docker exec -it es01 "${CMD}" | jq

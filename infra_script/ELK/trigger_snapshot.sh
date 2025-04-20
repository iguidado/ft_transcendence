#!/bin/sh
ES_USER="${ELASTIC_USER:-elastic}"
ES_PASS="${ELASTIC_PASSWORD:-espass}"
ES_HOST="${ES_HOST:-https://localhost:9200}"

CACERT="/usr/share/elasticsearch/config/certs/ca/ca.crt"

# Policy name and file
POLICY_NAME="weekly_backup"
POLICY_FILE="/usr/share/elasticsearch/config/policy_scripts/slm_policy/slm_policy_weekly.json"

docker exec -t es01 curl -X POST "${ES_HOST}/_slm/policy/${POLICY_NAME}/_execute" \
	-u "${ES_USER}:${ES_PASS}" --cacert "${CACERT}" 

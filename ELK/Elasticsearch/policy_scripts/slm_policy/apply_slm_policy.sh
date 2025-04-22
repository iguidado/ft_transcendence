#!/bin/bash

# Configurable variables
ES_USER="${ELASTIC_USER:-elastic}"
ES_PASS="${ELASTIC_PASSWORD:-default}"
ES_HOST="${ES_HOST:-https://localhost:9200}"

CACERT="/usr/share/elasticsearch/config/certs/ca/ca.crt"

# Policy name and file
POLICY_NAME="weekly_backup"
POLICY_FILE="/usr/share/elasticsearch/config/policy_scripts/slm_policy/slm_policy_weekly.json"

# Check if the policy already exists
response=$( curl -s --cacert "${CACERT}" \
	-o /dev/null -w "%{http_code}" \
	-u "${ES_USER}:${ES_PASS}" \
	"${ES_HOST}/_slm/policy/${POLICY_NAME}")

if [[ "$response" == "200" ]]; then
	echo "✅ SLM policy '${POLICY_NAME}' already exists. Skipping creation."
else
	echo "🚀 SLM policy '${POLICY_NAME}' does not exist. Applying it now..."

	curl --cacert "${CACERT}" \
		-X PUT "${ES_HOST}/_slm/policy/${POLICY_NAME}" \
		-u "${ES_USER}:${ES_PASS}" \
		-H "Content-Type: application/json" \
		-d @"${POLICY_FILE}"

	if [ $? -eq 0 ]; then
		echo "🎉 SLM policy '${POLICY_NAME}' applied successfully."
	else
		echo "❌ Failed to apply SLM policy '${POLICY_NAME}'." >&2
		exit 1
	fi
fi

# Optional: Trigger the policy immediately for testing (comment this for production use)
echo "⚡ Triggering initial snapshot for testing..."

curl -X POST "${ES_HOST}/_slm/policy/${POLICY_NAME}/_execute" \
	-u "${ES_USER}:${ES_PASS}" --cacert "${CACERT}" 

echo -e "\n--------------------------------------------------------------------"

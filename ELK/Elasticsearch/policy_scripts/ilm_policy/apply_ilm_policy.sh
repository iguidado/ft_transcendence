#!/bin/bash
set -e

POLICY_NAME="archive_policy"
POLICY_FILE="/usr/share/elasticsearch/config/policy_scripts/ilm_policy/ilm_policy.json"

echo "🔎 Checking if ILM policy '$POLICY_NAME' already exists..."

HTTP_CODE=$(curl -s \
    --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
    -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
    -o /dev/null \
    -w "%{http_code}" \
    "https://localhost:9200/_ilm/policy/$POLICY_NAME")

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ ILM policy already exists, skipping."
else
    echo "🔨 Applying ILM policy '$POLICY_NAME'..."
    curl -X PUT "https://localhost:9200/_ilm/policy/$POLICY_NAME" \
        -H 'Content-Type: application/json' \
        --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
        -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
        -d @"$POLICY_FILE"
    echo "✅ ILM policy applied."
fi

echo -e "\n--------------------------"

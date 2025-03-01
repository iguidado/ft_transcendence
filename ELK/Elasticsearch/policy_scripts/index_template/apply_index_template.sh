#!/bin/bash
set -e

TEMPLATE_NAME="archive-template"
TEMPLATE_FILE="/usr/share/elasticsearch/policy_scripts/index_template/archive_template.json"

echo "🔎 Checking if index template '$TEMPLATE_NAME' already exists..."

HTTP_CODE=$(curl -s \
    --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
    -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
    -o /dev/null \
    -w "%{http_code}" \
    "https://localhost:9200/_index_template/$TEMPLATE_NAME")

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Index template already exists, skipping."
else
    echo "🔨 Applying index template '$TEMPLATE_NAME'..."
    curl -X PUT "https://localhost:9200/_index_template/$TEMPLATE_NAME" \
        -H 'Content-Type: application/json' \
        --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
        -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
        -d @"$TEMPLATE_FILE"
    echo "✅ Index template applied."
fi

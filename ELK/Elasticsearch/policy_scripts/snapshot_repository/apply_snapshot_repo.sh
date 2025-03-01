#!/bin/bash
set -e

REPO_NAME="archive"
REPO_FILE="/usr/share/elasticsearch/policy_scripts/snapshoy_repository/archive_repository.json"

echo "🔎 Checking if snapshot repository '$REPO_NAME' already exists..."

HTTP_CODE=$(curl -s \
    --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
    -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
    -o /dev/null \
    -w "%{http_code}" \
    "https://localhost:9200/_snapshot/$REPO_NAME")

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Snapshot repository already exists, skipping."
else
    echo "🔨 Registering snapshot repository '$REPO_NAME'..."
    curl -X PUT "https://localhost:9200/_snapshot/$REPO_NAME" \
        -H 'Content-Type: application/json' \
        --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
        -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
        -d @"$REPO_FILE"
    echo "✅ Snapshot repository registered."
fi

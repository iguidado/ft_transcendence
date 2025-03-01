#!/bin/bash
set -e

echo "📦 Running Elasticsearch policies configuration process..."

echo "⏳ Waiting for Elasticsearch to be ready..."

HTTP_CODE=$(curl -s \
    --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
    -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
    "https://localhost:9200" | grep -q "You Know, for Search" && echo "200" || echo "500")

# Loop until Elasticsearch is available (HTTP_CODE == 200)
while [ "$HTTP_CODE" != "200" ]; do
    echo "🔄 Waiting for secure Elasticsearch..."
    sleep 5

    HTTP_CODE=$(curl -s \
        --cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
        -u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
        "https://localhost:9200" | grep -q "You Know, for Search" && echo "200" || echo "500")
done

echo "✅ Elasticsearch is up!"


# Step 2: Run all setup scripts for ILM policy, index template, initial index, and snapshot repo
echo "🛠️ Running setup scripts for archive..."

echo "🔧 Applying ILM policy..."
/usr/share/elasticsearch/policy_scripts/ilm_policy/apply_ilm_policy.sh

echo "🔧 Applying index template..."
/usr/share/elasticsearch/policy_scripts/index_template/apply_index_template.sh

echo "🔧 Registering snapshot repository..."
/usr/share/elasticsearch/policy_scripts/snapshot_repository/apply_snapshot_repo.sh


echo "🎉 Elasticsearch archive configuration complete!"

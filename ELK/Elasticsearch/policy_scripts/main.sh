#!/bin/sh

set -e

echo -e "\n📦 Running Elasticsearch policies configuration process...\n"

# Step 2: Waiting For ElasticSearch service to be available
echo -e "\n⏳ Waiting for Elasticsearch to be ready...\n"

HTTP_CODE=$(curl -s \
	--cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
	-u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
	"https://localhost:9200" | grep -q "You Know, for Search" && echo "200" || echo "500")

# Loop until Elasticsearch is available (HTTP_CODE == 200)
while [ "$HTTP_CODE" != "200" ];
do
	echo "🔄 Waiting for secure Elasticsearch..."
	sleep 5

	HTTP_CODE=$(curl -s \
		--cacert /usr/share/elasticsearch/config/certs/ca/ca.crt \
		-u "${ELASTIC_USER}:${ELASTIC_PASSWORD}" \
		"https://localhost:9200" | grep -q "You Know, for Search" && echo "200" || echo "500")
done

echo -e "\n✅ Elasticsearch is up!\n"


# Step 2: Run all setup scripts for ILM policy, index template, initial index, and snapshot repo
echo -e "\n🛠️ Running setup scripts for archive...\n"

echo -e "\n🔧 Registering snapshot repository...\n"
/usr/share/elasticsearch/config/policy_scripts/snapshot_repository/apply_snapshot_repo.sh

echo -e "\n🔧 Applying index template...\n"
/usr/share/elasticsearch/config/policy_scripts/index_template/apply_index_template.sh


echo -e "\n🔧 Applying ILM policy...\n"
/usr/share/elasticsearch/config/policy_scripts/ilm_policy/apply_ilm_policy.sh

echo -e "\n🔧 Applying SLM policy...\n"
/usr/share/elasticsearch/config/policy_scripts/slm_policy/apply_slm_policy.sh

echo -e "\n🎉 Elasticsearch archive configuration complete!\n"


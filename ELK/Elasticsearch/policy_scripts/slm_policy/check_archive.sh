#!/bin/bash

ES_USER="${ELASTIC_USER:-elastic}"
ES_PASS="${ELASTIC_PASSWORD:-default}"
ES_HOST="${ES_HOST:-https://localhost:9200}"

CACERT="/usr/share/elasticsearch/config/certs/ca/ca.crt"

curl -X GET "${ES_HOST}/_snapshot/archive/_all" \
	-u "${ES_USER}:${ES_PASS}" \
	--cacert "${CACERT}"


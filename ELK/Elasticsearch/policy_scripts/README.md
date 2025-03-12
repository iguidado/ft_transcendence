# Elasticsearch ILM, Index Template, and Snapshot Repository Configuration

This document describes the process of configuring Elasticsearch using a structured approach with configuration files and shell scripts. This approach ensures:

- An **ILM policy** is in place to automatically delete indices after a retention period, with snapshots taken before deletion.
- An **index template** links time-based Logstash indices to this ILM policy.
- A **snapshot repository** is configured to archive snapshots.
- A **main bootstrap script (`main.sh`)** applies all configurations at container startup.

---

## 📂 File Structure

```
.
├── ilm_policy
│   ├── apply_ilm_policy.sh
│   └── ilm_policy.json
├── index_template
│   ├── apply_index_template.sh
│   └── archive_template.json
├── main.sh
└── snapshot_repository
    ├── apply_snapshot_repository.sh
    └── archive_repository.json
```

- Every configuration file (\*.json) come with a bash script applying it to Elasticsearch server

---

## 🛠️ Configuration

### 1. Snapshot Repository Configuration (`snapshot_repository/*`)

Snapshot repository configure a repository that store snapshot. Snapshot can be done by hand (usually
automated with cronjob or other scheduler) or defined in ILM policy (as here)


This defines that snapshots will be stored on our filesystem in required location with compression activated.

```json
{
    "type": "fs",     // Define type of repository used: fs (filesystem)
    "settings": {     // settings is defined dependedly on type
        "location": "/mnt/snapshots",
        "compress": true
    }
}
```

---

### 2. ILM Policy Configuration (`./ilm_policy/*`)

**ILM policy** apply policy to **index logs**. We can define rollover between indices when certain condition are
met (log age, space restriction, ...). Since we automated rollover with logstash we are only using this
feature to define a archive policy based on age. 

- This defines a **delete phase** that applies after **30 minutes**, with a snapshot taken just before deletion.

```json
{
    "policy": {
        "phases": {  // Define which phase logs go through
            "delete": {  // delete here is simply phase's name
                "min_age": "30m",   // min_age is requirement needed before logs through this phase (30 min is only for POC, don't put value under a day)
                "actions": {        // All action applied on logs
                    "snapshot": {    // Snapshoting logs
                        "repository": "archive",   // repository name where logs go (must match repo created)
                        "name": "snapshot-%{now/d+1d}" // Name of snapshot created
                    },
                    "delete": {}    // delete here is action of deleting logs
                }
            }
        }
    }
}
```

---

### 3. Index Template Configuration (`index_template/apply_index_template.sh`)

Index template ensure that **ILM policy** is applied to logs forwarded by *logstash*

- This links `docker-logs-*` indices (created by Logstash) to the `delete_policy` ILM policy.

```json
{
    "index_patterns": ["docker-logs-*"],  // index matched by index template (accept wildcard)
    "settings": {
        "index.lifecycle.name": "archive_policy", // ILM configuration applied to logs
        "index.lifecycle.rollover_alias": "docker-logs"  // rollover alias serve when doing rollover we keep it here for documentation
    }
}
```

---

🛑 If you copy these json file be careful that json don't accept comment so be sure to delete them

### 4. Main Bootstrap Script (`main.sh`)

Main script check that Elasticsearch server is up and running before applying policies

---

## 🚀 Execution

- All files are mounted as a volume in `/usr/share/elasticsearch/config/policy_scripts`.
- Execution is done at run time container through docker-compose.yaml **command:** entry
- Every policies is self checking that policies are applied and element are created.

This ensures:

- Snapshot repository is applied if missing.
- ILM policy is applied if missing.
- Index template is applied if missing.
- All necessary setup runs **each time the container starts**.

---

## ✅ Summary

| Component                  | Purpose |
|------------------|----------------|
| Snapshot Repository | Stores archived logs before deletion |
| ILM Policy | Deletes indices after some time and takes snapshots before deletion |
| Index Template | Links Logstash indices to the ILM policy |
| Bootstrap Script | Applies all configurations when the container starts |

---

## 📝 Key Design Note

- This configuration works for **time-based Logstash indices** (like `docker-logs-YYYY.MM.dd`).
- No automatic rollover is used since Logstash manages index creation directly (per day).
- ILM only handles **deletion and pre-deletion snapshots**.

---

## To-do

- [ ] Replace all absolute path in script by relative path
- [ ] When implementing vault replace ElasticSearch credential env variable by secret retrieval

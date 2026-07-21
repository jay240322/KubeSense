from app.kubernetes.client import get_k8s_client
from app.ai.prompts import CLUSTER_ANALYSIS_PROMPT
from app.ai.service import generate_ai_response


def analyze_cluster():
    api = get_k8s_client()

    pods = api.list_pod_for_all_namespaces().items

    cluster_summary = []

    for pod in pods:
        restart_count = sum(
            container.restart_count
            for container in (pod.status.container_statuses or [])
        )

        cluster_summary.append(
            {
                "namespace": pod.metadata.namespace,
                "name": pod.metadata.name,
                "status": pod.status.phase,
                "node": pod.spec.node_name,
                "restarts": restart_count,
            }
        )

    prompt = f"""
{CLUSTER_ANALYSIS_PROMPT}

Cluster Summary:

{cluster_summary}
"""
    analysis = generate_ai_response(prompt)

    return {
        "pods": len(cluster_summary),
        "analysis": analysis,
    }
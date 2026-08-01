from sqlalchemy.orm import Session

from app.kubernetes.client import get_k8s_client
from app.kubernetes.pods import get_pod_events
from app.ai.prompts import CLUSTER_ANALYSIS_PROMPT
from app.ai.service import generate_ai_response


def analyze_cluster(
    db: Session,
    api_key: str | None = None,
):
    api = get_k8s_client()

    pods = api.list_pod_for_all_namespaces().items

    cluster_summary = []

    for pod in pods:
        restart_count = sum(
            container.restart_count
            for container in (pod.status.container_statuses or [])
        )

        if (
            pod.status.phase != "Running"
            or restart_count > 0
        ):
            events = get_pod_events(
                pod.metadata.namespace,
                pod.metadata.name,
            )

            cluster_summary.append(
                {
                    "namespace": pod.metadata.namespace,
                    "name": pod.metadata.name,
                    "status": pod.status.phase,
                    "node": pod.spec.node_name,
                    "restarts": restart_count,
                    "events": events,
                }
            )

    prompt = f"""
{CLUSTER_ANALYSIS_PROMPT}

Cluster Summary:

{cluster_summary}
"""

    analysis = generate_ai_response(
        db=db,
        prompt=prompt,
        api_key=api_key,
    )

    return {
        "health_score": 20,  # Temporary, we'll calculate this dynamically later
        "pods": len(cluster_summary),
        "analysis": analysis,
    }
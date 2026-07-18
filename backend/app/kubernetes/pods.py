from .client import get_k8s_client
from datetime import datetime, timezone


def list_pods():
    api = get_k8s_client()

    pods = api.list_pod_for_all_namespaces(watch=False)

    pod_list = []

    for pod in pods.items:

        restart_count = 0

        if pod.status.container_statuses:
            restart_count = sum(
                container.restart_count
                for container in pod.status.container_statuses
            )

        created = pod.metadata.creation_timestamp

        if created:
            age = datetime.now(timezone.utc) - created
            age = f"{age.days}d"
        else:
            age = "Unknown"

        pod_list.append({
            "name": pod.metadata.name,
            "namespace": pod.metadata.namespace,
            "status": pod.status.phase,
            "node": pod.spec.node_name,
            "restarts": restart_count,
            "age": age,
        })

    return pod_list

def get_pod_details(namespace: str, pod_name: str):
    api = get_k8s_client()

    pod = api.read_namespaced_pod(
        name=pod_name,
        namespace=namespace
    )

    restart_count = 0

    if pod.status.container_statuses:
        restart_count = sum(
            container.restart_count
            for container in pod.status.container_statuses
        )

    created = pod.metadata.creation_timestamp

    if created:
        age = datetime.now(timezone.utc) - created
        age = f"{age.days}d"

    else:
        age = "Unknown"

    images = []

    if pod.spec.containers:
        images = [
            container.image
            for container in pod.spec.containers
        ]

    return {
        "name": pod.metadata.name,
        "namespace": pod.metadata.namespace,
        "status": pod.status.phase,
        "node": pod.spec.node_name,
        "restarts": restart_count,
        "age": age,
        "images" : images,
    } 
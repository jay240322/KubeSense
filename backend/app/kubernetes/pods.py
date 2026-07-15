from .client import get_k8s_client

def list_pods():
    api = get_k8s_client()

    pods = api.list_pod_for_all_namespaces(watch=False)

    pod_list = []

    for pod in pods.items:
        pod_list.append({
            "name": pod.metadata.name,
            "namespace": pod.metadata.namespace,
            "status": pod.status.phase,
        })
    return pod_list
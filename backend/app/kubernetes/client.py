from kubernetes import client, config


def get_k8s_client():
    try:
        # Running inside Kubernetes
        config.load_incluster_config()

    except config.ConfigException:
        # Running locally
        config.load_kube_config()

    return client.CoreV1Api()
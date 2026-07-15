from kubernetes import client, config
from kubernetes.config.config_exception import ConfigException


def get_k8s_client():
    try:
        config.load_kube_config()
        return client.CoreV1Api()
    except ConfigException as e:
        raise RuntimeError(f"Failed to load kubeconfig: {e}")
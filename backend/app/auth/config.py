import os


KUBESENSE_USERNAME = os.getenv(
    "KUBESENSE_USERNAME",
    "admin",
)

KUBESENSE_PASSWORD = os.getenv(
    "KUBESENSE_PASSWORD",
    "KubeSense@123",
)
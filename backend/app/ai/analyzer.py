import json

from app.ai.client import (
    client,
    GEMINI_MODEL,
)

from app.ai.prompts import SYSTEM_PROMPT

from app.kubernetes.pods import (
    get_pod_details,
    get_pod_logs,
    get_pod_events,
)

def analyze_pod(
    namespace: str,
    pod_name: str,
):
    pod_details = get_pod_details(
        namespace,
        pod_name,
    )

    pod_logs = get_pod_logs(
        namespace,
        pod_name,
    )

    pod_events = get_pod_events(
        namespace,
        pod_name
    )

    prompt = f"""
{SYSTEM_PROMPT}

## Pod Details

{json.dumps(pod_details, indent=2)}

## Pod Logs

{pod_logs}

## Pod Events

{json.dumps(pod_events, indent=2)}

Please analyze the Kubernetes pod and produce a troubleshooting report.
"""

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return {
        "analysis": response.text
    }
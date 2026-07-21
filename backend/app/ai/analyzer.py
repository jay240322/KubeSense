import json

from app.ai.service import generate_ai_response

from app.ai.prompts import POD_ANALYSIS_PROMPT

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
{POD_ANALYSIS_PROMPT}

## Pod Details

{json.dumps(pod_details, indent=2)}

## Pod Logs

{pod_logs}

## Pod Events

{json.dumps(pod_events, indent=2)}

Please analyze the Kubernetes pod and produce a troubleshooting report.
"""

    analysis = generate_ai_response(prompt)

    return {
        "analysis": analysis
    }
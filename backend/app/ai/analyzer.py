import json

from app.ai.client import (
    client,
    GEMINI_MODEL,
)

from app.ai.prompts import SYSTEM_PROMPT


def analyze_pod(
    pod_details: dict,
    pod_logs: str,
    pod_events: list,
):

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
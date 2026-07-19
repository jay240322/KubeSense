from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    pod_details: dict
    pod_logs: str
    pod_events: list
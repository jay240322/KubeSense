from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    namespace: str
    pod_name: str
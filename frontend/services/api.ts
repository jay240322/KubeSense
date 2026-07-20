const API_BASE = "http://127.0.0.1:8000";

export async function getPods() {
  const response = await fetch(`${API_BASE}/api/v1/pods`);

  if (!response.ok) {
    throw new Error("Failed to fetch pods");
  }

  return response.json();
}

export async function getPodDetails(
  namespace: string,
  podName: string
) {
  const response = await fetch(
    `${API_BASE}/api/v1/pods/${namespace}/${podName}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pod details");
  }

  return response.json();
}

export async function getPodLogs(
  namespace: string,
  podName: string
) {
  const response = await fetch(
    `${API_BASE}/api/v1/pods/${namespace}/${podName}/logs`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pod logs");
  }

  return response.json();
}

export async function getPodEvents(
  namespace: string,
  podName: string
){
  const response = await fetch (
    `${API_BASE}/api/v1/pods/${namespace}/${podName}/events`
  );

  if(!response.ok) {
    throw new Error("failed to fetch pod events");
  }

  return response.json();
}

export async function analyzePod(
   namespace: string,
  podName: string
){
  const response = await fetch(
    `${API_BASE}/api/v1/analyze`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        namespace: namespace,
        pod_name: podName,
      }),
    }
  );

  if(!response.ok){
    throw new Error("Faailed to analyze pod");
  }
  return response.json();
}
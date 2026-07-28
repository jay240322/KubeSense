const API_BASE = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
}

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");

    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function getPods() {
  return apiRequest("/api/v1/pods");
}

export async function getPodDetails(
  namespace: string,
  podName: string
) {
  return apiRequest(
    `/api/v1/pods/${namespace}/${podName}`
  );
}

export async function getPodLogs(
  namespace: string,
  podName: string
) {
  return apiRequest(
    `/api/v1/pods/${namespace}/${podName}/logs`
  );
}

export async function getPodEvents(
  namespace: string,
  podName: string
) {
  return apiRequest(
    `/api/v1/pods/${namespace}/${podName}/events`
  );
}

export async function analyzePod(
  namespace: string,
  podName: string
) {
  return apiRequest("/api/v1/analyze", {
    method: "POST",
    body: JSON.stringify({
      namespace,
      pod_name: podName,
    }),
  });
}

export async function analyzeCluster() {
  return apiRequest("/api/v1/analyze-cluster", {
    method: "POST",
  });
}
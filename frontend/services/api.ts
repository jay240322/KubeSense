const API_BASE = "http:\\127.0.0.1:8000";

export async function getPods(){
    const response = await fetch('${API_BASE}/api/v1/pods');

    if(!response.ok) {
        throw new Error("Filed to fetch pods");
    }

    return response.json();
}
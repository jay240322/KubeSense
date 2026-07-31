# ☸️ Deploy KubeSense to Kubernetes

## Step 1: Create a Namespace

```bash
kubectl create namespace kubesense
```

Verify:

```bash
kubectl get namespaces
```

---

## Step 2: Apply the Kubernetes Manifests

```bash
kubectl apply -n kubesense -f k8s/
```

Verify the resources:

```bash
kubectl get all -n kubesense
```

---

## Step 3: Check the Pods

```bash
kubectl get pods -n kubesense
```

Wait until all pods show:

```
STATUS: Running
```

---

## Step 4: Verify the Services

```bash
kubectl get svc -n kubesense
```

---

## Step 5: Access the Application

```bash
kubectl port-forward -n kubesense svc/kubesense-frontend-service 3000:3000
```

Open:

```
http://localhost:3000
```

---

## Step 6: Login

Username

```text
admin
```

Password

```text
KubeSense@123
```

---

## Step 7: Configure Gemini API Key

After the first login:

1. Paste your Google Gemini API Key.
2. Click **Save & Continue**.
3. Open the Dashboard.

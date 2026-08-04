<div align="center">

#  KubeSense


### AI-Powered Kubernetes Troubleshooting Assistant

Diagnose, analyze, and resolve Kubernetes issues using **Google Gemini LLM**.

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?logo=argo&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

##  Overview

KubeSense is an AI-powered Kubernetes troubleshooting platform that helps developers and DevOps engineers quickly identify and resolve cluster issues. It collects Kubernetes diagnostics, analyzes them using **Google Gemini LLM**, and provides intelligent root cause analysis with actionable recommendations through a modern web dashboard.

---

##  Features

- 🤖 AI-powered Kubernetes troubleshooting
- ☸️ Pod, Logs & Events Explorer
- 🧠 Google Gemini LLM integration
- 📊 Cluster-wide AI analysis
- 🔐 JWT Authentication
- 🗄️ PostgreSQL database
- 🐳 Dockerized deployment
- 🚀 GitHub Actions CI/CD
- 🔄 ArgoCD GitOps
- 🌐 Kubernetes Ingress support

---

##  Why KubeSense?

- Reduce Kubernetes troubleshooting time
- AI-assisted root cause analysis
- Modern and responsive dashboard
- One-command Kubernetes installation
- Production-ready cloud-native architecture
- ---

# 🏗️ Architecture

KubeSense follows a cloud-native microservices architecture.

<div align="center">

<img width="1485" height="1059" alt="ChatGPT Image Aug 4, 2026, 09_11_37 AM" src="https://github.com/user-attachments/assets/3b3e8367-b4e2-4169-884a-f8b11c8ea0bc" />




</div>

---

# ⚙️ Prerequisites

Before installing KubeSense, ensure you have:

- Kubernetes Cluster
- kubectl
- Docker
- Internet Connection

Verify your cluster:

```bash
kubectl cluster-info
kubectl get nodes
```

---

# 📦 Installation


Create a namespace first:

```bash
 kubectl create namespace kubesense
```
Deploy KubeSense using a single command:

```bash
kubectl apply -f https://raw.githubusercontent.com/jay240322/KubeSense/main/k8s/base/install.yaml
```

Verify deployment:

```bash
kubectl get pods -n kubesense
kubectl get svc -n kubesense
```

---

#  Access the Application

Expose the frontend locally:

```bash
kubectl port-forward -n kubesense svc/kubesense-frontend-service 3000:3000
```

Open your browser:

```
http://localhost:3000
```

---

#  Default Credentials

| Username | Password |
|----------|----------|
| admin | KubeSense@123 |

---

#  Configure Gemini API

After logging in:

1. Enter your Google Gemini API Key.
2. Click **Save & Continue**.
3. Start analyzing your Kubernetes cluster.
---

#  API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/login` | User Login |
| GET | `/api/v1/pods` | List Kubernetes Pods |
| GET | `/api/v1/pods/{namespace}/{pod}` | Pod Details |
| GET | `/api/v1/pods/{namespace}/{pod}/logs` | Pod Logs |
| GET | `/api/v1/pods/{namespace}/{pod}/events` | Pod Events |
| POST | `/api/v1/analyze` | Analyze Pod |
| POST | `/api/v1/analyze-cluster` | Analyze Cluster |
| GET | `/api/v1/settings` | Get Gemini Settings |
| POST | `/api/v1/settings/gemini` | Save Gemini API Key |

---

#  CI/CD Pipeline

KubeSense uses GitHub Actions to automate the build and deployment process.

```text
Developer
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ▼
Build & Push Docker Images
    │
    ▼
Docker Hub
    │
    ▼
ArgoCD
    │
    ▼
Kubernetes Cluster
```

---

#  Deployment

KubeSense is deployed using:

- <img src="https://skillicons.dev/icons?i=docker" width="20" /> Docker
- <img src="https://skillicons.dev/icons?i=kubernetes" width="20" /> Kubernetes
- <img src="https://skillicons.dev/icons?i=githubactions" width="20" /> GitHub Actions
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/argocd/argocd-original.svg" width="20" height="20" alt="ArgoCD" /> Argo CD  
- 🌐 Ingress

---

# 🛣️ Roadmap

- ✅ AI-powered Kubernetes Troubleshooting
- ✅ Google Gemini LLM Integration
- ✅ Cluster-wide Analysis
- 🔄 Multi-Cluster Support
- 🔄 Helm Chart
- 🔄 Prometheus & Grafana Integration

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 👨‍💻 Development

If you want to contribute or customize KubeSense, follow these steps.

## Clone the Repository

```bash
git clone https://github.com/jay240322/KubeSense.git

cd KubeSense
```

---

## Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

---

## Make Your Changes

Modify the frontend, backend, or Kubernetes manifests as needed.

---

## Build and Push Docker Images

After making changes, commit and push your code.

GitHub Actions will automatically:

- Build the frontend and backend Docker images
- Push the latest images to Docker Hub

---

## Deploy the Latest Changes

Apply the updated Kubernetes manifests:

```bash
kubectl apply -f k8s/install.yaml
```

or, if you're using Kustomize:

```bash
kubectl apply -k k8s/overlays/dev
```


## Verify Deployment

```bash
kubectl get pods -n kubesense

kubectl get deployments -n kubesense
```

---

## Access the Application

```bash
kubectl port-forward -n kubesense svc/kubesense-frontend-service 3000:3000
```

Open:

```
http://localhost:3000
```

---

## Contribute

After testing your changes:

```bash
git add .

git commit -m "feat: your feature"

git push origin feature/your-feature-name
```

Create a Pull Request to merge your changes into the `develop` branch.

# 📄 License

This project is licensed under the **Apache License 2.0**.

---

<div align="center">

### ⭐ If you found KubeSense useful, consider giving this repository a star!

**Built with 👓 by Jay Patel**

</div>

"use client";

import LoginForm from "@/components/auth/LoginForm";
import "./page.css";

export default function Home() {
  return (
    <main className="login-page-container">
      <div className="login-glow-1"></div>
      <div className="login-glow-2"></div>

      <div className="login-card animate-fade-in">
        <div className="login-header">
          <h1 className="login-title">
            <i className="fa-solid fa-bolt-lightning login-logo-icon"></i> KubeSense
          </h1>

          <p className="login-subtitle">
            AI-Powered Kubernetes Troubleshooting Assistant
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
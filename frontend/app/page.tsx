"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            ⚡ KubeSense
          </h1>

          <p className="text-slate-400 mt-2">
            AI-Powered Kubernetes Troubleshooting Assistant
          </p>
        </div>

        <LoginForm />

      </div>
    </main>
  );
}
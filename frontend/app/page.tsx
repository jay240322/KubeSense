"use client";

import { useState } from "react";

import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            ⚡ KubeSense
          </h1>

          <p className="text-slate-400 mt-3">
            AI-Powered Kubernetes Troubleshooting Platform
          </p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-slate-700 mb-8">

          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
              isLogin
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 text-sm font-semibold transition-all duration-300 ${
              !isLogin
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Register
          </button>

        </div>

        <div className="animate-in fade-in duration-300">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>

      </div>
    </main>
  );
}
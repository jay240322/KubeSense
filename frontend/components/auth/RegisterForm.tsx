"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess("🎉 Account created successfully! You can now log in.");

      setUsername("");
      setEmail("");
      setPassword("");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Username
        </label>

        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Email
        </label>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Password
        </label>

        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-indigo-500"
        />
      </div>

      {success && (
        <div className="rounded-lg bg-green-500/10 border border-green-500 p-3 text-green-400">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500 p-3 text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

    </form>
  );
}
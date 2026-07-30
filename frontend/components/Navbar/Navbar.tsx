"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import GeminiApiModal from "../GeminiApiModal/GeminiApiModal";

import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>KubeSense</h2>
          <span>AI Kubernetes Assistant</span>
        </div>

        <div className="navbar-actions">
          <div className="navbar-status">
            <div className="status-dot"></div>
            <span>Connected</span>
          </div>

          {isAuthenticated && (
            <button
              className="navbar-settings-btn"
              onClick={() => setShowSettings(true)}
              aria-label="Gemini API Settings"
            >
              <i className="fa-solid fa-gear"></i>
            </button>
          )}

          {!isAuthenticated ? (
            <div className="auth-buttons">
              <Link href="/" className="auth-btn login-btn">
                <i className="fa-solid fa-right-to-bracket"></i> Login
              </Link>
            </div>
          ) : (
            <button
              className="auth-btn logout-btn"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-power-off"></i> Logout
            </button>
          )}
        </div>
      </nav>

      <GeminiApiModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSuccess={() => {}}
      />
    </>
  );
}
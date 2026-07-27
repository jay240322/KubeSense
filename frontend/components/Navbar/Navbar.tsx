"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
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

        {!isAuthenticated ? (
          <div className="auth-buttons">
            <Link href="/login" className="auth-btn login-btn">
              Login
            </Link>

            <Link href="/register" className="auth-btn signup-btn">
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            className="auth-btn logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
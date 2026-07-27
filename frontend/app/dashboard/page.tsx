"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import SearchBar from "@/components/Searchbar/Searchbar";
import PodTable from "@/components/podTable/podTable";
import PodDetails from "@/components/PodDetails/PodDetails";
import PodLogs from "@/components/PodLogs/PodLogs";
import PodEvents from "@/components/PodEvents/PodEvents";
import ClusterAnalysis from "@/components/ClusterAnalysis/ClusterAnalysis";

import usePods from "@/hooks/usePods";
import useClusterAI from "@/hooks/useClusterAI";
import useAI from "@/hooks/useAI";

import {
  getPodDetails,
  getPodLogs,
  getPodEvents,
} from "@/services/api";

import { PodDetails as PodDetailsType } from "@/types/pod";
import "./page.css";

interface Event {
  type: string;
  reason: string;
  message: string;
  time: string;
}

type ActiveView = "pod-list" | "pod-details" | "pod-logs" | "pod-events" | "pod-ai" | "cluster-analysis";

export default function Home() {
  const {
    pods,
    loading,
    error,
    refreshPods,
  } = usePods();

  const {
    analysis: clusterAnalysis,
    healthScore,
    pods: analyzedPods,
    loading: clusterLoading,
    error: clusterError,
    analyze: analyzeCluster,
  } = useClusterAI();

  const {
    analysis: podAnalysis,
    loading: podLoading,
    error: podError,
    analyze: analyzePod,
  } = useAI();

  const [activeAnalysisType, setActiveAnalysisType] = useState<"cluster" | "pod" | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>("pod-list");

  const [search, setSearch] = useState("");

  const [selectedPod, setSelectedPod] =
    useState<PodDetailsType | null>(null);

  const [logs, setLogs] = useState("");

  const [events, setEvents] = useState<Event[]>([]);

  const filteredPods = pods.filter((pod) => {
    const query = search.toLowerCase();

    return (
      pod.name.toLowerCase().includes(query) ||
      pod.namespace.toLowerCase().includes(query) ||
      pod.status.toLowerCase().includes(query)
    );
  });

  async function handleSelectPod(
    namespace: string,
    podName: string
  ) {
    try {
      const pod = await getPodDetails(namespace, podName);

      setSelectedPod(pod);
      setLogs("");
      setEvents([]);
      setActiveView("pod-details");
      if (activeAnalysisType === "pod") {
        setActiveAnalysisType(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleViewLogs(
    namespace: string,
    podName: string
  ) {
    try {
      const response = await getPodLogs(namespace, podName);

      setLogs(response.logs);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleViewEvents(
    namespace: string,
    podName: string
  ) {
    try {
      const response = await getPodEvents(namespace, podName);

      setEvents(response.events);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAnalyzePod(namespace: string, podName: string) {
    setActiveAnalysisType("pod");
    await analyzePod(namespace, podName);
  }

  function handleClosePodDetails() {
    setSelectedPod(null);
    setLogs("");
    setEvents([]);
    setActiveView("pod-list");
    if (activeAnalysisType === "pod") {
      setActiveAnalysisType(null);
    }
  }

  return (
    <>
      <Navbar />

      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Navigation</div>
            <div className="sidebar-group">
              <button
                className={`sidebar-btn ${activeView === "pod-list" ? "active" : ""}`}
                onClick={() => setActiveView("pod-list")}
              >
                📋 Pod List
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Global Actions</div>
            <div className="sidebar-group">
              <button className="sidebar-btn" onClick={refreshPods}>
                🔄 Refresh Pods
              </button>
              <button
                className={`sidebar-btn ai-btn ${activeView === "cluster-analysis" ? "active" : ""}`}
                onClick={() => {
                  setActiveView("cluster-analysis");
                  setActiveAnalysisType("cluster");
                  analyzeCluster();
                }}
                disabled={clusterLoading}
              >
                {clusterLoading ? "🤖 Analyzing..." : "🤖 Analyze Cluster"}
              </button>
            </div>
          </div>

          {selectedPod && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Pod Operations</div>
              <div className="selected-pod-card" onClick={() => setActiveView("pod-list")}>
                <div className="selected-pod-card-header">Selected Pod (Click to List)</div>
                <div className="selected-pod-name">{selectedPod.name}</div>
                <div className="selected-pod-namespace">Namespace: {selectedPod.namespace}</div>
                
                <div className="selected-pod-subgroup" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`sidebar-btn ${activeView === "pod-details" ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView("pod-details");
                    }}
                  >
                    ℹ️ Pod Details
                  </button>
                  <button
                    className={`sidebar-btn ${activeView === "pod-logs" ? "active" : ""}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setActiveView("pod-logs");
                      if (!logs) {
                        await handleViewLogs(selectedPod.namespace, selectedPod.name);
                      }
                    }}
                  >
                    📜 View Logs
                  </button>
                  <button
                    className={`sidebar-btn ${activeView === "pod-events" ? "active" : ""}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setActiveView("pod-events");
                      if (events.length === 0) {
                        await handleViewEvents(selectedPod.namespace, selectedPod.name);
                      }
                    }}
                  >
                    📅 View Events
                  </button>
                  <button
                    className={`sidebar-btn ai-btn ${activeView === "pod-ai" ? "active" : ""}`}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setActiveView("pod-ai");
                      if (!podAnalysis) {
                        await handleAnalyzePod(selectedPod.namespace, selectedPod.name);
                      }
                    }}
                    disabled={podLoading}
                  >
                    {podLoading ? "🤖 Analyzing..." : "🤖 Analyze with AI"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="main-content">
          {activeView === "pod-list" && (
            <SearchBar
              search={search}
              setSearch={setSearch}
            />
          )}

          {activeView === "cluster-analysis" && clusterAnalysis && (
            <div
              style={{
                marginBottom: "25px",
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                background: "#1f2937",
                color: "white",
              }}
            >
              <h2>🌐 Cluster Health Dashboard</h2>

              <p>
                ❤️ <strong>Health Score:</strong> {healthScore}/100
              </p>

              <p>
                📦 <strong>Pods Analyzed:</strong> {analyzedPods}
              </p>

              <p>
                🕒 <strong>Last Analysis:</strong> Just now
              </p>
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            {activeView === "pod-list" && (
              <>
                {loading && <p>Loading Pods...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                  <PodTable
                    pods={filteredPods}
                    onSelectPod={handleSelectPod}
                  />
                )}
              </>
            )}

            {activeView === "pod-details" && selectedPod && (
              <PodDetails
                pod={selectedPod}
                onClose={handleClosePodDetails}
              />
            )}

            {activeView === "pod-logs" && (
              <PodLogs
                logs={logs}
                onClose={handleClosePodDetails}
              />
            )}

            {activeView === "pod-events" && (
              <PodEvents
                events={events}
                onClose={handleClosePodDetails}
              />
            )}

            {activeView === "pod-ai" && (
              <ClusterAnalysis
                type="pod"
                analysis={podAnalysis}
                loading={podLoading}
                error={podError}
                onClose={handleClosePodDetails}
              />
            )}

            {activeView === "cluster-analysis" && (
              <ClusterAnalysis
                type="cluster"
                analysis={clusterAnalysis}
                loading={clusterLoading}
                error={clusterError}
                onClose={handleClosePodDetails}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
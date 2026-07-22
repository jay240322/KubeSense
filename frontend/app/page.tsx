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
            <div className="sidebar-section-title">Global Actions</div>
            <div className="sidebar-group">
              <button className="sidebar-btn" onClick={refreshPods}>
                🔄 Refresh Pods
              </button>
              <button
                className="sidebar-btn ai-btn"
                onClick={() => {
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
              <div className="selected-pod-card">
                <div className="selected-pod-card-header">Selected Pod</div>
                <div className="selected-pod-name">{selectedPod.name}</div>
                <div className="selected-pod-namespace">Namespace: {selectedPod.namespace}</div>
              </div>
              <div className="sidebar-group">
                <button
                  className="sidebar-btn"
                  onClick={() => handleViewLogs(selectedPod.namespace, selectedPod.name)}
                >
                  📜 View Logs
                </button>
                <button
                  className="sidebar-btn"
                  onClick={() => handleViewEvents(selectedPod.namespace, selectedPod.name)}
                >
                  📅 View Events
                </button>
                <button
                  className="sidebar-btn ai-btn"
                  onClick={() => handleAnalyzePod(selectedPod.namespace, selectedPod.name)}
                  disabled={podLoading}
                >
                  {podLoading ? "🤖 Analyzing..." : "🤖 Analyze with AI"}
                </button>
              </div>
            </div>
          )}
        </aside>

        <main className="main-content">
          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          {clusterAnalysis && (
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
            {loading && <p>Loading Pods...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && (
              <>
                <PodTable
                  pods={filteredPods}
                  onSelectPod={handleSelectPod}
                />

                <PodDetails
                  pod={selectedPod}
                  onClose={handleClosePodDetails}
                />

                {logs && (
                  <PodLogs
                    logs={logs}
                  />
                )}

                {events.length > 0 && (
                  <PodEvents
                    events={events}
                  />
                )}
              </>
            )}

            {activeAnalysisType && (
              <ClusterAnalysis
                type={activeAnalysisType}
                analysis={activeAnalysisType === "cluster" ? clusterAnalysis : podAnalysis}
                loading={activeAnalysisType === "cluster" ? clusterLoading : podLoading}
                error={activeAnalysisType === "cluster" ? clusterError : podError}
                onClose={() => setActiveAnalysisType(null)}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}
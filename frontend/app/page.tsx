"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import SearchBar from "@/components/Searchbar/Searchbar";
import RefreshButton from "@/components/Refreshbutton/Refreshbutton";
import PodTable from "@/components/podTable/podTable";
import PodDetails from "@/components/PodDetails/PodDetails";
import PodLogs from "@/components/PodLogs/PodLogs";
import PodEvents from "@/components/PodEvents/PodEvents";
import ClusterAnalysis from "@/components/ClusterAnalysis/ClusterAnalysis";

import usePods from "@/hooks/usePods";
import useClusterAI from "@/hooks/useClusterAI";

import {
  getPodDetails,
  getPodLogs,
  getPodEvents,
} from "@/services/api";

import { PodDetails as PodDetailsType } from "@/types/pod";

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

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div style={{ margin: "20px 0" }}>
          <RefreshButton onRefresh={refreshPods} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={analyzeCluster}
            disabled={clusterLoading}
          >
            {clusterLoading
              ? "🤖 Analyzing Cluster..."
              : "🤖 Analyze Entire Cluster"}
          </button>
        </div>

        {clusterAnalysis && (
          <div
            style={{
              marginBottom: "25px",
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
              onViewLogs={handleViewLogs}
              onViewEvents={handleViewEvents}
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

            <ClusterAnalysis
              analysis={clusterAnalysis}
              loading={clusterLoading}
              error={clusterError}
            />
          </>
        )}
      </div>
    </>
  );
}
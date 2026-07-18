"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import SearchBar from "@/components/Searchbar/Searchbar";
import RefreshButton from "@/components/Refreshbutton/Refreshbutton";
import PodTable from "@/components/podTable/podTable";
import PodDetails from "@/components/PodDetails/PodDetails";

import usePods from "@/hooks/usePods";
import { getPodDetails } from "@/services/api";
import { PodDetails as PodDetailsType } from "@/types/pod";

export default function Home() {
  const {
    pods,
    loading,
    error,
    refreshPods,
  } = usePods();

  const [search, setSearch] = useState("");

  const [selectedPod, setSelectedPod] =
    useState<PodDetailsType | null>(null);

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
    } catch (error) {
      console.error("Failed to fetch pod details:", error);
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

        {loading && <p>Loading Pods...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <>
            <PodTable
              pods={filteredPods}
              onSelectPod={handleSelectPod}
            />

            <PodDetails pod={selectedPod} />
          </>
        )}
      </div>
    </>
  );
}
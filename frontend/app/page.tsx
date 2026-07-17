"use client";

import Navbar from "@/components/Navbar/Navbar";
import SearchBar from "@/components/Searchbar/Searchbar";
import RefreshButton from "@/components/Refreshbutton/Refreshbutton";
import PodTable from "@/components/podTable/podTable";
import usePods from "@/hooks/usePods";

import { useState } from "react";

export default function Home() {
  const { pods,
          loading, 
          error,
          refreshPods,
         } = usePods();

  const [search, setSearch] = useState("");

  const filteredPods = pods.filter(
    (pod) =>
      pod.name.toLowerCase().includes(search.toLowerCase()) ||
      pod.namespace.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div style={{ margin: "20px 0" }}>
          <RefreshButton onRefresh={refreshPods}/>
        </div>

        {loading && <p>Loading Pods...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <PodTable pods={filteredPods} />
        )}
      </div>
    </>
  );
}
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


  const filteredPods = pods.filter((pod) => {
    const query = search.toLowerCase();

    return(
      pod.name.toLowerCase().includes(query) ||
      pod.namespace.toLowerCase().includes(query) ||
      pod.status.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navbar/>

      <div style={{ padding: "30px" }}>
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <div style={{ margin: "20px 0" }}>
          <RefreshButton onRefresh={refreshPods}/>
        </div>
        
        {loading && (
          <div style={{ marginTop: "20px" }}>
                  🔄 Loading Kubernetes Pods...
          </div>
        )}

        {error && (
            <div
              style={{
                background: "#3b0d0d",
                color: "#ffb4b4",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            >
              ❌ Unable to connect to the Kubernetes API.
              <br />
              Please verify that:
              <ul>
                <li>Backend is running</li>
                <li>Minikube is running</li>
              </ul>
            </div>
         )}

        {!loading && !error && (
          <PodTable pods={filteredPods} />
        )}
      </div>
    </>
  );
}
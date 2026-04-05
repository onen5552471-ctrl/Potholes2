import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Load jobs from localStorage
  const [jobs, setJobs] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jobs");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // SAVE jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Potholez 🚧</h1>
      <p>Report and manage pothole jobs.</p>

      <button onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
}
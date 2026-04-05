import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
async function addJob() {
  try {
    await addDoc(collection(db, "jobs"), {
      name: "Test Job",
      price: 100,
      createdAt: new Date()
    });

    alert("Saved!");
  } catch (err) {
    console.error(err);
    alert("Error saving");
  }
}
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
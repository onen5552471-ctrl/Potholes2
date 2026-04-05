import { useState, useEffect } from "react";

export default function Dashboard() {
  // LOAD jobs from localStorage
  const [jobs, setJobs] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("jobs");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");

  // SAVE jobs whenever they change
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = () => {
    if (!location || !size) {
      alert("Fill all fields");
      return;
    }

    const newJob = {
      location,
      size,
      status: "pending",
    };

    setJobs([...jobs, newJob]);

    setLocation("");
    setSize("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <br /><br />

      <button onClick={addJob}>Add Job</button>

      <h2>Jobs</h2>
      {jobs.map((job, index) => (
        <div key={index}>
          {job.location} - {job.size} - {job.status}
        </div>
      ))}
    </div>
  );
}
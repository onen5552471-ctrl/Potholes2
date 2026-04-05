import { useState } from "react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  const addJob = () => {
    const newJob = {
      id: Date.now(),
      location: "New pothole job",
      status: "Pending",
    };
    setJobs([...jobs, newJob]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard 📊</h1>

      <button onClick={addJob}>Add Job</button>

      {jobs.map((job) => (
        <div key={job.id}>
          <p>{job.location}</p>
          <p>{job.status}</p>
        </div>
      ))}
    </div>
  );
}
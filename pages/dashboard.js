import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [worker, setWorker] = useState("");
  const [location, setLocation] = useState("");

  // Load jobs
  const loadJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsArray = querySnapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
    setJobs(jobsArray);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Add job
  const addJob = async () => {
    if (!name || !price) return;

    await addDoc(collection(db, "jobs"), {
      name,
      price: Number(price),
      worker,
      location,
      completed: false,
      createdAt: new Date(),
    });

    setName("");
    setPrice("");
    setWorker("");
    setLocation("");
    loadJobs();
  };

  // Delete job
  const deleteJob = async (id) => {
    await deleteDoc(doc(db, "jobs", id));
    loadJobs();
  };

  // Toggle complete
  const toggleComplete = async (job) => {
    await updateDoc(doc(db, "jobs", job.id), {
      completed: !job.completed,
    });
    loadJobs();
  };

  // Totals
  const total = jobs.reduce((sum, j) => sum + (j.price || 0), 0);

  const today = new Date().toDateString();
  const todayTotal = jobs
    .filter((j) => new Date(j.createdAt?.seconds * 1000).toDateString() === today)
    .reduce((sum, j) => sum + (j.price || 0), 0);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Pothole Dashboard</h1>

      <h2>Total: ${total}</h2>
      <h3>Today: ${todayTotal}</h3>

      <div style={{ marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Job name"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
        />

        <input
          value={worker}
          onChange={(e) => setWorker(e.target.value)}
          placeholder="Worker"
        />

        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />

        <button onClick={addJob}>Add Job</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li
            key={job.id}
            style={{
              marginBottom: 10,
              padding: 10,
              background: job.completed ? "#d4edda" : "#f8d7da",
              borderRadius: 8,
            }}
          >
            <strong>{job.name}</strong> - ${job.price}
            <div>👷 {job.worker || "N/A"}</div>
            <div>📍 {job.location || "N/A"}</div>
            <div>
              {job.completed ? "✅ Completed" : "❌ Pending"}
            </div>

            <button onClick={() => toggleComplete(job)}>
              Toggle
            </button>

            <button onClick={() => deleteJob(job.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
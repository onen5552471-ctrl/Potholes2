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
      completed: false,
      createdAt: new Date(),
    });

    setName("");
    setPrice("");
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
  const completedTotal = jobs
    .filter((j) => j.completed)
    .reduce((sum, j) => sum + (j.price || 0), 0);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28 }}>Pothole Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        <h2>Total: ${total}</h2>
        <h3>Completed: ${completedTotal}</h3>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Job name"
          style={{ marginRight: 10, padding: 8 }}
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          style={{ marginRight: 10, padding: 8 }}
        />

        <button onClick={addJob} style={{ padding: 10 }}>
          Add Job
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => (
          <li
            key={job.id}
            style={{
              padding: 12,
              marginBottom: 10,
              background: job.completed ? "#d4edda" : "#f8d7da",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{job.name}</strong> - ${job.price}
              <div style={{ fontSize: 12 }}>
                {job.completed ? "✅ Completed" : "❌ Pending"}
              </div>
            </div>

            <div>
              <button
                onClick={() => toggleComplete(job)}
                style={{ marginRight: 8 }}
              >
                Toggle
              </button>

              <button onClick={() => deleteJob(job.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
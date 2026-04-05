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
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const snapshot = await getDocs(collection(db, "jobs"));
    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));
    setJobs(data);
  };

  const addJob = async () => {
    if (!name || !price) return;

    await addDoc(collection(db, "jobs"), {
      name,
      price: Number(price),
      worker,
      location,
      photo,
      completed: false,
      createdAt: new Date(),
    });

    setName("");
    setPrice("");
    setWorker("");
    setLocation("");
    setPhoto("");
    loadJobs();
  };

  const deleteJob = async (id) => {
    await deleteDoc(doc(db, "jobs", id));
    loadJobs();
  };

  const toggleComplete = async (job) => {
    await updateDoc(doc(db, "jobs", job.id), {
      completed: !job.completed,
    });
    loadJobs();
  };

  // 💰 totals
  const total = jobs.reduce((sum, j) => sum + (j.price || 0), 0);
  const completedTotal = jobs
    .filter((j) => j.completed)
    .reduce((sum, j) => sum + (j.price || 0), 0);

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h1>Pothole Dashboard</h1>

      <h2>Total: ${total}</h2>
      <h3>Completed: ${completedTotal}</h3>

      <div style={{ marginBottom: 15 }}>
        <input
          placeholder="Job name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: "block", marginBottom: 6 }}
        />

        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ display: "block", marginBottom: 6 }}
        />

        <input
          placeholder="Worker"
          value={worker}
          onChange={(e) => setWorker(e.target.value)}
          style={{ display: "block", marginBottom: 6 }}
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ display: "block", marginBottom: 6 }}
        />

        <input
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          style={{ display: "block", marginBottom: 6 }}
        />

        <button onClick={addJob}>Add Job</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs.map((job) => {
          return (
            <li
              key={job.id}
              style={{
                marginBottom: 10,
                padding: 10,
                borderRadius: 8,
                background: job.completed ? "#d4edda" : "#f8d7da",
              }}
            >
              <strong>{job.name}</strong> - ${job.price}

              <div>👷 {job.worker || "N/A"}</div>
              <div>📍 {job.location || "N/A"}</div>

              {job.photo && (
                <img
                  src={job.photo}
                  alt="job"
                  style={{ width: 100, marginTop: 5 }}
                />
              )}

              <div>
                {job.completed ? "✅ Completed" : "❌ Pending"}
              </div>

              <div style={{ marginTop: 8 }}>
                <button onClick={() => toggleComplete(job)}>
                  {job.completed ? "Undo" : "Complete"}
                </button>

                <button
                  onClick={() => deleteJob(job.id)}
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
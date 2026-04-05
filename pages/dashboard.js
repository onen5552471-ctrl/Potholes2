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

  const [filterWorker, setFilterWorker] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load jobs
  const loadJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "jobs"));

      const jobsArray = querySnapshot.docs
        .map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }))
        .sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });

      setJobs(jobsArray);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Add job
  const addJob = async () => {
    if (!name || !price) {
      alert("Name and price required");
      return;
    }

    try {
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
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add job");
    }
  };

  // Delete job
  const deleteJob = async (id) => {
    try {
      await deleteDoc(doc(db, "jobs", id));
      loadJobs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Toggle complete
  const toggleComplete = async (job) => {
    try {
      await updateDoc(doc(db, "jobs", job.id), {
        completed: !job.completed,
      });
      loadJobs();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Invoice
  const generateInvoice = (job) => {
    const text = `
INVOICE
--------
Job: ${job.name}
Worker: ${job.worker || "N/A"}
Location: ${job.location || "N/A"}
Price: $${job.price}
Status: ${job.completed ? "Completed" : "Pending"}
Date: ${new Date().toLocaleDateString()}
    `;
    alert(text);
  };

  // Totals
  const total = jobs.reduce((sum, j) => sum + (j.price || 0), 0);

  const completedTotal = jobs
    .filter((j) => j.completed)
    .reduce((sum, j) => sum + (j.price || 0), 0);

  const today = new Date().toDateString();
  const todayTotal = jobs
    .filter((j) =>
      j.createdAt?.seconds
        ? new Date(j.createdAt.seconds * 1000).toDateString() === today
        : false
    )
    .reduce((sum, j) => sum + (j.price || 0), 0);

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 500, margin: "auto" }}>
      <h1>Pothole Dashboard</h1>

      <h2>Total: ${total}</h2>
      <h3>Today: ${todayTotal}</h3>
      <h3>Completed: ${completedTotal}</h3>

      {/* ADD JOB */}
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

        <input
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="Photo URL"
        />

        <button onClick={addJob}>Add Job</button>
      </div>

      {/* FILTERS */}
      <div style={{ marginBottom: 15 }}>
        <input
          placeholder="Filter by worker"
          value={filterWorker}
          onChange={(e) => setFilterWorker(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* JOB LIST */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {jobs
          .filter((job) =>
            filterWorker
              ? job.worker?.toLowerCase().includes(filterWorker.toLowerCase())
              : true
          )
          .filter((job) => {
            if (filterStatus === "completed") return job.completed;
            if (filterStatus === "pending") return !job.completed;
            return true;
          })
          .map((job) => (
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

              <div style={{ marginTop: 10 }}>
                <button onClick={() => toggleComplete(job)}>
                  {job.completed ? "Undo" : "Complete"}
                </button>

                <button onClick={() => deleteJob(job.id)}>
                  Delete
                </button>

                <button onClick={() => generateInvoice(job)}>
                  Invoice
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
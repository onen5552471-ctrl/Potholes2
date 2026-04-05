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
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Load jobs
  const loadJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));

    const jobsArray = querySnapshot.docs
      .map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

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
      photo,
      completed: false,
      createdAt: new Date().toISOString(), // ✅ FIXED
    });

    setName("");
    setPrice("");
    setWorker("");
    setLocation("");
    setPhoto("");
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

  const todayTotal = jobs
    .filter((j) => {
      const jobDate = new Date(j.createdAt || 0);
      return jobDate.toDateString() === new Date().toDateString();
    })
    .reduce((sum, j) => sum + (j.price || 0), 0);

  // Worker totals
  const workerTotals = jobs.reduce((acc, job) => {
    if (!job.worker) return acc;
    acc[job.worker] = (acc[job.worker] || 0) + (job.price || 0);
    return acc;
  }, {});

  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 500, margin: "auto" }}>
      <h1>Pothole Dashboard</h1>

      <h2>Total: ${total}</h2>
      <h3>Today: ${todayTotal}</h3>
      <h3>Completed: ${completedTotal}</h3>

      <div style={{ marginBottom: 20 }}>
        <h3>Worker Earnings:</h3>
        {Object.keys(workerTotals).map((w) => (
          <div key={w}>
            {w}: ${workerTotals[w]}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Job name" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" type="number" />
        <input value={worker} onChange={(e) => setWorker(e.target.value)} placeholder="Worker" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Photo URL" />
        <button onClick={addJob}>Add Job</button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <input
          placeholder="Filter by worker"
          value={filterWorker}
          onChange={(e) => setFilterWorker(e.target.value)}
        />

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <input
          placeholder="Search job"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
        </select>
      </div>

      <ul>
        {jobs
          .filter((job) =>
            filterWorker
              ? (job.worker || "").toLowerCase().includes(filterWorker.toLowerCase())
              : true
          )
          .filter((job) => {
            if (filterStatus === "completed") return job.completed;
            if (filterStatus === "pending") return !job.completed;
            return true;
          })
          .filter((job) =>
            search
              ? job.name?.toLowerCase().includes(search.toLowerCase())
              : true
          )
          .filter((job) => {
            if (dateFilter === "today") {
              const jobDate = new Date(job.createdAt || 0);
              return jobDate.toDateString() === new Date().toDateString();
            }
            return true;
          })
          .map((job) => (
            <li key={job.id}>
              {job.name} - ${job.price} - {job.completed ? "✅" : "❌"}

              <button onClick={() => toggleComplete(job)}>Toggle</button>
              <button onClick={() => deleteJob(job.id)}>Delete</button>
              <button onClick={() => generateInvoice(job)}>Invoice</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
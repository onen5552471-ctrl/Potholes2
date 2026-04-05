import { useState, useEffect, useCallback } from “react”;
import { db } from “../firebase”;
import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc,
} from “firebase/firestore”;

export default function Dashboard() {
const [jobs, setJobs] = useState([]);
const [error, setError] = useState(””);
const [loading, setLoading] = useState(true);

const [name, setName] = useState(””);
const [price, setPrice] = useState(””);
const [worker, setWorker] = useState(””);
const [location, setLocation] = useState(””);
const [photo, setPhoto] = useState(””);

const [filterWorker, setFilterWorker] = useState(””);
const [filterStatus, setFilterStatus] = useState(“all”);
const [search, setSearch] = useState(””);
const [dateFilter, setDateFilter] = useState(“all”);

// LOAD JOBS
const loadJobs = useCallback(async () => {
try {
setLoading(true);
const querySnapshot = await getDocs(collection(db, “jobs”));
const jobsArray = querySnapshot.docs.map((docItem) => ({
id: docItem.id,
…docItem.data(),
}));
setJobs(jobsArray);
} catch (err) {
console.error(err);
setError(“Error loading jobs”);
} finally {
setLoading(false);
}
}, []);

useEffect(() => {
loadJobs();
}, [loadJobs]);

// ADD JOB
const addJob = async () => {
try {
if (!name || !price) {
alert(“Enter job name and price”);
return;
}

```
  await addDoc(collection(db, "jobs"), {
    name,
    price: Number(price),
    worker,
    location,
    photo,
    completed: false,
    createdAt: new Date().toISOString(),
  });

  alert("Job added ✅");

  setName("");
  setPrice("");
  setWorker("");
  setLocation("");
  setPhoto("");

  loadJobs();
} catch (err) {
  console.error(err);
  alert("Error adding job: " + err.message);
}
```

};

// DELETE
const deleteJob = async (id) => {
try {
await deleteDoc(doc(db, “jobs”, id));
loadJobs();
} catch (err) {
console.error(err);
setError(“Delete failed”);
}
};

// TOGGLE COMPLETE
const toggleComplete = async (job) => {
try {
await updateDoc(doc(db, “jobs”, job.id), {
completed: !job.completed,
});
loadJobs();
} catch (err) {
console.error(err);
setError(“Update failed”);
}
};

## // INVOICE
const generateInvoice = (job) => {
alert(`
INVOICE

Job: ${job.name}
Worker: ${job.worker || “N/A”}
Location: ${job.location || “N/A”}
Price: $${job.price}
Status: ${job.completed ? “Completed” : “Pending”}
Date: ${new Date().toLocaleDateString()}
`);
};

// TOTALS
const total = jobs.reduce((sum, j) => sum + Number(j.price || 0), 0);

const completedTotal = jobs
.filter((j) => j.completed)
.reduce((sum, j) => sum + Number(j.price || 0), 0);

const todayTotal = jobs
.filter((j) => {
try {
return new Date(j.createdAt).toDateString() === new Date().toDateString();
} catch {
return false;
}
})
.reduce((sum, j) => sum + Number(j.price || 0), 0);

// WORKER TOTALS
const workerTotals = jobs.reduce((acc, job) => {
if (!job.worker) return acc;
acc[job.worker] = (acc[job.worker] || 0) + Number(job.price || 0);
return acc;
}, {});

return (
<div style={{ padding: 20, fontFamily: “Arial”, maxWidth: 500, margin: “auto” }}>
<h1>Pothole Dashboard</h1>

```
  {error && <p style={{ color: "red" }}>{error}</p>}

  <h2>Total: ${total}</h2>
  <h3>Today: ${todayTotal}</h3>
  <h3>Completed: ${completedTotal}</h3>

  {/* WORKER TOTALS */}
  <div style={{ marginBottom: 20 }}>
    <h3>Worker Earnings:</h3>
    {Object.keys(workerTotals).map((w) => (
      <div key={w}>
        {w}: ${workerTotals[w]}
      </div>
    ))}
  </div>

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

  {/* SEARCH */}
  <div style={{ marginBottom: 15 }}>
    <input
      placeholder="Search job"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <select
      value={dateFilter}
      onChange={(e) => setDateFilter(e.target.value)}
    >
      <option value="all">All Time</option>
      <option value="today">Today</option>
    </select>
  </div>

  {/* LOADING */}
  {loading && <p>Loading jobs...</p>}

  {/* JOB LIST */}
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
          try {
            return new Date(job.createdAt).toDateString() === new Date().toDateString();
          } catch {
            return false;
          }
        }
        return true;
      })
      .map((job) => (
        <li key={job.id}>
          <strong>{job.name}</strong> - ${job.price}
          <div>👷 {job.worker || "N/A"}</div>
          <div>📍 {job.location || "N/A"}</div>
          {job.photo && (
            <img src={job.photo} alt="job" style={{ width: 100 }} />
          )}
          <div>{job.completed ? "✅ Completed" : "❌ Pending"}</div>
          <button onClick={() => toggleComplete(job)}>Toggle</button>
          <button onClick={() => deleteJob(job.id)}>Delete</button>
          <button onClick={() => generateInvoice(job)}>Invoice</button>
        </li>
      ))}
  </ul>
</div>
```

);
}
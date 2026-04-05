import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

export default function Home() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [jobs, setJobs] = useState([]);

  // 🔄 Load jobs
  async function loadJobs() {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setJobs(jobList);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  // ➕ Add job
  async function addJob() {
    if (!name || !price) {
      alert("Fill everything");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        name,
        price: Number(price),
        createdAt: new Date()
      });

      setName("");
      setPrice("");

      loadJobs(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  }

  // ❌ Delete job
  async function deleteJob(id) {
    await deleteDoc(doc(db, "jobs", id));
    loadJobs();
  }

  // 💰 Total revenue
  const total = jobs.reduce((sum, job) => sum + (job.price || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Pothole Dashboard</h1>

      <h2>Total: ${total}</h2>

      <input
        placeholder="Job Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={addJob}>Add Job</button>

      <hr />

      <h2>Jobs</h2>

      {jobs.map(job => (
        <div key={job.id} style={{ marginBottom: 10 }}>
          <strong>{job.name}</strong> - ${job.price}
          <button
            onClick={() => deleteJob(job.id)}
            style={{ marginLeft: 10 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
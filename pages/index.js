export const dynamic = "force-dynamic";
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
  const [cost, setCost] = useState("");
  const [customer, setCustomer] = useState("");
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
    if (!name || !price || !cost || !customer) {
      alert("Fill everything");
      return;
    }

    try {
      await addDoc(collection(db, "jobs"), {
        name,
        customer,
        price: Number(price),
        cost: Number(cost),
        profit: Number(price) - Number(cost),
        createdAt: new Date()
      });

      setName("");
      setPrice("");
      setCost("");
      setCustomer("");

      loadJobs();
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

  // 💰 Calculations
  const totalRevenue = jobs.reduce((sum, job) => sum + (job.price || 0), 0);
  const totalCost = jobs.reduce((sum, job) => sum + (job.cost || 0), 0);
  const totalProfit = jobs.reduce((sum, job) => sum + (job.profit || 0), 0);

  // 📅 Today’s jobs
  const today = new Date().toDateString();
  const todayJobs = jobs.filter(
    job => new Date(job.createdAt?.seconds * 1000).toDateString() === today
  );

  const todayTotal = todayJobs.reduce((sum, job) => sum + (job.price || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Pothole Business Dashboard</h1>

      {/* 📊 Stats */}
      <h2>Total Revenue: ${totalRevenue}</h2>
      <h3>Total Cost: ${totalCost}</h3>
      <h2>Profit: ${totalProfit}</h2>
      <h3>Today: ${todayTotal}</h3>

      <hr />

      {/* 📝 Inputs */}
      <input
        placeholder="Job Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Customer Name"
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Price ($)"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Cost ($)"
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <br /><br />

      <button onClick={addJob}>Add Job</button>

      <hr />

      {/* 📋 Job List */}
      <h2>Jobs</h2>

      {jobs.map(job => (
        <div
          key={job.id}
          style={{
            marginBottom: 15,
            padding: 10,
            border: "1px solid #ccc"
          }}
        >
          <strong>{job.name}</strong><br />
          Customer: {job.customer} <br />
          Revenue: ${job.price} <br />
          Cost: ${job.cost} <br />
          Profit: ${job.profit}

          <br />

          <button onClick={() => deleteJob(job.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
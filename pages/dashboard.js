import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const loadJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobs(jobsArray);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const addJob = async () => {
    if (!name || !price) return;

    await addDoc(collection(db, "jobs"), {
      name: name,
      price: Number(price),
      createdAt: new Date(),
    });

    setName("");
    setPrice("");
    loadJobs();
  };

  // 💰 total earnings
  const total = jobs.reduce((sum, job) => sum + (job.price || 0), 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <h2>Total: ${total}</h2>

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

      <button onClick={addJob}>Add Job</button>

      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.name} - ${job.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
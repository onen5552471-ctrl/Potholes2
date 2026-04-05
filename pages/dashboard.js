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

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const snapshot = await getDocs(collection(db, "jobs"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobs(data);
  };

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

  return (
    <div style={{ padding: 20 }}>
      <h1>Pothole Dashboard</h1>

      <input
        placeholder="Job name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={addJob}>Add Job</button>

      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.name} - ${job.price}
            <button onClick={() => toggleComplete(job)}>
              {job.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteJob(job.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
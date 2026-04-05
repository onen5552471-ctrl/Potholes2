import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
const deleteJob = async (id) => {
  await deleteDoc(doc(db, "jobs", id));
  loadJobs();
};
export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [input, setInput] = useState("");

  // Load jobs from Firebase
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

  // Add a new job
  const addJob = async () => {
    if (!input) return;

    await addDoc(collection(db, "jobs"), {
      name: input,
      createdAt: new Date(),
    });

    setInput("");
    loadJobs();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter job"
      />
      <button onClick={addJob}>Add Job</button>

   <ul>
  {jobs.map((job) => (
    <li key={job.id}>
      {job.name}
      <button onClick={() => deleteJob(job.id)}>❌</button>
    </li>
  ))}
</ul>
}
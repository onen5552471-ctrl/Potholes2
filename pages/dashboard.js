import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [input, setInput] = useState("");

  // LOAD jobs from Firebase
  useEffect(() => {
    const fetchJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsList);
    };

    fetchJobs();
  }, []);

const addJob = async () => {
  if (!jobInput) return;

  await addDoc(collection(db, "jobs"), {
    name: jobInput,
    createdAt: new Date(),
  });

  setJobInput("");
  loadJobs(); // reload after adding
};const loadJobs = async () => {
  const querySnapshot = await getDocs(collection(db, "jobs"));
  const jobsArray = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  setJobs(jobsArray);
};import { useEffect } from "react";

useEffect(() => {
  loadJobs();
}, []);
    await addDoc(collection(db, "jobs"), {
      name: input,
      createdAt: new Date()
    });

    setInput("");

    // reload jobs
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setJobs(jobsList);
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
        {jobs.map(job => (
          <li key={job.id}>{job.name}</li>
        ))}
      </ul>
    </div>
  );
}
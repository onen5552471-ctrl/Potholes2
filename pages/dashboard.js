import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");

  // LOAD jobs from Firebase
  useEffect(() => {
    const loadJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);
    };

    loadJobs();
  }, []);

  // ADD job to Firebase
  const addJob = async () => {
    if (!location || !size) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "jobs"), {
      location,
      size,
      status: "pending"
    });

    alert("Job saved!");

    // reload jobs
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setJobs(jobsData);

    setLocation("");
    setSize("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <br /><br />

      <button onClick={addJob}>Add Job</button>

      <h2>Jobs</h2>
      {jobs.map((job) => (
        <div key={job.id}>
          {job.location} - {job.size} - {job.status}
        </div>
      ))}
    </div>
  );
}
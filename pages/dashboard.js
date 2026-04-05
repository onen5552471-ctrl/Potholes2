import { useState } from "react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
const addJob = async () => {
  if (!location || !size || !price) {
    alert("Fill all fields");
    return;
  }

  await addDoc(collection(db, "jobs"), {
    location,
    size,
    price: parseFloat(price),
    status: "Pending",
  });

  alert("Job saved!");
};
  

    const newJob = {
      location,
      size,
      price: parseFloat(price),
      status: "Pending",
    };

    setJobs([...jobs, newJob]);

    setLocation("");
    setSize("");
    setPrice("");
  };

  const completeJob = (index) => {
    const updated = [...jobs];
    updated[index].status = "Completed";
    setJobs(updated);
  };

  const totalRevenue = jobs.reduce((sum, job) => sum + job.price, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <h2>Add Job</h2>
      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Size (small, medium, large)"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Price ($)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <button onClick={addJob}>Add Job</button>

      <h2>Jobs</h2>
      {jobs.map((job, index) => (
        <div key={index} style={{ marginBottom: 10 }}>
          <strong>{job.location}</strong> - {job.size} - ${job.price} - {job.status}
          <br />
          {job.status === "Pending" && (
            <button onClick={() => completeJob(index)}>Mark Complete</button>
          )}
        </div>
      ))}

      <h2>Total Revenue: ${totalRevenue}</h2>
    </div>
  );
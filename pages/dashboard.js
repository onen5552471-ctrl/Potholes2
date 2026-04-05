import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Dashboard() {
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [notes, setNotes] = useState("");

  const addJob = async () => {
    if (!location || !size) {
      alert("Fill all fields");
      return;
    }

    await addDoc(collection(db, "jobs"), {
      location,
      size,
      notes,
      status: "pending",
      createdAt: new Date()
    });

    setLocation("");
    setSize("");
    setNotes("");

    alert("Job added!");
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
        placeholder="Pothole Size"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <br /><br />

      <button onClick={addJob}>Add Job</button>
    </div>
  );
}
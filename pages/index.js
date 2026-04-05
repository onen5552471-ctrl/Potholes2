import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Home() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  async function addJob() {
    try {
      await addDoc(collection(db, "jobs"), {
        name: name,
        price: price,
        createdAt: new Date()
      });

      alert("Saved!");

      setName("");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Error saving");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Pothole Jobs</h1>

      <input
        placeholder="Job Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <button onClick={addJob}>Add Job</button>
    </div>
  );
}
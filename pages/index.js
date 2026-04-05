export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import jsPDF from "jspdf";

export default function Home() {
  const [user, setUser] = useState(null);

  // auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // job fields
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [cost, setCost] = useState("");

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  // 🔐 AUTH
  async function login() {
    const res = await signInWithEmailAndPassword(auth, email, password);
    setUser(res.user);
  }

  async function signup() {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    setUser(res.user);
  }

  function logout() {
    signOut(auth);
    setUser(null);
  }

  // 🔄 LOAD JOBS
  async function loadJobs() {
    const snapshot = await getDocs(collection(db, "jobs"));
    const list = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(job => job.userId === user.uid);

    setJobs(list);
  }

  useEffect(() => {
    if (user) loadJobs();
  }, [user]);

  // ➕ ADD JOB
  async function addJob() {
    await addDoc(collection(db, "jobs"), {
      name,
      customer,
      location,
      price: Number(price),
      cost: Number(cost),
      profit: Number(price) - Number(cost),
      createdAt: new Date(),
      userId: user.uid
    });

    setName("");
    setCustomer("");
    setLocation("");
    setPrice("");
    setCost("");

    loadJobs();
  }

  // ❌ DELETE
  async function deleteJob(id) {
    await deleteDoc(doc(db, "jobs", id));
    loadJobs();
  }

  // 🔍 FILTER
  const filtered = jobs.filter(j =>
    j.name?.toLowerCase().includes(search.toLowerCase()) ||
    j.customer?.toLowerCase().includes(search.toLowerCase())
  );

  // 💰 TOTALS
  const total = filtered.reduce((s, j) => s + j.price, 0);
  const profit = filtered.reduce((s, j) => s + j.profit, 0);

  // 📅 WEEKLY
  const weekly = filtered.filter(job => {
    const date = new Date(job.createdAt.seconds * 1000);
    const now = new Date();
    return (now - date) / (1000 * 60 * 60 * 24) <= 7;
  });

  const weeklyTotal = weekly.reduce((s, j) => s + j.price, 0);

  // 📈 CHART
  const chartData = Object.values(
    filtered.reduce((acc, job) => {
      const date = new Date(job.createdAt.seconds * 1000).toLocaleDateString();

      if (!acc[date]) acc[date] = { date, total: 0 };
      acc[date].total += job.price;

      return acc;
    }, {})
  );

  // 🧾 INVOICE
  function generateInvoice(job) {
    const doc = new jsPDF();

    doc.text("Invoice", 20, 20);
    doc.text(`Job: ${job.name}`, 20, 40);
    doc.text(`Customer: ${job.customer}`, 20, 50);
    doc.text(`Location: ${job.location}`, 20, 60);
    doc.text(`Price: $${job.price}`, 20, 70);

    doc.save(`invoice-${job.name}.pdf`);
  }

  // 🎨 STYLES
  const inputStyle = {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ddd"
  };

  const deleteBtn = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#ff3b30",
    color: "#fff",
    marginRight: 10
  };

  const invoiceBtn = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#34c759",
    color: "#fff"
  };

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>

        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />

        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={signup}>Sign Up</button>
      </div>
    );
  }

  // 📱 MAIN UI
  return (
    <div style={{
      padding: 20,
      maxWidth: 420,
      margin: "auto",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ textAlign: "center" }}<h1>IT UPDATED 🔥</h1>

      <button onClick={logout} style={{
        width: "100%",
        padding: 10,
        borderRadius: 8,
        border: "none",
        background: "#eee",
        marginBottom: 10
      }}>
        Logout
      </button>

      <div style={{
        background: "#111",
        color: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
      }}>
        <h3>Total: ${total}</h3>
        <h4>Profit: ${profit}</h4>
        <h4>7 Days: ${weeklyTotal}</h4>
      </div>

      <LineChart width={340} height={200} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" />
      </LineChart>

      <input
        placeholder="Search..."
        onChange={e => setSearch(e.target.value)}
        style={inputStyle}
      />

      <input placeholder="Job" onChange={e => setName(e.target.value)} style={inputStyle} />
      <input placeholder="Customer" onChange={e => setCustomer(e.target.value)} style={inputStyle} />
      <input placeholder="Location" onChange={e => setLocation(e.target.value)} style={inputStyle} />
      <input placeholder="Price" type="number" onChange={e => setPrice(e.target.value)} style={inputStyle} />
      <input placeholder="Cost" type="number" onChange={e => setCost(e.target.value)} style={inputStyle} />

      <button onClick={addJob} style={{
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "none",
        background: "#007aff",
        color: "#fff",
        fontWeight: "bold"
      }}>
        Add Job
      </button>

      {filtered.map(job => (
        <div key={job.id} style={{
          background: "#fff",
          padding: 15,
          borderRadius: 12,
          marginTop: 10
        }}>
          <strong>{job.name}</strong><br />
          {job.customer}<br />
          📍 {job.location}<br />
          ${job.price} | Profit: ${job.profit}

          <br />

          <button onClick={() => deleteJob(job.id)} style={deleteBtn}>
            Delete
          </button>

          <button onClick={() => generateInvoice(job)} style={invoiceBtn}>
            Invoice
          </button>
        </div>
      ))}
    </div>
  );
}
import { useRouter } from "next/router";
const [jobs, setJobs] = useState(() => {
  const saved = localStorage.getItem("jobs");
  return saved ? JSON.parse(saved) : [];
});
const [jobs, setJobs] = useState(() => {
  const saved = localStorage.getItem("jobs");
  return saved ? JSON.parse(saved) : [];
});
  return (
    <div style={{ padding: 20 }}>
      <h1>Potholez 🚧</h1>
      <p>Report and manage pothole jobs.</p>

      <button onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </button>
    </div>
  );
}
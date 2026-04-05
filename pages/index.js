import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

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
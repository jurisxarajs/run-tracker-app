import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [session, setSession] = useState(null);
  const [runs, setRuns] = useState([]);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session) {
      fetchRuns();
    } else {
      setRuns([]);
    }
  }, [session]);

  async function fetchRuns() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
  .from("runs")
  .select("*")
  .eq("user_id", session.user.id)
  .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setRuns([]);
    } else {
      setRuns(data || []);
    }

    setLoading(false);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setAuthLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Konts izveidots. Ja vajag, pārbaudi e-pastu apstiprināšanai.");
      setEmail("");
      setPassword("");
    }

    setAuthLoading(false);
  }

  async function handleSignIn(e) {
    e.preventDefault();
    setAuthLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setEmail("");
      setPassword("");
    }

    setAuthLoading(false);
  }

  async function handleSignOut() {
    setError("");
    setMessage("");
    await supabase.auth.signOut();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const { error } = await supabase.from("runs").insert([
  {
    date,
    distance,
    duration,
    notes,
    user_id: session.user.id,
  },
]);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setDate("");
    setDistance("");
    setDuration("");
    setNotes("");
    await fetchRuns();
    setSaving(false);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p>Ielādē...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Run Tracker</h1>
          <h2 style={styles.subtitle}>Pieslēgties vai reģistrēties</h2>

          <form style={styles.form}>
            <input
              type="email"
              placeholder="E-pasts"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Parole"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            <button
              type="button"
              onClick={handleSignIn}
              disabled={authLoading}
              style={styles.button}
            >
              {authLoading ? "Notiek..." : "Ieiet"}
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={authLoading}
              style={styles.buttonSecondary}
            >
              {authLoading ? "Notiek..." : "Reģistrēties"}
            </button>
          </form>

          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>Kļūda: {error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.topBar}>
          <h1 style={styles.title}>Run Tracker</h1>
          <button onClick={handleSignOut} style={styles.logoutButton}>
            Iziet
          </button>
        </div>

        <p style={styles.loggedInText}>Ielogojies kā: {session.user.email}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            style={styles.input}
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={styles.textarea}
          />

          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? "Saglabā..." : "Add Run"}
          </button>
        </form>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>Kļūda: {error}</p>}

        <h2 style={styles.subtitle}>Your Runs</h2>

        {loading ? (
          <p>Ielādē...</p>
        ) : runs.length === 0 ? (
          <p>No runs yet.</p>
        ) : (
          <div style={styles.list}>
            {runs.map((run) => (
              <div key={run.id} style={styles.runCard}>
                <p><strong>Date:</strong> {run.date}</p>
                <p><strong>Distance:</strong> {run.distance}</p>
                <p><strong>Duration:</strong> {run.duration}</p>
                <p><strong>Notes:</strong> {run.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "30px 16px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "700px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 18px rgba(0, 0, 0, 0.08)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
  },
  subtitle: {
    marginTop: "28px",
    marginBottom: "16px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minHeight: "90px",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  buttonSecondary: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#fff",
  },
  logoutButton: {
    padding: "10px 14px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    background: "#fff",
  },
  loggedInText: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#444",
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  runCard: {
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fafafa",
  },
  error: {
    color: "crimson",
    marginTop: "14px",
  },
  success: {
    color: "green",
    marginTop: "14px",
  },
};

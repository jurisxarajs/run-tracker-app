import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [runs, setRuns] = useState([]);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRuns();
  }, []);

  async function fetchRuns() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setRuns([]);
    } else {
      setRuns(data || []);
    }

    setLoading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { error } = await supabase.from("runs").insert([
      {
        date,
        distance,
        duration,
        notes,
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

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Run Tracker</h1>

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
            {saving ? "Saving..." : "Add Run"}
          </button>
        </form>

        {error && <p style={styles.error}>Error: {error}</p>}

        <h2 style={styles.subtitle}>Your Runs</h2>

        {loading ? (
          <p>Loading...</p>
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
  title: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "32px",
    textAlign: "center",
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
};

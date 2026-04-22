import React, { useState, useEffect } from "react";

const injectFonts = () => {
  if (document.getElementById("juris-fonts")) return;
  const link = document.createElement("link");
  link.id = "juris-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;600;700&display=swap";
  document.head.appendChild(link);
};

const GOAL_DATE = new Date("2030-11-26");
const STORAGE_KEY = "juris-40k-runs-v1";

const PHASES = [
  {
    id: 1,
    name: "Foundation",
    period: "2026",
    color: "#6ee7b7",
    target: "Long run: 12km",
    description: "Build consistent 1-hour Zone 2 runs. First Sigulda exploration.",
    milestones: ["4×/week consistency", "First 1-hour trail run", "Sigulda debut", "12km long run"],
  },
  {
    id: 2,
    name: "Base Building",
    period: "2027",
    color: "#b2f540",
    target: "Long run: 20km",
    description: "Introduce weekly long run. Build back-to-back easy days.",
    milestones: ["Weekly long run habit", "Back-to-back easy days", "First 3-hour outing", "20km long run"],
  },
  {
    id: 3,
    name: "Distance",
    period: "2028",
    color: "#fbbf24",
    target: "Long run: 28km",
    description: "Push long run distance. Add elevation and technical terrain.",
    milestones: ["Regular Sigulda runs", "Trail-specific strength", "First night run", "28km long run"],
  },
  {
    id: 4,
    name: "Endurance",
    period: "2029",
    color: "#f97316",
    target: "Long run: 35km",
    description: "Approach goal distance. Practice fueling. Simulation runs.",
    milestones: ["35km practice run", "Fueling strategy", "Event simulation", "35km strong"],
  },
  {
    id: 5,
    name: "Peak",
    period: "2030",
    color: "#c084fc",
    target: "40km birthday run 🎉",
    description: "Taper and execute. This is what it was all for.",
    milestones: ["Final long runs", "Taper week", "Route planning", "40km on your 40th 🔥"],
  },
];

const FEELINGS = ["😫", "😕", "😐", "🙂", "🔥"];
const RUN_TYPES = ["Easy Zone 2", "Hike-Run", "Exploration", "Long Run", "Fartlek", "Recovery"];

const C = {
  bg: "#0b160b",
  surface: "#111d11",
  card: "#182818",
  border: "#263826",
  accent: "#b2f540",
  accentDim: "#5a8020",
  text: "#dff5d0",
  muted: "#5e7a52",
  amber: "#f59e0b",
  white: "#f0f5e8",
};

const F = {
  display: "'Bebas Neue', sans-serif",
  body: "'Barlow', sans-serif",
  cond: "'Barlow Condensed', sans-serif",
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [runs, setRuns] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    distance: "",
    duration: "",
    type: "Easy Zone 2",
    notes: "",
    feeling: 3,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    injectFonts();
    loadRuns();
  }, []);

  useEffect(() => {
    if (loaded) persistRuns(runs);
  }, [runs, loaded]);

  function loadRuns() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRuns(JSON.parse(raw));
    } catch (_) {}
    setLoaded(true);
  }

  function persistRuns(r) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
    } catch (_) {}
  }

  function handleAdd() {
    if (!form.distance || !form.duration) return;

    setRuns((prev) => [
      {
        id: Date.now(),
        ...form,
        distance: parseFloat(form.distance),
        duration: parseInt(form.duration, 10),
      },
      ...prev,
    ]);

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setTab("log");
    }, 1100);

    setForm({
      date: new Date().toISOString().split("T")[0],
      distance: "",
      duration: "",
      type: "Easy Zone 2",
      notes: "",
      feeling: 3,
    });
  }

  function deleteRun(id) {
    setRuns((prev) => prev.filter((r) => r.id !== id));
  }

  const totalKm = runs.reduce((s, r) => s + r.distance, 0);
  const daysToGoal = Math.ceil((GOAL_DATE - new Date()) / 86400000);
  const year = new Date().getFullYear();
  const currentPhase = year <= 2026 ? 1 : year === 2027 ? 2 : year === 2028 ? 3 : year === 2029 ? 4 : 5;

  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        color: C.text,
        fontFamily: F.body,
        maxWidth: 430,
        margin: "0 auto",
        paddingBottom: 72,
      }}
    >
      {tab === "home" && (
        <HomeTab runs={runs} totalKm={totalKm} daysToGoal={daysToGoal} currentPhase={currentPhase} />
      )}
      {tab === "plan" && <PlanTab currentPhase={currentPhase} />}
      {tab === "log" && <LogTab runs={runs} onDelete={deleteRun} />}
      {tab === "add" && <AddTab form={form} setForm={setForm} onAdd={handleAdd} saved={saved} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

function HomeTab({ runs, totalKm, daysToGoal, currentPhase }) {
  const last = runs[0];
  const phase = PHASES[currentPhase - 1];
  const pct = Math.min(100, (totalKm / 3600) * 100);

  return (
    <div>
      <div style={{ padding: "52px 20px 20px", background: "linear-gradient(180deg,#0d2210 0%,#0b160b 100%)" }}>
        <div
          style={{
            fontFamily: F.cond,
            fontSize: 11,
            letterSpacing: 3,
            color: C.accentDim,
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          40k on your 40th
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div style={{ fontFamily: F.display, fontSize: 96, lineHeight: 1, color: C.accent }}>{daysToGoal}</div>
          <div
            style={{
              fontFamily: F.cond,
              fontSize: 15,
              color: C.muted,
              fontWeight: 600,
              paddingBottom: 10,
              lineHeight: 1.3,
            }}
          >
            days
            <br />
            to go
          </div>
        </div>
        <div style={{ marginTop: 14, height: 2, background: C.border, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: C.accent, borderRadius: 2 }} />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 5,
            fontFamily: F.cond,
            fontSize: 11,
            color: C.muted,
          }}
        >
          <span>{totalKm.toFixed(1)} km logged</span>
          <span>~3600 km journey</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 14px 12px" }}>
        {[["Runs", runs.length], ["Total KM", totalKm.toFixed(1)], ["Avg KM", runs.length ? (totalKm / runs.length).toFixed(1) : "—"]].map(
          ([label, val]) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: C.card,
                borderRadius: 10,
                padding: "12px 10px",
                border: `1px solid ${C.border}`,
              }}
            >
              <div style={{ fontFamily: F.display, fontSize: 30, color: C.white, lineHeight: 1 }}>{val}</div>
              <div
                style={{
                  fontFamily: F.cond,
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 3,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {label}
              </div>
            </div>
          )
        )}
      </div>

      <div
        style={{
          margin: "0 14px 10px",
          background: C.card,
          borderRadius: 12,
          padding: "14px",
          border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${phase.color}`,
        }}
      >
        <div
          style={{
            fontFamily: F.cond,
            fontSize: 10,
            letterSpacing: 2,
            color: C.muted,
            textTransform: "uppercase",
            marginBottom: 2,
          }}
        >
          Current Phase
        </div>
        <div style={{ fontFamily: F.display, fontSize: 24, color: phase.color }}>
          {phase.name} · {phase.period}
        </div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{phase.description}</div>
        <div
          style={{
            fontSize: 11,
            color: C.accentDim,
            marginTop: 8,
            fontFamily: F.cond,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          TARGET: {phase.target}
        </div>
      </div>

      {last ? (
        <div
          style={{
            margin: "0 14px",
            background: C.card,
            borderRadius: 12,
            padding: "14px",
            border: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              fontFamily: F.cond,
              fontSize: 10,
              letterSpacing: 2,
              color: C.muted,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Last Run
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: F.display, fontSize: 40, color: C.accent }}>{last.distance}</span>
                <span style={{ fontFamily: F.cond, fontSize: 13, color: C.muted }}>km</span>
                <span style={{ fontFamily: F.display, fontSize: 26, color: C.white, marginLeft: 8 }}>{last.duration}'</span>
              </div>
              <div style={{ fontFamily: F.cond, fontSize: 12, color: C.muted }}>
                {last.type} · {last.date}
              </div>
              {last.notes && (
                <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontStyle: "italic" }}>"{last.notes}"</div>
              )}
            </div>
            <div style={{ fontSize: 36 }}>{FEELINGS[last.feeling - 1]}</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            margin: "0 14px",
            background: C.card,
            borderRadius: 12,
            padding: "24px 14px",
            border: `1px solid ${C.border}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>🌲</div>
          <div style={{ fontFamily: F.cond, fontSize: 14, color: C.muted }}>
            No runs logged yet. The journey starts now.
          </div>
        </div>
      )}
    </div>
  );
}

function PlanTab({ currentPhase }) {
  return (
    <div style={{ padding: "52px 14px 24px" }}>
      <div style={{ fontFamily: F.display, fontSize: 48, color: C.white, lineHeight: 1 }}>THE PLAN</div>
      <div
        style={{
          fontFamily: F.cond,
          fontSize: 11,
          color: C.muted,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 22,
        }}
      >
        40k on your 40th · 2026–2030
      </div>
      {PHASES.map((phase) => {
        const isCurrent = phase.id === currentPhase;
        const isPast = phase.id < currentPhase;
        return (
          <div
            key={phase.id}
            style={{
              marginBottom: 10,
              background: isCurrent ? "#1b2e1b" : C.card,
              borderRadius: 12,
              padding: "14px",
              border: `1px solid ${isCurrent ? phase.color : C.border}`,
              opacity: isPast ? 0.55 : 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div
                  style={{
                    fontFamily: F.cond,
                    fontSize: 10,
                    letterSpacing: 2,
                    color: C.muted,
                    textTransform: "uppercase",
                  }}
                >
                  Phase {phase.id} · {phase.period}
                </div>
                <div style={{ fontFamily: F.display, fontSize: 30, color: phase.color, lineHeight: 1.1 }}>
                  {phase.name}
                </div>
              </div>
              {isCurrent && (
                <div
                  style={{
                    background: phase.color,
                    color: C.bg,
                    fontFamily: F.cond,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 4,
                    letterSpacing: 1,
                  }}
                >
                  NOW
                </div>
              )}
              {isPast && <div style={{ color: C.muted, fontSize: 18 }}>✓</div>}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{phase.description}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {phase.milestones.map((m) => (
                <div
                  key={m}
                  style={{
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 10,
                    color: C.muted,
                    fontFamily: F.cond,
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LogTab({ runs, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);

  if (!runs.length) {
    return (
      <div style={{ padding: "52px 14px", textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 48, color: C.white }}>THE LOG</div>
        <div style={{ fontSize: 40, margin: "24px 0 12px" }}>🏃</div>
        <div style={{ fontFamily: F.cond, fontSize: 15, color: C.muted }}>No runs yet. Get out there.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "52px 14px 24px" }}>
      <div style={{ fontFamily: F.display, fontSize: 48, color: C.white, lineHeight: 1 }}>THE LOG</div>
      <div
        style={{
          fontFamily: F.cond,
          fontSize: 11,
          color: C.muted,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        {runs.length} run{runs.length !== 1 ? "s" : ""} · {runs.reduce((s, r) => s + r.distance, 0).toFixed(1)} km total
      </div>
      {runs.map((run) => (
        <div
          key={run.id}
          style={{
            marginBottom: 8,
            background: C.card,
            borderRadius: 12,
            padding: "12px 14px",
            border: `1px solid ${C.border}`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: F.cond,
                  fontSize: 10,
                  color: C.muted,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                {run.date} · {run.type}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                <span style={{ fontFamily: F.display, fontSize: 34, color: C.accent }}>{run.distance}</span>
                <span style={{ fontFamily: F.cond, fontSize: 12, color: C.muted }}>km</span>
                <span style={{ fontFamily: F.display, fontSize: 22, color: C.white, marginLeft: 6 }}>{run.duration}</span>
                <span style={{ fontFamily: F.cond, fontSize: 12, color: C.muted }}>min</span>
                <span style={{ fontSize: 18, marginLeft: 6 }}>{FEELINGS[run.feeling - 1]}</span>
              </div>
              {run.notes && (
                <div style={{ fontSize: 11, color: C.muted, marginTop: 3, fontStyle: "italic" }}>"{run.notes}"</div>
              )}
            </div>
            <button
              onClick={() => setConfirmId(run.id)}
              style={{
                background: "none",
                border: "none",
                color: C.muted,
                fontSize: 20,
                cursor: "pointer",
                paddingLeft: 12,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          {confirmId === run.id && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  onDelete(run.id);
                  setConfirmId(null);
                }}
                style={{
                  flex: 1,
                  background: "#3a0e0e",
                  border: "1px solid #7a2020",
                  borderRadius: 8,
                  color: "#f87171",
                  fontFamily: F.cond,
                  fontSize: 13,
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmId(null)}
                style={{
                  flex: 1,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.muted,
                  fontFamily: F.cond,
                  fontSize: 13,
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AddTab({ form, setForm, onAdd, saved }) {
  const inp = {
    width: "100%",
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    color: C.text,
    fontFamily: F.body,
    fontSize: 16,
    padding: "12px 14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const lbl = {
    fontFamily: F.cond,
    fontSize: 10,
    letterSpacing: 2,
    color: C.muted,
    textTransform: "uppercase",
    marginBottom: 5,
    display: "block",
  };

  return (
    <div style={{ padding: "52px 14px 24px" }}>
      <div style={{ fontFamily: F.display, fontSize: 48, color: C.white, lineHeight: 1 }}>LOG RUN</div>
      <div
        style={{
          fontFamily: F.cond,
          fontSize: 11,
          color: C.muted,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 22,
        }}
      >
        Every km counts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={lbl}>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            style={{ ...inp, colorScheme: "dark" }}
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Distance (km)</label>
            <input
              type="number"
              step="0.1"
              placeholder="8.4"
              value={form.distance}
              onChange={(e) => setForm((f) => ({ ...f, distance: e.target.value }))}
              style={inp}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Duration (min)</label>
            <input
              type="number"
              placeholder="42"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              style={inp}
            />
          </div>
        </div>

        <div>
          <label style={lbl}>Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            style={{ ...inp, cursor: "pointer" }}
          >
            {RUN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={lbl}>How did it feel?</label>
          <div style={{ display: "flex", gap: 6 }}>
            {FEELINGS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setForm((f) => ({ ...f, feeling: i + 1 }))}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: form.feeling === i + 1 ? "#2a4a10" : C.surface,
                  border: `1px solid ${form.feeling === i + 1 ? C.accent : C.border}`,
                  borderRadius: 10,
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={lbl}>Notes</label>
          <textarea
            placeholder="Ankles good. Roots slippery after rain..."
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={3}
            style={{ ...inp, resize: "none" }}
          />
        </div>

        <button
          onClick={onAdd}
          disabled={!form.distance || !form.duration}
          style={{
            background: saved ? "#22c55e" : C.accent,
            color: C.bg,
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontFamily: F.display,
            fontSize: 26,
            cursor: form.distance && form.duration ? "pointer" : "not-allowed",
            opacity: form.distance && form.duration ? 1 : 0.45,
            transition: "background 0.3s",
          }}
        >
          {saved ? "✓ SAVED" : "SAVE RUN"}
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", label: "HOME", icon: "◈" },
    { id: "plan", label: "PLAN", icon: "▤" },
    { id: "log", label: "LOG", icon: "≡" },
    { id: "add", label: "ADD", icon: "+" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        background: "#0e1b0e",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        zIndex: 100,
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          style={{
            flex: 1,
            padding: "10px 4px 14px",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div style={{ fontSize: item.id === "add" ? 24 : 16, color: tab === item.id ? C.accent : C.muted, lineHeight: 1 }}>
            {item.icon}
          </div>
          <div
            style={{
              fontFamily: F.cond,
              fontSize: 9,
              letterSpacing: 1.5,
              color: tab === item.id ? C.accent : C.muted,
              textTransform: "uppercase",
            }}
          >
            {item.label}
          </div>
        </button>
      ))}
    </div>
  );
}

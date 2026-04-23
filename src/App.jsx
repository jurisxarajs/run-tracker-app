import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const responsiveCss = `
  @media (max-width: 1080px) {
.runology-stats-grid {
  grid-template-columns: 1fr !important;
    }
    .runology-auth-shell {
      grid-template-columns: 1fr !important;
      min-height: auto !important;
    }

    .runology-main-grid {
      grid-template-columns: 1fr !important;
    }

    .runology-form-card {
      position: static !important;
      top: auto !important;
    }

    .runology-auth-card-inner {
      margin-top: 0 !important;
    }
  }

  @media (max-width: 768px) {
  .runology-stats-grid {
  grid-template-columns: 1fr !important;
} 
    .runology-page {
      padding: 14px !important;
    }

    .runology-brand-panel,
    .runology-auth-card,
    .runology-header,
    .runology-form-card,
    .runology-list-card,
    .runology-loading-card {
      border-radius: 20px !important;
    }

    .runology-brand-panel {
      min-height: auto !important;
      padding: 28px !important;
    }

    .runology-auth-card {
      padding: 28px !important;
    }

    .runology-brand-title {
      font-size: 46px !important;
    }

    .runology-auth-title {
      font-size: 28px !important;
    }

    .runology-header {
      padding: 22px !important;
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .runology-header-actions {
      justify-content: space-between !important;
    }

    .runology-app-title {
      font-size: 28px !important;
    }

    .runology-main-grid {
      gap: 18px !important;
    }

    .runology-form-card,
    .runology-list-card {
      padding: 22px !important;
    }

    .runology-run-info-row {
      grid-template-columns: 1fr !important;
    }

    .runology-auth-topbar-desktop {
      display: none !important;
    }

    .runology-auth-topbar-mobile {
      display: flex !important;
    }
  }

  @media (max-width: 480px) {
    .runology-page {
      padding: 10px !important;
    }

    .runology-brand-title {
      font-size: 38px !important;
    }

    .runology-app-title {
      font-size: 24px !important;
    }

    .runology-section-title {
      font-size: 22px !important;
    }

    .runology-run-card {
      padding: 16px !important;
    }

    .runology-run-date {
      font-size: 16px !important;
    }

    .runology-input,
    .runology-textarea,
    .runology-primary-button,
    .runology-secondary-button,
    .runology-cancel-button,
    .runology-link-button {
      font-size: 15px !important;
    }

    .runology-header-actions {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .runology-logout-button {
      width: 100% !important;
    }

    .runology-language-switch {
      align-self: flex-start !important;
    }

    .runology-form-actions {
      grid-template-columns: 1fr !important;
    }

    .runology-run-action-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .runology-emoji-row {
      gap: 8px !important;
    }

    .runology-emoji-button {
      min-width: 44px !important;
      min-height: 44px !important;
    }
  }
`;

function formatSupabaseError(errorMessage, language) {
  if (!errorMessage) return "";

  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("email rate limit exceeded")) {
    return language === "lv"
      ? "Pārāk daudz mēģinājumu. Lūdzu, pagaidi un mēģini vēlreiz vēlāk."
      : "Too many attempts. Please wait and try again later.";
  }

  if (normalized.includes("invalid login credentials")) {
    return language === "lv"
      ? "Nepareizs e-pasts vai parole."
      : "Incorrect email or password.";
  }

  if (normalized.includes("user already registered")) {
    return language === "lv"
      ? "Šāds lietotājs jau ir reģistrēts."
      : "This user is already registered.";
  }

  if (normalized.includes("password should be at least")) {
    return language === "lv"
      ? "Parole ir pārāk īsa."
      : "Password is too short.";
  }

  if (normalized.includes("same password")) {
    return language === "lv"
      ? "Jaunā parole nedrīkst būt tāda pati kā iepriekšējā."
      : "The new password must be different from the old one.";
  }

  return errorMessage;
}

function LanguageSwitcher({ language, onChange, dark = false }) {
  const wrapperStyle = dark
    ? {
        ...styles.languageSwitch,
        background: "transparent",
        border: "1px solid #545047",
      }
    : styles.languageSwitch;

  const buttonBase = dark
    ? {
        ...styles.languageButton,
        color: "#b8aa95",
      }
    : styles.languageButton;

  const activeButtonStyle = dark
    ? {
        ...styles.languageButtonActive,
        color: "#ffffff",
      }
    : styles.languageButtonActive;

  return (
    <div className="runology-language-switch" style={wrapperStyle}>
      <button
        type="button"
        onClick={() => onChange("lv")}
        style={language === "lv" ? activeButtonStyle : buttonBase}
      >
        LV
      </button>
      <button
        type="button"
        onClick={() => onChange("en")}
        style={language === "en" ? activeButtonStyle : buttonBase}
      >
        EN
      </button>
    </div>
  );
}

function EmojiPicker({ options, value, onChange }) {
  return (
    <div className="runology-emoji-row" style={styles.emojiRow}>
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className="runology-emoji-button"
            onClick={() => onChange(option.value)}
            style={isActive ? styles.emojiButtonActive : styles.emojiButton}
            title={option.label}
            aria-label={option.label}
          >
            <span style={styles.emojiIcon}>{option.emoji}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [runs, setRuns] = useState([]);
  const [date, setDate] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("🙂");
  const [weather, setWeather] = useState("☀️");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [runsLoading, setRunsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [updatePasswordLoading, setUpdatePasswordLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingRunId, setEditingRunId] = useState(null);
  const [authMode, setAuthMode] = useState("choose");
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "lv";
    const saved = window.localStorage.getItem("runology-language");
    return saved === "en" ? "en" : "lv";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!document.getElementById("runology-responsive-styles")) {
      const styleTag = document.createElement("style");
      styleTag.id = "runology-responsive-styles";
      styleTag.innerHTML = responsiveCss;
      document.head.appendChild(styleTag);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("runology-language", language);
    }
  }, [language]);

  const text = useMemo(() => {
    const translations = {
      lv: {
        brand: "RUNOLOGY",
        loadingApp: "Ielādē aplikāciju...",
        heroTitle: "Tavs skriešanas žurnāls.",
        heroText:
          "Bez līderu tabulām. Bez sociālā spiediena. Tikai tu, tavi skrējieni un tas, kā tu juties.",
        feature1: "Sinhronizācija mākonī — jebkura ierīce, jebkurā laikā",
        feature2: "Privāti — tavi dati ir tikai tavējie",
        feature3: "Sajūta, laikapstākļi un brīvas piezīmes",
        authTitle: "Turpināt",
        authSubtitle: "Izvēlies, ko vēlies darīt.",
        resetTitle: "Atjaunot paroli",
        resetSubtitle:
          "Ievadi savu e-pastu, un mēs nosūtīsim paroles atjaunošanas saiti.",
        updatePasswordTitle: "Iestatīt jaunu paroli",
        updatePasswordSubtitle:
          "Ievadi jauno paroli, lai pabeigtu paroles maiņu.",
        email: "E-pasts",
        emailPlaceholder: "piemers@gmail.com",
        password: "Parole",
        passwordPlaceholder: "Tava parole",
        newPassword: "Jaunā parole",
        newPasswordPlaceholder: "Ievadi jauno paroli",
        confirmPassword: "Atkārto jauno paroli",
        confirmPasswordPlaceholder: "Ievadi to pašu paroli vēlreiz",
        passwordsDoNotMatch: "Paroles nesakrīt.",
        signIn: "Ieiet",
        signUp: "Izveidot kontu",
        signing: "Notiek...",
        signUpSuccess:
          "Konts izveidots. Pārbaudi e-pastu un apstiprini reģistrāciju.",
        signInSuccess: "Veiksmīgi ielogojies.",
        forgotPassword: "Aizmirsu paroli?",
        sendReset: "Nosūtīt atjaunošanas saiti",
        resetSending: "Sūta...",
        resetSuccess:
          "Paroles atjaunošanas e-pasts nosūtīts. Pārbaudi savu pastkasti.",
        backToLogin: "Atpakaļ",
        updatePasswordButton: "Saglabāt jauno paroli",
        updatingPassword: "Saglabā...",
        updatePasswordSuccess:
          "Parole nomainīta. Tagad vari ieiet ar jauno paroli.",
        headerTitle: "Tavi skrējieni vienuviet",
        loggedInAs: "Ielogojies kā",
        logout: "Iziet",
        addRunTitle: "Pievienot skrējienu",
        editRunTitle: "Labot skrējienu",
        addRunText: "Saglabā savu nākamo aktivitāti.",
        editRunText: "Maini izvēlētā ieraksta datus un saglabā izmaiņas.",
        date: "Datums",
        distance: "Distance (km)",
        distancePlaceholder: "Piemēram, 5",
        duration: "Ilgums (min)",
        durationPlaceholder: "Piemēram, 28",
        pace: "Temps",
        mood: "Sajūta",
        weather: "Laikapstākļi",
        notes: "Piezīmes",
        notesPlaceholder: "Tīras piezīmes par skrējienu.",
        saveRun: "Saglabāt skrējienu",
        saveChanges: "Saglabāt izmaiņas",
        cancelEdit: "Atcelt",
        saving: "Saglabā...",
        saveSuccess: "Skrējiens saglabāts.",
        updateSuccess: "Izmaiņas saglabātas.",
        deleteRun: "Dzēst",
        editRun: "Labot",
        deleteSuccess: "Skrējiens izdzēsts.",
        confirmDelete: "Vai tiešām dzēst šo ierakstu?",
        runsTitle: "Mani skrējieni",
        runsText: "Šeit redzi tikai savus ierakstus.",
        loadingRuns: "Ielādē skrējienus...",
        noRuns: "Vēl nav neviena skrējiena. Pievieno pirmo ierakstu.",
        noNotes: "Nav piezīmju.",
        mustLogin: "Tev vispirms jāielogojas.",
        invalidPace: "Ievadi distance un ilgumu, lai redzētu tempu.",
        errorPrefix: "Kļūda",
        distanceLabel: "Distance",
        durationLabel: "Ilgums",
        paceLabel: "Temps",
        notesLabel: "Piezīmes",
      },
      en: {
        brand: "RUNOLOGY",
        loadingApp: "Loading app...",
        heroTitle: "Your running journal.",
        heroText:
          "No leaderboards. No social pressure. Just you, your runs, and how they made you feel.",
        feature1: "Cloud sync — any device, any time",
        feature2: "Private — your data is yours only",
        feature3: "Mood, weather, and free-form notes",
        authTitle: "Continue",
        authSubtitle: "Choose what you want to do.",
        resetTitle: "Reset password",
        resetSubtitle:
          "Enter your email and we will send you a password reset link.",
        updatePasswordTitle: "Set new password",
        updatePasswordSubtitle:
          "Enter your new password to finish the password change.",
        email: "Email",
        emailPlaceholder: "you@example.com",
        password: "Password",
        passwordPlaceholder: "Your password",
        newPassword: "New password",
        newPasswordPlaceholder: "Enter new password",
        confirmPassword: "Confirm new password",
        confirmPasswordPlaceholder: "Enter the same password again",
        passwordsDoNotMatch: "Passwords do not match.",
        signIn: "Sign in",
        signUp: "Create account",
        signing: "Please wait...",
        signUpSuccess:
          "Account created. Check your email and confirm your registration.",
        signInSuccess: "Signed in successfully.",
        forgotPassword: "Forgot password?",
        sendReset: "Send reset link",
        resetSending: "Sending...",
        resetSuccess: "Password reset email sent. Check your inbox.",
        backToLogin: "Back",
        updatePasswordButton: "Save new password",
        updatingPassword: "Saving...",
        updatePasswordSuccess:
          "Password changed. You can now sign in with your new password.",
        headerTitle: "All your runs in one place",
        loggedInAs: "Logged in as",
        logout: "Log out",
        addRunTitle: "Add run",
        editRunTitle: "Edit run",
        addRunText: "Save your next activity.",
        editRunText: "Update the selected entry and save your changes.",
        date: "Date",
        distance: "Distance (km)",
        distancePlaceholder: "For example, 5",
        duration: "Duration (min)",
        durationPlaceholder: "For example, 28",
        pace: "Pace",
        mood: "Feeling",
        weather: "Weather",
        notes: "Notes",
        notesPlaceholder: "Only notes about the run.",
        saveRun: "Save run",
        saveChanges: "Save changes",
        cancelEdit: "Cancel",
        saving: "Saving...",
        saveSuccess: "Run saved.",
        updateSuccess: "Changes saved.",
        deleteRun: "Delete",
        editRun: "Edit",
        deleteSuccess: "Run deleted.",
        confirmDelete: "Are you sure you want to delete this entry?",
        runsTitle: "My runs",
        runsText: "Only your own entries are shown here.",
        loadingRuns: "Loading runs...",
        noRuns: "No runs yet. Add your first entry.",
        noNotes: "No notes.",
        mustLogin: "You must sign in first.",
        invalidPace: "Enter distance and duration to see pace.",
        errorPrefix: "Error",
        distanceLabel: "Distance",
        durationLabel: "Duration",
        paceLabel: "Pace",
        notesLabel: "Notes",
      },
    };

    return translations[language];
  }, [language]);

  const moodOptions = useMemo(
    () => [
      { value: "😄", emoji: "😄", label: language === "lv" ? "Lieliski" : "Great" },
      { value: "🙂", emoji: "🙂", label: language === "lv" ? "Labi" : "Good" },
      { value: "😐", emoji: "😐", label: language === "lv" ? "Neitrāli" : "Okay" },
      { value: "😓", emoji: "😓", label: language === "lv" ? "Grūti" : "Tough" },
      { value: "🥵", emoji: "🥵", label: language === "lv" ? "Ļoti grūti" : "Very hard" },
    ],
    [language]
  );

  const weatherOptions = useMemo(
    () => [
      { value: "☀️", emoji: "☀️", label: language === "lv" ? "Saulains" : "Sunny" },
      { value: "⛅", emoji: "⛅", label: language === "lv" ? "Mainīgs" : "Partly cloudy" },
      { value: "☁️", emoji: "☁️", label: language === "lv" ? "Mākoņains" : "Cloudy" },
      { value: "🌧️", emoji: "🌧️", label: language === "lv" ? "Lietus" : "Rain" },
      { value: "💨", emoji: "💨", label: language === "lv" ? "Vējains" : "Windy" },
    ],
    [language]
  );

const stats = useMemo(() => {
  const totalRuns = runs.length;

  const totalDistance = runs.reduce((sum, run) => {
    const value = parseFloat(String(run.distance).replace(",", "."));
    return Number.isNaN(value) ? sum : sum + value;
  }, 0);

  const totalDuration = runs.reduce((sum, run) => {
    const value = parseFloat(String(run.duration).replace(",", "."));
    return Number.isNaN(value) ? sum : sum + value;
  }, 0);

  let averagePace = text.invalidPace;

  if (totalDistance > 0 && totalDuration > 0) {
    const totalMinutesPerKm = totalDuration / totalDistance;
    let minutes = Math.floor(totalMinutesPerKm);
    let seconds = Math.round((totalMinutesPerKm - minutes) * 60);

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    averagePace = `${minutes}:${String(seconds).padStart(2, "0")} / km`;
  }

  return {
    totalRuns,
    totalDistance: totalDistance.toFixed(2),
    averagePace,
  };
}, [runs, text.invalidPace]);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash || "" : "";
    if (hash.includes("type=recovery")) {
      setAuthMode("updatePassword");
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setPageLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession || null);

      if (event === "PASSWORD_RECOVERY") {
        setAuthMode("updatePassword");
        setMessage("");
        setError("");
      }

      setPageLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session && authMode !== "updatePassword") {
      fetchRuns();
    } else if (!session) {
      setRuns([]);
    }
  }, [session, authMode]);

  async function fetchRuns() {
    if (!session) return;

    setRunsLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(formatSupabaseError(error.message, language));
      setRuns([]);
    } else {
      setRuns(data || []);
    }

    setRunsLoading(false);
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
      setError(formatSupabaseError(error.message, language));
    } else {
      setMessage(text.signUpSuccess);
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
      setError(formatSupabaseError(error.message, language));
    } else {
      setMessage(text.signInSuccess);
      setEmail("");
      setPassword("");
    }

    setAuthLoading(false);
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setError(formatSupabaseError(error.message, language));
      setResetLoading(false);
      return;
    }

    setMessage(text.resetSuccess);
    setResetLoading(false);
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    setUpdatePasswordLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmNewPassword) {
      setError(text.passwordsDoNotMatch);
      setUpdatePasswordLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(formatSupabaseError(error.message, language));
      setUpdatePasswordLoading(false);
      return;
    }

    setMessage(text.updatePasswordSuccess);
    setNewPassword("");
    setConfirmNewPassword("");
    setAuthMode("choose");
    setUpdatePasswordLoading(false);
  }

  async function handleSignOut() {
    setError("");
    setMessage("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(formatSupabaseError(error.message, language));
    }
  }

  function resetForm() {
    setDate("");
    setDistance("");
    setDuration("");
    setNotes("");
    setMood("🙂");
    setWeather("☀️");
    setEditingRunId(null);
  }

  function handleStartEdit(run) {
    setEditingRunId(run.id);
    setDate(run.date || "");
    setDistance(run.distance != null ? String(run.distance) : "");
    setDuration(run.duration != null ? String(run.duration) : "");
    setNotes(run.notes || "");
    setMood(run.mood || "🙂");
    setWeather(run.weather || "☀️");
    setMessage("");
    setError("");

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!session) {
      setError(text.mustLogin);
      return;
    }

    const parsedDistance = parseFloat(String(distance).replace(",", "."));
    const parsedDuration = parseFloat(String(duration).replace(",", "."));

    if (
      Number.isNaN(parsedDistance) ||
      Number.isNaN(parsedDuration) ||
      parsedDistance <= 0 ||
      parsedDuration <= 0
    ) {
      setError(text.invalidPace);
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

 if (editingRunId) {
  const payload = {
    date,
    distance: String(parsedDistance),
    duration: String(parsedDuration),
    notes: String(notes),
    mood,
    weather,
  };

  const { data, error } = await supabase
    .from("runs")
    .update(payload)
    .eq("id", editingRunId)
    .eq("user_id", session.user.id)
    .select();

  console.log("UPDATE RESULT DATA:", data);
  console.log("UPDATE RESULT ERROR:", error);

  if (error) {
    setError(formatSupabaseError(error.message, language));
    setSaving(false);
    return;
  }

  setMessage(text.updateSuccess);
  resetForm();
  await fetchRuns();
  setSaving(false);
  return;
}

    const { error } = await supabase.from("runs").insert([
      {
        date,
        distance: parsedDistance,
        duration: parsedDuration,
        notes,
        mood,
        weather,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      setError(formatSupabaseError(error.message, language));
      setSaving(false);
      return;
    }

    resetForm();
    setMessage(text.saveSuccess);
    await fetchRuns();
    setSaving(false);
  }

  async function handleDelete(runId) {
    if (!session) return;

    const confirmed = window.confirm(text.confirmDelete);

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const { error } = await supabase
      .from("runs")
      .delete()
      .eq("id", runId)
      .eq("user_id", session.user.id);

    if (error) {
      setError(formatSupabaseError(error.message, language));
      return;
    }

    if (editingRunId === runId) {
      resetForm();
    }

    setMessage(text.deleteSuccess);
    await fetchRuns();
  }

  function formatDate(value) {
    if (!value) return "-";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString(language === "lv" ? "lv-LV" : "en-GB");
  }

  function formatPace(distanceValue, durationValue) {
    const distanceNum = parseFloat(String(distanceValue).replace(",", "."));
    const durationNum = parseFloat(String(durationValue).replace(",", "."));

    if (!distanceNum || !durationNum || distanceNum <= 0 || durationNum <= 0) {
      return text.invalidPace;
    }

    const totalMinutesPerKm = durationNum / distanceNum;
    let minutes = Math.floor(totalMinutesPerKm);
    let seconds = Math.round((totalMinutesPerKm - minutes) * 60);

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")} / km`;
  }

  function toggleLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setMessage("");
    setError("");
  }

  function goToSignInMode() {
    setAuthMode("login");
    setMessage("");
    setError("");
    setPassword("");
  }

  function goToSignUpMode() {
    setAuthMode("signup");
    setMessage("");
    setError("");
    setPassword("");
  }

  function goToResetMode() {
    setAuthMode("reset");
    setMessage("");
    setError("");
    setPassword("");
  }

  function goToLoginMode() {
    setAuthMode("choose");
    setMessage("");
    setError("");
    setNewPassword("");
    setConfirmNewPassword("");
  }

  if (pageLoading) {
    return (
      <div className="runology-page" style={styles.page}>
        <div style={styles.centerWrap}>
          <div className="runology-loading-card" style={styles.loadingCard}>
            <div className="runology-loading-topbar" style={styles.loadingTopBar}>
              <LanguageSwitcher language={language} onChange={toggleLanguage} dark />
            </div>
            <div style={styles.logoCircle}>R</div>
            <h1 style={styles.loadingTitle}>Runology</h1>
            <p style={styles.loadingText}>{text.loadingApp}</p>
          </div>
        </div>
      </div>
    );
  }

  if (authMode === "updatePassword") {
    return (
      <div className="runology-page" style={styles.page}>
        <div style={styles.centerWrap}>
          <div
            className="runology-auth-card"
            style={{ ...styles.authCard, maxWidth: "560px", width: "100%" }}
          >
            <div
              className="runology-auth-topbar-mobile"
              style={{ ...styles.authCardTopBar, display: "flex" }}
            >
              <LanguageSwitcher language={language} onChange={toggleLanguage} dark />
            </div>

            <div style={styles.authHeader}>
              <h2 className="runology-auth-title" style={styles.authTitle}>
                {text.updatePasswordTitle}
              </h2>
              <p style={styles.authSubtitle}>{text.updatePasswordSubtitle}</p>
            </div>

            <form onSubmit={handleUpdatePassword} style={styles.form}>
              <label style={styles.label}>{text.newPassword}</label>
              <input
                className="runology-input"
                type="password"
                placeholder={text.newPasswordPlaceholder}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>{text.confirmPassword}</label>
              <input
                className="runology-input"
                type="password"
                placeholder={text.confirmPasswordPlaceholder}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                style={styles.input}
              />

              <button
                className="runology-primary-button"
                type="submit"
                disabled={updatePasswordLoading}
                style={styles.primaryButton}
              >
                {updatePasswordLoading
                  ? text.updatingPassword
                  : text.updatePasswordButton}
              </button>

              <button
                className="runology-link-button"
                type="button"
                onClick={goToLoginMode}
                style={styles.linkButton}
              >
                {text.backToLogin}
              </button>
            </form>

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{text.errorPrefix}: {error}</div>}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="runology-page" style={styles.page}>
        <div className="runology-auth-shell" style={styles.authShell}>
          <div className="runology-brand-panel" style={styles.brandPanel}>
            <div style={styles.brandBadge}>{text.brand}</div>

            <div style={styles.brandContent}>
              <h1 className="runology-brand-title" style={styles.brandTitle}>
                {text.heroTitle}
              </h1>

              <p style={styles.brandText}>{text.heroText}</p>

              <div style={styles.featureList}>
                <div style={styles.featureBulletRow}>
                  <span style={styles.featureDot} />
                  <span style={styles.featureBulletText}>{text.feature1}</span>
                </div>

                <div style={styles.featureBulletRow}>
                  <span style={styles.featureDot} />
                  <span style={styles.featureBulletText}>{text.feature2}</span>
                </div>

                <div style={styles.featureBulletRow}>
                  <span style={styles.featureDot} />
                  <span style={styles.featureBulletText}>{text.feature3}</span>
                </div>
              </div>
            </div>

            <div style={styles.brandFooter}>runology.fit</div>
          </div>

          <div className="runology-auth-card" style={styles.authCard}>
            <div
              className="runology-auth-topbar-mobile"
              style={styles.authCardTopBar}
            >
              <LanguageSwitcher language={language} onChange={toggleLanguage} dark />
            </div>

            <div
              className="runology-auth-topbar-desktop"
              style={styles.authDesktopTopBar}
            >
              <LanguageSwitcher language={language} onChange={toggleLanguage} dark />
            </div>

            <div
              className="runology-auth-card-inner"
              style={styles.authCardInner}
            >
              <div style={styles.authHeader}>
                <h2 className="runology-auth-title" style={styles.authTitle}>
                  {authMode === "reset"
                    ? text.resetTitle
                    : authMode === "signup"
                    ? text.signUp
                    : authMode === "login"
                    ? text.signIn
                    : text.authTitle}
                </h2>

                <p style={styles.authSubtitle}>
                  {authMode === "reset"
                    ? text.resetSubtitle
                    : authMode === "signup"
                    ? language === "lv"
                      ? "Ievadi e-pastu un paroli, lai izveidotu kontu."
                      : "Enter your email and password to create an account."
                    : authMode === "login"
                    ? language === "lv"
                      ? "Ievadi e-pastu un paroli, lai ieietu."
                      : "Enter your email and password to sign in."
                    : text.authSubtitle}
                </p>
              </div>

              {authMode === "choose" ? (
                <div style={styles.form}>
                  <button
                    className="runology-primary-button"
                    type="button"
                    onClick={goToSignInMode}
                    style={styles.primaryButton}
                  >
                    {text.signIn}
                  </button>

                  <button
                    className="runology-secondary-button"
                    type="button"
                    onClick={goToSignUpMode}
                    style={styles.secondaryButton}
                  >
                    {text.signUp}
                  </button>
                </div>
              ) : authMode === "reset" ? (
                <form onSubmit={handlePasswordReset} style={styles.form}>
                  <label style={styles.label}>{text.email}</label>
                  <input
                    className="runology-input"
                    type="email"
                    placeholder={text.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />

                  <button
                    className="runology-primary-button"
                    type="submit"
                    disabled={resetLoading}
                    style={styles.primaryButton}
                  >
                    {resetLoading ? text.resetSending : text.sendReset}
                  </button>

                  <button
                    className="runology-link-button"
                    type="button"
                    onClick={goToLoginMode}
                    style={styles.linkButton}
                  >
                    {text.backToLogin}
                  </button>
                </form>
              ) : authMode === "login" ? (
                <form style={styles.form}>
                  <label style={styles.label}>{text.email}</label>
                  <input
                    className="runology-input"
                    type="email"
                    placeholder={text.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />

                  <label style={styles.label}>{text.password}</label>
                  <input
                    className="runology-input"
                    type="password"
                    placeholder={text.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />

                  <button
                    className="runology-primary-button"
                    type="button"
                    onClick={handleSignIn}
                    disabled={authLoading}
                    style={styles.primaryButton}
                  >
                    {authLoading ? text.signing : text.signIn}
                  </button>

                  <button
                    className="runology-link-button"
                    type="button"
                    onClick={goToResetMode}
                    style={styles.linkButton}
                  >
                    {text.forgotPassword}
                  </button>

                  <button
                    className="runology-link-button"
                    type="button"
                    onClick={goToLoginMode}
                    style={styles.linkButton}
                  >
                    {text.backToLogin}
                  </button>
                </form>
              ) : (
                <form style={styles.form}>
                  <label style={styles.label}>{text.email}</label>
                  <input
                    className="runology-input"
                    type="email"
                    placeholder={text.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                  />

                  <label style={styles.label}>{text.password}</label>
                  <input
                    className="runology-input"
                    type="password"
                    placeholder={text.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />

                  <button
                    className="runology-secondary-button"
                    type="button"
                    onClick={handleSignUp}
                    disabled={authLoading}
                    style={styles.secondaryButton}
                  >
                    {authLoading ? text.signing : text.signUp}
                  </button>

                  <button
                    className="runology-link-button"
                    type="button"
                    onClick={goToLoginMode}
                    style={styles.linkButton}
                  >
                    {text.backToLogin}
                  </button>
                </form>
              )}

              {message && <div style={styles.successBox}>{message}</div>}
              {error && <div style={styles.errorBox}>{text.errorPrefix}: {error}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="runology-page" style={styles.page}>
      <div style={styles.appShell}>
        <header className="runology-header" style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.topTag}>{text.brand}</div>
            <h1 className="runology-app-title" style={styles.appTitle}>
              {text.headerTitle}
            </h1>
            <p style={styles.appSubtitle}>
              {text.loggedInAs} <strong>{session.user.email}</strong>
            </p>
          </div>

          <div className="runology-header-actions" style={styles.headerActions}>
            <LanguageSwitcher language={language} onChange={toggleLanguage} />
            <button
              className="runology-logout-button"
              onClick={handleSignOut}
              style={styles.logoutButton}
            >
              {text.logout}
            </button>
          </div>
        </header>

<div className="runology-stats-grid" style={styles.statsGrid}>
  <div style={styles.statCard}>
    <span style={styles.statLabel}>
      {language === "lv" ? "Skrējieni" : "Runs"}
    </span>
    <span style={styles.statValue}>{stats.totalRuns}</span>
  </div>

  <div style={styles.statCard}>
    <span style={styles.statLabel}>
      {language === "lv" ? "Kopējā distance" : "Total distance"}
    </span>
    <span style={styles.statValue}>{stats.totalDistance} km</span>
  </div>

  <div style={styles.statCard}>
    <span style={styles.statLabel}>
      {language === "lv" ? "Vidējais temps" : "Average pace"}
    </span>
    <span style={styles.statValue}>{stats.averagePace}</span>
  </div>
</div>

        <section className="runology-main-grid" style={styles.mainGrid}>
          <div className="runology-form-card" style={styles.formCard}>
            <div style={styles.sectionHeader}>
              <h2 className="runology-section-title" style={styles.sectionTitle}>
                {editingRunId ? text.editRunTitle : text.addRunTitle}
              </h2>
              <p style={styles.sectionText}>
                {editingRunId ? text.editRunText : text.addRunText}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>{text.date}</label>
              <input
                className="runology-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>{text.distance}</label>
              <input
                className="runology-input"
                type="number"
                step="0.01"
                min="0"
                placeholder={text.distancePlaceholder}
                value={distance}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setDistance(value);
                  }
                }}
                required
                style={styles.input}
              />

              <label style={styles.label}>{text.duration}</label>
              <input
                className="runology-input"
                type="number"
                step="0.01"
                min="0"
                placeholder={text.durationPlaceholder}
                value={duration}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    setDuration(value);
                  }
                }}
                required
                style={styles.input}
              />

              <div style={styles.pacePreviewBox}>
                <span style={styles.infoLabel}>{text.pace}</span>
                <div style={styles.pacePreviewValue}>
                  {formatPace(distance, duration)}
                </div>
              </div>

              <label style={styles.label}>{text.mood}</label>
              <EmojiPicker options={moodOptions} value={mood} onChange={setMood} />

              <label style={styles.label}>{text.weather}</label>
              <EmojiPicker
                options={weatherOptions}
                value={weather}
                onChange={setWeather}
              />

              <label style={styles.label}>{text.notes}</label>
              <textarea
                className="runology-textarea"
                placeholder={text.notesPlaceholder}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={styles.textarea}
              />

              <div className="runology-form-actions" style={styles.formActions}>
                <button
                  className="runology-primary-button"
                  type="submit"
                  disabled={saving}
                  style={styles.primaryButtonDashboard}
                >
                  {saving
                    ? text.saving
                    : editingRunId
                    ? text.saveChanges
                    : text.saveRun}
                </button>

                {editingRunId && (
                  <button
                    className="runology-cancel-button"
                    type="button"
                    onClick={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    {text.cancelEdit}
                  </button>
                )}
              </div>
            </form>

            {message && <div style={styles.successBoxDashboard}>{message}</div>}
            {error && <div style={styles.errorBoxDashboard}>{text.errorPrefix}: {error}</div>}
          </div>

          <div className="runology-list-card" style={styles.listCard}>
            <div style={styles.sectionHeader}>
              <h2 className="runology-section-title" style={styles.sectionTitle}>
                {text.runsTitle}
              </h2>
              <p style={styles.sectionText}>{text.runsText}</p>
            </div>

            {runsLoading ? (
              <div style={styles.emptyState}>{text.loadingRuns}</div>
            ) : runs.length === 0 ? (
              <div style={styles.emptyState}>{text.noRuns}</div>
            ) : (
              <div style={styles.runList}>
                {runs.map((run) => (
                  <div
                    className="runology-run-card"
                    key={run.id}
                    style={styles.runCard}
                  >
                    <div style={styles.runTopRow}>
                      <div className="runology-run-date" style={styles.runDate}>
                        {formatDate(run.date)}
                      </div>
                      <div style={styles.runPill}>{run.distance} km</div>
                    </div>

                    <div style={styles.metaChipRow}>
                      <div style={styles.metaChip}>{run.mood || "🙂"}</div>
                      <div style={styles.metaChip}>{run.weather || "☀️"}</div>
                    </div>

                    <div className="runology-run-info-row" style={styles.runInfoRow}>
                      <div style={styles.infoBlock}>
                        <span style={styles.infoLabel}>{text.distanceLabel}</span>
                        <span style={styles.infoValue}>{run.distance} km</span>
                      </div>

                      <div style={styles.infoBlock}>
                        <span style={styles.infoLabel}>{text.durationLabel}</span>
                        <span style={styles.infoValue}>{run.duration} min</span>
                      </div>

                      <div style={styles.infoBlock}>
                        <span style={styles.infoLabel}>{text.paceLabel}</span>
                        <span style={styles.infoValue}>
                          {formatPace(run.distance, run.duration)}
                        </span>
                      </div>
                    </div>

                    <div className="runology-run-action-row" style={styles.runActionRow}>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(run)}
                        style={styles.editButton}
                      >
                        {text.editRun}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(run.id)}
                        style={styles.deleteButton}
                      >
                        {text.deleteRun}
                      </button>
                    </div>

                    <div style={styles.notesBox}>
                      <span style={styles.infoLabel}>{text.notesLabel}</span>
                      <p style={styles.notesText}>{run.notes || text.noNotes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#111111",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "32px",
    boxSizing: "border-box",
  },
  centerWrap: {
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    width: "100%",
    maxWidth: "440px",
    background: "#2a2a2a",
    borderRadius: "22px",
    padding: "24px 30px 42px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
    border: "1px solid #2f2f2f",
  },
  loadingTopBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "16px",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, #22482e 0%, #203f2b 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
    margin: "0 auto 18px",
    boxShadow: "0 18px 36px rgba(0, 0, 0, 0.28)",
  },
  loadingTitle: {
    margin: "0 0 8px 0",
    fontSize: "36px",
    letterSpacing: "-0.04em",
    color: "#f6efe5",
  },
  loadingText: {
    margin: 0,
    color: "#d1c5b2",
    fontSize: "16px",
  },
  authShell: {
    maxWidth: "1180px",
    margin: "0 auto",
    minHeight: "calc(100vh - 64px)",
    display: "grid",
    gridTemplateColumns: "1fr 1.08fr",
    gap: "0",
    borderRadius: "22px",
    overflow: "hidden",
    background: "#242424",
    border: "1px solid #2f2f2f",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
  },
  brandPanel: {
    background: "linear-gradient(180deg, #22482e 0%, #203f2b 100%)",
    color: "#f5efe6",
    padding: "42px 46px",
    display: "flex",
    flexDirection: "column",
    minHeight: "720px",
  },
  brandBadge: {
    display: "inline-flex",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(215, 227, 218, 0.28)",
    color: "#dfe8e2",
    borderRadius: "10px",
    padding: "6px 12px",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  brandContent: {
    marginTop: "70px",
    maxWidth: "420px",
  },
  brandTitle: {
    margin: "0 0 26px 0",
    fontSize: "66px",
    lineHeight: 0.98,
    letterSpacing: "-0.04em",
    fontWeight: "500",
    color: "#f4eadf",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  brandText: {
    margin: "0 0 34px 0",
    fontSize: "18px",
    lineHeight: 1.55,
    color: "#c7d6c7",
    maxWidth: "360px",
  },
  featureList: {
    display: "grid",
    gap: "14px",
    marginTop: "8px",
  },
  featureBulletRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  featureDot: {
    width: "7px",
    height: "7px",
    borderRadius: "999px",
    background: "#8ad08d",
    marginTop: "10px",
    flexShrink: 0,
  },
  featureBulletText: {
    fontSize: "16px",
    lineHeight: 1.55,
    color: "#d7e3d8",
    fontWeight: "600",
  },
  brandFooter: {
    marginTop: "auto",
    color: "rgba(211, 225, 214, 0.45)",
    fontSize: "15px",
    fontWeight: "600",
  },
  authCard: {
    background: "#2a2a2a",
    color: "#f5f2eb",
    padding: "42px 40px",
    display: "flex",
    flexDirection: "column",
  },
  authDesktopTopBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "38px",
  },
  authCardTopBar: {
    display: "none",
    justifyContent: "flex-end",
    marginBottom: "24px",
  },
  authCardInner: {
    width: "100%",
    maxWidth: "424px",
    margin: "40px 0 0 0",
    alignSelf: "center",
  },
  authHeader: {
    marginBottom: "28px",
  },
  authTitle: {
    margin: "0 0 10px 0",
    fontSize: "26px",
    lineHeight: 1.15,
    color: "#f6efe5",
    letterSpacing: "-0.03em",
    fontWeight: "700",
  },
  authSubtitle: {
    margin: 0,
    color: "#d1c5b2",
    fontSize: "16px",
    lineHeight: 1.5,
    maxWidth: "390px",
  },
  appShell: {
    maxWidth: "1260px",
    margin: "0 auto",
  },
  header: {
    background: "#1b1b1b",
    borderRadius: "24px",
    padding: "30px 32px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
    border: "1px solid #292929",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  headerLeft: {
    minWidth: 0,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  topTag: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#262626",
    color: "#d7e3d8",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "10px",
    border: "1px solid #353535",
  },
  appTitle: {
    margin: "0 0 8px 0",
    fontSize: "36px",
    color: "#f6efe5",
    letterSpacing: "-0.05em",
  },
  appSubtitle: {
    margin: 0,
    color: "#c0b5a4",
    fontSize: "15px",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "420px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  statsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "16px",
  marginBottom: "24px",
},

statCard: {
  background: "#1b1b1b",
  borderRadius: "20px",
  padding: "20px",
  border: "1px solid #292929",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.18)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
},

statLabel: {
  fontSize: "13px",
  fontWeight: "800",
  letterSpacing: "0.4px",
  textTransform: "uppercase",
  color: "#b8aa95",
},

statValue: {
  fontSize: "28px",
  fontWeight: "800",
  color: "#f6efe5",
  letterSpacing: "-0.03em",
},
  formCard: {
    background: "#1b1b1b",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
    border: "1px solid #292929",
    position: "sticky",
    top: "24px",
  },
  listCard: {
    background: "#1b1b1b",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
    border: "1px solid #292929",
    minHeight: "500px",
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 6px 0",
    fontSize: "26px",
    color: "#f6efe5",
    letterSpacing: "-0.04em",
  },
  sectionText: {
    margin: 0,
    color: "#c0b5a4",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  form: {
    display: "grid",
    gap: "10px",
  },
  formActions: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "10px",
    alignItems: "center",
    marginTop: "10px",
  },
  label: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#e6d9c4",
    marginTop: "10px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 16px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #4a443c",
    background: "#2f2f2f",
    outline: "none",
    color: "#f6efe5",
    boxShadow: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    fontSize: "16px",
    borderRadius: "14px",
    border: "1px solid #343434",
    background: "#242424",
    outline: "none",
    color: "#f6efe5",
    minHeight: "124px",
    resize: "vertical",
    boxShadow: "none",
  },
  pacePreviewBox: {
    background: "#242424",
    border: "1px solid #343434",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "6px",
  },
  pacePreviewValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f6efe5",
    marginTop: "6px",
    letterSpacing: "-0.02em",
  },
  emojiRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  emojiButton: {
    border: "1px solid #343434",
    background: "#242424",
    borderRadius: "16px",
    minWidth: "50px",
    minHeight: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
  },
  emojiButtonActive: {
    border: "1px solid #536557",
    background: "#2a322c",
    borderRadius: "16px",
    minWidth: "50px",
    minHeight: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
  },
  emojiIcon: {
    fontSize: "24px",
    lineHeight: 1,
  },
  primaryButton: {
    width: "100%",
    border: "1px solid #5a534a",
    borderRadius: "12px",
    padding: "15px 18px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f6efe5",
    background: "#2f2f2f",
    boxShadow: "none",
    marginTop: "10px",
  },
  secondaryButton: {
    width: "100%",
    border: "1px solid #5a534a",
    borderRadius: "12px",
    padding: "15px 18px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f6efe5",
    background: "#2f2f2f",
    boxShadow: "none",
  },
  primaryButtonDashboard: {
    width: "100%",
    border: "none",
    borderRadius: "16px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#ffffff",
    background: "linear-gradient(135deg, #203428 0%, #3a5244 100%)",
    boxShadow: "0 18px 30px rgba(0, 0, 0, 0.22)",
  },
  cancelButton: {
    border: "1px solid #343434",
    borderRadius: "16px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f6efe5",
    background: "#242424",
    whiteSpace: "nowrap",
  },
  linkButton: {
    border: "none",
    background: "transparent",
    padding: "10px 0 0 0",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#e7d9c5",
    textAlign: "left",
  },
  logoutButton: {
    border: "1px solid #343434",
    borderRadius: "16px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f6efe5",
    background: "#242424",
    whiteSpace: "nowrap",
  },
  successBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "#243629",
    color: "#d8ebda",
    border: "1px solid #35523c",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  errorBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "12px",
    background: "#3a2424",
    color: "#ffd4d4",
    border: "1px solid #6a3838",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  successBoxDashboard: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#243629",
    color: "#d8ebda",
    border: "1px solid #35523c",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  errorBoxDashboard: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "#3a2424",
    color: "#ffd4d4",
    border: "1px solid #6a3838",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  emptyState: {
    padding: "34px",
    borderRadius: "18px",
    background: "#242424",
    border: "1px dashed #343434",
    color: "#c0b5a4",
    fontSize: "15px",
    textAlign: "center",
  },
  runList: {
    display: "grid",
    gap: "18px",
  },
  runCard: {
    borderRadius: "22px",
    padding: "22px",
    background: "#242424",
    border: "1px solid #343434",
    boxShadow: "none",
  },
  runTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  runDate: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#f6efe5",
    letterSpacing: "-0.02em",
  },
  runPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#2e2e2e",
    color: "#d7e3d8",
    fontWeight: "800",
    fontSize: "13px",
    border: "1px solid #3a3a3a",
  },
  metaChipRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "14px",
  },
  metaChip: {
    minWidth: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "#2e2e2e",
    border: "1px solid #3a3a3a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "none",
  },
  runInfoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "14px",
  },
  infoBlock: {
    background: "#2a2a2a",
    border: "1px solid #383838",
    borderRadius: "16px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    color: "#b8aa95",
  },
  infoValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f6efe5",
    letterSpacing: "-0.02em",
  },
  runActionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  editButton: {
    border: "none",
    borderRadius: "14px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f6efe5",
    background: "#2e2e2e",
  },
  deleteButton: {
    border: "none",
    borderRadius: "14px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#ffd4d4",
    background: "#3a2424",
  },
  notesBox: {
    background: "#2a2a2a",
    border: "1px solid #383838",
    borderRadius: "16px",
    padding: "15px",
  },
  notesText: {
    margin: "8px 0 0 0",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#ddd1c0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  languageSwitch: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "transparent",
    border: "1px solid #545047",
    borderRadius: "12px",
    padding: "0",
    boxShadow: "none",
  },
  languageButton: {
    border: "none",
    background: "transparent",
    color: "#32473b",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },
  languageButtonActive: {
    border: "none",
    background: "transparent",
    color: "#ffffff",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "none",
  },
};

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const responsiveCss = `
  @media (max-width: 1080px) {
    .runology-auth-shell {
      grid-template-columns: 1fr !important;
    }

    .runology-main-grid {
      grid-template-columns: 1fr !important;
    }

    .runology-form-card {
      position: static !important;
      top: auto !important;
    }
  }

  @media (max-width: 768px) {
    .runology-page {
      padding: 14px !important;
    }

    .runology-brand-panel,
    .runology-auth-card,
    .runology-header,
    .runology-form-card,
    .runology-list-card,
    .runology-loading-card {
      border-radius: 28px !important;
    }

    .runology-brand-panel {
      min-height: auto !important;
      padding: 26px !important;
    }

    .runology-auth-card {
      padding: 22px !important;
    }

    .runology-brand-title {
      font-size: 36px !important;
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

    .runology-brand-panel,
    .runology-auth-card,
    .runology-header,
    .runology-form-card,
    .runology-list-card,
    .runology-loading-card {
      border-radius: 24px !important;
    }

    .runology-brand-title {
      font-size: 30px !important;
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

if (
  typeof document !== "undefined" &&
  !document.getElementById("runology-responsive-styles")
) {
  const styleTag = document.createElement("style");
  styleTag.id = "runology-responsive-styles";
  styleTag.innerHTML = responsiveCss;
  document.head.appendChild(styleTag);
}

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
        background: "rgba(255, 255, 255, 0.10)",
        border: "1px solid rgba(255, 255, 255, 0.16)",
      }
    : styles.languageSwitch;

  const buttonBase = dark
    ? {
        ...styles.languageButton,
        color: "#ffffff",
      }
    : styles.languageButton;

  const activeButtonStyle = dark
    ? {
        ...styles.languageButtonActive,
        background: "#ffffff",
        color: "#163223",
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
  const [authMode, setAuthMode] = useState("login");
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("runology-language");
    return saved === "en" ? "en" : "lv";
  });

  useEffect(() => {
    localStorage.setItem("runology-language", language);
  }, [language]);

  const text = useMemo(() => {
    const translations = {
      lv: {
        brand: "RUNOLOGY",
        loadingApp: "Ielādē aplikāciju...",
        heroTitle: "Tavs skriešanas žurnāls.",
        heroText:
          "Pieraksti skrējienus, glabā tos droši datubāzē un piekļūsti tiem no jebkuras ierīces.",
        feature1: "Saglabā skrējienus mākonī",
        feature2: "Piekļuve no jebkuras ierīces",
        feature3: "Katram lietotājam savi dati",
        authTitle: "Ieiet vai reģistrēties",
        authSubtitle:
          "Izmanto savu e-pastu un paroli, lai piekļūtu saviem skrējieniem.",
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
        forgotPassword: "Aizmirsu paroli",
        sendReset: "Nosūtīt atjaunošanas saiti",
        resetSending: "Sūta...",
        resetSuccess:
          "Paroles atjaunošanas e-pasts nosūtīts. Pārbaudi savu pastkasti.",
        backToLogin: "Atpakaļ uz ieeju",
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
          "Log your runs, store them safely in the cloud, and access them from any device.",
        feature1: "Store runs in the cloud",
        feature2: "Access from any device",
        feature3: "Each user sees only their own data",
        authTitle: "Sign in or create account",
        authSubtitle: "Use your email and password to access your runs.",
        resetTitle: "Reset password",
        resetSubtitle:
          "Enter your email and we will send you a password reset link.",
        updatePasswordTitle: "Set new password",
        updatePasswordSubtitle:
          "Enter your new password to finish the password change.",
        email: "Email",
        emailPlaceholder: "example@gmail.com",
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
        forgotPassword: "Forgot password",
        sendReset: "Send reset link",
        resetSending: "Sending...",
        resetSuccess:
          "Password reset email sent. Check your inbox.",
        backToLogin: "Back to sign in",
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

  useEffect(() => {
    const hash = window.location.hash || "";
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
    setAuthMode("login");
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
    setDistance(run.distance || "");
    setDuration(run.duration || "");
    setNotes(run.notes || "");
    setMood(run.mood || "🙂");
    setWeather(run.weather || "☀️");
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    setSaving(true);
    setError("");
    setMessage("");

    if (editingRunId) {
      const { error } = await supabase
        .from("runs")
        .update({
          date,
          distance,
          duration,
          notes,
          mood,
          weather,
        })
        .eq("id", editingRunId)
        .eq("user_id", session.user.id);

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
        distance,
        duration,
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

  function goToResetMode() {
    setAuthMode("reset");
    setMessage("");
    setError("");
    setPassword("");
  }

  function goToLoginMode() {
    setAuthMode("login");
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
              <LanguageSwitcher language={language} onChange={toggleLanguage} />
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
              <LanguageSwitcher language={language} onChange={toggleLanguage} />
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
            <div className="runology-auth-topbar-desktop" style={styles.authTopBar}>
              <div style={styles.brandBadge}>{text.brand}</div>
              <LanguageSwitcher language={language} onChange={toggleLanguage} dark />
            </div>

            <h1 className="runology-brand-title" style={styles.brandTitle}>
              {text.heroTitle}
            </h1>
            <p style={styles.brandText}>{text.heroText}</p>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>{text.feature1}</div>
              <div style={styles.featureItem}>{text.feature2}</div>
              <div style={styles.featureItem}>{text.feature3}</div>
            </div>
          </div>

          <div className="runology-auth-card" style={styles.authCard}>
            <div className="runology-auth-topbar-mobile" style={styles.authCardTopBar}>
              <LanguageSwitcher language={language} onChange={toggleLanguage} />
            </div>

            <div style={styles.authHeader}>
              <h2 className="runology-auth-title" style={styles.authTitle}>
                {authMode === "reset" ? text.resetTitle : text.authTitle}
              </h2>
              <p style={styles.authSubtitle}>
                {authMode === "reset" ? text.resetSubtitle : text.authSubtitle}
              </p>
            </div>

            {authMode === "reset" ? (
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
                  className="runology-primary-button"
                  type="button"
                  onClick={handleSignIn}
                  disabled={authLoading}
                  style={styles.primaryButton}
                >
                  {authLoading ? text.signing : text.signIn}
                </button>

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
                  onClick={goToResetMode}
                  style={styles.linkButton}
                >
                  {text.forgotPassword}
                </button>
              </form>
            )}

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{text.errorPrefix}: {error}</div>}
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
                  if (/^\\d*\\.?\\d{0,2}$/.test(value)) {
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
                  if (/^\\d*\\.?\\d{0,2}$/.test(value)) {
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
                  style={styles.primaryButton}
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

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{text.errorPrefix}: {error}</div>}
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
    background:
      "radial-gradient(circle at top left, #fcfffd 0%, #f3f6f4 45%, #edf1ee 100%)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "24px",
    boxSizing: "border-box",
  },
  centerWrap: {
    minHeight: "calc(100vh - 48px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "34px",
    padding: "24px 30px 42px",
    textAlign: "center",
    boxShadow: "0 24px 80px rgba(17, 24, 18, 0.08)",
    border: "1px solid rgba(255,255,255,0.82)",
  },
  loadingTopBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "16px",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "28px",
    background: "linear-gradient(135deg, #264734 0%, #3e6b50 100%)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    fontWeight: "800",
    margin: "0 auto 18px",
    boxShadow: "0 18px 36px rgba(30, 53, 40, 0.22)",
  },
  loadingTitle: {
    margin: "0 0 8px 0",
    fontSize: "36px",
    letterSpacing: "-0.04em",
    color: "#17231b",
  },
  loadingText: {
    margin: 0,
    color: "#657067",
    fontSize: "16px",
  },
  authShell: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    gap: "24px",
    alignItems: "stretch",
  },
  authTopBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  },
  brandPanel: {
    background:
      "linear-gradient(145deg, rgba(20,29,23,0.96) 0%, rgba(34,53,42,0.94) 45%, rgba(68,96,79,0.90) 100%)",
    color: "#ffffff",
    borderRadius: "38px",
    padding: "48px",
    boxShadow: "0 30px 90px rgba(16, 24, 20, 0.20)",
    minHeight: "650px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  brandBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    background: "rgba(255, 255, 255, 0.10)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    borderRadius: "999px",
    padding: "9px 15px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1.5px",
  },
  brandTitle: {
    fontSize: "58px",
    lineHeight: 1.02,
    margin: "0 0 18px 0",
    maxWidth: "540px",
    letterSpacing: "-0.05em",
  },
  brandText: {
    fontSize: "18px",
    lineHeight: 1.8,
    color: "rgba(255, 255, 255, 0.82)",
    margin: "0 0 30px 0",
    maxWidth: "520px",
  },
  featureList: {
    display: "grid",
    gap: "14px",
    marginTop: "10px",
  },
  featureItem: {
    background: "rgba(255, 255, 255, 0.07)",
    border: "1px solid rgba(255, 255, 255, 0.10)",
    borderRadius: "20px",
    padding: "14px 16px",
    fontSize: "15px",
    fontWeight: "600",
    maxWidth: "430px",
    backdropFilter: "blur(10px)",
  },
  authCard: {
    background: "rgba(255,255,255,0.82)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "34px",
    padding: "26px 36px 36px",
    boxShadow: "0 24px 80px rgba(17, 24, 18, 0.07)",
    border: "1px solid rgba(255,255,255,0.82)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  authCardTopBar: {
    display: "none",
    justifyContent: "flex-end",
    marginBottom: "8px",
  },
  authHeader: {
    marginBottom: "26px",
  },
  authTitle: {
    margin: "0 0 8px 0",
    fontSize: "34px",
    color: "#17231b",
    letterSpacing: "-0.04em",
  },
  authSubtitle: {
    margin: 0,
    color: "#6a756d",
    fontSize: "15px",
    lineHeight: 1.7,
  },
  appShell: {
    maxWidth: "1260px",
    margin: "0 auto",
  },
  header: {
    background: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "32px",
    padding: "30px 32px",
    boxShadow: "0 20px 60px rgba(17, 24, 18, 0.06)",
    border: "1px solid rgba(255,255,255,0.82)",
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
    background: "#f6f8f6",
    color: "#2d4236",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "10px",
    border: "1px solid #e7ece8",
  },
  appTitle: {
    margin: "0 0 8px 0",
    fontSize: "36px",
    color: "#17231b",
    letterSpacing: "-0.05em",
  },
  appSubtitle: {
    margin: 0,
    color: "#69756c",
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
  formCard: {
    background: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "32px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(17, 24, 18, 0.06)",
    border: "1px solid rgba(255,255,255,0.82)",
    position: "sticky",
    top: "24px",
  },
  listCard: {
    background: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    borderRadius: "32px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(17, 24, 18, 0.06)",
    border: "1px solid rgba(255,255,255,0.82)",
    minHeight: "500px",
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 6px 0",
    fontSize: "26px",
    color: "#17231b",
    letterSpacing: "-0.04em",
  },
  sectionText: {
    margin: 0,
    color: "#728077",
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
    fontSize: "14px",
    fontWeight: "700",
    color: "#304438",
    marginTop: "6px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    fontSize: "16px",
    borderRadius: "20px",
    border: "1px solid #e4eae6",
    background: "rgba(252,253,252,0.98)",
    outline: "none",
    color: "#17231b",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92)",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    fontSize: "16px",
    borderRadius: "20px",
    border: "1px solid #e4eae6",
    background: "rgba(252,253,252,0.98)",
    outline: "none",
    color: "#17231b",
    minHeight: "124px",
    resize: "vertical",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92)",
  },
  pacePreviewBox: {
    background: "linear-gradient(180deg, #fbfcfb 0%, #f5f7f5 100%)",
    border: "1px solid #eaefeb",
    borderRadius: "22px",
    padding: "16px",
    marginTop: "6px",
  },
  pacePreviewValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#17231b",
    marginTop: "6px",
    letterSpacing: "-0.02em",
  },
  emojiRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  emojiButton: {
    border: "1px solid #e7ece8",
    background: "rgba(251,252,251,0.98)",
    borderRadius: "18px",
    minWidth: "50px",
    minHeight: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 18px rgba(17, 24, 18, 0.03)",
  },
  emojiButtonActive: {
    border: "1px solid #40584a",
    background: "linear-gradient(180deg, #ffffff 0%, #f3f6f4 100%)",
    borderRadius: "18px",
    minWidth: "50px",
    minHeight: "50px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 24px rgba(17, 24, 18, 0.08)",
  },
  emojiIcon: {
    fontSize: "24px",
    lineHeight: 1,
  },
  primaryButton: {
    width: "100%",
    border: "none",
    borderRadius: "20px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#ffffff",
    background: "linear-gradient(135deg, #203428 0%, #3a5244 100%)",
    boxShadow: "0 18px 30px rgba(25, 38, 30, 0.16)",
  },
  secondaryButton: {
    width: "100%",
    border: "1px solid #e2e8e4",
    borderRadius: "20px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#203428",
    background: "rgba(252,253,252,0.98)",
  },
  cancelButton: {
    border: "1px solid #e2e8e4",
    borderRadius: "20px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#203428",
    background: "rgba(252,253,252,0.98)",
    whiteSpace: "nowrap",
  },
  linkButton: {
    border: "none",
    background: "transparent",
    padding: "8px 2px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#2f4a3a",
    textAlign: "left",
  },
  logoutButton: {
    border: "1px solid #e2e8e4",
    borderRadius: "20px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#203428",
    background: "rgba(252,253,252,0.98)",
    whiteSpace: "nowrap",
  },
  successBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #f7faf8 0%, #f1f5f2 100%)",
    color: "#23362b",
    border: "1px solid #e3ebe6",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  errorBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "20px",
    background: "linear-gradient(180deg, #fff8f8 0%, #fdf2f2 100%)",
    color: "#a11d1d",
    border: "1px solid #f0d9d9",
    fontSize: "14px",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  emptyState: {
    padding: "34px",
    borderRadius: "24px",
    background: "linear-gradient(180deg, #fcfdfc 0%, #f5f7f5 100%)",
    border: "1px dashed #e3e9e5",
    color: "#6d7a72",
    fontSize: "15px",
    textAlign: "center",
  },
  runList: {
    display: "grid",
    gap: "18px",
  },
  runCard: {
    borderRadius: "28px",
    padding: "22px",
    background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,249,248,0.98) 100%)",
    border: "1px solid #ebefec",
    boxShadow: "0 16px 34px rgba(17, 24, 18, 0.04)",
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
    color: "#17231b",
    letterSpacing: "-0.02em",
  },
  runPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#f6f8f6",
    color: "#31463a",
    fontWeight: "800",
    fontSize: "13px",
    border: "1px solid #e7ece8",
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
    background: "linear-gradient(180deg, #ffffff 0%, #f4f6f4 100%)",
    border: "1px solid #eaefeb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "0 6px 14px rgba(17, 24, 18, 0.03)",
  },
  runInfoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "14px",
  },
  infoBlock: {
    background: "linear-gradient(180deg, #fcfdfc 0%, #f6f8f6 100%)",
    border: "1px solid #eaefeb",
    borderRadius: "20px",
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
    color: "#708077",
  },
  infoValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#17231b",
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
    borderRadius: "15px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#203428",
    background: "linear-gradient(180deg, #f6f8f6 0%, #eef2ef 100%)",
  },
  deleteButton: {
    border: "none",
    borderRadius: "15px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#9a1c1c",
    background: "linear-gradient(180deg, #fff7f7 0%, #fdf0f0 100%)",
  },
  notesBox: {
    background: "linear-gradient(180deg, #fdfefd 0%, #f7f9f7 100%)",
    border: "1px solid #eaefeb",
    borderRadius: "20px",
    padding: "15px",
  },
  notesText: {
    margin: "8px 0 0 0",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "#3a4e43",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  languageSwitch: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: "rgba(248,249,248,0.98)",
    border: "1px solid #e6ebe7",
    borderRadius: "999px",
    padding: "4px",
    boxShadow: "0 8px 18px rgba(17, 24, 18, 0.03)",
  },
  languageButton: {
    border: "none",
    background: "transparent",
    color: "#32473b",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
  },
  languageButtonActive: {
    border: "none",
    background: "#22392c",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(17, 24, 18, 0.12)",
  },
};

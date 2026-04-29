import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabase";

const responsiveCss = `
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  input[type="date"] {
    text-align: left !important;
    -webkit-appearance: none !important;
    appearance: none !important;
  }

  input[type="date"]::-webkit-date-and-time-value {
    text-align: left !important;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    margin-left: auto !important;
  }

  @media (max-width: 1080px) {
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

    .runology-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
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
      width: 100% !important;
      justify-content: flex-start !important;
      align-items: stretch !important;
      flex-direction: column !important;
      gap: 10px !important;
    }

    .runology-view-switch {
      width: 100% !important;
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 8px !important;
      padding: 6px !important;
    }

    .runology-view-switch button {
      width: 100% !important;
      text-align: center !important;
      white-space: normal !important;
      min-height: 42px !important;
      padding: 10px 8px !important;
    }

    .runology-language-switch {
      align-self: flex-start !important;
    }

    .runology-logout-button {
      width: 100% !important;
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

    .runology-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 12px !important;
      margin-bottom: 20px !important;
    }

    .runology-duration-grid {
      grid-template-columns: 1fr !important;
    }

    .runology-run-card {
      padding: 14px !important;
    }

    .runology-run-date {
      font-size: 15px !important;
    }

    .runology-run-info-row {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      gap: 7px !important;
    }

    .runology-run-info-row > div {
      padding: 10px 8px !important;
      border-radius: 13px !important;
      min-width: 0 !important;
    }

    .runology-run-info-row span:first-child {
      font-size: 9px !important;
      letter-spacing: 0.2px !important;
    }

    .runology-run-info-row span:last-child {
      font-size: 13px !important;
      white-space: nowrap !important;
    }

    .runology-auth-topbar-desktop {
      display: none !important;
    }

    .runology-auth-topbar-mobile {
      display: flex !important;
    }
  }

  @media (max-width: 560px) {
    .runology-page {
      padding: 10px !important;
    }

    .runology-header,
    .runology-list-card,
    .runology-form-card,
    .runology-profile-card,
    .runology-insights-panel,
    .runology-chart-card,
    .runology-monthly-identity-card {
      padding: 18px !important;
      border-radius: 20px !important;
    }

    .runology-stats-grid {
      grid-template-columns: 1fr !important;
    }

    .runology-stat-card {
      padding: 16px !important;
    }

    .runology-stat-value {
      font-size: 24px !important;
    }

    .runology-view-switch {
      grid-template-columns: 1fr !important;
    }

    .runology-activity-filter-top-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .runology-activity-filter-group {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      width: 100% !important;
    }

    .runology-activity-filter-group button,
    .runology-export-csv-button {
      width: 100% !important;
      white-space: normal !important;
    }

    .runology-export-csv-button {
      text-align: center !important;
    }

    .runology-form-actions {
      grid-template-columns: 1fr !important;
    }

    .runology-run-action-row {
      display: grid !important;
      grid-template-columns: 1fr !important;
      align-items: stretch !important;
    }

    .runology-run-action-row button {
      width: 100% !important;
    }

    .runology-insights-grid,
    .runology-insight-recommendation-grid {
      grid-template-columns: 1fr !important;
    }

    .runology-monthly-identity-top-row {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .runology-monthly-identity-actions {
      display: grid !important;
      grid-template-columns: 1fr !important;
      width: 100% !important;
    }

    .runology-monthly-identity-actions button {
      width: 100% !important;
    }

    .runology-modal-backdrop {
      padding: 10px !important;
      align-items: flex-start !important;
    }

    .runology-form-card {
      max-height: calc(100vh - 20px) !important;
      overflow-y: auto !important;
    }

    .runology-profile-password-header {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .runology-password-toggle-button {
      width: 100% !important;
    }
  }

  @media (max-width: 480px) {
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

    .runology-emoji-row {
      gap: 8px !important;
    }

    .runology-emoji-button {
      min-width: 44px !important;
      min-height: 44px !important;
    }
  }

  button {
    transition: transform 0.16s ease, background 0.16s ease, border-color 0.16s ease, opacity 0.16s ease;
  }

  button:active {
    transform: translateY(1px) scale(0.99);
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
        color: "rgba(255, 255, 255, 0.62)",
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

function ChoicePicker({ options, value, onChange, multiple = false }) {
  function isSelected(optionValue) {
    return multiple ? value.includes(optionValue) : value === optionValue;
  }

  function handleClick(optionValue) {
    if (!multiple) {
      onChange(value === optionValue ? "" : optionValue);
      return;
    }

    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
      return;
    }

    if (optionValue === "no_fuel") {
      onChange(["no_fuel"]);
      return;
    }

    onChange([...value.filter((item) => item !== "no_fuel"), optionValue]);
  }

  return (
    <div style={styles.choiceGrid}>
      {options.map((option) => {
        const selected = isSelected(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleClick(option.value)}
            style={selected ? styles.choiceButtonActive : styles.choiceButton}
            title={option.label}
            aria-label={option.label}
          >
            <span style={styles.choiceMainRow}>
              <span style={styles.choiceEmoji}>{option.emoji}</span>
              <span>{option.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [runs, setRuns] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [activityType, setActivityType] = useState("run");
  const [activityFilter, setActivityFilter] = useState("all");
  const [distance, setDistance] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotImportLoading, setScreenshotImportLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState("🙂");
  const [weather, setWeather] = useState("☀️");
  const [preSessionState, setPreSessionState] = useState("");
  const [sleepQuality, setSleepQuality] = useState("");
  const [duringSessionFuel, setDuringSessionFuel] = useState([]);
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
  const [activeView, setActiveView] = useState("runs");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [expandedRunId, setExpandedRunId] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [insightActivityType, setInsightActivityType] = useState("all");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [username, setUsername] = useState("");
  const [unit, setUnit] = useState("km");
  const [watch, setWatch] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [profilePasswordConfirm, setProfilePasswordConfirm] = useState("");
  const [showProfilePasswords, setShowProfilePasswords] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "lv";
    const saved = window.localStorage.getItem("runology-language");
    return saved === "en" ? "en" : "lv";
  });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

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
        heroTitle: "Tavs sporta žurnāls.",
        heroText:
          "Bez līderu tabulām. Bez sociālā spiediena. Tikai tu, tavas aktivitātes un tas, kā tu juties.",
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
        headerTitle: "Tavas aktivitātes vienuviet",
        loggedInAs: "Ielogojies kā",
        logout: "Iziet",
        addRunTitle: "Pievienot aktivitāti",
        addActivityButton: "+ Pievienot aktivitāti",
        closeActivityModal: "Aizvērt",
        editRunTitle: "Labot aktivitāti",
        addRunText: "Saglabā savu nākamo aktivitāti.",
        editRunText: "Maini izvēlētā ieraksta datus un saglabā izmaiņas.",
        importScreenshot: "Importēt no Strava screenshot",
        importScreenshotHelp: "Izvēlies Strava screenshot, pārbaudi priekšskatījumu un nospied Importēt datus.",
        chooseScreenshot: "Izvēlēties attēlu",
        importScreenshotButton: "Importēt datus",
        importingScreenshot: "Importē...",
        removeScreenshot: "Noņemt attēlu",
        screenshotPreview: "Screenshot priekšskatījums",
        importScreenshotSuccess: "Dati importēti. Pārbaudi laukus pirms saglabāšanas.",
        importScreenshotNoFile: "Vispirms izvēlies attēlu.",
        importScreenshotError: "Neizdevās importēt datus no screenshot.",
        date: "Datums",
        activityType: "Aktivitātes tips",
        runType: "Skrējiens",
        gymType: "Zāle",
        hikeType: "Pārgājiens",
        distance: "Distance (km)",
        distancePlaceholder: "Piemēram, 5",
        duration: "Ilgums",
        durationHours: "Stundas",
        durationMinutes: "Minūtes",
        durationSeconds: "Sekundes",
        pace: "Temps",
        mood: "Sajūta",
        weather: "Laikapstākļi",
        preSessionState: "Pirms aktivitātes",
        sleep: "Miegs",
        duringSession: "Aktivitātes laikā",
        optional: "Nav obligāts",
        fasted: "Tukšā dūšā",
        lightMeal: "Viegla maltīte",
        carbedUp: "Ar ogļhidrātiem",
        heavyMeal: "Smaga maltīte",
        sleepGood: "Labs",
        sleepOk: "Vidējs",
        sleepBad: "Slikts",
        water: "Ūdens",
        electrolytes: "Elektrolīti",
        gelSnacks: "Gels / Uzkodas",
        noFuel: "Bez uzņemšanas",
        notes: "Piezīmes",
        notesPlaceholder: "Tīras piezīmes par aktivitāti.",
        saveRun: "Saglabāt aktivitāti",
        saveChanges: "Saglabāt izmaiņas",
        cancelEdit: "Atcelt",
        saving: "Saglabā...",
        saveSuccess: "Aktivitāte saglabāta.",
        updateSuccess: "Izmaiņas saglabātas.",
        deleteRun: "Dzēst",
        editRun: "Labot",
        deleteSuccess: "Aktivitāte izdzēsta.",
        confirmDelete: "Vai tiešām dzēst šo ierakstu?",
        runsTitle: "Manas aktivitātes",
        runsText: "Šeit redzi tikai savus ierakstus.",
        activityFilter: "Filtrs",
        allActivities: "Visas",
        exportCsv: "Eksportēt CSV",
        exportNoRows: "Nav aktivitāšu, ko eksportēt.",
        noFilteredRuns: "Nav aktivitāšu šajā filtrā.",
        loadingRuns: "Ielādē skrējienus...",
        noRuns: "Vēl nav nevienas aktivitātes. Pievieno pirmo ierakstu.",
        noNotes: "Nav piezīmju.",
        mustLogin: "Tev vispirms jāielogojas.",
        invalidPace: "Ievadi distance un ilgumu, lai redzētu tempu.",
        errorPrefix: "Kļūda",
        distanceLabel: "Distance",
        durationLabel: "Ilgums",
        paceLabel: "Temps",
        notesLabel: "Piezīmes",
        profileTab: "Profils",
        runsTab: "Aktivitātes",
        dashboardTab: "Dashboard",
        profileTitle: "Tavs profils",
        profileText: "Pārvaldi savu profilu un iestatījumus.",
        username: "Lietotājvārds",
        usernamePlaceholder: "Piemēram, Juris",
        unitLabel: "Noklusētā distance",
        watchLabel: "Pulkstenis",
        watchPlaceholder: "Piemēram, Garmin Forerunner 255",
        emailReadOnly: "E-pasts",
        changePasswordTitle: "Mainīt paroli",
        newPasswordShort: "Jaunā parole",
        confirmNewPasswordShort: "Atkārto jauno paroli",
        saveProfile: "Saglabāt profilu",
        profileSaving: "Saglabā...",
        profileSaved: "Profils saglabāts.",
        kilometers: "Kilometri (km)",
        miles: "Jūdzes (mi)",
        insightsButton: "Insights",
        monthlyIdentityTab: "Mēneša identitāte",
        shareImage: "Share as image",
        imageSaved: "Attēls ir sagatavots kopīgošanai.",
        imageDownloaded: "Attēls lejupielādēts.",
        hideInsights: "Paslēpt insights",
        insightsTitle: "Insight engine",
        insightsSubtitle: "Īss pārskats no taviem aktivitāšu datiem.",
        insightSportFilter: "Sporta veids",
        insightAllSports: "Skrējieni + pārgājieni",
        insightsNotEnough: "Pievieno vismaz 2 aktivitātes ar distanci, lai redzētu jēgpilnus insights.",
        insightsBasedOn: "Balstīts uz",
        insightsActivities: "aktivitātēm",
        insightsAvgPace: "Vidējais temps",
        insightsTotalDistance: "Kopējā distance",
        insightsAvgDistance: "Vidējā distance",
        insightsTrend: "Temps",
        insightsBestContext: "Labākais konteksts",
        insightsNoContext: "Vēl nav pietiekami daudz miega, ēšanas vai fuel datu.",
        insightsGymAvgDuration: "Vidējais ilgums",
        insightsGymTotalDuration: "Kopējais ilgums",
        insightsGymLatestDuration: "Pēdējais ilgums",
        insightsGymTrend: "Ilgums",
        chartTitle: "Tempa trends",
        chartSubtitle: "Pēdējās 12 aktivitātes ar distanci.",
        notEnoughChartData: "Vajag vismaz 2 aktivitātes ar distanci, lai parādītu grafiku.",
        latestPace: "Pēdējais temps",
        chartEntries: "ieraksti",
        giveFeedback: "Give feedback",
        feedbackTitle: "Nosūtīt feedback",
        feedbackSubtitle: "Pastāsti, kas jāuzlabo, kas nestrādā vai kas pietrūkst Runology.",
        feedbackEmail: "E-pasts",
        feedbackEmailPlaceholder: "nav obligāts",
        feedbackMessage: "Feedback",
        feedbackMessagePlaceholder: "Uzraksti savu ziņu...",
        feedbackRequired: "Ievadi feedback tekstu.",
        feedbackSend: "Send",
        feedbackSending: "Sūta...",
        feedbackCancel: "Atcelt",
        feedbackSuccess: "Paldies. Feedback nosūtīts.",
        feedbackError: "Neizdevās nosūtīt feedback.",
      },
      en: {
        brand: "RUNOLOGY",
        loadingApp: "Loading app...",
        heroTitle: "Your activity journal.",
        heroText:
          "No leaderboards. No social pressure. Just you, your activities, and how they made you feel.",
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
        headerTitle: "All your activities in one place",
        loggedInAs: "Logged in as",
        logout: "Log out",
        addRunTitle: "Add activity",
        addActivityButton: "+ Add activity",
        closeActivityModal: "Close",
        editRunTitle: "Edit activity",
        addRunText: "Save your next activity.",
        editRunText: "Update the selected entry and save your changes.",
        importScreenshot: "Import from Strava screenshot",
        importScreenshotHelp: "Choose a Strava screenshot, check the preview, then import the data.",
        chooseScreenshot: "Choose image",
        importScreenshotButton: "Import data",
        importingScreenshot: "Importing...",
        removeScreenshot: "Remove image",
        screenshotPreview: "Screenshot preview",
        importScreenshotSuccess: "Data imported. Review the fields before saving.",
        importScreenshotNoFile: "Choose an image first.",
        importScreenshotError: "Could not import data from screenshot.",
        date: "Date",
        activityType: "Activity type",
        runType: "Run",
        gymType: "Gym",
        hikeType: "Hike",
        distance: "Distance (km)",
        distancePlaceholder: "For example, 5",
        duration: "Duration",
        durationHours: "Hours",
        durationMinutes: "Minutes",
        durationSeconds: "Seconds",
        pace: "Pace",
        mood: "Feeling",
        weather: "Weather",
        preSessionState: "Pre session state",
        sleep: "Sleep",
        duringSession: "During session",
        optional: "Optional",
        fasted: "Fasted",
        lightMeal: "Light meal",
        carbedUp: "Carbed up",
        heavyMeal: "Heavy meal",
        sleepGood: "Good",
        sleepOk: "OK",
        sleepBad: "Bad",
        water: "Water",
        electrolytes: "Electrolytes",
        gelSnacks: "Gel / Snacks",
        noFuel: "No fuel",
        notes: "Notes",
        notesPlaceholder: "Only notes about the activity.",
        saveRun: "Save activity",
        saveChanges: "Save changes",
        cancelEdit: "Cancel",
        saving: "Saving...",
        saveSuccess: "Run saved.",
        updateSuccess: "Changes saved.",
        deleteRun: "Delete",
        editRun: "Edit",
        deleteSuccess: "Activity deleted.",
        confirmDelete: "Are you sure you want to delete this entry?",
        runsTitle: "My activities",
        runsText: "Only your own entries are shown here.",
        activityFilter: "Filter",
        allActivities: "All",
        exportCsv: "Export CSV",
        exportNoRows: "No activities to export.",
        noFilteredRuns: "No activities in this filter.",
        loadingRuns: "Loading runs...",
        noRuns: "No activities yet. Add your first entry.",
        noNotes: "No notes.",
        mustLogin: "You must sign in first.",
        invalidPace: "Enter distance and duration to see pace.",
        errorPrefix: "Error",
        distanceLabel: "Distance",
        durationLabel: "Duration",
        paceLabel: "Pace",
        notesLabel: "Notes",
        profileTab: "Profile",
        runsTab: "Activities",
        dashboardTab: "Dashboard",
        profileTitle: "Your profile",
        profileText: "Manage your profile and preferences.",
        username: "Username",
        usernamePlaceholder: "For example, Juris",
        unitLabel: "Default distance",
        watchLabel: "Watch",
        watchPlaceholder: "For example, Garmin Forerunner 255",
        emailReadOnly: "Email",
        changePasswordTitle: "Change password",
        newPasswordShort: "New password",
        confirmNewPasswordShort: "Confirm new password",
        saveProfile: "Save profile",
        profileSaving: "Saving...",
        profileSaved: "Profile saved.",
        kilometers: "Kilometers (km)",
        miles: "Miles (mi)",
        insightsButton: "Insights",
        monthlyIdentityTab: "Monthly Identity",
        shareImage: "Share as image",
        imageSaved: "Image is ready to share.",
        imageDownloaded: "Image downloaded.",
        hideInsights: "Hide insights",
        insightsTitle: "Insight engine",
        insightsSubtitle: "A short readout from your activity data.",
        insightSportFilter: "Sport",
        insightAllSports: "Runs + hikes",
        insightsNotEnough: "Add at least 2 distance-based activities to see useful insights.",
        insightsBasedOn: "Based on",
        insightsActivities: "activities",
        insightsAvgPace: "Average pace",
        insightsTotalDistance: "Total distance",
        insightsAvgDistance: "Average distance",
        insightsTrend: "Pace",
        insightsBestContext: "Best context",
        insightsNoContext: "Not enough sleep, pre-session, or fuel data yet.",
        insightsGymAvgDuration: "Average duration",
        insightsGymTotalDuration: "Total duration",
        insightsGymLatestDuration: "Latest duration",
        insightsGymTrend: "Duration",
        chartTitle: "Pace trend",
        chartSubtitle: "Last 12 distance-based activities.",
        notEnoughChartData: "Add at least 2 distance-based activities to show the chart.",
        latestPace: "Latest pace",
        chartEntries: "entries",
        giveFeedback: "Give feedback",
        feedbackTitle: "Send feedback",
        feedbackSubtitle: "Tell us what should be improved, what is broken, or what is missing in Runology.",
        feedbackEmail: "Email",
        feedbackEmailPlaceholder: "optional",
        feedbackMessage: "Feedback",
        feedbackMessagePlaceholder: "Write your message...",
        feedbackRequired: "Enter feedback text.",
        feedbackSend: "Send",
        feedbackSending: "Sending...",
        feedbackCancel: "Cancel",
        feedbackSuccess: "Thanks. Feedback sent.",
        feedbackError: "Could not send feedback.",
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

  const preSessionOptions = useMemo(
    () => [
      { value: "fasted", emoji: "💧", label: text.fasted },
      { value: "light_meal", emoji: "🥣", label: text.lightMeal },
      { value: "carbed_up", emoji: "🍝", label: text.carbedUp },
      { value: "heavy_meal", emoji: "🥩", label: text.heavyMeal },
    ],
    [language, text]
  );

  const sleepOptions = useMemo(
    () => [
      { value: "good", emoji: "😊", label: text.sleepGood },
      { value: "ok", emoji: "😐", label: text.sleepOk },
      { value: "bad", emoji: "🙁", label: text.sleepBad },
    ],
    [language, text]
  );

  const duringSessionOptions = useMemo(
    () => [
      { value: "water", emoji: "💧", label: text.water },
      { value: "electrolytes", emoji: "⚡", label: text.electrolytes },
      { value: "gel_snacks", emoji: "🍬", label: text.gelSnacks },
      { value: "no_fuel", emoji: "🚫", label: text.noFuel },
    ],
    [language, text]
  );

const stats = useMemo(() => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthActivities = runs.filter((activity) => {
    const activityDate = new Date(activity.date);
    return (
      activityDate.getMonth() === currentMonth &&
      activityDate.getFullYear() === currentYear
    );
  });

  const runActivities = thisMonthActivities.filter(
    (activity) => (activity.type || "run") === "run"
  );

  const hikeActivities = thisMonthActivities.filter(
    (activity) => activity.type === "hike"
  );

  const gymActivities = thisMonthActivities.filter(
    (activity) => activity.type === "gym"
  );

  function getTotalDistance(activities) {
    return activities.reduce((sum, activity) => {
      const value = parseFloat(String(activity.distance).replace(",", "."));
      return Number.isNaN(value) ? sum : sum + value;
    }, 0);
  }

  function getTotalDuration(activities) {
    return activities.reduce((sum, activity) => {
      const value = parseFloat(String(activity.duration).replace(",", "."));
      return Number.isNaN(value) ? sum : sum + value;
    }, 0);
  }

  function getAveragePace(activities) {
    const totalDistance = getTotalDistance(activities);
    const totalDuration = getTotalDuration(activities);

    if (totalDistance <= 0 || totalDuration <= 0) {
      return "—";
    }

    const totalMinutesPerKm = totalDuration / totalDistance;
    let minutes = Math.floor(totalMinutesPerKm);
    let seconds = Math.round((totalMinutesPerKm - minutes) * 60);

    if (seconds === 60) {
      minutes += 1;
      seconds = 0;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")} / km`;
  }

  function getAverageDuration(activities) {
    if (activities.length === 0) {
      return "—";
    }

    const totalDuration = getTotalDuration(activities);
    return `${Math.round(totalDuration / activities.length)} min`;
  }

  return {
    totalActivitiesThisMonth: thisMonthActivities.length,
    runCount: runActivities.length,
    runDistance: getTotalDistance(runActivities).toFixed(2),
    runPace: getAveragePace(runActivities),
    hikeCount: hikeActivities.length,
    hikeDistance: getTotalDistance(hikeActivities).toFixed(2),
    hikePace: getAveragePace(hikeActivities),
    gymCount: gymActivities.length,
    gymAverageDuration: getAverageDuration(gymActivities),
  };
}, [runs]);

const filteredRuns = useMemo(() => {
  if (activityFilter === "all") {
    return runs;
  }

  return runs.filter((run) => (run.type || "run") === activityFilter);
}, [runs, activityFilter]);

const chartData = useMemo(() => {
  return runs
    .filter((activity) => (activity.type || "run") !== "gym")
    .map((activity) => {
      const distanceValue = parseFloat(String(activity.distance).replace(",", "."));
      const durationValue = parseFloat(String(activity.duration).replace(",", "."));

      if (!distanceValue || !durationValue || distanceValue <= 0 || durationValue <= 0) {
        return null;
      }

      return {
        id: activity.id,
        date: activity.date,
        label: formatDate(activity.date),
        distance: distanceValue,
        duration: durationValue,
        pace: durationValue / distanceValue,
        type: activity.type || "run",
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-12);
}, [runs, language]);

const insightData = useMemo(() => {
  const selectedType = insightActivityType;

  const sourceActivities = runs.filter((activity) => {
    const type = activity.type || "run";

    if (selectedType === "all") {
      return type === "run" || type === "hike";
    }

    return type === selectedType;
  });

  const isGymView = selectedType === "gym";

  function formatKm(value) {
    return `${value.toFixed(1)} km`;
  }

  function formatSignedPace(value) {
    const prefix = value < 0 ? "-" : "+";
    return `${prefix}${formatPaceNumber(Math.abs(value))} / km`;
  }

  function getConfidence(count) {
    if (count >= 12) {
      return language === "lv"
        ? "Uzticamība: augsta. Datu jau ir pietiekami, lai secinājumi būtu praktiski lietojami."
        : "Confidence: high. You have enough data for practical conclusions.";
    }

    if (count >= 7) {
      return language === "lv"
        ? "Uzticamība: vidēja. Secinājumi ir lietojami, bet vēl pārbaudi tos ar nākamajiem treniņiem."
        : "Confidence: medium. The signals are useful, but validate them with future sessions.";
    }

    return language === "lv"
      ? "Uzticamība: sākotnēja. Balstīts uz nelielu datu apjomu, tāpēc izmanto kā hipnotēzi, nevis likumu."
      : "Confidence: early. Treat these as hypotheses, not fixed rules.";
  }

  function getValues(item, fieldName) {
    const rawValue = item[fieldName];
    return Array.isArray(rawValue)
      ? rawValue
      : String(rawValue || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
  }

  if (isGymView) {
    const gymActivities = sourceActivities
      .map((activity) => {
        const durationValue = parseFloat(String(activity.duration).replace(",", "."));

        if (!durationValue || durationValue <= 0) {
          return null;
        }

        return { ...activity, durationValue };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const count = gymActivities.length;
    if (count < 2) return { count, cards: [], contextLines: [], recommendations: [], patternLines: [], riskLines: [], experimentLines: [], confidenceText: "", isGymView };

    const totalDuration = gymActivities.reduce((sum, item) => sum + item.durationValue, 0);
    const avgDuration = totalDuration / count;
    const latest = gymActivities[count - 1];
    const previous = gymActivities.slice(0, -1);
    const previousAvgDuration = previous.reduce((sum, item) => sum + item.durationValue, 0) / previous.length;
    const trendDiff = latest.durationValue - previousAvgDuration;
    const lastThree = gymActivities.slice(-3);
    const lastThreeAvg = lastThree.reduce((sum, item) => sum + item.durationValue, 0) / lastThree.length;
    const longest = gymActivities.reduce((best, item) => item.durationValue > best.durationValue ? item : best, gymActivities[0]);

    const trendText = Math.abs(trendDiff) < 1
      ? language === "lv"
        ? "Pēdējais zāles treniņš bija ļoti tuvu tavam vidējam ilgumam."
        : "Your latest gym session was very close to your average duration."
      : trendDiff > 0
        ? language === "lv"
          ? `Pēdējais zāles treniņš bija par ${Math.round(trendDiff)} min garāks nekā iepriekšējais vidējais.`
          : `Your latest gym session was ${Math.round(trendDiff)} min longer than your previous average.`
        : language === "lv"
          ? `Pēdējais zāles treniņš bija par ${Math.round(Math.abs(trendDiff))} min īsāks nekā iepriekšējais vidējais.`
          : `Your latest gym session was ${Math.round(Math.abs(trendDiff))} min shorter than your previous average.`;

    const consistencyText = language === "lv"
      ? `Tev ir ${count} zāles treniņi. Vidēji viens treniņš ilgst ${Math.round(avgDuration)} min.`
      : `You have ${count} gym sessions. Average session duration is ${Math.round(avgDuration)} min.`;

    function bestCountByField(fieldName, options, minItems = 2) {
      const groups = new Map();

      gymActivities.forEach((item) => {
        getValues(item, fieldName).forEach((value) => {
          if (!groups.has(value)) groups.set(value, []);
          groups.get(value).push(item);
        });
      });

      return Array.from(groups.entries())
        .map(([value, items]) => ({ value, label: getOptionLabel(options, value), count: items.length }))
        .filter((item) => item.count >= minItems && item.label)
        .sort((a, b) => b.count - a.count)[0] || null;
    }

    const commonSleep = bestCountByField("sleep_quality", sleepOptions);
    const commonPreSession = bestCountByField("pre_session_state", preSessionOptions);
    const commonFuel = bestCountByField("during_session_fuel", duringSessionOptions);

    const contextLines = [
      commonPreSession ? `${text.preSessionState}: ${commonPreSession.label} (${commonPreSession.count}x)` : "",
      commonSleep ? `${text.sleep}: ${commonSleep.label} (${commonSleep.count}x)` : "",
      commonFuel ? `${text.duringSession}: ${commonFuel.label} (${commonFuel.count}x)` : "",
    ].filter(Boolean);

    const recommendations = [
      {
        title: language === "lv" ? "Nākamais solis" : "Next step",
        body: language === "lv"
          ? `Turpini ar aptuveni ${Math.round(avgDuration)} min treniņiem. Tas ir tavs pašreizējais stabilais zāles treniņa apjoms.`
          : `Keep sessions around ${Math.round(avgDuration)} min. That is your current stable gym volume.`,
      },
      {
        title: language === "lv" ? "Progresijas tests" : "Progression test",
        body: language === "lv"
          ? `Vienu no nākamajiem treniņiem pagarini par 5–10 min tikai tad, ja iepriekšējā dienā miegs un sajūta ir laba.`
          : `Extend one of the next sessions by 5–10 min only if sleep and pre-session feel are good.`,
      },
      {
        title: language === "lv" ? "Ko pierakstīt" : "What to log",
        body: language === "lv"
          ? "Pēc zāles treniņa piezīmēs atzīmē galveno fokusu: spēks, mobilitāte, core, kājas vai augšdaļa. Tas ļaus dot precīzākus secinājumus."
          : "After gym sessions, log the main focus: strength, mobility, core, legs, or upper body. That will make future insights sharper.",
      },
    ];

    const patternLines = [
      language === "lv" ? `Pēdējo 3 zāles treniņu vidējais ilgums: ${Math.round(lastThreeAvg)} min.` : `Average duration over the last 3 gym sessions: ${Math.round(lastThreeAvg)} min.`,
      language === "lv" ? `Garākais zāles treniņš: ${Math.round(longest.durationValue)} min.` : `Longest gym session: ${Math.round(longest.durationValue)} min.`,
      ...contextLines,
    ];

    const riskLines = [
      lastThreeAvg > avgDuration * 1.25
        ? language === "lv"
          ? "Pēdējie treniņi ir būtiski garāki nekā tavs vidējais. Uzmani nogurumu un nepievieno slodzi pārāk strauji."
          : "Recent sessions are much longer than your average. Watch fatigue and avoid increasing load too quickly."
        : "",
      trendDiff < -10
        ? language === "lv"
          ? "Pēdējais treniņš bija īsāks nekā ierasts. Ja tas sakrīt ar sliktu miegu, nākamajā reizē ej uz vieglāku slodzi."
          : "The latest session was shorter than usual. If this matches poor sleep, keep the next one lighter."
        : "",
    ].filter(Boolean);

    const experimentLines = [
      language === "lv" ? "Pamēģini 2 nedēļas turēt vienādu zāles treniņa ilgumu un mainīt tikai intensitāti." : "For 2 weeks, keep gym session duration stable and change only intensity.",
      language === "lv" ? "Salīdzini zāles dienas ar nākamo skrējienu: vai pēc garāka zāles treniņa temps kļūst lēnāks?" : "Compare gym days with the next run: does pace slow down after longer gym sessions?",
      language === "lv" ? "Atzīmē, vai treniņš bija kājas/augšdaļa/core. Tas ir nākamais datu līmenis personalizētiem ieteikumiem." : "Tag whether the session was legs/upper/core. That is the next data layer for better recommendations.",
    ];

    return {
      count,
      isGymView,
      cards: [
        { title: text.insightsGymAvgDuration, value: `${Math.round(avgDuration)} min`, detail: `${text.insightsGymTotalDuration}: ${formatDurationFromMinutes(totalDuration)}` },
        { title: text.insightsGymTrend, value: formatDurationFromMinutes(latest.durationValue), detail: trendText },
        { title: text.insightsGymLatestDuration, value: formatDurationFromMinutes(latest.durationValue), detail: consistencyText },
      ],
      contextLines,
      recommendations,
      patternLines,
      riskLines,
      experimentLines,
      confidenceText: getConfidence(count),
    };
  }

  const distanceActivities = sourceActivities
    .map((activity) => {
      const distanceValue = parseFloat(String(activity.distance).replace(",", "."));
      const durationValue = parseFloat(String(activity.duration).replace(",", "."));

      if (!distanceValue || !durationValue || distanceValue <= 0 || durationValue <= 0) {
        return null;
      }

      return { ...activity, distanceValue, durationValue, paceValue: durationValue / distanceValue };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const count = distanceActivities.length;
  if (count < 2) return { count, cards: [], contextLines: [], recommendations: [], patternLines: [], riskLines: [], experimentLines: [], confidenceText: "", isGymView };

  const totalDistance = distanceActivities.reduce((sum, item) => sum + item.distanceValue, 0);
  const totalDuration = distanceActivities.reduce((sum, item) => sum + item.durationValue, 0);
  const avgPace = totalDuration / totalDistance;
  const avgDistance = totalDistance / count;
  const latest = distanceActivities[count - 1];
  const previous = distanceActivities.slice(0, -1);
  const previousDistance = previous.reduce((sum, item) => sum + item.distanceValue, 0);
  const previousDuration = previous.reduce((sum, item) => sum + item.durationValue, 0);
  const previousAvgPace = previousDuration / previousDistance;
  const trendDiff = latest.paceValue - previousAvgPace;
  const lastThree = distanceActivities.slice(-3);
  const lastThreeDistance = lastThree.reduce((sum, item) => sum + item.distanceValue, 0);
  const lastThreeDuration = lastThree.reduce((sum, item) => sum + item.durationValue, 0);
  const lastThreePace = lastThreeDuration / lastThreeDistance;
  const longest = distanceActivities.reduce((best, item) => item.distanceValue > best.distanceValue ? item : best, distanceActivities[0]);
  const fastest = distanceActivities.reduce((best, item) => item.paceValue < best.paceValue ? item : best, distanceActivities[0]);

  function averageByField(fieldName, options, minItems = 2) {
    const groups = new Map();

    distanceActivities.forEach((item) => {
      getValues(item, fieldName).forEach((value) => {
        if (!groups.has(value)) groups.set(value, []);
        groups.get(value).push(item);
      });
    });

    return Array.from(groups.entries())
      .map(([value, items]) => {
        const distanceSum = items.reduce((sum, item) => sum + item.distanceValue, 0);
        const durationSum = items.reduce((sum, item) => sum + item.durationValue, 0);
        const groupPace = durationSum / distanceSum;
        return {
          value,
          label: getOptionLabel(options, value),
          count: items.length,
          avgPace: groupPace,
          deltaFromAverage: groupPace - avgPace,
        };
      })
      .filter((item) => item.count >= minItems && item.label)
      .sort((a, b) => a.avgPace - b.avgPace);
  }

  const preSessionGroups = averageByField("pre_session_state", preSessionOptions);
  const sleepGroups = averageByField("sleep_quality", sleepOptions);
  const fuelGroups = averageByField("during_session_fuel", duringSessionOptions);
  const bestPreSession = preSessionGroups[0] || null;
  const bestSleep = sleepGroups[0] || null;
  const bestFuel = fuelGroups[0] || null;
  const worstSleep = sleepGroups.length > 1 ? sleepGroups[sleepGroups.length - 1] : null;
  const worstPreSession = preSessionGroups.length > 1 ? preSessionGroups[preSessionGroups.length - 1] : null;

  function makeContextLine(label, item) {
    if (!item) return "";
    const deltaText = Math.abs(item.deltaFromAverage) < 0.05
      ? language === "lv" ? "tuvu tavam vidējam" : "close to your average"
      : item.deltaFromAverage < 0
        ? language === "lv"
          ? `${formatPaceNumber(Math.abs(item.deltaFromAverage))} / km ātrāk nekā tavs vidējais`
          : `${formatPaceNumber(Math.abs(item.deltaFromAverage))} / km faster than your average`
        : language === "lv"
          ? `${formatPaceNumber(item.deltaFromAverage)} / km lēnāk nekā tavs vidējais`
          : `${formatPaceNumber(item.deltaFromAverage)} / km slower than your average`;

    return `${label}: ${item.label} (${formatPaceNumber(item.avgPace)} / km, ${deltaText}, ${item.count}x)`;
  }

  const contextLines = [
    makeContextLine(text.preSessionState, bestPreSession),
    makeContextLine(text.sleep, bestSleep),
    makeContextLine(text.duringSession, bestFuel),
  ].filter(Boolean);

  const trendText = Math.abs(trendDiff) < 0.05
    ? language === "lv"
      ? "Pēdējā aktivitāte ir ļoti tuvu tavam vidējam tempam."
      : "Your latest activity is very close to your average pace."
    : trendDiff < 0
      ? language === "lv"
        ? `Pēdējā aktivitāte bija par ${formatPaceNumber(Math.abs(trendDiff))} / km ātrāka nekā iepriekšējais vidējais.`
        : `Your latest activity was ${formatPaceNumber(Math.abs(trendDiff))} / km faster than your previous average.`
      : language === "lv"
        ? `Pēdējā aktivitāte bija par ${formatPaceNumber(trendDiff)} / km lēnāka nekā iepriekšējais vidējais.`
        : `Your latest activity was ${formatPaceNumber(trendDiff)} / km slower than your previous average.`;

  const consistencyText = language === "lv"
    ? `Tev ir ${count} aktivitātes ar distanci. Vidēji viena aktivitāte ir ${formatKm(avgDistance)}.`
    : `You have ${count} distance-based activities. Average distance is ${formatKm(avgDistance)}.`;

  const recommendations = [
    bestPreSession && bestPreSession.deltaFromAverage < -0.05
      ? {
          title: language === "lv" ? "Ko atkārtot" : "Repeat this",
          body: language === "lv"
            ? `Plāno svarīgākos skrējienus ar statusu “${bestPreSession.label}”. Šajā kontekstā tavs temps ir ${formatPaceNumber(Math.abs(bestPreSession.deltaFromAverage))} / km labāks par vidējo.`
            : `Plan key runs with “${bestPreSession.label}”. In this context your pace is ${formatPaceNumber(Math.abs(bestPreSession.deltaFromAverage))} / km better than average.`,
        }
      : null,
    bestSleep && bestSleep.deltaFromAverage < -0.05
      ? {
          title: language === "lv" ? "Miega signāls" : "Sleep signal",
          body: language === "lv"
            ? `Kad miegs ir “${bestSleep.label}”, tev parasti iet labāk. Šādas dienas izmanto kvalitātes treniņiem.`
            : `When sleep is “${bestSleep.label}”, performance is usually better. Use those days for quality sessions.`,
        }
      : null,
    bestFuel && bestFuel.deltaFromAverage < -0.05
      ? {
          title: language === "lv" ? "Fuel stratēģija" : "Fuel strategy",
          body: language === "lv"
            ? `“${bestFuel.label}” šobrīd izskatās kā labākais variants aktivitātes laikā. Pārbaudi to vēl 2–3 līdzīgos skrējienos.`
            : `“${bestFuel.label}” currently looks like the best in-session option. Test it in 2–3 similar runs.`,
        }
      : null,
    {
      title: language === "lv" ? "Nākamais skrējiens" : "Next run",
      body: language === "lv"
        ? `Mērķis: ${formatKm(avgDistance)}–${formatKm(avgDistance * 1.15)} vieglā tempā. Salīdzini sajūtu un tempu ar pašreizējo vidējo ${formatPaceNumber(avgPace)} / km.`
        : `Target: ${formatKm(avgDistance)}–${formatKm(avgDistance * 1.15)} at easy effort. Compare feel and pace with your current average of ${formatPaceNumber(avgPace)} / km.`,
    },
  ].filter(Boolean).slice(0, 4);

  const patternLines = [
    language === "lv" ? `Pēdējo 3 aktivitāšu temps: ${formatPaceNumber(lastThreePace)} / km (${formatSignedPace(lastThreePace - avgPace)} pret kopējo vidējo).` : `Last 3 activity pace: ${formatPaceNumber(lastThreePace)} / km (${formatSignedPace(lastThreePace - avgPace)} vs total average).`,
    language === "lv" ? `Ātrākā aktivitāte: ${formatPaceNumber(fastest.paceValue)} / km pie ${formatKm(fastest.distanceValue)}.` : `Fastest activity: ${formatPaceNumber(fastest.paceValue)} / km over ${formatKm(fastest.distanceValue)}.`,
    language === "lv" ? `Garākā aktivitāte: ${formatKm(longest.distanceValue)} ar tempu ${formatPaceNumber(longest.paceValue)} / km.` : `Longest activity: ${formatKm(longest.distanceValue)} at ${formatPaceNumber(longest.paceValue)} / km.`,
  ];

  const riskLines = [
    worstSleep && worstSleep.deltaFromAverage > 0.05
      ? language === "lv"
        ? `Uzmanies ar “${worstSleep.label}” miegu: šajā grupā temps ir ${formatPaceNumber(worstSleep.deltaFromAverage)} / km lēnāks par vidējo.`
        : `Watch “${worstSleep.label}” sleep: this group is ${formatPaceNumber(worstSleep.deltaFromAverage)} / km slower than average.`
      : "",
    worstPreSession && worstPreSession.deltaFromAverage > 0.05
      ? language === "lv"
        ? `“${worstPreSession.label}” pirms aktivitātes pašlaik izskatās vājākais konteksts. Neliec tur svarīgākos skrējienus.`
        : `“${worstPreSession.label}” currently looks like the weakest pre-session context. Avoid key runs there.`
      : "",
    latest.distanceValue > avgDistance * 1.35
      ? language === "lv"
        ? "Pēdējā aktivitāte bija būtiski garāka par tavu vidējo. Nākamo treniņu labāk turi vieglu."
        : "The latest activity was much longer than your average. Keep the next session easy."
      : "",
  ].filter(Boolean);

  const experimentLines = [
    language === "lv" ? "2 skrējienus pēc kārtas atkārto labāko kontekstu un pārbaudi, vai temps turas labāks." : "Repeat the best context for 2 runs and check whether pace stays better.",
    language === "lv" ? "Vienu vieglo skrējienu dari bez tempa mērķa, bet pēc tam pieraksti sajūtu. Tas palīdz nošķirt formu no noguruma." : "Do one easy run without a pace target, then log how it felt. This helps separate fitness from fatigue.",
    language === "lv" ? "Ja skrējiens ir virs 45 min, salīdzini fuel variantus: ūdens, elektrolīti, gels/uzkodas." : "For runs over 45 min, compare fuel options: water, electrolytes, gel/snacks.",
    language === "lv" ? "Pēc slikta miega izvēlies vieglu skrējienu, nevis kvalitātes treniņu. Tad salīdzini atjaunošanos." : "After poor sleep, choose an easy run instead of quality work. Then compare recovery.",
    language === "lv" ? "Pievieno piezīmēs vienu teikumu: kas šodien palīdzēja vai traucēja. Tas nākamajiem insights dos daudz vairāk konteksta." : "Add one sentence in notes: what helped or hurt today. That gives future insights much more context.",
  ];

  return {
    count,
    isGymView,
    cards: [
      { title: text.insightsAvgPace, value: `${formatPaceNumber(avgPace)} / km`, detail: `${text.insightsTotalDistance}: ${formatKm(totalDistance)}` },
      { title: text.insightsTrend, value: formatPaceNumber(latest.paceValue) + " / km", detail: trendText },
      { title: text.insightsAvgDistance, value: formatKm(avgDistance), detail: consistencyText },
    ],
    contextLines,
    recommendations,
    patternLines,
    riskLines,
    experimentLines,
    confidenceText: getConfidence(count),
  };
}, [runs, language, preSessionOptions, sleepOptions, duringSessionOptions, text, insightActivityType]);
const monthlyIdentity = useMemo(() => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const locale = language === "lv" ? "lv-LV" : "en-GB";
  const monthName = now.toLocaleDateString(locale, { month: "long", year: "numeric" });

  const monthlyRuns = runs
    .filter((run) => {
      if (!run.date) return false;
      const date = new Date(run.date);
      return !Number.isNaN(date.getTime()) && date.getMonth() === month && date.getFullYear() === year;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const totalSessions = monthlyRuns.length;

  function getRatio(count) {
    if (!totalSessions) return 0;
    return count / totalSessions;
  }

  function percent(value) {
    return `${Math.round(value * 100)}%`;
  }

  function getMaxGapBetweenSessions(items) {
    if (items.length < 2) return 0;

    let maxGap = 0;
    for (let index = 1; index < items.length; index += 1) {
      const previous = new Date(items[index - 1].date);
      const current = new Date(items[index].date);
      const gap = Math.round((current - previous) / (1000 * 60 * 60 * 24));
      if (gap > maxGap) maxGap = gap;
    }
    return maxGap;
  }

  const fastedCount = monthlyRuns.filter((run) => run.pre_session_state === "fasted").length;
  const carbedCount = monthlyRuns.filter((run) => run.pre_session_state === "carbed_up").length;
  const goodSleepCount = monthlyRuns.filter((run) => run.sleep_quality === "good").length;
  const hardCount = monthlyRuns.filter((run) => run.mood === "😓" || run.mood === "🥵").length;
  const strongCount = monthlyRuns.filter((run) => run.mood === "😄" || run.mood === "🙂").length;

  const fastedRatio = getRatio(fastedCount);
  const carbedRatio = getRatio(carbedCount);
  const hardRatio = getRatio(hardCount);
  const strongRatio = getRatio(strongCount);
  const maxGap = getMaxGapBetweenSessions(monthlyRuns);

  const copy = {
    lv: {
      title: "Monthly Identity",
      basedOn: `Balstīts uz ${monthName} aktivitātēm`,
      share: "Share",
      copied: "Monthly Identity nokopēts.",
      showingUp: {
        line: "Šis mēnesis bija par parādīšanos.",
        reason: "Katra aktivitāte skaitās — konsekvence sākas maziem soļiem.",
      },
      consistent: {
        line: "Šomēnes tu trenējies kā Consistent Builder.",
        reason: `Tu pabeidzi ${totalSessions} aktivitātes bez gariem pārtraukumiem.`,
      },
      fasted: {
        line: "Šomēnes tu trenējies kā Fasted Machine.",
        reason: `${percent(fastedRatio)} aktivitāšu bija tukšā dūšā.`,
      },
      fueled: {
        line: "Šomēnes tu trenējies kā Fuel-Focused Athlete.",
        reason: "Vairāk nekā puse aktivitāšu bija ar ogļhidrātu uzņemšanu pirms treniņa.",
      },
      resilient: {
        line: "Šomēnes tu trenējies kā Resilient Trainer.",
        reason: "Pat ar daudz grūtām aktivitātēm tu turpināji kustēties.",
      },
      strong: {
        line: "Šomēnes tu trenējies kā Strong Finisher.",
        reason: "Daudzas aktivitātes beidzās ar labu sajūtu.",
      },
      balanced: {
        line: "Šomēnes tu trenējies kā Balanced Trainer.",
        reason: "Tavi treniņi bija stabili dažādos apstākļos.",
      },
      extraFastedHard: "Tukšā dūšā veiktās aktivitātes biežāk tika atzīmētas kā grūtas.",
      extraSleepStrong: "Laba miega dienās aktivitātes biežāk beidzās ar labu sajūtu.",
    },
    en: {
      title: "Monthly Identity",
      basedOn: `Based on ${monthName} sessions`,
      share: "Share",
      copied: "Monthly Identity copied.",
      showingUp: {
        line: "This month was about showing up.",
        reason: "Every session counts — consistency starts small.",
      },
      consistent: {
        line: "This month you trained like a Consistent Builder.",
        reason: `You completed ${totalSessions} sessions with no long breaks.`,
      },
      fasted: {
        line: "This month you trained like a Fasted Machine.",
        reason: `${percent(fastedRatio)} of your sessions were fasted.`,
      },
      fueled: {
        line: "This month you trained like a Fuel-Focused Athlete.",
        reason: "More than half of your sessions were carbed up before training.",
      },
      resilient: {
        line: "This month you trained like a Resilient Trainer.",
        reason: "Even with many hard sessions, you kept showing up.",
      },
      strong: {
        line: "This month you trained like a Strong Finisher.",
        reason: "Many of your sessions ended feeling strong.",
      },
      balanced: {
        line: "This month you trained like a Balanced Trainer.",
        reason: "Your training stayed steady across different conditions.",
      },
      extraFastedHard: "Fasted sessions were more often marked as hard.",
      extraSleepStrong: "Good sleep days more often ended with strong sessions.",
    },
  }[language];

  let identity = copy.balanced;
  if (totalSessions < 4) identity = copy.showingUp;
  else if (totalSessions >= 12 && maxGap <= 4) identity = copy.consistent;
  else if (hardRatio >= 0.5 && totalSessions >= 8) identity = copy.resilient;
  else if (strongRatio >= 0.4 && totalSessions >= 6) identity = copy.strong;
  else if (fastedRatio >= 0.5 && totalSessions >= 6) identity = copy.fasted;
  else if (carbedRatio >= 0.5 && totalSessions >= 6) identity = copy.fueled;

  let supportingInsight = "";
  if (fastedCount >= 3 && hardCount >= 3) {
    const fastedHardCount = monthlyRuns.filter((run) => run.pre_session_state === "fasted" && (run.mood === "😓" || run.mood === "🥵")).length;
    if (fastedHardCount / fastedCount >= 0.5) supportingInsight = copy.extraFastedHard;
  }

  if (!supportingInsight && goodSleepCount >= 3 && strongCount >= 3) {
    const goodSleepStrongCount = monthlyRuns.filter((run) => run.sleep_quality === "good" && (run.mood === "😄" || run.mood === "🙂")).length;
    if (goodSleepStrongCount / goodSleepCount >= 0.5) supportingInsight = copy.extraSleepStrong;
  }

  const shareText = `Runology Monthly Identity\n\n${identity.line}\n${identity.reason}${supportingInsight ? `\n\n${supportingInsight}` : ""}`;

  return {
    ...identity,
    title: copy.title,
    basedOn: copy.basedOn,
    shareLabel: copy.share,
    copiedMessage: copy.copied,
    supportingInsight,
    totalSessions,
    maxGap,
    shareText,
  };
}, [runs, language]);

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

  useEffect(() => {
    if (session) {
      fetchProfile();
    } else {
      setUsername("");
      setUnit("km");
      setWatch("");
      setProfileMessage("");
      setProfileError("");
    }
  }, [session]);

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
async function fetchProfile() {
  if (!session) return;

  setProfileLoading(true);
  setProfileError("");
  setProfileMessage("");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  if (error) {
    setProfileError(formatSupabaseError(error.message, language));
    setProfileLoading(false);
    return;
  }

  if (!data) {
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: session.user.id,
        username: "",
        unit: "km",
        watch: "",
      },
    ]);

    if (insertError) {
      setProfileError(formatSupabaseError(insertError.message, language));
      setProfileLoading(false);
      return;
    }

    setUsername("");
    setUnit("km");
    setWatch("");
    setProfileLoading(false);
    return;
  }

  setUsername(data.username || "");
  setUnit(data.unit || "km");
  setWatch(data.watch || "");
  setProfileLoading(false);
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
      setAuthMode("signupSuccess");
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
async function handleSaveProfile(e) {
  e.preventDefault();

  if (!session) return;

  setProfileSaving(true);
  setProfileError("");
  setProfileMessage("");

  const { error } = await supabase
    .from("profiles")
    .update({
      username: username.trim(),
      unit,
      watch: watch.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id);

  if (error) {
    setProfileError(formatSupabaseError(error.message, language));
    setProfileSaving(false);
    return;
  }

  if (profilePassword || profilePasswordConfirm) {
    if (profilePassword !== profilePasswordConfirm) {
      setProfileError(language === "lv" ? "Paroles nesakrīt." : "Passwords do not match.");
      setProfileSaving(false);
      return;
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: profilePassword,
    });

    if (passwordError) {
      setProfileError(formatSupabaseError(passwordError.message, language));
      setProfileSaving(false);
      return;
    }
  }

  setProfilePassword("");
  setProfilePasswordConfirm("");
  setProfileMessage(
    language === "lv" ? "Profils saglabāts." : "Profile saved."
  );
  setProfileSaving(false);
}



  function handleScreenshotChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }

    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  }

  function handleRemoveScreenshot() {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }

    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotImportLoading(false);
  }

  async function handleImportScreenshotData() {
    if (!screenshotFile) {
      setError(text.importScreenshotNoFile);
      return;
    }

    setScreenshotImportLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", screenshotFile);

    try {
      const response = await fetch(
        "https://pmfwfbgdpfvdjdrcpqqm.supabase.co/functions/v1/import-strava-screenshot",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Import failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Empty import response");
      }

      if (data.activity_type) {
        const importedType = String(data.activity_type).toLowerCase();

        if (["run", "gym", "hike"].includes(importedType)) {
          setActivityType(importedType);
        } else if (["walk", "walking"].includes(importedType)) {
          setActivityType("hike");
        } else {
          setActivityType("run");
        }
      }

      if (data.date) setDate(String(data.date));
      if (data.distance !== undefined) setDistance(String(data.distance));
      if (data.duration_hours !== undefined) setDurationHours(String(data.duration_hours));
      if (data.duration_minutes !== undefined) setDurationMinutes(String(data.duration_minutes));
      if (data.duration_seconds !== undefined) setDurationSeconds(String(data.duration_seconds));

      setMessage(text.importScreenshotSuccess);
      console.log("Strava screenshot import result:", data);
    } catch (err) {
      console.error("Strava screenshot import failed:", err);
      setError(text.importScreenshotError);
    } finally {
      setScreenshotImportLoading(false);
    }
  }

  function resetForm() {
    setDate(new Date().toISOString().slice(0, 10));
    setActivityType("run");
    setDistance("");
    setDurationHours("");
    setDurationMinutes("");
    setDurationSeconds("");
    setScreenshotFile(null);
    setScreenshotImportLoading(false);
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotPreview(null);
    setNotes("");
    setMood("🙂");
    setWeather("☀️");
    setPreSessionState("");
    setSleepQuality("");
    setDuringSessionFuel([]);
    setEditingRunId(null);
  }

  function minutesToDurationInput(value) {
    const totalSeconds = Math.round(Number(value) * 60);

    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
      return "";
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  function handleStartEdit(run) {
    setEditingRunId(run.id);
    setDate(run.date || "");
    setActivityType(run.type || "run");
    setDistance(run.distance != null ? String(run.distance) : "");
    const editDuration = splitDurationMinutes(run.duration);
    setDurationHours(editDuration.hours);
    setDurationMinutes(editDuration.minutes);
    setDurationSeconds(editDuration.seconds);
    setNotes(run.notes || "");
    setMood(run.mood || "🙂");
    setWeather(run.weather || "☀️");
    setPreSessionState(run.pre_session_state || "");
    setSleepQuality(run.sleep_quality || "");
    setDuringSessionFuel(
      Array.isArray(run.during_session_fuel)
        ? run.during_session_fuel
        : String(run.during_session_fuel || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    );
    setMessage("");
    setError("");
    setIsActivityModalOpen(true);
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("");
    setError("");
    setIsActivityModalOpen(false);
  }

function durationPartsToMinutes(hoursValue, minutesValue, secondsValue) {
  const hours = hoursValue === "" ? 0 : Number(hoursValue);
  const minutes = minutesValue === "" ? 0 : Number(minutesValue);
  const seconds = secondsValue === "" ? 0 : Number(secondsValue);

  if (
    !Number.isFinite(hours) ||
    !Number.isFinite(minutes) ||
    !Number.isFinite(seconds) ||
    hours < 0 ||
    minutes < 0 ||
    seconds < 0 ||
    minutes > 59 ||
    seconds > 59
  ) {
    return NaN;
  }

  return hours * 60 + minutes + seconds / 60;
}

function splitDurationMinutes(value) {
  const totalSeconds = Math.round(Number(value) * 60);

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return { hours: "", minutes: "", seconds: "" };
  }

  return {
    hours: String(Math.floor(totalSeconds / 3600)),
    minutes: String(Math.floor((totalSeconds % 3600) / 60)),
    seconds: String(totalSeconds % 60),
  };
}

function formatDurationFromMinutes(value) {
  const totalSeconds = Math.round(Number(value) * 60);

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

  async function handleSubmit(e) {
    e.preventDefault();

    if (!session) {
      setError(text.mustLogin);
      return;
    }

    const parsedDistance =
      activityType === "gym" && distance === ""
        ? 0
        : parseFloat(String(distance).replace(",", "."));

     const parsedDuration = durationPartsToMinutes(durationHours, durationMinutes, durationSeconds);   

    if (
      Number.isNaN(parsedDuration) ||
      parsedDuration <= 0 ||

      
      (activityType !== "gym" &&
        (Number.isNaN(parsedDistance) || parsedDistance <= 0))
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
    type: activityType,
    distance: parsedDistance,
    duration: parsedDuration,
    notes: String(notes),
    mood,
    weather,
    pre_session_state: preSessionState || null,
    sleep_quality: sleepQuality || null,
    during_session_fuel: duringSessionFuel.join(","),
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
  setIsActivityModalOpen(false);
  await fetchRuns();
  setSaving(false);
  return;
}

    let saveResponse;

    try {
      saveResponse = await fetch(
        "https://pmfwfbgdpfvdjdrcpqqm.supabase.co/functions/v1/save-activity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            activity_type: activityType,
            distance: parsedDistance,
            duration_hours: String(durationHours || "0"),
            duration_minutes: String(durationMinutes || "0"),
            duration_seconds: String(durationSeconds || "0"),
            duration_minutes_total: parsedDuration,
            notes: String(notes),
            mood,
            weather,
            pre_session_state: preSessionState || null,
            sleep_quality: sleepQuality || null,
            during_session_fuel: duringSessionFuel.join(","),
            user_id: session.user.id,
          }),
        }
      );
    } catch (err) {
      setError(language === "lv" ? "Neizdevās saglabāt aktivitāti." : "Could not save activity.");
      setSaving(false);
      return;
    }

    const saveResult = await saveResponse.json().catch(() => null);

    if (!saveResponse.ok || saveResult?.error) {
      setError(saveResult?.error || (language === "lv" ? "Neizdevās saglabāt aktivitāti." : "Could not save activity."));
      setSaving(false);
      return;
    }

    resetForm();
    setIsActivityModalOpen(false);
    setMessage(text.saveSuccess);
    await fetchRuns();
    setSaving(false);
  }

  function openFeedbackModal() {
    setFeedbackEmail(session?.user?.email || "");
    setFeedbackMessage("");
    setFeedbackStatus("");
    setFeedbackError("");
    setIsFeedbackModalOpen(true);
  }

  function closeFeedbackModal() {
    if (feedbackLoading) return;

    setIsFeedbackModalOpen(false);
    setFeedbackStatus("");
    setFeedbackError("");
  }

  async function handleSendFeedback(e) {
    e.preventDefault();

    const cleanMessage = feedbackMessage.trim();
    const cleanEmail = feedbackEmail.trim();

    if (!cleanMessage) {
      setFeedbackError(text.feedbackRequired);
      setFeedbackStatus("");
      return;
    }

    setFeedbackLoading(true);
    setFeedbackStatus("");
    setFeedbackError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail || null,
          message: cleanMessage,
          user_id: session?.user?.id || null,
          user_email: session?.user?.email || null,
          page: typeof window !== "undefined" ? window.location.href : null,
          language,
          created_at: new Date().toISOString(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.error) {
        throw new Error(result?.error || text.feedbackError);
      }

      setFeedbackStatus(text.feedbackSuccess);
      setFeedbackMessage("");
    } catch (err) {
      setFeedbackError(err?.message || text.feedbackError);
    } finally {
      setFeedbackLoading(false);
    }
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

  const distanceInKm = unit === "miles" ? distanceNum * 1.60934 : distanceNum;

  const totalMinutesPerKm = durationNum / distanceInKm;
  let minutes = Math.floor(totalMinutesPerKm);
  let seconds = Math.round((totalMinutesPerKm - minutes) * 60);

  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")} / ${
    unit === "miles" ? "mi" : "km"
  }`;
}
function getActivityTypeLabel(typeValue) {
  const normalizedType = typeValue || "run";

  if (normalizedType === "gym") return text.gymType;
  if (normalizedType === "hike") return text.hikeType;
  return text.runType;
}

function getOptionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || "";
}

function getDuringSessionLabels(value) {
  const values = Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return values
    .map((item) => getOptionLabel(duringSessionOptions, item))
    .filter(Boolean)
    .join("; ");
}

function csvEscape(value) {
  if (value === null || value === undefined) return '""';

  const normalized = String(value).replace(/\r?\n|\r/g, " ").trim();
  return `"${normalized.replace(/"/g, '""')}"`;
}

async function handleShareMonthlyIdentity() {
  const shareText = monthlyIdentity.shareText;

  try {
    if (navigator.share) {
      await navigator.share({
        title: monthlyIdentity.title,
        text: shareText,
      });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    setMessage(monthlyIdentity.copiedMessage);
  } catch (shareError) {
    if (shareError?.name !== "AbortError") {
      setError(shareError.message || String(shareError));
    }
  }
}

async function handleShareMonthlyIdentityImage() {
  try {
    const canvas = document.createElement("canvas");
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const accent = "#22c55e";
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#153b25");
    bg.addColorStop(0.42, "#101010");
    bg.addColorStop(1, "#050505");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(34, 197, 94, 0.16)";
    ctx.beginPath();
    ctx.arc(160, 120, 280, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.055)";
    roundRect(ctx, 80, 110, 920, 1130, 56);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 2;
    roundRect(ctx, 80, 110, 920, 1130, 56);
    ctx.stroke();

    ctx.fillStyle = accent;
    ctx.font = "700 34px Arial, sans-serif";
    ctx.fillText("RUNOLOGY", 140, 195);

    ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
    ctx.font = "500 30px Arial, sans-serif";
    ctx.fillText(monthlyIdentity.basedOn, 140, 250);

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 70px Arial, sans-serif";
    wrapCanvasText(ctx, monthlyIdentity.line, 140, 390, 800, 84, 4);

    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
    ctx.font = "500 38px Arial, sans-serif";
    const reasonEndY = wrapCanvasText(ctx, monthlyIdentity.reason, 140, 735, 800, 52, 4);

    if (monthlyIdentity.supportingInsight) {
      ctx.fillStyle = "rgba(34, 197, 94, 0.16)";
      roundRect(ctx, 140, reasonEndY + 48, 800, 150, 32);
      ctx.fill();

      ctx.fillStyle = "#d7ffe6";
      ctx.font = "600 31px Arial, sans-serif";
      wrapCanvasText(ctx, monthlyIdentity.supportingInsight, 180, reasonEndY + 105, 720, 42, 3);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "500 28px Arial, sans-serif";
    ctx.fillText(language === "lv" ? "Mēneša identitāte" : "Monthly Identity", 140, 1145);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;

    const file = new File([blob], "runology-monthly-identity.png", { type: "image/png" });

    if (navigator.canShare?.({ files: [file] }) && navigator.share) {
      await navigator.share({
        title: monthlyIdentity.title,
        text: monthlyIdentity.shareText,
        files: [file],
      });
      setMessage(text.imageSaved);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "runology-monthly-identity.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(text.imageDownloaded);
  } catch (shareError) {
    if (shareError?.name !== "AbortError") {
      setError(shareError.message || String(shareError));
    }
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function wrapCanvasText(ctx, textValue, x, y, maxWidth, lineHeight, maxLines = 10) {
  const words = String(textValue || "").split(" ");
  let line = "";
  let currentY = y;
  let lines = 0;

  for (let index = 0; index < words.length; index += 1) {
    const testLine = line ? `${line} ${words[index]}` : words[index];
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      lines += 1;
      if (lines >= maxLines) {
        ctx.fillText(`${line.replace(/\.$/, "")}…`, x, currentY);
        return currentY + lineHeight;
      }
      ctx.fillText(line, x, currentY);
      line = words[index];
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  }

  return currentY;
}

function handleExportCsv() {
  if (filteredRuns.length === 0) {
    setError(text.exportNoRows);
    return;
  }

  const headers = [
    "date",
    "activity_type",
    "distance_km",
    "duration_minutes",
    "duration_formatted",
    "pace",
    "mood",
    "weather",
    "pre_session_state",
    "sleep",
    "during_session",
    "notes",
  ];

  const rows = filteredRuns.map((run) => {
    const durationMinutes = run.duration ?? "";
    const paceValue = (run.type || "run") === "gym" ? "" : formatPace(run.distance, run.duration);

    return [
      run.date || "",
      getActivityTypeLabel(run.type),
      run.distance ?? "",
      durationMinutes,
      formatDurationFromMinutes(run.duration),
      paceValue,
      getOptionLabel(moodOptions, run.mood) || run.mood || "",
      getOptionLabel(weatherOptions, run.weather) || run.weather || "",
      getOptionLabel(preSessionOptions, run.pre_session_state),
      getOptionLabel(sleepOptions, run.sleep_quality),
      getDuringSessionLabels(run.during_session_fuel),
      run.notes || "",
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  const filterSuffix = activityFilter === "all" ? "all" : activityFilter;

  link.href = url;
  link.download = `runology-activities-${filterSuffix}-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function convertDistance(value) {
  const num = parseFloat(String(value).replace(",", "."));
  if (!num) return value;

  if (unit === "miles") {
    return (num * 0.621371).toFixed(2);
  }

  return num.toFixed(2);
}

function getDistanceUnitLabel() {
  return unit === "miles" ? "mi" : "km";
}

function formatPaceNumber(value) {
  if (!Number.isFinite(value) || value <= 0) return "—";

  const minutes = Math.floor(value);
  let seconds = Math.round((value - minutes) * 60);
  let safeMinutes = minutes;

  if (seconds === 60) {
    safeMinutes += 1;
    seconds = 0;
  }

  return `${safeMinutes}:${String(seconds).padStart(2, "0")}`;
}

function renderPaceTrendChart() {
  if (chartData.length < 2) {
    return <div style={styles.emptyChartText}>{text.notEnoughChartData}</div>;
  }

  const width = 620;
  const height = 220;
  const padding = 28;
  const values = chartData.map((item) => item.pace);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const points = chartData.map((item, index) => {
    const x = padding + (index / Math.max(chartData.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((item.pace - minValue) / range) * (height - padding * 2);

    return { ...item, x, y };
  });

  const polylinePoints = points.map((point) => `${point.x},${point.y}`).join(" ");
  const latest = chartData[chartData.length - 1];

  return (
    <div>
      <div style={styles.chartSummaryRow}>
        <div>
          <div style={styles.chartBigValue}>{formatPaceNumber(latest.pace)} / km</div>
          <div style={styles.chartMutedText}>{text.latestPace}</div>
        </div>
        <div style={styles.chartSmallBadge}>
          {chartData.length} {text.chartEntries}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} style={styles.chartSvg} role="img">
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        />
        <polyline
          fill="none"
          stroke="#d7e3d8"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />
        {points.map((point) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#8ad08d"
            stroke="#111111"
            strokeWidth="2"
          >
            <title>{`${point.label}: ${formatPaceNumber(point.pace)} / km`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function renderMonthlyIdentityCard() {
  return (
    <section className="runology-monthly-identity-card" style={styles.monthlyIdentityCard}>
      <div className="runology-monthly-identity-top-row" style={styles.monthlyIdentityTopRow}>
        <div>
          <div style={styles.monthlyIdentityEyebrow}>🧭 {monthlyIdentity.title}</div>
          <h2 style={styles.monthlyIdentityLine}>{monthlyIdentity.line}</h2>
        </div>
        <div className="runology-monthly-identity-actions" style={styles.monthlyIdentityActions}>
          <button type="button" onClick={handleShareMonthlyIdentity} style={styles.monthlyIdentityShareButton}>
            {monthlyIdentity.shareLabel}
          </button>
          <button type="button" onClick={handleShareMonthlyIdentityImage} style={styles.monthlyIdentityShareImageButton}>
            {text.shareImage}
          </button>
        </div>
      </div>

      <p style={styles.monthlyIdentityReason}>{monthlyIdentity.reason}</p>
      {monthlyIdentity.supportingInsight && (
        <p style={styles.monthlyIdentitySupport}>{monthlyIdentity.supportingInsight}</p>
      )}
      <div style={styles.monthlyIdentityBasedOn}>{monthlyIdentity.basedOn}</div>
    </section>
  );
}

function renderInsightsPanel() {
  const selectedInsightLabel = insightActivityType === "all"
    ? text.insightAllSports
    : insightActivityType === "run"
      ? text.runType
      : insightActivityType === "hike"
        ? text.hikeType
        : text.gymType;

  const insightFilterControl = (
    <div style={styles.insightFilterRow}>
      <label style={styles.insightFilterLabel} htmlFor="insight-activity-type">
        {text.insightSportFilter}
      </label>
      <select
        id="insight-activity-type"
        value={insightActivityType}
        onChange={(e) => setInsightActivityType(e.target.value)}
        style={styles.insightSelect}
      >
        <option value="all">{text.insightAllSports}</option>
        <option value="run">🏃 {text.runType}</option>
        <option value="hike">🥾 {text.hikeType}</option>
        <option value="gym">🏋️ {text.gymType}</option>
      </select>
    </div>
  );

  if (insightData.count < 2) {
    return (
      <section className="runology-insights-panel" style={styles.insightsPanel}>
        <div style={styles.sectionHeaderCompact}>
          <h2 style={styles.insightsTitle}>{text.insightsTitle}</h2>
          <p style={styles.insightsSubtitle}>{text.insightsSubtitle}</p>
        </div>

        {insightFilterControl}

        <div style={styles.emptyState}>
          {insightActivityType === "gym"
            ? language === "lv"
              ? `Pievieno vismaz 2 zāles aktivitātes ar ilgumu, lai redzētu ${selectedInsightLabel} insights.`
              : `Add at least 2 gym sessions with duration to see ${selectedInsightLabel} insights.`
            : text.insightsNotEnough}
        </div>
      </section>
    );
  }

  return (
    <section className="runology-insights-panel" style={styles.insightsPanel}>
      <div style={styles.sectionHeaderCompact}>
        <h2 style={styles.insightsTitle}>{text.insightsTitle}</h2>
        <p style={styles.insightsSubtitle}>
          {text.insightsBasedOn} {insightData.count} {text.insightsActivities} · {selectedInsightLabel}.
        </p>
      </div>

      {insightFilterControl}

      <div className="runology-insights-grid" style={styles.insightsGrid}>
        {insightData.cards.map((card) => (
          <div key={card.title} style={styles.insightCard}>
            <div style={styles.insightCardTitle}>{card.title}</div>
            <div style={styles.insightCardValue}>{card.value}</div>
            <div style={styles.insightCardDetail}>{card.detail}</div>
          </div>
        ))}
      </div>

      <div style={styles.insightContextBox}>
        <div style={styles.insightCardTitle}>{text.insightsBestContext}</div>
        {insightData.contextLines.length > 0 ? (
          insightData.contextLines.map((line) => (
            <div key={line} style={styles.insightContextLine}>{line}</div>
          ))
        ) : (
          <div style={styles.insightContextLine}>{text.insightsNoContext}</div>
        )}
      </div>

      {insightData.confidenceText ? (
        <div style={styles.insightConfidenceBox}>{insightData.confidenceText}</div>
      ) : null}

      {insightData.recommendations.length > 0 ? (
        <div style={styles.insightSectionBox}>
          <div style={styles.insightCardTitle}>{language === "lv" ? "Ko darīt tālāk" : "What to do next"}</div>
          <div className="runology-insight-recommendation-grid" style={styles.insightRecommendationGrid}>
            {insightData.recommendations.map((item) => (
              <div key={`${item.title}-${item.body}`} style={styles.insightRecommendationCard}>
                <div style={styles.insightRecommendationTitle}>{item.title}</div>
                <div style={styles.insightRecommendationBody}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {insightData.patternLines.length > 0 ? (
        <div style={styles.insightSectionBox}>
          <div style={styles.insightCardTitle}>{language === "lv" ? "Signāli datos" : "Signals in your data"}</div>
          {insightData.patternLines.map((line) => (
            <div key={line} style={styles.insightContextLine}>{line}</div>
          ))}
        </div>
      ) : null}

      {insightData.riskLines.length > 0 ? (
        <div style={styles.insightRiskBox}>
          <div style={styles.insightCardTitle}>{language === "lv" ? "Kam pievērst uzmanību" : "Watch-outs"}</div>
          {insightData.riskLines.map((line) => (
            <div key={line} style={styles.insightContextLine}>{line}</div>
          ))}
        </div>
      ) : null}

      {insightData.experimentLines.length > 0 ? (
        <div style={styles.insightSectionBox}>
          <div style={styles.insightCardTitle}>{language === "lv" ? "Eksperimenti nākamajām aktivitātēm" : "Experiments for upcoming activities"}</div>
          {insightData.experimentLines.map((line) => (
            <div key={line} style={styles.insightContextLine}>{line}</div>
          ))}
        </div>
      ) : null}
    </section>
  );
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

  function goToChooseMode() {
    setAuthMode("choose");
    setMessage("");
    setError("");
    setEmail("");
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

  function goHome() {
    setActiveView("runs");
    setEditingRunId(null);
    resetForm();
    setMessage("");
    setError("");
    setProfileMessage("");
    setProfileError("");

    if (!session) {
      setAuthMode("choose");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
            <button
              type="button"
              onClick={goHome}
              style={{ ...styles.brandBadge, ...styles.brandHomeButton }}
              aria-label={language === "lv" ? "Atgriezties sākumlapā" : "Back to home"}
              title={language === "lv" ? "Atgriezties sākumlapā" : "Back to home"}
            >
              {text.brand}
            </button>

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
                    : authMode === "signupSuccess"
                    ? language === "lv"
                      ? "Pārbaudi e-pastu"
                      : "Check your email"
                    : authMode === "signup"
                    ? text.signUp
                    : authMode === "login"
                    ? text.signIn
                    : text.authTitle}
                </h2>

                <p style={styles.authSubtitle}>
                  {authMode === "reset"
                    ? text.resetSubtitle
                    : authMode === "signupSuccess"
                    ? language === "lv"
                      ? "Mēs nosūtījām apstiprinājuma saiti uz tavu e-pastu."
                      : "We sent a confirmation link to your email."
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
              ) : authMode === "signupSuccess" ? (
                <div style={styles.form}>
                  <div style={styles.successBox}>
                    {text.signUpSuccess}
                  </div>

                  <button
                    className="runology-primary-button"
                    type="button"
                    onClick={goToSignInMode}
                    style={styles.primaryButton}
                  >
                    {text.signIn}
                  </button>

                  <button
                    className="runology-link-button"
                    type="button"
                    onClick={goToChooseMode}
                    style={styles.linkButton}
                  >
                    {text.backToLogin}
                  </button>
                </div>
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

              {message && authMode !== "signupSuccess" && (
                <div style={styles.successBox}>{message}</div>
              )}
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
            <button
              type="button"
              onClick={goHome}
              style={{ ...styles.topTag, ...styles.brandHomeButton }}
              aria-label={language === "lv" ? "Atgriezties sākumlapā" : "Back to home"}
              title={language === "lv" ? "Atgriezties sākumlapā" : "Back to home"}
            >
              {text.brand}
            </button>
            <h1 className="runology-app-title" style={styles.appTitle}>
              {text.headerTitle}
            </h1>
            <p style={styles.appSubtitle}>
              {text.loggedInAs}{" "}
              <strong>{username || session.user.email}</strong>
            </p>
          </div>

          <div className="runology-header-actions" style={styles.headerActions}>
            <div className="runology-view-switch" style={styles.viewSwitch}>
              <button
                type="button"
                onClick={() => {
                  setActiveView("runs");
                  setShowInsights(false);
                }}
                style={
                  activeView === "runs"
                    ? styles.viewSwitchButtonActive
                    : styles.viewSwitchButton
                }
              >
                {text.runsTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("dashboard");
                  setShowInsights(false);
                }}
                style={
                  activeView === "dashboard"
                    ? styles.viewSwitchButtonActive
                    : styles.viewSwitchButton
                }
              >
                {text.dashboardTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("insights");
                  setShowInsights(false);
                }}
                style={
                  activeView === "insights"
                    ? styles.viewSwitchButtonActive
                    : styles.viewSwitchButton
                }
              >
                {text.insightsButton}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("monthly");
                  setShowInsights(false);
                }}
                style={
                  activeView === "monthly"
                    ? styles.viewSwitchButtonActive
                    : styles.viewSwitchButton
                }
              >
                {text.monthlyIdentityTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("profile");
                  setShowInsights(false);
                }}
                style={
                  activeView === "profile"
                    ? styles.viewSwitchButtonActive
                    : styles.viewSwitchButton
                }
              >
                {text.profileTab}
              </button>
            </div>

            <button
              type="button"
              onClick={openFeedbackModal}
              style={styles.feedbackHeaderButton}
            >
              {text.giveFeedback}
            </button>

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

        {isFeedbackModalOpen && (
          <div className="runology-modal-backdrop" style={styles.modalBackdrop}>
            <div style={styles.feedbackModalCard}>
              <button
                type="button"
                onClick={closeFeedbackModal}
                disabled={feedbackLoading}
                style={styles.modalCloseButton}
                aria-label={language === "lv" ? "Aizvērt" : "Close"}
              >
                ×
              </button>

              <div style={styles.sectionHeader}>
                <h2 className="runology-section-title" style={styles.sectionTitle}>
                  {text.feedbackTitle}
                </h2>
                <p style={styles.sectionText}>{text.feedbackSubtitle}</p>
              </div>

              <form onSubmit={handleSendFeedback} style={styles.form}>
                <label style={styles.label}>{text.feedbackEmail}</label>
                <input
                  type="email"
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  placeholder={text.feedbackEmailPlaceholder}
                  style={styles.input}
                />

                <label style={styles.label}>{text.feedbackMessage}</label>
                <textarea
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  placeholder={text.feedbackMessagePlaceholder}
                  style={styles.textarea}
                  rows={6}
                  required
                />

                <div className="runology-form-actions" style={styles.formActions}>
                  <button
                    className="runology-primary-button"
                    type="submit"
                    disabled={feedbackLoading}
                    style={feedbackLoading ? styles.primaryButtonDisabled : styles.primaryButton}
                  >
                    {feedbackLoading ? text.feedbackSending : text.feedbackSend}
                  </button>
                  <button
                    className="runology-cancel-button"
                    type="button"
                    onClick={closeFeedbackModal}
                    disabled={feedbackLoading}
                    style={styles.cancelButton}
                  >
                    {text.feedbackCancel}
                  </button>
                </div>

                {feedbackStatus && <div style={styles.successBox}>{feedbackStatus}</div>}
                {feedbackError && <div style={styles.errorBox}>{feedbackError}</div>}
              </form>
            </div>
          </div>
        )}

        {activeView === "dashboard" && (
          <section className="runology-dashboard-page" style={styles.dashboardPage}>
            <div style={styles.sectionHeaderCompact}>
              <h2 className="runology-section-title" style={styles.sectionTitle}>
                {text.dashboardTab}
              </h2>
              <p style={styles.sectionSubtitle}>
                {language === "lv"
                  ? "Īss pārskats par šo mēnesi."
                  : "A quick overview of this month."}
              </p>
            </div>

            <div className="runology-stats-grid" style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>
              {language === "lv" ? "Aktivitātes šajā mēnesī" : "Activities this month"}
            </div>
            <div className="runology-stat-value" style={styles.statValue}>{stats.totalActivitiesThisMonth}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>🏃 {text.runType}</div>
            <div className="runology-stat-value" style={styles.statValue}>{stats.runCount}</div>
            <div style={styles.statSubtext}>{stats.runDistance} km</div>
            <div style={styles.statSubtext}>{stats.runPace}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>🥾 {text.hikeType}</div>
            <div className="runology-stat-value" style={styles.statValue}>{stats.hikeCount}</div>
            <div style={styles.statSubtext}>{stats.hikeDistance} km</div>
            <div style={styles.statSubtext}>{stats.hikePace}</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statLabel}>🏋️ {text.gymType}</div>
            <div className="runology-stat-value" style={styles.statValue}>{stats.gymCount}</div>
            <div style={styles.statSubtext}>
              {language === "lv" ? "Aktivitātes" : "Activities"}
            </div>
            <div style={styles.statSubtext}>
              {language === "lv" ? "Vidēji" : "Average"} {stats.gymAverageDuration}
            </div>
          </div>
            </div>

          </section>
        )}

        {activeView === "insights" && renderInsightsPanel()}

        {activeView === "monthly" && renderMonthlyIdentityCard()}

        {activeView === "runs" ? (
          <section className="runology-main-grid" style={styles.mainGrid}>
            {isActivityModalOpen && (
              <div
                className="runology-modal-backdrop"
                style={styles.modalBackdrop}
                onClick={handleCancelEdit}
              >
                <div
                  className="runology-form-card"
                  style={styles.modalCard}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    aria-label={text.closeActivityModal}
                    onClick={handleCancelEdit}
                    style={styles.modalCloseButton}
                  >
                    ×
                  </button>
              <div style={styles.sectionHeader}>
                <h2 className="runology-section-title" style={styles.sectionTitle}>
                  {editingRunId ? text.editRunTitle : text.addRunTitle}
                </h2>
                <p style={styles.sectionText}>
                  {editingRunId ? text.editRunText : text.addRunText}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                {!editingRunId && (
                  <div style={styles.screenshotImportBox}>
                    <div style={styles.sessionSectionTitleRow}>
                      <label style={styles.label}>{text.importScreenshot}</label>
                      {screenshotFile && (
                        <span style={styles.optionalPill}>{screenshotFile.name}</span>
                      )}
                    </div>
                    <p style={styles.importHelpText}>{text.importScreenshotHelp}</p>

                    <label style={styles.fileUploadButton}>
                      {text.chooseScreenshot}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        style={styles.hiddenFileInput}
                      />
                    </label>

                    {screenshotPreview && (
                      <div style={styles.screenshotPreviewWrap}>
                        <img
                          src={screenshotPreview}
                          alt={text.screenshotPreview}
                          style={styles.screenshotPreviewImage}
                        />

                        <div style={styles.screenshotActionRow}>
                          <button
                            type="button"
                            onClick={handleImportScreenshotData}
                            disabled={screenshotImportLoading}
                            style={
                              screenshotImportLoading
                                ? styles.importScreenshotButtonDisabled
                                : styles.importScreenshotButton
                            }
                          >
                            {screenshotImportLoading
                              ? text.importingScreenshot
                              : text.importScreenshotButton}
                          </button>

                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            style={styles.removeScreenshotButton}
                          >
                            {text.removeScreenshot}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <label style={styles.label}>{text.activityType}</label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  style={styles.input}
                >
                  <option value="run">🏃 {text.runType}</option>
                  <option value="gym">🏋️ {text.gymType}</option>
                  <option value="hike">🥾 {text.hikeType}</option>
                </select>

                <label style={styles.label}>{text.date}</label>
                <input
                  className="runology-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ ...styles.input, ...styles.dateInput }}
                />

                <label style={styles.label}>{text.distance}</label>
                <input
                  className="runology-input"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={
                    activityType === "gym"
                      ? language === "lv"
                        ? "Nav obligāts"
                        : "Optional"
                      : text.distancePlaceholder
                  }
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required={activityType !== "gym"}
                  style={styles.input}
                />

               <label style={styles.label}>{text.duration}</label>
                <div className="runology-duration-grid" style={styles.durationGrid}>
                  <input
                    className="runology-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder={text.durationHours}
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    className="runology-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="59"
                    step="1"
                    placeholder={text.durationMinutes}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    style={styles.input}
                  />
                  <input
                    className="runology-input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="59"
                    step="1"
                    placeholder={text.durationSeconds}
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(e.target.value)}
                    style={styles.input}
                  />
                </div>

                {activityType !== "gym" && (
                  <div style={styles.pacePreviewBox}>
                    <span style={styles.infoLabel}>{text.pace}</span>
                    <div style={styles.pacePreviewValue}>
                      {formatPace(distance, durationPartsToMinutes(durationHours, durationMinutes, durationSeconds))}
                    </div>
                  </div>
                )}

                <label style={styles.label}>{text.mood}</label>
                <EmojiPicker options={moodOptions} value={mood} onChange={setMood} />

                <label style={styles.label}>{text.weather}</label>
                <EmojiPicker
                  options={weatherOptions}
                  value={weather}
                  onChange={setWeather}
                />

                <div style={styles.sessionSection}>
                  <div style={styles.sessionSectionTitleRow}>
                    <label style={styles.label}>{text.preSessionState}</label>
                    <span style={styles.optionalPill}>{text.optional}</span>
                  </div>
                  <ChoicePicker
                    options={preSessionOptions}
                    value={preSessionState}
                    onChange={setPreSessionState}
                  />
                </div>

                <div style={styles.sessionSection}>
                  <div style={styles.sessionSectionTitleRow}>
                    <label style={styles.label}>{text.sleep}</label>
                    <span style={styles.optionalPill}>{text.optional}</span>
                  </div>
                  <ChoicePicker
                    options={sleepOptions}
                    value={sleepQuality}
                    onChange={setSleepQuality}
                  />
                </div>

                <div style={styles.sessionSection}>
                  <div style={styles.sessionSectionTitleRow}>
                    <label style={styles.label}>{text.duringSession}</label>
                    <span style={styles.optionalPill}>{text.optional}</span>
                  </div>
                  <ChoicePicker
                    options={duringSessionOptions}
                    value={duringSessionFuel}
                    onChange={setDuringSessionFuel}
                    multiple
                  />
                </div>

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
                  <button
                    className="runology-cancel-button"
                    type="button"
                    onClick={handleCancelEdit}
                    style={styles.cancelButton}
                  >
                    {text.cancelEdit}
                  </button>
                </div>
              </form>

              {message && <div style={styles.successBoxDashboard}>{message}</div>}
              {error && (
                <div style={styles.errorBoxDashboard}>
                  {text.errorPrefix}: {error}
                </div>
              )}
                </div>
              </div>
            )}

            <div className="runology-list-card" style={styles.listCard}>
              <div style={styles.sectionHeader}>
                <h2 className="runology-section-title" style={styles.sectionTitle}>
                  {text.runsTitle}
                </h2>
                <p style={styles.sectionText}>{text.runsText}</p>
              </div>

              <div style={styles.listToolbar}>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMessage("");
                    setError("");
                    setIsActivityModalOpen(true);
                  }}
                  style={styles.addActivityButton}
                >
                  {text.addActivityButton}
                </button>
              </div>

              {!isActivityModalOpen && message && (
                <div style={styles.successBoxDashboard}>{message}</div>
              )}
              {!isActivityModalOpen && error && (
                <div style={styles.errorBoxDashboard}>
                  {text.errorPrefix}: {error}
                </div>
              )}

              <div style={styles.activityFilterWrap}>
                <div className="runology-activity-filter-top-row" style={styles.activityFilterTopRow}>
                  <span style={styles.infoLabel}>{text.activityFilter}</span>
                  <button
                    className="runology-export-csv-button"
                    type="button"
                    onClick={handleExportCsv}
                    disabled={filteredRuns.length === 0}
                    style={
                      filteredRuns.length === 0
                        ? styles.exportCsvButtonDisabled
                        : styles.exportCsvButton
                    }
                  >
                    {text.exportCsv}
                  </button>
                </div>
                <div className="runology-activity-filter-group" style={styles.activityFilterGroup}>
                  <button
                    type="button"
                    onClick={() => setActivityFilter("all")}
                    style={activityFilter === "all" ? styles.activityFilterButtonActive : styles.activityFilterButton}
                  >
                    {text.allActivities}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityFilter("run")}
                    style={activityFilter === "run" ? styles.activityFilterButtonActive : styles.activityFilterButton}
                  >
                    🏃 {text.runType}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityFilter("gym")}
                    style={activityFilter === "gym" ? styles.activityFilterButtonActive : styles.activityFilterButton}
                  >
                    🏋️ {text.gymType}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivityFilter("hike")}
                    style={activityFilter === "hike" ? styles.activityFilterButtonActive : styles.activityFilterButton}
                  >
                    🥾 {text.hikeType}
                  </button>
                </div>
              </div>

              {runsLoading ? (
                <div style={styles.emptyState}>{text.loadingRuns}</div>
              ) : runs.length === 0 ? (
                <div style={styles.emptyState}>{text.noRuns}</div>
              ) : filteredRuns.length === 0 ? (
                <div style={styles.emptyState}>{text.noFilteredRuns}</div>
              ) : (
                <div style={styles.runList}>
                  {filteredRuns.map((run) => {
                    const runType = run.type || "run";
                    const isExpanded = expandedRunId === run.id;

                    return (
                      <div
                        className="runology-run-card"
                        key={run.id}
                        style={styles.runCard}
                        role="button"
                        tabIndex={0}
                        onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setExpandedRunId(isExpanded ? null : run.id);
                          }
                        }}
                      >
                        <div style={styles.runTopRow}>
                          <div className="runology-run-date" style={styles.runDate}>
                            {formatDate(run.date)}
                          </div>
                          <div style={styles.runPill}>
                            {runType === "run" && `🏃 ${text.runType}`}
                            {runType === "gym" && `🏋️ ${text.gymType}`}
                            {runType === "hike" && `🥾 ${text.hikeType}`}
                          </div>
                        </div>

                        <div style={styles.metaChipRow}>
                          <div style={styles.metaChip}>{run.mood || "🙂"}</div>
                          <div style={styles.metaChip}>{run.weather || "☀️"}</div>
                          {run.pre_session_state && (
                            <div style={styles.sessionMetaChip}>
                              {getOptionLabel(preSessionOptions, run.pre_session_state)}
                            </div>
                          )}
                          {run.sleep_quality && (
                            <div style={styles.sessionMetaChip}>
                              {getOptionLabel(sleepOptions, run.sleep_quality)}
                            </div>
                          )}
                          {run.during_session_fuel && (
                            <div style={styles.sessionMetaChip}>
                              {getDuringSessionLabels(run.during_session_fuel)}
                            </div>
                          )}
                        </div>

                        <div className="runology-run-info-row" style={styles.runInfoRow}>
                          {runType !== "gym" && (
                            <div style={styles.infoBlock}>
                              <span style={styles.infoLabel}>{text.distanceLabel}</span>
                              <span style={styles.infoValue}>
                                {convertDistance(run.distance)} {getDistanceUnitLabel()}
                              </span>
                            </div>
                          )}

                          <div style={styles.infoBlock}>
                            <span style={styles.infoLabel}>{text.durationLabel}</span>
                            <span style={styles.infoValue}>
                            {formatDurationFromMinutes(run.duration)}
                          </span>
                          </div>

                          {runType !== "gym" && (
                            <div style={styles.infoBlock}>
                              <span style={styles.infoLabel}>{text.paceLabel}</span>
                              <span style={styles.infoValue}>
                                {formatPace(run.distance, run.duration)}
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setExpandedRunId(isExpanded ? null : run.id);
                          }}
                          style={styles.detailsToggleButton}
                        >
                          {isExpanded
                            ? language === "lv"
                              ? "Paslēpt detaļas"
                              : "Hide details"
                            : language === "lv"
                              ? "Atvērt detaļas"
                              : "Open details"}
                        </button>

                        {isExpanded && (
                          <div style={styles.runExpandedArea}>
                            <div style={styles.notesBox}>
                              <span style={styles.infoLabel}>{text.notesLabel}</span>
                              <p style={styles.notesText}>{run.notes || text.noNotes}</p>
                            </div>

                            <div
                              className="runology-run-action-row"
                              style={styles.runActionRow}
                            >
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleStartEdit(run);
                                }}
                                style={styles.editButton}
                              >
                                {text.editRun}
                              </button>

                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(run.id);
                                }}
                                style={styles.deleteButton}
                              >
                                {text.deleteRun}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        ) : null}

        {activeView === "profile" && (
          <section style={styles.profileSection}>
            <div className="runology-profile-card" style={styles.profileCard}>
              <div style={styles.sectionHeader}>
                <h2 className="runology-section-title" style={styles.sectionTitle}>
                  {text.profileTitle}
                </h2>
                <p style={styles.sectionText}>{text.profileText}</p>
              </div>

              {profileLoading ? (
                <div style={styles.emptyState}>
                  {language === "lv" ? "Ielādē profilu..." : "Loading profile..."}
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} style={styles.form}>
                  <label style={styles.label}>{text.username}</label>
                  <input
                    className="runology-input"
                    type="text"
                    placeholder={text.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                  />

                  <label style={styles.label}>{text.emailReadOnly}</label>
                  <input
                    className="runology-input"
                    type="text"
                    value={session?.user?.email || ""}
                    readOnly
                    style={styles.inputReadOnly}
                  />

                  <label style={styles.label}>{text.unitLabel}</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={styles.input}
                  >
                    <option value="km">{text.kilometers}</option>
                    <option value="miles">{text.miles}</option>
                  </select>

                  <label style={styles.label}>{text.watchLabel}</label>
                  <input
                    className="runology-input"
                    type="text"
                    placeholder={text.watchPlaceholder}
                    value={watch}
                    onChange={(e) => setWatch(e.target.value)}
                    style={styles.input}
                  />

                  <div style={styles.profilePasswordBlock}>
                    <div className="runology-profile-password-header" style={styles.profilePasswordHeader}>
                      <h3 style={styles.profileSubheading}>{text.changePasswordTitle}</h3>
                      <button
                        type="button"
                        onClick={() => setShowProfilePasswords((value) => !value)}
                        style={styles.passwordToggleButton}
                      >
                        {showProfilePasswords
                          ? language === "lv"
                            ? "Paslēpt"
                            : "Hide"
                          : language === "lv"
                            ? "Rādīt"
                            : "Show"}
                      </button>
                    </div>

                    <div style={styles.profilePasswordFields}>
                      <div>
                        <label style={styles.label}>{text.newPasswordShort}</label>
                        <input
                          className="runology-input"
                          type={showProfilePasswords ? "text" : "password"}
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                          style={styles.input}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>{text.confirmNewPasswordShort}</label>
                        <input
                          className="runology-input"
                          type={showProfilePasswords ? "text" : "password"}
                          value={profilePasswordConfirm}
                          onChange={(e) => setProfilePasswordConfirm(e.target.value)}
                          style={styles.input}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="runology-primary-button"
                    type="submit"
                    disabled={profileSaving}
                    style={styles.primaryButtonDashboard}
                  >
                    {profileSaving ? text.profileSaving : text.saveProfile}
                  </button>
                </form>
              )}

              {profileMessage && (
                <div style={styles.successBoxDashboard}>{profileMessage}</div>
              )}
              {profileError && (
                <div style={styles.errorBoxDashboard}>
                  {text.errorPrefix}: {profileError}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {  
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top left, rgba(34, 197, 94, 0.14) 0%, rgba(15, 15, 15, 0.98) 34%, #101010 100%)",
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
    background: "rgba(42, 42, 42, 0.9)",
    borderRadius: "22px",
    padding: "24px 30px 42px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
    border: "1px solid #2f2f2f",
  },
  loadingTopBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "22px",
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
    color: "#f8fafc",
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
    background: "rgba(36, 36, 36, 0.9)",
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
  brandHomeButton: {
    cursor: "pointer",
    background: "transparent",
    fontFamily: "inherit",
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
    color: "rgba(236, 253, 245, 0.82)",
    fontWeight: "600",
  },
  brandFooter: {
    marginTop: "auto",
    color: "rgba(211, 225, 214, 0.45)",
    fontSize: "15px",
    fontWeight: "600",
  },
  authCard: {
    background: "rgba(42, 42, 42, 0.9)",
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
    color: "#f8fafc",
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
    background: "linear-gradient(135deg, rgba(26, 26, 26, 0.96) 0%, rgba(22, 32, 25, 0.96) 100%)",
    borderRadius: "24px",
    padding: "30px 32px",
    boxShadow: "0 18px 54px rgba(0, 0, 0, 0.28)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    marginBottom: "16px",
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
  viewSwitch: {
  display: "inline-flex",
  gap: "8px",
  background: "rgba(36, 36, 36, 0.9)",
  border: "1px solid rgba(255, 255, 255, 0.07)",
  borderRadius: "14px",
  padding: "4px",
},

viewSwitchButton: {
  border: "none",
  background: "transparent",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
},

viewSwitchButtonActive: {
  border: "none",
  background: "rgba(47, 47, 47, 0.9)",
  color: "#ffffff",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
},

profileSection: {
  marginTop: "0",
},

profileCard: {
  background: "rgba(26, 26, 26, 0.92)",
  borderRadius: "24px",
  padding: "28px",
  boxShadow: "0 18px 54px rgba(0, 0, 0, 0.28)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  maxWidth: "760px",
},

inputReadOnly: {
  width: "100%",
  boxSizing: "border-box",
  padding: "16px 16px",
  fontSize: "16px",
  borderRadius: "10px",
  border: "1px solid #3b3b3b",
  background: "#222222",
  outline: "none",
  color: "#a89f92",
  boxShadow: "none",
},

profilePasswordBlock: {
  marginTop: "28px",
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(255, 255, 255, 0.035)",
  border: "1px solid rgba(255, 255, 255, 0.07)",
},

profilePasswordHeader: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "14px",
},

profilePasswordFields: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
},

profileSubheading: {
  margin: "0",
  color: "#f8fafc",
  fontSize: "18px",
  fontWeight: "700",
},

passwordToggleButton: {
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.06)",
  color: "rgba(255, 255, 255, 0.86)",
  borderRadius: "999px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: "700",
  cursor: "pointer",
  whiteSpace: "nowrap",
},
  topTag: {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#262626",
    color: "rgba(236, 253, 245, 0.82)",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "10px",
    border: "1px solid #353535",
  },
  appTitle: {
    margin: "0 0 8px 0",
    fontSize: "36px",
    color: "#f8fafc",
    letterSpacing: "-0.05em",
  },
  appSubtitle: {
    margin: 0,
    color: "rgba(255, 255, 255, 0.64)",
    fontSize: "15px",
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    alignItems: "start",
  },
  dashboardPage: {
    marginBottom: "28px",
  },
  statsGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "16px",
  marginBottom: "28px",
},

statCard: {
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.045) 0%, rgba(255, 255, 255, 0.025) 100%)",
  borderRadius: "20px",
  padding: "20px",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  boxShadow: "0 16px 42px rgba(0, 0, 0, 0.24)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
},

statLabel: {
  fontSize: "13px",
  fontWeight: "800",
  letterSpacing: "0.4px",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.62)",
},

statValue: {
  fontSize: "28px",
  fontWeight: "800",
  color: "#f8fafc",
  letterSpacing: "-0.03em",
},

statSubtext: {
  color: "#cbd5e1",
  fontSize: "13px",
  marginTop: "4px",
},
  monthlyIdentityCard: {
    background: "linear-gradient(135deg, #20231f 0%, #171717 58%, #222018 100%)",
    border: "1px solid rgba(215, 227, 216, 0.22)",
    borderRadius: "24px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 22px 70px rgba(0, 0, 0, 0.24)",
  },

  monthlyIdentityTopRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
  },

  monthlyIdentityEyebrow: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "12px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "8px",
  },

  monthlyIdentityLine: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "24px",
    lineHeight: 1.12,
    letterSpacing: "-0.04em",
  },

  monthlyIdentityReason: {
    margin: "14px 0 0 0",
    color: "#f8fafc",
    fontSize: "15px",
    lineHeight: 1.5,
  },

  monthlyIdentitySupport: {
    margin: "10px 0 0 0",
    color: "rgba(236, 253, 245, 0.82)",
    fontSize: "14px",
    lineHeight: 1.45,
  },

  monthlyIdentityBasedOn: {
    marginTop: "14px",
    color: "#8d8272",
    fontSize: "12px",
    fontWeight: "800",
  },

  monthlyIdentityShareButton: {
    border: "1px solid rgba(215, 227, 216, 0.55)",
    background: "#d7e3d8",
    color: "#111111",
    borderRadius: "999px",
    padding: "10px 14px",
    fontSize: "12px",
    fontWeight: "900",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  insightsToggleRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "18px",
  },

  monthlyIdentityActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  monthlyIdentityShareImageButton: {
    border: "1px solid rgba(255, 255, 255, 0.14)",
    background: "rgba(255, 255, 255, 0.06)",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "9px 12px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },

  insightsButton: {
    border: "1px solid rgba(255, 255, 255, 0.07)",
    background: "#1f1f1f",
    color: "#f8fafc",
    borderRadius: "999px",
    padding: "11px 16px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 12px 34px rgba(0, 0, 0, 0.18)",
  },

  insightsButtonActive: {
    border: "1px solid rgba(215, 227, 216, 0.55)",
    background: "#d7e3d8",
    color: "#111111",
    borderRadius: "999px",
    padding: "11px 16px",
    fontSize: "13px",
    fontWeight: "900",
    cursor: "pointer",
    boxShadow: "0 12px 34px rgba(0, 0, 0, 0.18)",
  },

  insightFilterRow: {
    display: "grid",
    gap: "8px",
    marginBottom: "18px",
  },
  insightFilterLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.62)",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  insightSelect: {
    width: "100%",
    maxWidth: "320px",
    boxSizing: "border-box",
    padding: "13px 14px",
    fontSize: "15px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background: "rgba(36, 36, 36, 0.94)",
    color: "#ffffff",
    outline: "none",
  },
  insightsPanel: {
    background: "rgba(26, 26, 26, 0.92)",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 16px 42px rgba(0, 0, 0, 0.24)",
    marginBottom: "28px",
  },

  insightsTitle: {
    margin: "0 0 6px 0",
    color: "#f8fafc",
    fontSize: "20px",
    letterSpacing: "-0.03em",
  },

  insightsSubtitle: {
    margin: 0,
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "14px",
    lineHeight: 1.45,
  },

  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "12px",
  },

  insightCard: {
    background: "rgba(36, 36, 36, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "18px",
    padding: "16px",
  },

  insightCardTitle: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "8px",
  },

  insightCardValue: {
    color: "#f8fafc",
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "-0.04em",
    marginBottom: "8px",
  },

  insightCardDetail: {
    color: "rgba(236, 253, 245, 0.82)",
    fontSize: "13px",
    lineHeight: 1.45,
  },

  insightContextBox: {
    background: "#202020",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "18px",
    padding: "16px",
  },

  insightContextLine: {
    color: "#ffffff",
    fontSize: "13px",
    lineHeight: 1.6,
  },

  insightConfidenceBox: {
    marginTop: "12px",
    background: "rgba(36, 36, 36, 0.86)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "12px 14px",
    color: "rgba(236, 253, 245, 0.86)",
    fontSize: "13px",
    lineHeight: 1.55,
  },

  insightSectionBox: {
    marginTop: "12px",
    background: "rgba(32, 32, 32, 0.92)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "18px",
    padding: "16px",
  },

  insightRiskBox: {
    marginTop: "12px",
    background: "rgba(44, 32, 32, 0.72)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "18px",
    padding: "16px",
  },

  insightRecommendationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },

  insightRecommendationCard: {
    background: "rgba(255, 255, 255, 0.045)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "15px",
    padding: "13px",
  },

  insightRecommendationTitle: {
    color: "#f8fafc",
    fontSize: "14px",
    fontWeight: "850",
    marginBottom: "6px",
  },

  insightRecommendationBody: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: "13px",
    lineHeight: 1.5,
  },

  chartCard: {
    background: "rgba(26, 26, 26, 0.92)",
    borderRadius: "22px",
    padding: "22px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 16px 42px rgba(0, 0, 0, 0.24)",
    overflow: "hidden",
    marginBottom: "28px",
  },

  sectionHeaderCompact: {
    marginBottom: "16px",
  },

  chartTitle: {
    margin: "0 0 6px 0",
    color: "#f8fafc",
    fontSize: "20px",
    letterSpacing: "-0.03em",
  },

  chartSubtitle: {
    margin: 0,
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "14px",
    lineHeight: 1.45,
  },

  chartSummaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "10px",
  },

  chartBigValue: {
    color: "#f8fafc",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "-0.04em",
  },

  chartMutedText: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "13px",
    marginTop: "3px",
  },

  chartSmallBadge: {
    border: "1px solid rgba(255, 255, 255, 0.07)",
    background: "rgba(36, 36, 36, 0.9)",
    color: "rgba(236, 253, 245, 0.82)",
    borderRadius: "999px",
    padding: "7px 10px",
    fontSize: "12px",
    fontWeight: "800",
  },

  chartSvg: {
    width: "100%",
    height: "220px",
    display: "block",
  },


  screenshotImportBox: {
    padding: "14px",
    borderRadius: "18px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(15, 23, 42, 0.44)",
  },
  importHelpText: {
    margin: "4px 0 12px",
    fontSize: "12px",
    lineHeight: 1.5,
    color: "rgba(226, 232, 240, 0.68)",
  },
  fileUploadButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "42px",
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(251, 146, 60, 0.45)",
    background: "rgba(251, 146, 60, 0.14)",
    color: "#fed7aa",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
  },
  hiddenFileInput: {
    display: "none",
  },
  screenshotPreviewWrap: {
    marginTop: "12px",
    display: "grid",
    gap: "10px",
  },
  screenshotPreviewImage: {
    width: "100%",
    maxHeight: "360px",
    objectFit: "contain",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    background: "rgba(2, 6, 23, 0.55)",
  },
  screenshotActionRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  importScreenshotButton: {
    border: "0",
    borderRadius: "999px",
    padding: "10px 14px",
    background: "linear-gradient(135deg, #fb923c, #f97316)",
    color: "#111827",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(249, 115, 22, 0.18)",
  },
  importScreenshotButtonDisabled: {
    border: "0",
    borderRadius: "999px",
    padding: "10px 14px",
    background: "rgba(148, 163, 184, 0.22)",
    color: "rgba(226, 232, 240, 0.72)",
    fontSize: "12px",
    fontWeight: 900,
    cursor: "not-allowed",
  },
  removeScreenshotButton: {
    width: "fit-content",
    border: "0",
    borderRadius: "999px",
    padding: "9px 12px",
    background: "rgba(148, 163, 184, 0.16)",
    color: "rgba(226, 232, 240, 0.9)",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },

  emptyChartText: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "14px",
    lineHeight: 1.5,
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(36, 36, 36, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },

  formCard: {
    background: "rgba(26, 26, 26, 0.92)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 18px 54px rgba(0, 0, 0, 0.28)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    position: "sticky",
    top: "24px",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(0, 0, 0, 0.72)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "28px 14px",
    overflowY: "auto",
  },
  modalCard: {
    width: "min(640px, 100%)",
    maxHeight: "calc(100vh - 56px)",
    overflowY: "auto",
    position: "relative",
    background: "rgba(26, 26, 26, 0.92)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 28px 90px rgba(0, 0, 0, 0.48)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
  },
  modalCloseButton: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    background: "rgba(36, 36, 36, 0.9)",
    color: "#f8fafc",
    fontSize: "24px",
    lineHeight: "32px",
    cursor: "pointer",
  },
  listToolbar: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "18px",
  },
  addActivityButton: {
    border: "1px solid rgba(34, 197, 94, 0.62)",
    borderRadius: "16px",
    padding: "13px 16px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    color: "#08130c",
    background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
    boxShadow: "0 18px 30px rgba(0, 0, 0, 0.22)",
  },
  listCard: {
    background: "rgba(20, 20, 20, 0.78)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 18px 54px rgba(0, 0, 0, 0.28)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    minHeight: "500px",
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: "0 0 6px 0",
    fontSize: "26px",
    color: "#f8fafc",
    letterSpacing: "-0.04em",
  },
  sectionText: {
    margin: 0,
    color: "rgba(255, 255, 255, 0.64)",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  form: {
    display: "grid",
    gap: "10px",
  },
  formActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    alignItems: "center",
    marginTop: "10px",
  },
  label: {
    fontSize: "15px",
    fontWeight: "700",
    color: "rgba(248, 250, 252, 0.84)",
    marginTop: "10px",
  },
  durationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 16px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #4a443c",
    background: "rgba(47, 47, 47, 0.9)",
    outline: "none",
    color: "#f8fafc",
    boxShadow: "none",
  },
  dateInput: {
    minWidth: 0,
    textAlign: "left",
    WebkitAppearance: "none",
    appearance: "none",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 16px",
    fontSize: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    background: "rgba(36, 36, 36, 0.9)",
    outline: "none",
    color: "#f8fafc",
    minHeight: "124px",
    resize: "vertical",
    boxShadow: "none",
  },
  pacePreviewBox: {
    background: "rgba(36, 36, 36, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "16px",
    padding: "16px",
    marginTop: "6px",
  },
  pacePreviewValue: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#f8fafc",
    marginTop: "6px",
    letterSpacing: "-0.02em",
  },
  emojiRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  emojiButton: {
    border: "1px solid rgba(255, 255, 255, 0.07)",
    background: "rgba(36, 36, 36, 0.9)",
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
    border: "1px solid rgba(34, 197, 94, 0.52)",
    background: "rgba(34, 197, 94, 0.13)",
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
  sessionSection: {
    display: "grid",
    gap: "10px",
    paddingTop: "4px",
  },
  sessionSectionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  optionalPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    padding: "4px 8px",
    background: "rgba(42, 42, 42, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "11px",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
    gap: "10px",
  },
  choiceButton: {
    border: "1px solid #3d3a35",
    borderRadius: "14px",
    padding: "12px 12px",
    minHeight: "72px",
    cursor: "pointer",
    color: "#f8fafc",
    background: "rgba(36, 36, 36, 0.9)",
    fontFamily: "inherit",
    textAlign: "left",
    display: "grid",
    gap: "7px",
  },
  choiceButtonActive: {
    border: "1px solid rgba(34, 197, 94, 0.52)",
    borderRadius: "14px",
    padding: "12px 12px",
    minHeight: "72px",
    cursor: "pointer",
    color: "#dcfce7",
    background: "rgba(34, 197, 94, 0.14)",
    fontFamily: "inherit",
    textAlign: "left",
    display: "grid",
    gap: "7px",
  },
  choiceMainRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "800",
    lineHeight: 1.2,
  },
  choiceEmoji: {
    fontSize: "20px",
    lineHeight: 1,
  },
  choiceSubLabel: {
    color: "rgba(255, 255, 255, 0.62)",
    fontSize: "12px",
    fontWeight: "600",
  },
  primaryButton: {
    width: "100%",
    border: "1px solid #5a534a",
    borderRadius: "12px",
    padding: "15px 18px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f8fafc",
    background: "rgba(47, 47, 47, 0.9)",
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
    color: "#f8fafc",
    background: "rgba(47, 47, 47, 0.9)",
    boxShadow: "none",
  },
  primaryButtonDashboard: {
    width: "100%",
    border: "1px solid rgba(34, 197, 94, 0.62)",
    borderRadius: "16px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#08130c",
    background: "linear-gradient(135deg, #22c55e 0%, #86efac 100%)",
    boxShadow: "0 18px 30px rgba(0, 0, 0, 0.22)",
  },
  cancelButton: {
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "16px",
    padding: "15px 18px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f8fafc",
    background: "rgba(36, 36, 36, 0.9)",
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
  feedbackHeaderButton: {
    border: "1px solid rgba(34, 197, 94, 0.54)",
    borderRadius: "16px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: "800",
    cursor: "pointer",
    color: "#dcfce7",
    background: "rgba(34, 197, 94, 0.12)",
    whiteSpace: "nowrap",
  },
  feedbackModalCard: {
    width: "min(560px, 100%)",
    maxHeight: "calc(100vh - 56px)",
    overflowY: "auto",
    position: "relative",
    background: "rgba(26, 26, 26, 0.96)",
    borderRadius: "24px",
    padding: "28px",
    boxShadow: "0 28px 90px rgba(0, 0, 0, 0.48)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
  },
  primaryButtonDisabled: {
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "12px",
    padding: "15px 18px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "not-allowed",
    color: "rgba(248, 250, 252, 0.62)",
    background: "rgba(47, 47, 47, 0.56)",
    boxShadow: "none",
    marginTop: "10px",
  },
  logoutButton: {
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "16px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f8fafc",
    background: "rgba(36, 36, 36, 0.9)",
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
     width: "100%",
    minHeight: "120px",
    padding: "18px",
    borderRadius: "18px",
    background: "rgba(36, 36, 36, 0.9)",
    border: "1px dashed #343434",
    color: "rgba(255, 255, 255, 0.64)",
    fontSize: "15px",
    lineHeight: 1.45,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  activityFilterWrap: {
    display: "grid",
    gap: "10px",
    marginBottom: "18px",
  },
  activityFilterTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
  },
  exportCsvButton: {
    border: "1px solid rgba(34, 197, 94, 0.52)",
    borderRadius: "14px",
    padding: "10px 13px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    color: "#dcfce7",
    background: "rgba(34, 197, 94, 0.14)",
  },
  exportCsvButtonDisabled: {
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "14px",
    padding: "10px 13px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "not-allowed",
    color: "#6f6659",
    background: "rgba(36, 36, 36, 0.9)",
  },
  activityFilterGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    padding: "6px",
    borderRadius: "18px",
    background: "rgba(36, 36, 36, 0.9)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
  },
  activityFilterButton: {
    border: "1px solid transparent",
    borderRadius: "14px",
    padding: "10px 13px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    color: "rgba(255, 255, 255, 0.62)",
    background: "transparent",
  },
  activityFilterButtonActive: {
    border: "1px solid rgba(34, 197, 94, 0.5)",
    borderRadius: "14px",
    padding: "10px 13px",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    color: "#dcfce7",
    background: "rgba(34, 197, 94, 0.14)",
  },
  runList: {
    display: "grid",
    gap: "18px",
  },
  runCard: {
    borderRadius: "22px",
    padding: "22px",
    cursor: "pointer",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.032) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    boxShadow: "0 12px 34px rgba(0, 0, 0, 0.22)",
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
    color: "#f8fafc",
    letterSpacing: "-0.02em",
  },
  runPill: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(46, 46, 46, 0.86)",
    color: "rgba(236, 253, 245, 0.82)",
    fontWeight: "800",
    fontSize: "13px",
    border: "1px solid rgba(255, 255, 255, 0.07)",
  },
  metaChipRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px",
  },
  metaChip: {
    minWidth: "42px",
    height: "42px",
    borderRadius: "999px",
    background: "rgba(46, 46, 46, 0.86)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "none",
  },
  sessionMetaChip: {
    minHeight: "30px",
    padding: "7px 10px",
    borderRadius: "999px",
    background: "rgba(46, 46, 46, 0.86)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "800",
    lineHeight: 1.1,
    letterSpacing: "0.01em",
    boxShadow: "none",
  },
  runInfoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    marginBottom: "14px",
  },
  infoBlock: {
    background: "rgba(42, 42, 42, 0.9)",
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
    color: "rgba(255, 255, 255, 0.62)",
  },
  infoValue: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: "-0.02em",
  },
  detailsToggleButton: {
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.07)",
    borderRadius: "14px",
    padding: "10px 12px",
    marginTop: "2px",
    fontSize: "13px",
    fontWeight: "800",
    cursor: "pointer",
    color: "#ffffff",
    background: "rgba(46, 46, 46, 0.72)",
  },
  runExpandedArea: {
    marginTop: "12px",
  },
  runActionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
    marginBottom: "12px",
  },
  editButton: {
    border: "none",
    borderRadius: "14px",
    padding: "11px 14px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#f8fafc",
    background: "rgba(46, 46, 46, 0.86)",
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
    background: "rgba(42, 42, 42, 0.9)",
    border: "1px solid #383838",
    borderRadius: "16px",
    padding: "15px",
  },
  notesText: {
    margin: "8px 0 0 0",
    fontSize: "15px",
    lineHeight: 1.7,
    color: "rgba(248, 250, 252, 0.78)",
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

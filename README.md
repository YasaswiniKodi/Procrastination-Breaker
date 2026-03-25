# ⚡ ProcrastiNO — Beat Procrastination

> Your AI procrastination breaker with Login & Signup

---

## 🚀 How to Run (No Setup Required!)

1. Download or clone this repo
2. Double-click `index.html` to open in Chrome
3. That's it — **no server, no Node.js, no install needed**

---

## 📁 Project Structure

```
procrastino/
├── index.html                    ← Landing page + Dashboard (start here)
├── login.html                    ← Login page
├── signup.html                   ← Sign Up page
├── style.css                     ← All styles
├── script.js                     ← Auth logic (localStorage)
└── procrastino_app_upgraded.html ← Main app (all 5 features)
```

---

## ✨ Features

### Auth System
- ✅ Sign Up with name, email, password
- ✅ Login with email & password
- ✅ Password strength meter (live)
- ✅ Show/hide password toggle
- ✅ Field-level validation with error messages
- ✅ Session persistence (stays logged in)
- ✅ Logout
- ✅ 100% offline — uses `localStorage`

### ProcrastiNO App (5 Upgraded Features)
1. **🧠 Smart Nudge System** — Escalating nudges after 15s, 35s, 60s, 90s of idle time
2. **📊 Tiny Progress Insight** — Rotating motivational insights on success screen
3. **▶️ Continue Button** — "Continue for 5 more minutes" on success screen
4. **👉 First Step Highlight** — Step 1 is visually highlighted with "START HERE" badge
5. **🔍 Task Type Detection** — Detects task type (Study/Coding/Writing etc.) in real-time

---

## 🔒 Data Storage

All data is stored in your **browser's localStorage**:
- `pno_users` — user accounts (email + password)
- `pno_session` — active session (email)
- `pno_streak` — focus streak count

> ⚠️ **Note:** This is a frontend-only demo. Passwords are stored in plain text in localStorage — not suitable for production. For a real app, use a backend with hashed passwords.

---

## 📤 GitHub Upload Steps

1. Create a new repo on GitHub
2. Upload all files (keep same folder structure)
3. Go to **Settings → Pages → Source: main branch → / (root)**
4. Your app will be live at `https://yourusername.github.io/repo-name/`

---

## 🛠 Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6)
- Google Fonts (Sora + DM Sans)
- localStorage API
- No frameworks, no build tools, no dependencies

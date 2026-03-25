// ──────────────────────────────────────
//  ProcrastiNO Auth — script.js
//  Pure localStorage, no server needed
// ──────────────────────────────────────

const USERS_KEY = 'pno_users';
const SESSION_KEY = 'pno_session';

// ── Helpers ──
function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function setSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}
function getSession() {
  return localStorage.getItem(SESSION_KEY);
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// ── Page navigation ──
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
  clearAllAlerts();
}

function clearAllAlerts() {
  document.querySelectorAll('.alert').forEach(a => { a.style.display = 'none'; a.textContent = ''; });
  document.querySelectorAll('.field-error').forEach(e => { e.style.display = 'none'; e.textContent = ''; });
  document.querySelectorAll('.error-field').forEach(i => i.classList.remove('error-field'));
}

function showAlert(id, msg, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'alert alert-' + type;
  el.textContent = msg;
  el.style.display = 'block';
}

function showFieldError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errorId);
  if (field) field.classList.add('error-field');
  if (err) { err.textContent = msg; err.style.display = 'block'; }
}

// ── Password strength ──
function checkPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function updateStrengthBar(pw) {
  const bar = document.getElementById('signup-pw-fill');
  const label = document.getElementById('signup-pw-label');
  const wrap = document.getElementById('signup-pw-strength');
  if (!bar || !label || !wrap) return;
  if (!pw) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  const score = checkPasswordStrength(pw);
  const levels = [
    { pct: 15,  color: '#ef4444', text: 'Too short' },
    { pct: 30,  color: '#f97316', text: 'Weak' },
    { pct: 55,  color: '#eab308', text: 'Fair' },
    { pct: 78,  color: '#22c55e', text: 'Good' },
    { pct: 100, color: '#16a34a', text: 'Strong 💪' }
  ];
  const lvl = levels[Math.min(score, 4)];
  bar.style.width = lvl.pct + '%';
  bar.style.background = lvl.color;
  label.textContent = lvl.text;
  label.style.color = lvl.color;
}

// ── Toggle password visibility ──
function togglePassword(fieldId, btnId) {
  const field = document.getElementById(fieldId);
  const btn = document.getElementById(btnId);
  if (!field || !btn) return;
  if (field.type === 'password') {
    field.type = 'text';
    btn.textContent = '🙈';
  } else {
    field.type = 'password';
    btn.textContent = '👁️';
  }
}

// ── Validation ──
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── SIGNUP ──
function handleSignup(e) {
  e && e.preventDefault();
  clearAllAlerts();

  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pw    = document.getElementById('signup-pw').value;
  const pw2   = document.getElementById('signup-pw2').value;

  let valid = true;

  if (!name) {
    showFieldError('signup-name', 'signup-name-err', 'Please enter your full name.');
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    showFieldError('signup-email', 'signup-email-err', 'Please enter a valid email address.');
    valid = false;
  }
  if (pw.length < 6) {
    showFieldError('signup-pw', 'signup-pw-err', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (pw !== pw2) {
    showFieldError('signup-pw2', 'signup-pw2-err', 'Passwords do not match.');
    valid = false;
  }
  if (!valid) return;

  const users = getUsers();
  if (users[email]) {
    showAlert('signup-alert', '⚠️ An account with this email already exists. Please log in.', 'error');
    return;
  }

  // Simulate brief loading
  const btn = document.getElementById('signup-btn');
  btn.disabled = true;
  btn.classList.add('loading');
  btn.textContent = 'Creating account';

  setTimeout(() => {
    users[email] = { name, email, pw, createdAt: new Date().toISOString() };
    saveUsers(users);
    setSession(email);

    btn.disabled = false;
    btn.classList.remove('loading');
    btn.textContent = 'Create Account →';

    showAlert('signup-alert', '🎉 Account created! Redirecting…', 'success');
    setTimeout(() => showPage('page-dashboard'), 1200);
  }, 800);
}

// ── LOGIN ──
function handleLogin(e) {
  e && e.preventDefault();
  clearAllAlerts();

  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const pw    = document.getElementById('login-pw').value;

  let valid = true;
  if (!email || !validateEmail(email)) {
    showFieldError('login-email', 'login-email-err', 'Please enter a valid email address.');
    valid = false;
  }
  if (!pw) {
    showFieldError('login-pw', 'login-pw-err', 'Please enter your password.');
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.classList.add('loading');
  btn.textContent = 'Signing in';

  setTimeout(() => {
    const users = getUsers();
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.textContent = 'Sign In →';

    if (!users[email]) {
      showAlert('login-alert', '❌ No account found with this email.', 'error');
      return;
    }
    if (users[email].pw !== pw) {
      showAlert('login-alert', '❌ Incorrect password. Please try again.', 'error');
      return;
    }

    setSession(email);
    showAlert('login-alert', '✅ Welcome back! Redirecting…', 'success');
    setTimeout(() => showPage('page-dashboard'), 900);
  }, 700);
}

// ── LOGOUT ──
function handleLogout() {
  clearSession();
  showPage('page-landing');
}

// ── Dashboard: load user info ──
function loadDashboard() {
  const email = getSession();
  if (!email) { showPage('page-landing'); return; }
  const users = getUsers();
  const user = users[email];
  if (!user) { clearSession(); showPage('page-landing'); return; }

  const streak = parseInt(localStorage.getItem('pno_streak') || '0');
  document.getElementById('dash-name').textContent = user.name;
  document.getElementById('dash-email').textContent = user.email;
  document.getElementById('dash-streak').textContent = streak > 0 ? '🔥 ' + streak + '-day streak' : 'No streak yet — start today!';
  document.getElementById('dash-joined').textContent = 'Member since ' + new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  // Check existing session
  if (getSession()) {
    loadDashboard();
    showPage('page-dashboard');
  } else {
    showPage('page-landing');
  }

  // Password strength live update
  const signupPw = document.getElementById('signup-pw');
  if (signupPw) signupPw.addEventListener('input', () => updateStrengthBar(signupPw.value));

  // Enter key submits forms
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const form = input.closest('[data-form]');
        if (form && form.dataset.form === 'login') handleLogin();
        if (form && form.dataset.form === 'signup') handleSignup();
      }
    });
  });
});

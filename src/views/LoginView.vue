<template>
  <div class="app-shell">

    <!-- ░░ BARRE DE STATUT SIMULÉE (mobile) ░░ -->
    <div class="status-bar">
      <span class="time">{{ currentTime }}</span>
      <div class="status-icons">
        <span class="signal">
          <i></i><i></i><i></i><i></i>
        </span>
        <span class="network">4G</span>
        <span class="battery">
          <span class="bat-body"><span class="bat-fill"></span></span>
          <span class="bat-tip"></span>
        </span>
      </div>
    </div>

    <!-- ░░ HEADER "Mon site" ░░ -->
    <header class="app-header">
      <div class="header-left">
        <button class="back-btn" @click="$router.push('/login')" v-if="false">‹</button>
      </div>
      <h1 class="site-title">Mon site</h1>
      <div class="header-right"></div>
    </header>

    <!-- ░░ BREADCRUMB ░░ -->
    <div class="breadcrumb">
      <div class="avatar-thumb">
        <img src="/img/avatar.png" onerror="this.style.display='none'" alt="" />
        <span class="avatar-fallback">🏫</span>
      </div>
      <div class="breadcrumb-text">
        <span class="bc-main">salle &nbsp;&nbsp; <strong>Formateurs</strong></span>
        <span class="bc-sub">salle d'inscription</span>
      </div>
    </div>

    <!-- ░░ CONTENU PRINCIPAL ░░ -->
    <main class="main-content">

      <!-- Titre section -->
      <div class="section-header">
        <h2 class="section-title">Connexion</h2>
        <p class="section-desc">Connectez-vous pour accéder à votre compte</p>
      </div>

      <!-- Carte du formulaire -->
      <div class="form-card" :class="{ 'card-error': hasErrors }">

        <!-- Succès -->
        <transition name="slide-down">
          <div v-if="successMsg" class="msg-success">
            <span class="msg-icon">✓</span>
            <div>
              <strong>Connexion réussie !</strong>
              <p>{{ successMsg }}</p>
            </div>
          </div>
        </transition>

        <!-- Erreur globale -->
        <transition name="slide-down">
          <div v-if="errorMsg" class="msg-error">
            <span class="msg-icon">!</span>
            <div>
              <strong>Erreur</strong>
              <p>{{ errorMsg }}</p>
            </div>
          </div>
        </transition>

        <form @submit.prevent="handleLogin" novalidate>

          <!-- ── Nom de l'utilisateur ── -->
          <div class="field-group" :class="{ 'field-err': errors.username, 'field-ok': form.username && !errors.username }">
            <label class="field-label">
              <span class="label-icon">👤</span>
              Nom de l'utilisateur
              <span class="required">*</span>
            </label>
            <div class="field-wrap">
              <input
                v-model="form.username"
                type="text"
                class="field-input"
                placeholder="Entrez votre nom d'utilisateur"
                autocomplete="username"
                @blur="validateField('username')"
              />
              <span class="field-status" v-if="form.username">
                <span v-if="!errors.username" class="ok-icon">✓</span>
                <span v-else class="err-icon">✗</span>
              </span>
            </div>
            <transition name="err-msg">
              <p class="field-error-msg" v-if="errors.username">
                <span>⚠</span> {{ errors.username }}
              </p>
            </transition>
          </div>

          <!-- ── Code (mot de passe) ── -->
          <div class="field-group" :class="{ 'field-err': errors.code, 'field-ok': form.code && !errors.code }">
            <label class="field-label">
              <span class="label-icon">🔢</span>
              Code
              <span class="required">*</span>
            </label>
            <div class="field-wrap">
              <input
                v-model="form.code"
                :type="showCode ? 'text' : 'password'"
                class="field-input"
                placeholder="Entrez votre code d'accès"
                autocomplete="new-password"
                @blur="validateField('code')"
              />
              <button type="button" class="toggle-code" @click="showCode = !showCode">
                {{ showCode ? '🙈' : '👁' }}
              </button>
            </div>
            <!-- Indicateur de force -->
            <div class="code-strength" v-if="form.code">
              <div class="strength-dots">
                <span :class="['dot', form.code.length >= 4 ? 'dot-active' : '']"></span>
                <span :class="['dot', form.code.length >= 6 ? 'dot-active dot-med' : '']"></span>
                <span :class="['dot', form.code.length >= 8 ? 'dot-active dot-strong' : '']"></span>
              </div>
              <span class="strength-text" :class="codeStrengthClass">{{ codeStrengthLabel }}</span>
            </div>
            <transition name="err-msg">
              <p class="field-error-msg" v-if="errors.code">
                <span>⚠</span> {{ errors.code }}
              </p>
            </transition>
          </div>

          <!-- ── Bouton connexion ── -->
          <button
            type="submit"
            class="btn-inscription"
            :disabled="loading"
            :class="{ 'btn-loading': loading }"
          >
            <span v-if="loading" class="spinner"></span>
            <span v-else>Se connecter</span>
          </button>

        </form>

        <!-- Divider -->
        <div class="divider-row">
          <span></span>
          <em>ou</em>
          <span></span>
        </div>

        <!-- Lien inscription -->
        <div class="login-row">
          <span class="login-text">Pas encore de compte ?</span>
          <router-link to="/" class="login-link">S'inscrire</router-link>
        </div>

      </div>

      <!-- Info box -->
      <div class="info-box">
        <span class="info-icon">ℹ</span>
        <p>Connectez-vous avec vos identifiants fournis lors de l'inscription.</p>
      </div>

    </main>

    <!-- ░░ BARRE DE NAVIGATION BAS ░░ -->
    <nav class="bottom-nav">
      <button class="nav-item" @click="$router.push('/')">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Accueil</span>
      </button>
      <button class="nav-item nav-active">
        <span class="nav-icon">🔐</span>
        <span class="nav-label">Connexion</span>
      </button>
      <button class="nav-item" @click="$router.push('/formateurs')">
        <span class="nav-icon">👥</span>
        <span class="nav-label">Formateurs</span>
      </button>
    </nav>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      form: {
        username: "",
        code: "",
      },
      errors: {},
      loading: false,
      successMsg: "",
      errorMsg: "",
      showCode: false,
      currentTime: "",
    };
  },
  computed: {
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    },
    codeStrengthClass() {
      const l = this.form.code.length;
      if (l < 4) return "str-weak";
      if (l < 8) return "str-med";
      return "str-strong";
    },
    codeStrengthLabel() {
      const l = this.form.code.length;
      if (l < 4) return "Trop court";
      if (l < 8) return "Moyen";
      return "Fort";
    },
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
    },
    validateField(field) {
      if (field === "username") {
        if (!this.form.username.trim())
          this.errors.username = "Le nom d'utilisateur est requis.";
        else if (this.form.username.length < 3)
          this.errors.username = "Minimum 3 caractères.";
        else
          delete this.errors.username;
      }
      if (field === "code") {
        if (!this.form.code)
          this.errors.code = "Le code est requis.";
        else if (this.form.code.length < 4)
          this.errors.code = "Minimum 4 caractères.";
        else
          delete this.errors.code;
      }
      // forcer réactivité
      this.errors = { ...this.errors };
    },
    validateAll() {
      ["username", "code"].forEach(f => this.validateField(f));
      return Object.keys(this.errors).length === 0;
    },
    async handleLogin() {
      this.successMsg = "";
      this.errorMsg = "";
      if (!this.validateAll()) return;

      this.loading = true;
      try {
        const res = await axios.post(
          "http://localhost:8000/api/token/",
          {
            username: this.form.username,
            password: this.form.code,
          }
        );
        if (res.status === 200) {
          localStorage.setItem('access_token', res.data.access);
          if (res.data.refresh) {
            localStorage.setItem('refresh_token', res.data.refresh);
          }
          this.successMsg = "Connexion réussie ! Redirection en cours...";
          this.form = { username: "", code: "" };
          this.errors = {};
          setTimeout(() => this.$router.push("/formateurs"), 1500);
        }
      } catch (e) {
        // Si l'API échoue, on vérifie les comptes créés localement
        const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const found = users.find(
          u => u.username === this.form.username && u.code === this.form.code
        );
        if (found) {
          localStorage.setItem('access_token', 'local_user_' + found.username);
          this.successMsg = "Connexion réussie ! Redirection en cours...";
          this.form = { username: "", code: "" };
          this.errors = {};
          setTimeout(() => this.$router.push("/formateurs"), 1500);
        } else {
          const d = e.response?.data;
          if (d?.detail) {
            this.errorMsg = d.detail;
          } else {
            this.errorMsg = "Identifiants incorrects. Vérifiez votre nom et votre code.";
          }
          this.errors = { ...this.errors };
        }
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.updateTime();
    this._timer = setInterval(this.updateTime, 1000);
    // Pré-remplir le nom si on vient de s'inscrire
    if (this.$route.query.registered === '1' && this.$route.query.username) {
      this.form.username = this.$route.query.username;
      this.successMsg = `Compte créé avec succès ! Entrez maintenant votre code pour vous connecter.`;
    }
  },
  beforeUnmount() {
    clearInterval(this._timer);
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

/* ═══════════════════════════
   RESET & VARIABLES
═══════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app-shell {
  --blue:      #1a73e8;
  --blue-lt:   #e8f0fe;
  --blue-dark: #1557b0;
  --green:     #1e8e3e;
  --green-lt:  #e6f4ea;
  --red:       #d93025;
  --red-lt:    #fce8e6;
  --orange:    #f29900;
  --text:      #1f2937;
  --text-2:    #6b7280;
  --border:    #e5e7eb;
  --bg:        #f5f7fa;
  --white:     #ffffff;
  --radius:    12px;
  --shadow:    0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.05);

  font-family: 'Outfit', -apple-system, sans-serif;
  background: var(--bg);
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* ═══════════════════════════
   BARRE DE STATUT
═══════════════════════════ */
.status-bar {
  height: 44px;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}

.status-icons {
  display: flex;
  align-items: center;
  gap: 6px;
}

.signal {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}
.signal i {
  display: block;
  width: 3px;
  background: var(--text);
  border-radius: 1px;
}
.signal i:nth-child(1) { height: 4px; }
.signal i:nth-child(2) { height: 6px; }
.signal i:nth-child(3) { height: 9px; }
.signal i:nth-child(4) { height: 12px; }

.network {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .5px;
}

.battery {
  display: flex;
  align-items: center;
  gap: 1px;
}
.bat-body {
  width: 22px; height: 11px;
  border: 2px solid var(--text);
  border-radius: 3px;
  padding: 1px;
  display: flex;
}
.bat-fill {
  flex: 1;
  background: var(--green);
  border-radius: 1px;
}
.bat-tip {
  width: 2px; height: 5px;
  background: var(--text);
  border-radius: 0 1px 1px 0;
}

/* ═══════════════════════════
   HEADER
═══════════════════════════ */
.app-header {
  background: var(--white);
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid var(--border);
}

.site-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--blue);
  letter-spacing: -.2px;
}

/* ═══════════════════════════
   BREADCRUMB
═══════════════════════════ */
.breadcrumb {
  background: var(--white);
  padding: 10px 18px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border);
}

.avatar-thumb {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  overflow: hidden;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.avatar-thumb img { width: 100%; height: 100%; object-fit: cover; }
.avatar-fallback { font-size: 22px; }

.breadcrumb-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bc-main {
  font-size: 13px;
  color: var(--text-2);
}
.bc-main strong {
  color: var(--blue);
  font-weight: 600;
}
.bc-sub {
  font-size: 12px;
  color: var(--text-2);
  font-style: italic;
}

/* ═══════════════════════════
   CONTENU PRINCIPAL
═══════════════════════════ */
.main-content {
  flex: 1;
  padding: 20px 16px 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  padding: 0 2px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -.3px;
}

.section-desc {
  font-size: 13px;
  color: var(--text-2);
  margin-top: 3px;
}

/* ═══════════════════════════
   CARTE FORMULAIRE
═══════════════════════════ */
.form-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-md);
  border: 1.5px solid var(--border);
  transition: border-color .25s;
}
.form-card.card-error {
  border-color: #fca5a5;
}

/* ── Messages ── */
.msg-success, .msg-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  margin-bottom: 18px;
  font-size: 13px;
}
.msg-success {
  background: var(--green-lt);
  border: 1px solid #a7f3d0;
  color: var(--green);
}
.msg-error {
  background: var(--red-lt);
  border: 1px solid #fca5a5;
  color: var(--red);
}
.msg-icon {
  width: 22px; height: 22px; flex-shrink: 0;
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 900;
}
.msg-success .msg-icon { background: var(--green); color: white; }
.msg-error   .msg-icon { background: var(--red);   color: white; }
.msg-success strong, .msg-error strong { display: block; font-weight: 700; margin-bottom: 2px; }
.msg-success p, .msg-error p { font-size: 12px; opacity: .85; }

/* ── Champs ── */
.field-group {
  margin-bottom: 16px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 7px;
}
.label-icon { font-size: 14px; }
.required { color: var(--red); font-size: 14px; }

.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-input {
  width: 100%;
  padding: 13px 42px 13px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  background: #fafafa;
  outline: none;
  transition: border-color .2s, background .2s, box-shadow .2s;
  -webkit-appearance: none;
}
.field-input::placeholder { color: #bbc0ca; font-weight: 400; }
.field-input:focus {
  border-color: var(--blue);
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(26,115,232,.12);
}

/* Couleur bordure selon état */
.field-err .field-input  { border-color: var(--red) !important; background: #fff8f8; }
.field-err .field-input:focus { box-shadow: 0 0 0 3px rgba(217,48,37,.1); }
.field-ok  .field-input  { border-color: #a7f3d0; }

/* Icône de statut */
.field-status {
  position: absolute;
  right: 13px;
  font-size: 16px;
  font-weight: 700;
}
.ok-icon  { color: var(--green); }
.err-icon { color: var(--red); }

/* Bouton afficher/masquer code */
.toggle-code {
  position: absolute;
  right: 10px;
  background: none; border: none;
  font-size: 17px; cursor: pointer;
  padding: 4px; opacity: .7;
  transition: opacity .2s;
}
.toggle-code:hover { opacity: 1; }

/* Indicateur de force */
.code-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
}
.strength-dots {
  display: flex;
  gap: 4px;
}
.dot {
  width: 28px; height: 4px;
  border-radius: 2px;
  background: var(--border);
  transition: background .3s;
}
.dot-active          { background: var(--red); }
.dot-active.dot-med  { background: var(--orange); }
.dot-active.dot-strong { background: var(--green); }

.strength-text { font-size: 12px; font-weight: 600; }
.str-weak   { color: var(--red); }
.str-med    { color: var(--orange); }
.str-strong { color: var(--green); }

/* Message d'erreur champ */
.field-error-msg {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--red);
}

/* ── Bouton inscription ── */
.btn-inscription {
  width: 100%;
  padding: 15px;
  margin-top: 4px;
  border: none;
  border-radius: 10px;
  background: var(--blue);
  color: white;
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background .2s, transform .15s, box-shadow .2s;
  box-shadow: 0 2px 8px rgba(26,115,232,.35);
  position: relative;
  overflow: hidden;
}
.btn-inscription::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,.15) 0%, transparent 60%);
  pointer-events: none;
}
.btn-inscription:hover:not(:disabled) {
  background: var(--blue-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(26,115,232,.4);
}
.btn-inscription:active:not(:disabled) {
  transform: translateY(0);
}
.btn-inscription:disabled {
  opacity: .65; cursor: not-allowed;
}
.btn-inscription.btn-loading {
  background: #93b4e8;
}

.spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Divider ── */
.divider-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 14px;
}
.divider-row span { flex: 1; height: 1px; background: var(--border); }
.divider-row em {
  font-style: normal;
  font-size: 12px;
  color: var(--text-2);
  font-weight: 500;
}

/* ── Lien connexion ── */
.login-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.login-text {
  font-size: 14px;
  color: var(--text-2);
}
.login-link {
  font-size: 14px;
  font-weight: 700;
  color: var(--blue);
  text-decoration: none;
  transition: color .2s;
}
.login-link:hover { color: var(--blue-dark); text-decoration: underline; }

/* ═══════════════════════════
   INFO BOX
═══════════════════════════ */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: var(--blue-lt);
  border: 1px solid #c5d9f7;
  border-radius: 10px;
  font-size: 13px;
  color: #1557b0;
  line-height: 1.5;
}
.info-icon {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  display: grid; place-items: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

/* ═══════════════════════════
   BARRE DE NAV BAS
═══════════════════════════ */
.bottom-nav {
  position: fixed;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 100%; max-width: 430px;
  background: var(--white);
  border-top: 1px solid var(--border);
  display: flex;
  padding: 8px 0 16px;
  z-index: 100;
  box-shadow: 0 -2px 10px rgba(0,0,0,.06);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity .2s;
}
.nav-icon  { font-size: 22px; }
.nav-label {
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-2);
  letter-spacing: .3px;
}
.nav-item.nav-active .nav-label { color: var(--blue); }
.nav-item.nav-active .nav-icon  { filter: drop-shadow(0 0 3px rgba(26,115,232,.4)); }

/* ═══════════════════════════
   TRANSITIONS
═══════════════════════════ */
.slide-down-enter-active, .slide-down-leave-active { transition: all .3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

.err-msg-enter-active, .err-msg-leave-active { transition: all .2s ease; }
.err-msg-enter-from, .err-msg-leave-to { opacity: 0; transform: translateY(-4px); max-height: 0; }
.err-msg-enter-to, .err-msg-leave-from { max-height: 40px; }

/* ═══════════════════════════
   RESPONSIVE
═══════════════════════════ */
@media (max-width: 430px) {
  .app-shell { max-width: 100%; }
}
@media (min-width: 430px) {
  .app-shell {
    box-shadow: 0 0 0 1px var(--border), 0 20px 60px rgba(0,0,0,.12);
    border-radius: 40px;
    margin: 20px auto;
    min-height: calc(100vh - 40px);
    overflow: hidden;
  }
}
</style>
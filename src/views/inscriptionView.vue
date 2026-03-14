<template>
  <div class="app-shell">

    <!-- STATUS BAR -->
    <div class="status-bar">
      <span class="status-brand">Mon site</span>
      <span class="status-tag">Inscription</span>
    </div>

    <!-- HEADER -->
    <header class="app-header">
      <div class="avatar-thumb">
        <span>🏫</span>
      </div>
      <div class="header-text">
        <span class="header-main">Centre de Formation</span>
        <span class="header-sub">Créez votre compte gratuitement</span>
      </div>
    </header>

    <!-- CONTENU PRINCIPAL -->
    <main class="main-content">

      <div class="section-header">
        <h2 class="section-title">Inscription</h2>
        <p class="section-desc">Remplissez les champs pour accéder à la plateforme</p>
      </div>

      <div class="form-card">

        <!-- Message d'erreur -->
        <transition name="slide-down">
          <div v-if="errorMsg" class="msg-error">
            <span class="msg-icon">!</span>
            <div>
              <strong>Erreur</strong>
              <p>{{ errorMsg }}</p>
            </div>
          </div>
        </transition>

        <form @submit.prevent="handleRegister" novalidate>

          <!-- Nom d'utilisateur -->
          <div class="field-group">
            <label class="field-label">
              <span>👤</span>
              Nom d'utilisateur <span class="required">*</span>
            </label>
            <div class="field-wrap">
              <input
                v-model="form.username"
                type="text"
                class="field-input"
                placeholder="Choisissez un nom d'utilisateur"
                autocomplete="username"
                required
              />
              <span class="field-status" v-if="form.username">
                <span v-if="form.username.length >= 3" class="ok-icon">✓</span>
                <span v-else class="err-icon">✗</span>
              </span>
            </div>
            <p class="hint-text" v-if="form.username && form.username.length < 3">Minimum 3 caractères</p>
          </div>

          <!-- Code -->
          <div class="field-group">
            <label class="field-label">
              <span>🔢</span>
              Code (Mot de passe) <span class="required">*</span>
            </label>
            <div class="field-wrap">
              <input
                v-model="form.code"
                :type="showCode ? 'text' : 'password'"
                class="field-input"
                placeholder="Créez un code d'accès"
                autocomplete="new-password"
                required
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
          </div>

          <button type="submit" class="btn-primary">S'inscrire →</button>
        </form>

        <div class="divider-row">
          <span></span><em>ou</em><span></span>
        </div>

        <div class="login-row">
          <span class="login-text">Déjà un compte ?</span>
          <router-link to="/Login" class="login-link">Se connecter</router-link>
        </div>
      </div>

      <!-- Info box -->
      <div class="info-box">
        <span class="info-icon">ℹ</span>
        <p>Votre compte sera utilisé pour accéder aux formateurs et aux salles disponibles.</p>
      </div>
    </main>

  </div>
</template>

<script>
export default {
  name: "InscriptionView",
  data() {
    return {
      form: { username: "", code: "" },
      errorMsg: "",
      showCode: false,
    };
  },
  computed: {
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
    handleRegister() {
      const { username, code } = this.form;
      this.errorMsg = "";

      if (!username.trim() || username.length < 3) {
        this.errorMsg = "Le nom d'utilisateur doit avoir au moins 3 caractères.";
        return;
      }
      if (!code || code.length < 4) {
        this.errorMsg = "Le code doit avoir au moins 4 caractères.";
        return;
      }

      const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const exists = users.find(u => u.username === username);
      if (exists) {
        this.errorMsg = "Ce nom d'utilisateur existe déjà. Choisissez-en un autre.";
        return;
      }

      users.push({ username, code });
      localStorage.setItem('registered_users', JSON.stringify(users));

      this.$router.push({ path: '/Login', query: { registered: '1', username } });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app-shell {
  --blue:      #1a73e8;
  --blue-dark: #1557b0;
  --blue-lt:   #e8f0fe;
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
  --shadow:    0 1px 3px rgba(0,0,0,.1);
  --shadow-md: 0 4px 10px rgba(0,0,0,.08);

  font-family: 'Outfit', -apple-system, sans-serif;
  background: var(--bg);
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* STATUS BAR */
.status-bar {
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  color: white;
  font-size: 13px;
  font-weight: 700;
}
.status-tag {
  background: rgba(255,255,255,.22);
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .5px;
}

/* HEADER */
.app-header {
  background: var(--white);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 13px;
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow);
}
.avatar-thumb {
  width: 46px; height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.header-text { display: flex; flex-direction: column; gap: 2px; }
.header-main { font-size: 15px; font-weight: 700; color: var(--text); }
.header-sub  { font-size: 12px; color: var(--text-2); }

/* MAIN */
.main-content {
  flex: 1;
  padding: 20px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header { padding: 0 2px; }
.section-title  { font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -.3px; }
.section-desc   { font-size: 13px; color: var(--text-2); margin-top: 3px; }

/* FORM CARD */
.form-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow-md);
  border: 1.5px solid var(--border);
}

/* MESSAGES */
.msg-error {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px; border-radius: 10px;
  margin-bottom: 16px; font-size: 13px;
  background: var(--red-lt);
  border: 1px solid #fca5a5;
  color: var(--red);
}
.msg-icon {
  width: 22px; height: 22px; flex-shrink: 0;
  border-radius: 50%; display: grid; place-items: center;
  font-size: 12px; font-weight: 900;
  background: var(--red); color: white;
}
.msg-error strong { display: block; font-weight: 700; margin-bottom: 2px; }
.msg-error p { font-size: 12px; opacity: .85; }

/* CHAMPS */
.field-group { margin-bottom: 16px; }
.field-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--text);
  margin-bottom: 7px;
}
.required { color: var(--red); }
.field-wrap { position: relative; display: flex; align-items: center; }
.field-input {
  width: 100%;
  padding: 13px 42px 13px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 15px; font-weight: 500;
  color: var(--text);
  background: #fafafa;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.field-input::placeholder { color: #bbc0ca; font-weight: 400; }
.field-input:focus {
  border-color: var(--blue);
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(26,115,232,.12);
}
.field-status { position: absolute; right: 13px; font-size: 16px; font-weight: 700; }
.ok-icon  { color: var(--green); }
.err-icon { color: var(--red); }
.hint-text { margin-top: 5px; font-size: 12px; color: var(--orange); font-weight: 600; }

.toggle-code {
  position: absolute; right: 10px;
  background: none; border: none;
  font-size: 17px; cursor: pointer;
  padding: 4px; opacity: .7;
  transition: opacity .2s;
}
.toggle-code:hover { opacity: 1; }

/* Indicateur de force */
.code-strength { display: flex; align-items: center; gap: 8px; margin-top: 7px; }
.strength-dots { display: flex; gap: 4px; }
.dot { width: 28px; height: 4px; border-radius: 2px; background: var(--border); transition: background .3s; }
.dot-active           { background: var(--red); }
.dot-active.dot-med   { background: var(--orange); }
.dot-active.dot-strong{ background: var(--green); }
.strength-text { font-size: 12px; font-weight: 600; }
.str-weak   { color: var(--red); }
.str-med    { color: var(--orange); }
.str-strong { color: var(--green); }

/* BOUTON */
.btn-primary {
  width: 100%; padding: 15px; margin-top: 4px;
  border: none; border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-family: 'Outfit', sans-serif;
  font-size: 16px; font-weight: 700;
  cursor: pointer;
  transition: opacity .2s, transform .15s, box-shadow .2s;
  box-shadow: 0 4px 14px rgba(102,126,234,.4);
}
.btn-primary:hover { opacity: .92; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

/* DIVIDER */
.divider-row { display: flex; align-items: center; gap: 10px; margin: 18px 0 14px; }
.divider-row span { flex: 1; height: 1px; background: var(--border); }
.divider-row em { font-style: normal; font-size: 12px; color: var(--text-2); font-weight: 500; }

/* LIEN */
.login-row { display: flex; align-items: center; justify-content: center; gap: 6px; }
.login-text { font-size: 14px; color: var(--text-2); }
.login-link { font-size: 14px; font-weight: 700; color: #667eea; text-decoration: none; transition: color .2s; }
.login-link:hover { color: #764ba2; text-decoration: underline; }

/* INFO BOX */
.info-box {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 12px 14px;
  background: var(--blue-lt);
  border: 1px solid #c5d9f7;
  border-radius: 10px;
  font-size: 13px; color: #1557b0; line-height: 1.5;
}
.info-icon {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--blue); color: white;
  display: grid; place-items: center;
  font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 1px;
}

/* TRANSITIONS */
.slide-down-enter-active, .slide-down-leave-active { transition: all .3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

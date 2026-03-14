<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const formateurs = ref([]);
const loading    = ref(true);
const error      = ref('');
const showModal  = ref(false);
const saving     = ref(false);
const saveError  = ref('');
const saveOk     = ref('');
const router     = useRouter();

const form = ref({ nom: '', prenom: '', matricule: '', specialite: '', email: '' });

const avatarColors = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
];

function fetchFormateurs() {
  loading.value = true;
  axios.get("http://127.0.0.1:8000/gestion_etudiant/formateurs/")
    .then(resp => { formateurs.value = resp.data.results ?? resp.data; })
    .catch(() => { error.value = "Impossible de charger les formateurs."; })
    .finally(() => { loading.value = false; });
}

onMounted(fetchFormateurs);

function openModal() {
  form.value = { nom: '', prenom: '', matricule: '', specialite: '', email: '' };
  saveError.value = '';
  saveOk.value = '';
  showModal.value = true;
}

async function submitFormateur() {
  if (!form.value.nom.trim() || !form.value.prenom.trim() || !form.value.matricule.trim()) {
    saveError.value = "Les champs Nom, Prénom et Matricule sont obligatoires.";
    return;
  }
  saving.value = true;
  saveError.value = '';
  try {
    await axios.post("http://127.0.0.1:8000/gestion_etudiant/formateurs/", {
      nom:        form.value.nom,
      prenom:     form.value.prenom,
      matricule:  form.value.matricule,
      specialite: form.value.specialite,
      email:      form.value.email,
    });
    saveOk.value = `Formateur "${form.value.prenom} ${form.value.nom}" ajouté avec succès !`;
    fetchFormateurs();
    setTimeout(() => { showModal.value = false; saveOk.value = ''; }, 1800);
  } catch(e) {
    const data = e.response?.data;
    saveError.value = data ? JSON.stringify(data) : "Erreur lors de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  router.push('/Login');
}

function getInitials(nom, prenom) {
  return ((nom?.[0] || '') + (prenom?.[0] || '')).toUpperCase();
}
</script>

<template>
  <div class="app-shell">

    <!-- STATUS BAR -->
    <div class="status-bar">
      <span class="status-brand">Mon site</span>
      <span class="badge-live">● LIVE</span>
    </div>

    <!-- HEADER -->
    <header class="app-header">
      <div class="header-info">
        <h1 class="site-title">Formateurs</h1>
        <span class="header-count" v-if="formateurs.length">
          {{ formateurs.length }} formateur{{ formateurs.length > 1 ? 's' : '' }}
        </span>
      </div>
      <button class="btn-logout" @click="logout">⏻ Quitter</button>
    </header>

    <!-- NAV TABS -->
    <nav class="tab-nav">
      <button class="tab-item tab-active" @click="$router.push('/formateurs')">
        <span>👥</span> Formateurs
      </button>
      <button class="tab-item" @click="$router.push('/salle')">
        <span>🏫</span> Salles
      </button>
    </nav>

    <!-- CONTENU -->
    <main class="main-content">
      <div v-if="loading" class="state-box">
        <div class="spinner-lg"></div>
        <p>Chargement...</p>
      </div>
      <div v-else-if="error" class="state-box error-box">
        <span class="state-icon">⚠</span><p>{{ error }}</p>
      </div>
      <div v-else-if="formateurs.length === 0" class="state-box">
        <span class="state-icon">👥</span>
        <p>Aucun formateur. Cliquez sur <strong>+</strong> pour en ajouter un.</p>
      </div>
      <div v-else class="formateurs-grid">
        <div
          class="formateur-card"
          v-for="(f, index) in formateurs"
          :key="f.matricule || index"
        >
          <div class="card-avatar" :style="{ background: avatarColors[index % avatarColors.length] }">
            {{ getInitials(f.nom, f.prenom) }}
          </div>
          <div class="card-body">
            <h3 class="card-name">{{ f.prenom }} {{ f.nom }}</h3>
            <div class="card-meta">
              <span class="meta-badge">🪪 {{ f.matricule }}</span>
              <span class="meta-badge" v-if="f.specialite">📚 {{ f.specialite }}</span>
              <span class="meta-badge" v-if="f.email">✉ {{ f.email }}</span>
            </div>
          </div>
          <span class="card-arrow">›</span>
        </div>
      </div>
    </main>

    <!-- FAB BOUTON + -->
    <button class="fab-btn" @click="openModal" title="Ajouter un formateur">
      <span class="fab-icon">+</span>
    </button>

    <!-- BOTTOM NAV -->
    <nav class="bottom-nav">
      <button class="nav-item nav-active" @click="$router.push('/formateurs')">
        <span class="nav-icon">👥</span><span class="nav-label">Formateurs</span>
      </button>
      <button class="nav-item" @click="$router.push('/salle')">
        <span class="nav-icon">🏫</span><span class="nav-label">Salles</span>
      </button>
      <button class="nav-item" @click="logout">
        <span class="nav-icon">⏻</span><span class="nav-label">Quitter</span>
      </button>
    </nav>

    <!-- ══════════ MODAL AJOUT FORMATEUR ══════════ -->
    <transition name="fade">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2 class="modal-title">➕ Nouveau formateur</h2>
            <button class="modal-close" @click="showModal = false">✕</button>
          </div>

          <!-- Succès -->
          <div v-if="saveOk" class="msg-success">
            <span>✓</span> {{ saveOk }}
          </div>

          <!-- Erreur -->
          <div v-if="saveError" class="msg-error">
            <span>⚠</span> {{ saveError }}
          </div>

          <form @submit.prevent="submitFormateur" class="modal-form">
            <div class="field-group">
              <label class="field-label">Nom <span class="req">*</span></label>
              <input v-model="form.nom" type="text" class="field-input" placeholder="Ex: Dupont" required />
            </div>
            <div class="field-group">
              <label class="field-label">Prénom <span class="req">*</span></label>
              <input v-model="form.prenom" type="text" class="field-input" placeholder="Ex: Jean" required />
            </div>
            <div class="field-group">
              <label class="field-label">Matricule <span class="req">*</span></label>
              <input v-model="form.matricule" type="text" class="field-input" placeholder="Ex: F-001" required />
            </div>
            <div class="field-group">
              <label class="field-label">Spécialité</label>
              <input v-model="form.specialite" type="text" class="field-input" placeholder="Ex: Informatique" />
            </div>
            <div class="field-group">
              <label class="field-label">Email</label>
              <input v-model="form.email" type="email" class="field-input" placeholder="Ex: jean@mail.com" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" @click="showModal = false">Annuler</button>
              <button type="submit" class="btn-save" :disabled="saving">
                <span v-if="saving" class="spinner-sm"></span>
                <span v-else>💾 Enregistrer</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app-shell {
  --blue:      #1a73e8;
  --blue-dark: #1557b0;
  --blue-lt:   #e8f0fe;
  --green:     #1e8e3e;
  --red:       #d93025;
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
  position: relative;
}

/* STATUS BAR */
.status-bar {
  height: 40px; background: var(--blue);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 18px; color: white; font-size: 13px; font-weight: 700;
}
.badge-live { font-size: 11px; color: #b9f5d0; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

/* HEADER */
.app-header {
  background: var(--white); padding: 13px 18px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border); box-shadow: var(--shadow);
}
.header-info { display: flex; align-items: center; gap: 10px; }
.site-title { font-size: 20px; font-weight: 700; color: var(--text); }
.header-count {
  padding: 3px 10px; background: var(--blue-lt); color: var(--blue);
  border-radius: 20px; font-size: 12px; font-weight: 700;
}
.btn-logout {
  padding: 7px 12px; background: #fce8e6; color: var(--red);
  border: 1px solid #fca5a5; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;
}
.btn-logout:hover { background: #fca5a5; }

/* TAB NAV */
.tab-nav { background: var(--white); display: flex; border-bottom: 2px solid var(--border); }
.tab-item {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 12px; background: none; border: none; border-bottom: 3px solid transparent;
  margin-bottom: -2px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
  color: var(--text-2); cursor: pointer; transition: color .2s, border-color .2s;
}
.tab-item:hover { color: var(--blue); }
.tab-active { color: var(--blue) !important; border-bottom-color: var(--blue) !important; }

/* MAIN */
.main-content {
  flex: 1; padding: 16px 14px 110px;
  display: flex; flex-direction: column; gap: 10px;
}

/* ÉTATS */
.state-box {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 14px; padding: 50px 20px;
  color: var(--text-2); font-size: 14px; text-align: center;
}
.error-box { color: var(--red); }
.state-icon { font-size: 40px; }
.spinner-lg {
  width: 42px; height: 42px; border: 4px solid var(--border);
  border-top-color: var(--blue); border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* GRILLE */
.formateurs-grid { display: flex; flex-direction: column; gap: 10px; }
.formateur-card {
  display: flex; align-items: center; gap: 13px;
  background: var(--white); border-radius: var(--radius);
  padding: 13px 15px; box-shadow: var(--shadow); border: 1.5px solid var(--border);
  cursor: pointer; transition: transform .15s, box-shadow .15s, border-color .2s;
}
.formateur-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: #93c4fb; }
.card-avatar {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 16px; font-weight: 700;
}
.card-body { flex: 1; min-width: 0; }
.card-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 5px; }
.card-meta { display: flex; flex-wrap: wrap; gap: 4px; }
.meta-badge {
  padding: 2px 8px; background: var(--bg); border: 1px solid var(--border);
  border-radius: 20px; font-size: 11px; color: var(--text-2); font-weight: 500;
}
.card-arrow { font-size: 22px; color: #d1d5db; flex-shrink: 0; }

/* ── FAB BOUTON + ── */
.fab-btn {
  position: fixed;
  bottom: 86px;
  right: calc(50% - 215px + 16px);
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a73e8, #1557b0);
  color: white;
  border: none;
  box-shadow: 0 4px 16px rgba(26,115,232,.5);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform .2s, box-shadow .2s;
  z-index: 90;
}
.fab-btn:hover { transform: scale(1.1); box-shadow: 0 6px 22px rgba(26,115,232,.6); }
.fab-btn:active { transform: scale(0.96); }
.fab-icon { font-size: 30px; font-weight: 300; line-height: 1; }

/* BOTTOM NAV */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; background: var(--white);
  border-top: 1px solid var(--border); display: flex;
  padding: 8px 0 16px; z-index: 100;
  box-shadow: 0 -2px 10px rgba(0,0,0,.06);
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 3px; background: none; border: none; cursor: pointer; padding: 4px 0;
}
.nav-icon  { font-size: 22px; }
.nav-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 600; color: var(--text-2); }
.nav-active .nav-label { color: var(--blue); }

/* ══ MODAL ══ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 200;
}
.modal-box {
  background: var(--white);
  border-radius: 20px 20px 0 0;
  padding: 24px 20px 36px;
  width: 100%; max-width: 430px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 -8px 30px rgba(0,0,0,.15);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.modal-title { font-size: 18px; font-weight: 700; color: var(--text); }
.modal-close {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg); border: 1px solid var(--border);
  font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .2s;
}
.modal-close:hover { background: #fce8e6; color: var(--red); }

.modal-form { display: flex; flex-direction: column; gap: 14px; }

.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 600; color: var(--text); }
.req { color: var(--red); }
.field-input {
  width: 100%; padding: 12px 14px;
  border: 1.5px solid var(--border); border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--text);
  background: #fafafa; outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.field-input:focus {
  border-color: var(--blue); background: var(--white);
  box-shadow: 0 0 0 3px rgba(26,115,232,.1);
}

.modal-footer {
  display: flex; gap: 10px; margin-top: 6px;
}
.btn-cancel {
  flex: 1; padding: 13px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 10px; font-family: 'Outfit', sans-serif;
  font-size: 14px; font-weight: 600; color: var(--text-2); cursor: pointer;
  transition: background .2s;
}
.btn-cancel:hover { background: var(--border); }
.btn-save {
  flex: 2; padding: 13px;
  background: linear-gradient(135deg, #1a73e8, #1557b0);
  color: white; border: none; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: opacity .2s, transform .15s;
  box-shadow: 0 4px 14px rgba(26,115,232,.35);
}
.btn-save:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.btn-save:disabled { opacity: .6; cursor: not-allowed; }
.spinner-sm {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,.3);
  border-top-color: white; border-radius: 50%;
  animation: spin .7s linear infinite;
}

/* Messages */
.msg-success {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; margin-bottom: 12px;
  background: #e6f4ea; border: 1px solid #a7f3d0;
  border-radius: 10px; color: var(--green); font-size: 13px; font-weight: 600;
}
.msg-error {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; margin-bottom: 12px;
  background: #fce8e6; border: 1px solid #fca5a5;
  border-radius: 10px; color: var(--red); font-size: 13px; font-weight: 600;
}

/* Transition modal */
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
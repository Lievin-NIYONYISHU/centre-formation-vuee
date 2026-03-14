<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const salles     = ref([]);
const loading    = ref(true);
const error      = ref('');
const showModal  = ref(false);
const saving     = ref(false);
const saveError  = ref('');
const saveOk     = ref('');
const router     = useRouter();

const form = ref({ nom: '', capacite: '', type: '', disponible: true });

const typeOptions = ['Cours', 'TD', 'TP', 'TP Informatique', 'Conférence', 'Réunion'];

const salleColors  = ['#e8f0fe','#fce4ec','#e8f5e9','#fff3e0','#f3e5f5','#e0f7fa'];
const salleBorders = ['#1a73e8','#e91e63','#43a047','#f57c00','#8e24aa','#00acc1'];

const typeIcons = {
  'Cours': '📖', 'TD': '✏️', 'TP': '🔬',
  'TP Informatique': '💻', 'Conférence': '🎤', 'Réunion': '🤝',
};
function getIcon(type) {
  for (const key in typeIcons) { if (type?.includes(key)) return typeIcons[key]; }
  return '🏫';
}

function fetchSalles() {
  loading.value = true;
  axios.get("http://127.0.0.1:8000/gestion_etudiant/salles/")
    .then(resp => { salles.value = resp.data.results ?? resp.data; })
    .catch(() => {
      salles.value = [
        { id: 1, nom: 'Salle A', capacite: 30, type: 'Cours', disponible: true },
        { id: 2, nom: 'Salle B', capacite: 20, type: 'TD', disponible: false },
        { id: 3, nom: 'Salle C', capacite: 15, type: 'TP Informatique', disponible: true },
        { id: 4, nom: 'Amphithéâtre', capacite: 120, type: 'Conférence', disponible: true },
      ];
    })
    .finally(() => { loading.value = false; });
}

onMounted(fetchSalles);

function openModal() {
  form.value = { nom: '', capacite: '', type: 'Cours', disponible: true };
  saveError.value = '';
  saveOk.value = '';
  showModal.value = true;
}

async function submitSalle() {
  if (!form.value.nom.trim()) {
    saveError.value = "Le nom de la salle est obligatoire.";
    return;
  }
  saving.value = true;
  saveError.value = '';
  try {
    await axios.post("http://127.0.0.1:8000/gestion_etudiant/salles/", {
      nom:       form.value.nom,
      capacite:  form.value.capacite || null,
      type:      form.value.type,
      disponible: form.value.disponible,
    });
    saveOk.value = `Salle "${form.value.nom}" ajoutée avec succès !`;
    fetchSalles();
    setTimeout(() => { showModal.value = false; saveOk.value = ''; }, 1800);
  } catch(e) {
    const data = e.response?.data;
    saveError.value = data ? JSON.stringify(data) : "Erreur lors de l'enregistrement. Vérifiez que le serveur Django est démarré.";
  } finally {
    saving.value = false;
  }
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  router.push('/Login');
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
        <h1 class="site-title">Salles</h1>
        <span class="header-count" v-if="salles.length">
          {{ salles.length }} salle{{ salles.length > 1 ? 's' : '' }}
        </span>
      </div>
      <button class="btn-logout" @click="logout">⏻ Quitter</button>
    </header>

    <!-- NAV TABS -->
    <nav class="tab-nav">
      <button class="tab-item" @click="$router.push('/formateurs')">
        <span>👥</span> Formateurs
      </button>
      <button class="tab-item tab-active" @click="$router.push('/salle')">
        <span>🏫</span> Salles
      </button>
    </nav>

    <!-- CONTENU -->
    <main class="main-content">

      <!-- Résumé -->
      <div class="summary-row" v-if="!loading && salles.length">
        <div class="summary-card green">
          <span class="sum-num">{{ salles.filter(s => s.disponible !== false).length }}</span>
          <span class="sum-label">Disponibles</span>
        </div>
        <div class="summary-card red">
          <span class="sum-num">{{ salles.filter(s => s.disponible === false).length }}</span>
          <span class="sum-label">Occupées</span>
        </div>
        <div class="summary-card blue">
          <span class="sum-num">{{ salles.reduce((a, s) => a + (parseInt(s.capacite) || 0), 0) }}</span>
          <span class="sum-label">Places totales</span>
        </div>
      </div>

      <div v-if="loading" class="state-box">
        <div class="spinner-lg"></div>
        <p>Chargement des salles...</p>
      </div>
      <div v-else-if="error" class="state-box error-box">
        <span class="state-icon">⚠</span><p>{{ error }}</p>
      </div>
      <div v-else-if="salles.length === 0" class="state-box">
        <span class="state-icon">🏫</span>
        <p>Aucune salle. Cliquez sur <strong>+</strong> pour en ajouter une.</p>
      </div>

      <div v-else class="salles-grid">
        <div
          class="salle-card"
          v-for="(s, index) in salles"
          :key="s.id || index"
          :style="{ background: salleColors[index % salleColors.length], borderColor: salleBorders[index % salleBorders.length] }"
        >
          <div class="salle-icon-wrap" :style="{ color: salleBorders[index % salleBorders.length] }">
            {{ getIcon(s.type) }}
          </div>
          <div class="salle-body">
            <h3 class="salle-name">{{ s.nom }}</h3>
            <p class="salle-type" v-if="s.type">{{ s.type }}</p>
            <div class="salle-meta">
              <span class="salle-badge" v-if="s.capacite">👤 {{ s.capacite }} places</span>
              <span class="salle-badge" :class="s.disponible === false ? 'badge-red' : 'badge-green'">
                {{ s.disponible === false ? '🔴 Occupée' : '🟢 Disponible' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- FAB BOUTON + -->
    <button class="fab-btn" @click="openModal" title="Ajouter une salle">
      <span class="fab-icon">+</span>
    </button>

    <!-- BOTTOM NAV -->
    <nav class="bottom-nav">
      <button class="nav-item" @click="$router.push('/formateurs')">
        <span class="nav-icon">👥</span><span class="nav-label">Formateurs</span>
      </button>
      <button class="nav-item nav-active" @click="$router.push('/salle')">
        <span class="nav-icon">🏫</span><span class="nav-label">Salles</span>
      </button>
      <button class="nav-item" @click="logout">
        <span class="nav-icon">⏻</span><span class="nav-label">Quitter</span>
      </button>
    </nav>

    <!-- ══ MODAL AJOUT SALLE ══ -->
    <transition name="fade">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2 class="modal-title">➕ Nouvelle salle</h2>
            <button class="modal-close" @click="showModal = false">✕</button>
          </div>

          <div v-if="saveOk" class="msg-success"><span>✓</span> {{ saveOk }}</div>
          <div v-if="saveError" class="msg-error"><span>⚠</span> {{ saveError }}</div>

          <form @submit.prevent="submitSalle" class="modal-form">
            <div class="field-group">
              <label class="field-label">Nom de la salle <span class="req">*</span></label>
              <input v-model="form.nom" type="text" class="field-input" placeholder="Ex: Salle A, Labo 01" required />
            </div>
            <div class="field-group">
              <label class="field-label">Capacité (nombre de places)</label>
              <input v-model="form.capacite" type="number" class="field-input" placeholder="Ex: 30" min="1" />
            </div>
            <div class="field-group">
              <label class="field-label">Type de salle</label>
              <select v-model="form.type" class="field-input">
                <option v-for="t in typeOptions" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
            <div class="field-group toggle-row">
              <label class="field-label">Disponibilité</label>
              <div class="toggle-wrap" @click="form.disponible = !form.disponible">
                <div class="toggle-track" :class="{ 'toggle-on': form.disponible }">
                  <div class="toggle-thumb"></div>
                </div>
                <span class="toggle-label" :class="form.disponible ? 'text-green' : 'text-red'">
                  {{ form.disponible ? '🟢 Disponible' : '🔴 Occupée' }}
                </span>
              </div>
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
  --blue-lt:   #e8f0fe;
  --green:     #1e8e3e;
  --green-lt:  #e6f4ea;
  --red:       #d93025;
  --red-lt:    #fce8e6;
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
  height: 40px; background: #1e8e3e;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 18px; color: white; font-size: 13px; font-weight: 700;
}
.badge-live { font-size: 11px; color: #b9f5d0; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }

/* HEADER */
.app-header {
  background: var(--white); padding: 13px 18px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid var(--border); box-shadow: var(--shadow);
}
.header-info { display: flex; align-items: center; gap: 10px; }
.site-title { font-size: 20px; font-weight: 700; color: var(--text); }
.header-count {
  padding: 3px 10px; background: var(--green-lt); color: var(--green);
  border-radius: 20px; font-size: 12px; font-weight: 700;
}
.btn-logout {
  padding: 7px 12px; background: var(--red-lt); color: var(--red);
  border: 1px solid #fca5a5; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer;
}
.btn-logout:hover { background: #fca5a5; }

/* TABS */
.tab-nav { background: var(--white); display: flex; border-bottom: 2px solid var(--border); }
.tab-item {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 12px; background: none; border: none; border-bottom: 3px solid transparent;
  margin-bottom: -2px; font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
  color: var(--text-2); cursor: pointer; transition: color .2s, border-color .2s;
}
.tab-item:hover { color: var(--green); }
.tab-active { color: var(--green) !important; border-bottom-color: var(--green) !important; }

/* MAIN */
.main-content { flex: 1; padding: 16px 14px 110px; display: flex; flex-direction: column; gap: 12px; }

/* RÉSUMÉ */
.summary-row { display: flex; gap: 8px; }
.summary-card {
  flex: 1; border-radius: 12px; padding: 12px 10px;
  display: flex; flex-direction: column; align-items: center; gap: 2px; border: 1.5px solid transparent;
}
.summary-card.green { background: var(--green-lt); border-color: #a7f3d0; }
.summary-card.red   { background: var(--red-lt);   border-color: #fca5a5; }
.summary-card.blue  { background: var(--blue-lt);  border-color: #93c4fb; }
.sum-num { font-size: 22px; font-weight: 800; }
.summary-card.green .sum-num { color: var(--green); }
.summary-card.red   .sum-num { color: var(--red); }
.summary-card.blue  .sum-num { color: var(--blue); }
.sum-label { font-size: 11px; font-weight: 600; color: var(--text-2); text-align: center; }

/* ÉTATS */
.state-box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; padding: 50px 20px; color: var(--text-2); font-size: 14px; text-align: center;
}
.error-box { color: var(--red); }
.state-icon { font-size: 40px; }
.spinner-lg {
  width: 42px; height: 42px; border: 4px solid var(--border);
  border-top-color: var(--green); border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* SALLES GRID */
.salles-grid { display: flex; flex-direction: column; gap: 10px; }
.salle-card {
  display: flex; align-items: center; gap: 14px;
  border-radius: var(--radius); padding: 15px 16px;
  border-left: 5px solid; box-shadow: var(--shadow);
  transition: transform .15s, box-shadow .2s; cursor: pointer;
}
.salle-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.salle-icon-wrap { font-size: 30px; flex-shrink: 0; }
.salle-body { flex: 1; }
.salle-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.salle-type { font-size: 12px; color: var(--text-2); margin-bottom: 6px; }
.salle-meta { display: flex; flex-wrap: wrap; gap: 5px; }
.salle-badge {
  padding: 3px 9px; background: rgba(255,255,255,.7);
  border: 1px solid rgba(0,0,0,.08); border-radius: 20px;
  font-size: 11px; font-weight: 600; color: var(--text-2);
}
.badge-green { color: #1e8e3e; } .badge-red { color: #d93025; }

/* FAB BOUTON + */
.fab-btn {
  position: fixed;
  bottom: 86px;
  right: calc(50% - 215px + 16px);
  width: 56px; height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e8e3e, #43a047);
  color: white; border: none;
  box-shadow: 0 4px 16px rgba(30,142,62,.5);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform .2s, box-shadow .2s;
  z-index: 90;
}
.fab-btn:hover { transform: scale(1.1); box-shadow: 0 6px 22px rgba(30,142,62,.6); }
.fab-btn:active { transform: scale(0.96); }
.fab-icon { font-size: 30px; font-weight: 300; line-height: 1; }

/* BOTTOM NAV */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px; background: var(--white);
  border-top: 1px solid var(--border); display: flex;
  padding: 8px 0 16px; z-index: 100; box-shadow: 0 -2px 10px rgba(0,0,0,.06);
}
.nav-item {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  gap: 3px; background: none; border: none; cursor: pointer; padding: 4px 0;
}
.nav-icon  { font-size: 22px; }
.nav-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 600; color: var(--text-2); }
.nav-active .nav-label { color: var(--green); }

/* MODAL */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45); backdrop-filter: blur(3px);
  display: flex; align-items: flex-end; justify-content: center; z-index: 200;
}
.modal-box {
  background: var(--white); border-radius: 20px 20px 0 0;
  padding: 24px 20px 36px; width: 100%; max-width: 430px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 -8px 30px rgba(0,0,0,.15);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;
}
.modal-title { font-size: 18px; font-weight: 700; color: var(--text); }
.modal-close {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg); border: 1px solid var(--border);
  font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;
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
  background: #fafafa; outline: none; transition: border-color .2s, box-shadow .2s;
}
.field-input:focus { border-color: var(--green); background: var(--white); box-shadow: 0 0 0 3px rgba(30,142,62,.1); }

/* TOGGLE */
.toggle-row { flex-direction: row !important; align-items: center; justify-content: space-between; }
.toggle-wrap { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.toggle-track {
  width: 46px; height: 26px; border-radius: 13px;
  background: #fca5a5; position: relative; transition: background .3s;
}
.toggle-track.toggle-on { background: #86efac; }
.toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 20px; height: 20px; border-radius: 50%;
  background: white; box-shadow: 0 1px 4px rgba(0,0,0,.2);
  transition: left .3s;
}
.toggle-on .toggle-thumb { left: 23px; }
.toggle-label { font-size: 13px; font-weight: 600; }
.text-green { color: var(--green); } .text-red { color: var(--red); }

/* FOOTER */
.modal-footer { display: flex; gap: 10px; margin-top: 6px; }
.btn-cancel {
  flex: 1; padding: 13px; background: var(--bg);
  border: 1.5px solid var(--border); border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-2); cursor: pointer;
}
.btn-cancel:hover { background: var(--border); }
.btn-save {
  flex: 2; padding: 13px;
  background: linear-gradient(135deg, #1e8e3e, #43a047);
  color: white; border: none; border-radius: 10px;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 14px rgba(30,142,62,.35); transition: opacity .2s, transform .15s;
}
.btn-save:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.btn-save:disabled { opacity: .6; cursor: not-allowed; }
.spinner-sm {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,.3); border-top-color: white;
  border-radius: 50%; animation: spin .7s linear infinite;
}

/* MESSAGES */
.msg-success {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px; margin-bottom: 12px;
  background: var(--green-lt); border: 1px solid #a7f3d0;
  border-radius: 10px; color: var(--green); font-size: 13px; font-weight: 600;
}
.msg-error {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px; margin-bottom: 12px;
  background: var(--red-lt); border: 1px solid #fca5a5;
  border-radius: 10px; color: var(--red); font-size: 13px; font-weight: 600;
}

/* TRANSITION */
.fade-enter-active, .fade-leave-active { transition: opacity .25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
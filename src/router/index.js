import { createRouter, createWebHistory } from 'vue-router'

// ── Imports des vues ─────────────────────────────────────
import formulaire1View from '../views/formulaire1View.vue'
import acceuilView from '../views/sallelView.vue'
import FormateursView from '../views/formateursView.vue'
import inscriptionsalleView from '../views/inscriptionsalleView.vue'
// import dashboardView supprimé, inutilisé
import InscriptionView from '../views/inscriptionView.vue'
import LoginView from '../views/LoginView.vue'

// ── Définition des routes ────────────────────────────────
const routes = [
  // Page d'accueil = page d'inscription (publique, obligatoire)
  {
    path: '/',
    name: 'inscription',
    component: InscriptionView,
    meta: { requiresAuth: false },
  },
  // Formulaire 1
  {
    path: '/formulaire1',
    name: 'formulaire1',
    component: formulaire1View,
    meta: { requiresAuth: false },
  },
  // Salle (ancien accueil)
  {
    path: '/salle',
    name: 'acceuil',
    component: acceuilView,
    meta: { requiresAuth: true },
  },
  // Formateurs (protégé)
  {
    path: '/formateurs',
    name: 'formateurs',
    component: FormateursView,
    meta: { requiresAuth: true },
  },
  // Inscription salle (protégé)
  {
    path: '/inscriptionsalle',
    name: 'inscriptionsalle',
    component: inscriptionsalleView,
    meta: { requiresAuth: true },
  },
  // Connexion (publique)
  {
    path: '/Login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  // Dashboard (protégé)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: inscriptionsalleView,
    meta: { requiresAuth: true },
  },
  // Fallback : toute URL inconnue → accueil
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

// ── Création du router ───────────────────────────────────
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ── Guard de navigation ──────────────────────────────────
// Bloque les pages protégées si l'utilisateur n'est pas connecté
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !token) {
    // Pas de token → renvoyer vers l'inscription
    next({ name: 'inscription' })
  } else if (!to.meta.requiresAuth && token &&
    (to.name === 'inscription' || to.name === 'Login')) {
    // Déjà connecté + tente d'aller sur une page publique → formateurs
    next({ name: 'formateurs' })
  } else {
    next()
  }
})

export default router
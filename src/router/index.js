import { createRouter, createWebHistory } from 'vue-router'
import acceuilView from '../views/acceuilView.vue'
// Importez la page 2
import formulaireView from '../views/formulaireView.vue'
import inscriptionsalleView from '../views/inscriptionsalleView.vue'
import formulaire1View from '../views/formulaire1View.vue'


const routes = [
  {
    path: '/',
    name: 'acceuil',
    component: formulaire1View
  },

  {
    path: '/formulaire',  // Nouvelle route pour page2
    name: 'formulaire',
    component: formulaireView
  },
   {
    path: '/formulaire1',  // Nouvelle route pour page2
    name: 'formulaire1',
    component: acceuilView
  },
  {
    path: '/inscriptionsalle',  // Nouvelle route pour page2
    name: 'inscriptionsalle',
    component: inscriptionsalleView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
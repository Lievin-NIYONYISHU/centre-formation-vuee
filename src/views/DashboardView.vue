<template>
  <div id="dashboard" class="page">
    <!-- Clé obligatoire pour la boucle v-for -->
    <div
      class="card"
      v-for="(f, index) in formateur"
      :key="f.id || index"
    >
      <h2 class="card-title">{{ f.nom }} {{ f.prenom }}</h2>
      <p class="card-text">{{ f.email }} – {{ f.date_naissance }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const formateur = ref([])

axios.get('http://127.0.0.1:8000/gestion_etudiant/formateurs/').then(resp => {
  formateur.value = resp.data
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
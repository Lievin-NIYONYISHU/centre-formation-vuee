<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';  // ← ajouter onMounted

const formateurs = ref([])  // minuscule

onMounted(() => {  // ← entourer l'appel axios
  axios.get("http://127.0.0.1:8000/gestion_etudiant/formateurs/")
    .then(resp => {
      // Fonctionne avec et sans pagination DRF
      formateurs.value = resp.data.results ?? resp.data
    })
    .catch(err => {
      console.error("Erreur de chargement :", err)
    })
})
</script>

<template>
  <h1>Formateurs disponibles</h1>

  <ol type="1">
    <!-- ← formateurs avec f minuscule -->
    <li class="formateur" v-for="f in formateurs" :key="f.matricule">
      {{ f.nom }} {{ f.prenom }} - Ref: {{ f.matricule }}
    </li>
  </ol>
</template>

<style scoped>
/* vos styles ici */
</style>
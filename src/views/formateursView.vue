<script setup>
import axios from 'axios';
import { ref } from 'vue';

const formateurs = ref([])

// Récupération des formateurs (vérifiez l'URL de votre API)
  axios.get("http://127.0.0.1:8000/gestion_etudiant/creneaux/").then(resp => {
  // .results si vous utilisez la pagination DRF, sinon resp.data
  formateurs.value = resp.data.results ; 
})
</script>

<template>
  <h1>Formateurs disponibles</h1>
  
  <ol type="1">
    <li class="formateur" v-for="f in Formateurs" :key="f.matricule">
      {{ f.nom }} {{ f.prenom }} - Ref: {{ f.matricule }}
    </li>
  </ol>
</template>

<style scoped>
/* Style identique à celui de "salle" */
.formateur {
  background: #f1f1f1;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}
</style>
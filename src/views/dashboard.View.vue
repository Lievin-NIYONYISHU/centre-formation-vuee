<template>
    <div id="dashboard" class="page">
      <div class="card" v-for="formateur in formateur">
        <h2 class="card-title">{{ formateur.nom }} {{ formateur.prenom }}</h2>
        <p class="card-text">{{formateur.email}} - {{ formateur.date_naissance }}</p>
      </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';

const formateur = ref([])

axios.get("http://127.0.0.1:8000//api/etudiants/").then(resp => {
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
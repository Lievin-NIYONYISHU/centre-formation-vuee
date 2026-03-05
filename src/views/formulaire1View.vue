<script setup>
import axios from 'axios';
import { ref } from 'vue';

const salles = ref([])

  axios.get("http://127.0.0.1:8000/gestion_etudiant/salles/").then(resp => {
    salles.value = resp.data.results;
  })

</script>

<template>
  <h1>salle disponible </h1>
  <ol type="1">
    <li class="salle" v-for="salle in salles" :key="salle.id">
      {{ salle.nom }} 
    </li>
  </ol>
</template>
<style scoped>
.salle{
  background: #f1f1f1;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}
</style>
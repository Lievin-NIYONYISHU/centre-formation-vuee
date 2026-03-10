<template>
  <!-- SECTION PRINCIPALE -->
  <section class="container">
    <!-- Image avec le bon chemin Vue -->
    <img 
      src="@/assets/images/lilove3.jpeg" 
      alt="logo de l'application" 
      width="80" 
      height="80"
    >

    <h1>soyez les Bienvenue</h1>
    <p class="subtitle">
      Apprenez et progressez
    </p>

    <!-- CARTES -->
    <div class="cards">
      <div class="card orange">
        <div class="icon">▶</div>
        <h3>Cours en ligne</h3>
        <p>Accédez à des cours interactifs</p>
      </div>

      <div class="card purple">
        <div class="icon">📅</div>
        <h3>Créer un plan</h3>
        <p>Organisez votre planning d’apprentissage</p>
      </div>

      <div class="card blue">
        <div class="icon">✔</div>
        <h3>Sujets abordés</h3>
        <p>Explorez les différents thèmes</p>
      </div>
    </div>

    <!-- BOUTON - Changé pour router-link -->
    <router-link to="/inscriptionsalleView" class="btn-start">
      COMMENCER
    </router-link>
  </section>
</template>

<script>
export default {
  name: 'HomeView'
}

</script>


<style scoped>
/* Votre CSS de style.css copié ici */
body {
    background: linear-gradient(to bottom, #93c7d4, #6aa9ff);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
}

.container {
    width: 90%;
    max-width: 1100px;
}

h1 {
    font-size: 38px;
    color: blueviolet;
    margin-bottom: 15px;
}

</style>
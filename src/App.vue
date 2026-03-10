

<template>
<!-- <h1> Bienvenue sur mom site </h1> -->
<!-- Barre de navigation -->
<nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <router-link to="/">Mon Site</router-link>
            </div>
            <div class="ifoto">
                <img 
      src="@/assets/images/lilove3.jpeg" 
      width="80" 
      height="80" style="width: 50; height: 50;border-radius: 50%;position: absolute;position: left;
       position: absolute; 
        left: 20px; 
        top: 65px;">
    </div>
            <ul class="nav-links">
                <li><router-link to="/">salle</router-link></li>
                <li><router-link to="/Formateurs" class="active">Formateurs</router-link ></li>
                <li><router-link to="/inscriptionsalle" class="active">inscriptionsalle</router-link ></li>
            </ul>
        </div>
</nav>
<main>
<router-view />
</main>



</template>

<style>
/* Si vous aviez un fichier CSS, importez-le ici */
@import './assets/style.css';


/* Si vous aviez du CSS dans des balises style communes, mettez-le ici */

</style>

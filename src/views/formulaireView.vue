<template>
    <div class="container">
        <h1 class="titre-principal">inscription pour les formateur</h1>
        <div class="formulaire-wrapper">
            <!-- Full Name -->
            <div class="groupe-champ">
                <label><strong>Full Name</strong></label>
                <input type="text" placeholder="Enter your name">
            </div>
            <div class="groupe-champ">
                <label><strong>Username</strong></label>
                <input type="text" placeholder="Enter your username">
            </div>
            <div class="groupe-champ">
                <label><strong>Email</strong></label>
                <input type="email" placeholder="Enter your email">
            </div>
            <div class="groupe-champ">
                <label><strong>Phone Number</strong></label>
                <input type="tel" placeholder="Enter your number">
            </div>
            <div class="groupe-champ">
                <label><strong>Password</strong></label>
                <div class="confirm-text">Confirm Password</div>
                <input type="password" placeholder="Enter password">
            </div>
            <div class="groupe-champ">
                <label><strong>Confirm Password</strong></label>
                <input type="password" placeholder="Confirm password">
            </div>
            <div class="groupe-boutons">
                <!-- Bouton Retour (AJOUTÉ) -->
                <a href="/accueilView" class="btn btn-retour">← RETOUR</a>
                <button type="submit" class="btn btn-enregistrer"><strong>ENREGISTRER</strong></button>
                <button type="reset" class="btn btn-annuler">ANNULER</button>
            </div>
        </div>
    </div>
    
    <!-- Tableau corrigé - seule erreur était ici -->
    <div>
        <h3>formateur :</h3>
        <table border="1" style="border-collapse: collapse; width: 100%;">
            <!-- AJOUT: Thead requis pour les en-têtes -->
            <thead>
                <tr>
                    <th>name</th>
                    <th>username</th>
                    <th>email</th>
                </tr>
            </thead>
            <!-- AJOUT: Tbody requis pour les données -->
            <tbody>
                <tr v-for="formateur in formulaire" :key="formateur.id">
                    <td>{{ formateur.name }}</td>
                    <td>{{ formateur.username }} €</td>
                    <td>{{ formateur.email }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'InscriptionFormateur',
    data() {
        return {
            // Vos données conservées exactement comme avant
            formulaire: [
                { id: 1, name: 'Jean Dupont', username: 'jdupont', email: 'jean@example.com' },
                { id: 2, name: 'Marie Martin', username: 'mmartin', email: 'marie@example.com' }
            ]
        }
    }
}
</script>

<style scoped>
/* Votre CSS existant conservé */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}
</style>
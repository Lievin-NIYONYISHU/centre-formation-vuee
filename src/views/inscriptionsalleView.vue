<template>
    <!-- Barre de navigation -->
    <!-- Contenu principal -->
    <main class="main-content">
        <div class="container">
            <!-- Lien de retour -->
            <div class="retour-lien">
                <a href="#" class="retour-link">← Retour à la liste</a>
            </div>

            <!-- Formulaire -->
            <div class="formulaire-salle">
                <h1>Ajouter une salle de formation</h1>

                <form class="salle-form">
                    <!-- ID Salle -->
                    <div class="champ">
                        <label for="id-salle">nom salle:<span class="requis">*</span></label>
                        <input type="text" id="nom_salle" v-model="salleName" placeholder="Ex: S001, SALLE-01" required>
                    </div>

                    <!-- Boutons -->
                    <div class="boutons">
                        <button type="submit" class="btn btn-enregistrer" :disabled="!salleName">
                            <span class="btn-icon">💾</span> Enregistrer
                        </button>

                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>

import axios from 'axios';
import { ref } from 'vue'

const salleName = ref("")

  axios.post("http://127.0.0.1:8000/gestion_etudiant/salles/", {
    nom: salleName.value
  }).then(resp => {
    console.log(resp.data);
  }).catch(err => {
    console.error(err);
  })

</script>

<style scoped>
/* Styles généraux */
.main-content {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 40px 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

/* Lien de retour */
.retour-lien {
    margin-bottom: 20px;
}

.retour-link {
    color: white;
    text-decoration: none;
    font-size: 16px;
    opacity: 0.9;
    transition: opacity 0.3s;
}

.retour-link:hover {
    opacity: 1;
    text-decoration: underline;
}

/* Formulaire */
.formulaire-salle {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
}

h1 {
    color: #333;
    font-size: 28px;
    margin-bottom: 30px;
    text-align: center;
    position: relative;
    padding-bottom: 15px;
}

h1:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
}

.salle-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* Champs du formulaire */
.champ {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

label {
    font-weight: 600;
    color: #555;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.requis {
    color: #e74c3c;
    margin-left: 4px;
}

input {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    outline: none;
    background: #f8f9fa;
}

input:focus {
    border-color: #667eea;
    background: white;
    box-shadow: 0 4px 10px rgba(102, 126, 234, 0.1);
}

input.input-erreur {
    border-color: #e74c3c;
    background: #fff5f5;
}

input.input-succes {
    border-color: #2ecc71;
    background: #f0fff4;
}

/* Messages d'erreur/succès */
.message-erreur {
    color: #e74c3c;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    animation: slideIn 0.3s ease;
}

.message-succes {
    color: #2ecc71;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    animation: slideIn 0.3s ease;
}

/* Évaluation globale */
.evaluation-globale {
    background: #f8f9fa;
    border-radius: 15px;
    padding: 20px;
    text-align: center;
    margin: 10px 0;
    animation: fadeIn 0.5s ease;
}

.evaluation-excellent {
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    border: 2px solid #52c41a;
}

.evaluation-bon {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    border: 2px solid #1890ff;
}

.evaluation-moyen {
    background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
    border: 2px solid #fa8c16;
}

.evaluation-faible {
    background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
    border: 2px solid #f5222d;
}

.evaluation-globale p {
    margin: 0 0 15px 0;
    font-size: 18px;
    font-weight: 600;
}

/* Barre de progression */
.progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin: 10px 0;
}

.progress {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 4px;
    transition: width 0.3s ease;
}

.evaluation-globale small {
    color: #666;
    font-size: 13px;
    font-weight: 600;
}

/* Boutons */
.boutons {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.btn {
    flex: 1;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-icon {
    font-size: 18px;
}

.btn-enregistrer {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-enregistrer:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-enregistrer:active:not(:disabled) {
    transform: translateY(0);
}

.btn-enregistrer:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #bdc3c7;
    box-shadow: none;
}

.btn-annuler {
    background: white;
    color: #666;
    border: 2px solid #e0e0e0;
}

.btn-annuler:hover {
    background: #f8f9fa;
    border-color: #999;
    transform: translateY(-2px);
}

.btn-annuler:active {
    transform: translateY(0);
}

/* Animations */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Responsive */
@media (max-width: 768px) {
    .formulaire-salle {
        padding: 30px 20px;
    }

    h1 {
        font-size: 24px;
    }

    .boutons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}

/* Effets de hover sur les champs */
.champ:hover input {
    border-color: #b3b3b3;
}

.champ:hover label {
    color: #333;
}

/* Style pour le placeholder */
input::placeholder {
    color: #aaa;
    font-size: 14px;
}

/* Focus visible pour l'accessibilité */
input:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}
</style>
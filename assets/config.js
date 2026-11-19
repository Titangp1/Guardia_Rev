/* Guardia_Rev · configuration.
   firebase : collez ici l'objet firebaseConfig de l'application Web (console Firebase > Paramètres du projet).
   Ces valeurs sont publiques par conception : la sécurité vient des règles Firestore (firebase/firestore.rules).
   Tant que firebase vaut null, le site tourne en « mode local » : les comptes restent dans ce navigateur. */
window.GR_CONFIG = {
  domain: 'guardiaschool.fr',
  firebase: null
};

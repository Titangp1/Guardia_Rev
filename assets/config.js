/* Guardia_Rev · configuration.
   firebase : collez ici l'objet firebaseConfig de l'application Web (console Firebase > Paramètres du projet).
   Ces valeurs sont publiques par conception : la sécurité vient des règles Firestore (firebase/firestore.rules).
   Tant que firebase vaut null, le site tourne en « mode local » : les comptes restent dans ce navigateur. */
window.GR_CONFIG = {
  domain: 'guardiaschool.fr',
  /* Adresses interdites : empreintes SHA-256 de l'email en minuscules (les adresses ne sont pas publiées en clair).
     Doit rester aligné sur la fonction banned() de firebase/firestore.rules. */
  blocked: [
    '50fdb7e7463cbc703e96a7e378002137ef56c3effa71e6e6bf295942cc03f6dc',
    '584f24b53e94295bc618fd1941b653bf45866923f5e81357abf194e8668bb1ed',
    'd0f8637156ca71f4d8bb4d4b6582ab58234d2997feceae4843a452f815f5b5b4'
  ],
  firebase: {
    apiKey: 'AIzaSyAZVEPFapmL7cKCyvM1x_GPase23cy7lV8',
    authDomain: 'guardiarev.firebaseapp.com',
    projectId: 'guardiarev',
    storageBucket: 'guardiarev.firebasestorage.app',
    messagingSenderId: '315075905449',
    appId: '1:315075905449:web:b54bbb0482262db4c7a6b8'
  }
};

/* Sales Tech Academy : comptes utilisateurs (Supabase).
   Pour activer les comptes, colle entre les guillemets l'URL du projet et sa clé publique
   (« publishable key », qui commence par sb_publishable_), puis enregistre le fichier.
   Cette clé est faite pour être publique : les règles de la base protègent les données.
   Laisse les deux valeurs vides pour désactiver les comptes : la progression reste alors dans le navigateur. */
window.STA_CLOUD = {
  url: "",
  key: ""
};

/* Adresse de contact (facultative), affichée dans les pages Questions fréquentes, Confidentialité et Mentions légales.
   Exemple : window.STA_CONTACT = "contact@mon-domaine.fr";  Laisse vide pour ne rien afficher. */
window.STA_CONTACT = "";

/* Mentions légales : l'identité de l'éditeur du site, affichée dans la page « Mentions légales ».
   - Particulier, sans activité professionnelle : le nom ci-dessous peut suffire, à condition que
     l'hébergeur (GitHub) dispose de ton identité.
   - Activité professionnelle (micro-entreprise, société) : remplis aussi le statut, l'adresse, le SIREN,
     le téléphone, et l'adresse email ci-dessus (window.STA_CONTACT).
   Un champ laissé vide n'est pas affiché. */
window.STA_LEGAL = {
  editeur: "",    // ton nom et prénom, ou le nom de ta société. Vide : « PA »
  statut: "",     // ex. « Entrepreneur individuel » ou « SAS au capital de 1 000 € »
  adresse: "",    // adresse postale de ton entreprise ou de ton domicile professionnel
  siren: "",      // ex. « 123 456 789 »
  rcs: "",        // ex. « RCS Paris » ; vide si tu n'es pas inscrit au RCS
  tva: "",        // numéro de TVA intracommunautaire, si tu en as un
  telephone: "",  // obligatoire pour une activité professionnelle
  directeur: ""   // directeur de la publication. Vide : l'éditeur
};

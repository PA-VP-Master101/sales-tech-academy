# Activer les comptes utilisateurs

Le site sait déjà gérer des comptes : inscription par email et mot de passe, progression synchronisée sur tous les appareils, suppression de compte, et un tableau de suivi réservé à l'administrateur (`#admin`).

Ces fonctions restent cachées tant que le site n'est pas relié à une base de données. Ce guide explique comment créer cette base chez Supabase, gratuitement, en une vingtaine de minutes.

Ce que voit l'apprenant tant que rien n'est activé : le site fonctionne comme avant, et la progression reste dans le navigateur.

---

## 1. Créer le projet Supabase (5 minutes)

1. Va sur [supabase.com](https://supabase.com), clique sur **Start your project**, puis connecte-toi avec ton compte GitHub.
2. Clique sur **New project** :
   - **Name** : `sales-tech-academy`
   - **Database password** : clique sur *Generate a password* et garde-le dans ton gestionnaire de mots de passe. Le site n'en a pas besoin.
   - **Region** : **West EU (Paris)**. Les données de tes apprenants restent en Europe.
   - **Plan** : Free
   - Laisse cochée l'option **Enable Data API** si elle apparaît.
3. Clique sur **Create new project**, puis attends environ deux minutes.

## 2. Créer la base (2 minutes)

1. Dans le menu de gauche, ouvre **SQL Editor**, puis **New query**.
2. Copie tout le contenu du fichier [`schema.sql`](schema.sql) et colle-le.
3. Clique sur **Run**. Le message attendu : *Success. No rows returned*.

Ce script crée la table de progression et les règles de sécurité : chaque apprenant ne voit que sa propre progression, et seul un administrateur voit l'ensemble.

## 3. Régler la connexion (3 minutes)

**Authentication > Sign In / Providers > Email**

- Désactive **Confirm email**, puis enregistre.
  Raison : sans serveur d'envoi d'emails à toi (voir l'étape 7), Supabase n'envoie des emails qu'aux membres de ton équipe, et au plus 2 par heure. Avec la confirmation activée, tes apprenants ne pourraient pas finir leur inscription.
- Si l'option **Minimum password length** apparaît, mets **8** : c'est le minimum que le site demande déjà.

**Authentication > URL Configuration**

- **Site URL** : `https://pa-vp-master101.github.io/sales-tech-academy/`
- **Redirect URLs** : clique sur *Add URL* et ajoute `https://pa-vp-master101.github.io/sales-tech-academy/**`

## 4. Relier le site à la base (2 minutes)

Il te faut deux valeurs :

- **L'URL du projet**, de la forme `https://abcdefghijkl.supabase.co`. Tu la trouves avec le bouton **Connect** en haut du tableau de bord, ou dans **Project Settings > Data API**.
- **La clé publique** (*publishable key*), qui commence par `sb_publishable_`. Elle est dans **Project Settings > API Keys**.

Cette clé est faite pour être publique : ce sont les règles de l'étape 2 qui protègent les données. Ne copie jamais la clé *secret* (`sb_secret_...`) ni l'ancienne clé *service_role* : elles ne doivent jamais apparaître sur le site.

Ensuite, deux possibilités :

- **Tu m'envoies les deux valeurs**, et je mets le site à jour.
- **Tu les colles toi-même** : ouvre [config.js sur GitHub](https://github.com/PA-VP-Master101/sales-tech-academy/edit/main/config.js), colle l'URL entre les guillemets de `url`, la clé entre ceux de `key`, puis clique sur **Commit changes**. Le site en ligne se met à jour en une minute environ.

## 5. Devenir administrateur (2 minutes)

1. Sur le site, ouvre le menu de ton profil (ou le menu ☰ sur téléphone), clique sur **Sauvegarder ma progression** et crée ton compte avec ton adresse email.
2. Retourne dans **SQL Editor > New query**, colle ces lignes en remplaçant l'adresse par la tienne, puis clique sur **Run** :

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = lower('ton-adresse@exemple.com')
   on conflict (user_id) do nothing;
   ```

3. Recharge le site. Le menu de ton profil affiche maintenant **Tableau de suivi**, aussi accessible à l'adresse `https://pa-vp-master101.github.io/sales-tech-academy/#admin`.

Crée ton compte **avant** d'ouvrir le site à tes apprenants : comme l'adresse email n'est pas vérifiée (étape 3), cela garantit que personne ne peut s'inscrire avec la tienne.

## 6. Ce que montre le tableau de suivi

- Le nombre d'inscrits, d'apprenants actifs sur 7 jours, de séances terminées en moyenne et d'examens réussis.
- Le graphique **Où les apprenants décrochent** : combien d'apprenants ont terminé chaque séance, avec le plus gros décrochage mis en évidence.
- La liste des apprenants, avec recherche, tri et export CSV (lisible directement dans Excel).

## 7. Plus tard : envoyer de vrais emails (recommandé avant d'avoir beaucoup d'apprenants)

Sans serveur d'emails, le lien **Mot de passe oublié** ne fonctionne que pour les membres de ton équipe Supabase. Pour qu'il marche pour tout le monde :

1. Crée un compte chez un service d'envoi d'emails. [Brevo](https://www.brevo.com) (entreprise française) envoie 300 emails par jour dans son offre gratuite.
2. Dans Supabase : **Authentication > Emails > SMTP Settings**, active **Enable custom SMTP** et recopie les réglages SMTP fournis par ce service (pour Brevo : `smtp-relay.brevo.com`, port `587`, ton identifiant SMTP et ta clé SMTP). L'expéditeur doit être une adresse que tu as validée chez ce service.
3. Dans **Authentication > Rate Limits**, augmente si besoin le nombre d'emails par heure.
4. Dans **Authentication > Emails > Templates**, traduis les modèles en français. Par exemple, pour **Reset password** :
   - Sujet : `Choisis ton nouveau mot de passe`
   - Message :

     ```html
     <h2>Nouveau mot de passe</h2>
     <p>Tu as demandé à changer le mot de passe de ton compte Sales Tech Academy.</p>
     <p><a href="{{ .ConfirmationURL }}">Choisir mon nouveau mot de passe</a></p>
     <p>Si ce n'est pas toi, ignore cet email : rien ne change.</p>
     ```

   Et pour **Confirm signup**, si tu réactives la confirmation des emails :
   - Sujet : `Confirme ton adresse`
   - Message :

     ```html
     <h2>Bienvenue sur l'île</h2>
     <p>Clique sur le lien ci-dessous pour activer ton compte Sales Tech Academy.</p>
     <p><a href="{{ .ConfirmationURL }}">Activer mon compte</a></p>
     ```

Une fois l'envoi d'emails configuré, tu peux réactiver **Confirm email** (étape 3) : le site sait déjà afficher l'écran « Confirme ton adresse ».

## Bon à savoir

- **Offre gratuite** : jusqu'à 50 000 utilisateurs actifs par mois et 500 Mo de base, largement assez pour la formation. Un projet gratuit est mis en pause après 7 jours sans aucune activité ; un bouton **Restore** le relance. Pendant une pause, le site continue de fonctionner et garde la progression dans le navigateur.
- **Hors ligne** : la progression reste enregistrée sur l'appareil, puis part vers le compte dès le retour du réseau.
- **Confidentialité** : la fenêtre de création de compte indique que tu vois le prénom, l'email et l'avancement de chaque apprenant, et que chacun peut supprimer son compte à tout moment.
- **Plus tard, un accès payant** : les comptes en sont la première brique. Pour réserver vraiment une partie du contenu aux apprenants qui ont payé, il faudra en plus servir ce contenu depuis la base, réservé aux comptes autorisés, au lieu de l'inclure dans la page.

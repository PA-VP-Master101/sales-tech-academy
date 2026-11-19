# Sales Tech Academy

**La formation SDR & BDR de PA : 40 séances pour décrocher ton premier poste de sales en tech.**
Encaisse les non. Reste debout.

[Ouvrir la formation](https://pa-vp-master101.github.io/sales-tech-academy/)

![Sales Tech Academy : Encaisse les non. Reste debout.](og-image.png)

## Le contenu

| | |
|---|---|
| **Parcours** | 40 séances d'environ 4 heures, en 8 modules : le métier, le ciblage, la prospection écrite, le téléphone, la qualification, la candidature, les entretiens, l'examen |
| **Apprendre** | 8 fiches de cours écrites pour la formation, un glossaire français-anglais de 77 termes, un quiz et des cartes mémoire |
| **S'entraîner** | Un simulateur d'appel à froid (8 scénarios, dont un en anglais, avec un coach à chaque réplique), un atelier d'écriture (accroche, cold email, message LinkedIn, ICP) et un examen final noté sur 100 |
| **Certifier** | Un certificat Sales Tech Academy en PNG et PDF, et 14 certifications d'éditeurs reconnues (HubSpot, LinkedIn Sales Navigator, Salesforce Trailhead…) placées dans le parcours |
| **Ressources** | 79 ressources externes choisies et vérifiées : cours, articles, vidéos, podcasts, offres d'emploi |

## Ce que le site fait pour l'apprenant

- **Progression motivante** : XP, niveaux, série de jours ouvrés, ahu de Moai qui se dresse module après module.
- **Planning** : une date de début planifie les 40 séances sur les jours ouvrés ; export vers Google Agenda, Apple Calendrier et Outlook (.ics).
- **Application installable** : fonctionne hors ligne une fois installée, sur téléphone comme sur ordinateur.
- **Recherche instantanée** (`⌘K` ou `/`) dans les séances, fiches, termes, ressources et questions fréquentes.
- **Comptes facultatifs** : progression synchronisée sur tous les appareils et tableau de suivi pour l'administrateur, une fois Supabase activé ([guide](supabase/README.md)).

## Qualité

- **Accessibilité** : navigation complète au clavier, lien d'évitement, focus géré à chaque changement de page et dans les fenêtres, menus annoncés aux lecteurs d'écran, animations réduites si le système le demande, thèmes clair et sombre.
- **Typographie française** : apostrophes courbes et espaces insécables appliquées automatiquement à tout le texte affiché.
- **Confidentialité** : aucune publicité, aucune mesure d'audience, aucun appel à un service tiers au chargement, hors connexion à un compte quand les comptes sont activés. Les polices sont hébergées sur le site.
- **Sécurité** : politique de sécurité du contenu (CSP) stricte, bibliothèque externe épinglée avec contrôle d'intégrité (SRI), règles d'accès par ligne (RLS) côté base de données.
- **Partage** : titre et description par page, aperçu soigné sur LinkedIn, WhatsApp et Slack, données structurées schema.org.

## Structure du dépôt

```
index.html             L'application complète : contenu, styles et code, sans dépendance
config.js              Réglages : comptes Supabase et adresse de contact (facultatifs)
sw.js                  Service worker : fonctionnement hors ligne
manifest.webmanifest   Installation comme application
fonts/                 Polices hébergées sur le site (licence SIL OFL)
supabase/              Schéma de la base et guide d'activation des comptes
404.html               Page introuvable
og-image.png           Image d'aperçu pour les réseaux sociaux
sitemap.xml            Plan du site pour les moteurs de recherche
```

## Lancer le site en local

Aucune installation : un simple serveur de fichiers suffit.

```bash
python3 -m http.server 8000
```

Puis ouvre <http://localhost:8000>.

## Réglages

Dans [`config.js`](config.js) :

- `window.STA_CLOUD` : l'URL et la clé publique du projet Supabase, pour activer les comptes. Laissées vides, la progression reste dans le navigateur.
- `window.STA_CONTACT` : une adresse email de contact, affichée dans les pages Questions fréquentes et Confidentialité.

## Crédits

Polices [Bricolage Grotesque](https://github.com/ateliertriay/bricolage), [Inter](https://github.com/rsms/inter) et [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), sous licence SIL Open Font License 1.1. Comptes avec [Supabase](https://supabase.com).

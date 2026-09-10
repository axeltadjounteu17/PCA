# PCA Prep

Site de préparation à la certification **Google Cloud Professional Cloud Architect** (guide d'examen v6.1).

Site statique, sans build ni dépendance d'exécution. HTML, CSS et JavaScript natifs.

## Contenu

- **Tableau de bord** — compte à rebours, progression par domaine pondérée selon le poids réel de chaque section, plan de révision sur 7 jours.
- **Cours** — les six piliers du Well-Architected Framework, tableau des mots-clés déclencheurs, quatre arbres de décision (compute, données, réseau, sécurité).
- **Études de cas** — fiches de profil des quatre cas officiels et méthode de lecture.
- **Entraînement** — 47 questions filtrables par domaine, par étude de cas, ou limitées à ses propres erreurs. Correction immédiate avec réfutation de chaque option écartée.
- **Examen blanc** — 47 questions chronométrées sur 2 heures, navigation libre, questions marquables, aucune correction avant la fin, puis résultat détaillé par domaine.
- **Vocabulaire** — flashcards et glossaire bilingue de 35 termes.

Interface bilingue français / anglais, thème clair et sombre.

## Lancer en local

`localStorage` est refusé sur une origine `file://` : la progression ne serait pas enregistrée. Passer par un serveur local.

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Déployer sur Vercel

Aucune configuration nécessaire : importer le dépôt et déployer en preset « Other ». Ne pas définir de commande de build ni de répertoire de sortie.

## Avertissement sur les questions

Les questions sont **originales**. Elles reproduisent le format et le niveau d'arbitrage de l'examen, jamais son contenu réel.

Diffuser ou consulter de vraies questions d'examen viole l'accord de confidentialité Google signé avant l'épreuve et expose à la révocation définitive de ses certifications. C'est aussi contre-productif : l'examen évalue la capacité à arbitrer sous contraintes, pas la mémorisation de réponses.

Les contextes d'entreprise des questions d'étude de cas sont des reconstitutions bâties sur le profil sectoriel de chaque cas officiel. Elles ne remplacent pas les énoncés publiés par Google, à lire séparément.

## Vérification

```bash
node tools/validate.js
```

Contrôle l'intégrité de la banque : identifiants uniques, quatre options par question, index de réponse valides, cohérence entre le marqueur « réponses multiples » et le nombre de réponses, complétude bilingue de chaque champ, présence des mots-clés et d'une réfutation par option.

## Données personnelles

Aucun backend, aucune requête sortante hormis le chargement de la police Inter depuis Google Fonts. La progression reste dans le `localStorage` du navigateur.

## Sources

- [Guide d'examen Professional Cloud Architect](https://cloud.google.com/learn/certification/guides/professional-cloud-architect)
- [Google Cloud Well-Architected Framework](https://cloud.google.com/architecture/framework)

Le guide v6.1 énumère six piliers, durabilité incluse. Certaines pages plus anciennes de la documentation n'en listent que cinq.

/* ==========================================================================
   Banque de questions — Domaine 5
   « Managing implementation » (~12,5 %)
   Conseil aux équipes de développement et d'exploitation, intégration d'API,
   stratégies de déploiement, outillage SDK / Terraform, environnements.
   ========================================================================== */

window.PCA_QUESTIONS_D5 = [
  {
    id: "D5-01",
    domain: "d5",
    topic: "Stratégie de déploiement",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une équipe doit livrer une refonte du moteur de recherche de son site marchand. Le changement modifie l'algorithme de pertinence et son effet sur le taux de conversion est incertain. L'équipe veut pouvoir comparer objectivement l'ancien et le nouveau comportement sur du trafic réel, et revenir en arrière en quelques minutes si la conversion se dégrade.",
      en: "A team must ship a rewrite of its storefront search engine. The change alters the relevance algorithm and its effect on conversion rate is uncertain. The team wants to objectively compare old and new behaviour on real traffic, and roll back within minutes if conversion degrades."
    },
    stem: {
      fr: "Quelle stratégie de mise en production retenir ?",
      en: "Which release strategy should be selected?"
    },
    options: [
      { fr: "Un déploiement canari acheminant d'abord une petite fraction du trafic vers la nouvelle version, avec suivi des métriques métier", en: "A canary deployment routing a small traffic fraction to the new version first, monitoring business metrics" },
      { fr: "Un déploiement bleu-vert basculant l'intégralité du trafic une fois la nouvelle version prête", en: "A blue-green deployment switching all traffic once the new version is ready" },
      { fr: "Un déploiement progressif par mise à jour continue des instances", en: "A progressive rolling update across instances" },
      { fr: "Une livraison en une fois pendant une fenêtre de faible trafic nocturne", en: "A single release during a low-traffic overnight window" }
    ],
    correct: [0],
    keywords: ["effet incertain sur la conversion", "comparer sur du trafic réel", "revenir en arrière en minutes"],
    rationale: {
      fr: "Le besoin de comparaison objective sur trafic réel désigne le canari : les deux versions coexistent et servent simultanément, ce qui permet de rapporter le taux de conversion de chacune. Le retour arrière consiste à ramener la fraction de trafic à zéro, donc quasi immédiat, et l'exposition initiale limitée borne le risque commercial.",
      en: "The need for objective comparison on real traffic points to canary: both versions coexist and serve simultaneously, allowing conversion rate to be attributed to each. Rollback means returning the traffic fraction to zero, so it is near immediate, and the limited initial exposure bounds commercial risk."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le bleu-vert offre un retour arrière rapide mais bascule tout le trafic d'un coup : impossible de comparer les deux versions côte à côte, et 100 % des utilisateurs subissent une éventuelle dégradation.", en: "Blue-green offers fast rollback but switches all traffic at once: the two versions cannot be compared side by side, and 100% of users absorb any degradation." },
      { fr: "La mise à jour continue remplace progressivement les instances mais ne pilote pas la répartition du trafic par version et n'est pas conçue pour mesurer un indicateur métier comparé.", en: "Rolling update progressively replaces instances but does not control per-version traffic split and is not designed to measure a compared business metric." },
      { fr: "Livrer de nuit réduit l'exposition mais supprime justement le trafic réel nécessaire pour évaluer la conversion. Le doute resterait entier jusqu'au matin.", en: "Releasing overnight reduces exposure but removes precisely the real traffic needed to evaluate conversion. The uncertainty would persist until morning." }
    ]
  },

  {
    id: "D5-02",
    domain: "d5",
    topic: "Gestion de l'état Terraform",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Quatre ingénieurs travaillent sur la même base Terraform. Deux incidents sont survenus : un fichier d'état conservé sur un poste de travail a été perdu, et deux applications simultanées ont produit des ressources dupliquées. L'équipe veut sécuriser le processus sans changer d'outil.",
      en: "Four engineers work on the same Terraform codebase. Two incidents occurred: a state file kept on a workstation was lost, and two simultaneous applies produced duplicated resources. The team wants to secure the process without changing tools."
    },
    stem: {
      fr: "Quelle correction apporter ?",
      en: "Which fix should be applied?"
    },
    options: [
      { fr: "Placer l'état dans un backend distant sur Cloud Storage avec versionnement et verrouillage d'état", en: "Move state to a remote backend on Cloud Storage with versioning and state locking" },
      { fr: "Committer le fichier d'état dans le dépôt Git à chaque modification", en: "Commit the state file to the Git repository on every change" },
      { fr: "Attribuer la responsabilité exclusive des applications à un seul ingénieur", en: "Give a single engineer exclusive responsibility for applies" },
      { fr: "Sauvegarder quotidiennement le fichier d'état sur un disque partagé", en: "Back up the state file daily to a shared drive" }
    ],
    correct: [0],
    keywords: ["état perdu", "applications simultanées", "ressources dupliquées", "quatre ingénieurs"],
    rationale: {
      fr: "Les deux incidents ont deux causes et une seule solution. Le backend distant sur Cloud Storage supprime la dépendance au poste local, le versionnement du bucket protège contre la perte et permet de revenir à un état antérieur, et le verrouillage empêche deux applications concurrentes. C'est la configuration de référence pour un travail à plusieurs.",
      en: "The two incidents have two causes and one solution. A remote backend on Cloud Storage removes dependence on a local workstation, bucket versioning protects against loss and allows reverting to a prior state, and locking prevents concurrent applies. This is the reference setup for team work."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le fichier d'état contient fréquemment des valeurs sensibles et n'est pas conçu pour la fusion Git. Cette pratique crée des conflits et un risque de fuite de secrets.", en: "The state file frequently contains sensitive values and is not designed for Git merging. This practice creates conflicts and a secret-leak risk." },
      { fr: "Un verrou humain crée un goulot d'étranglement et reste faillible. Le verrouillage doit être technique pour être fiable.", en: "A human lock creates a bottleneck and remains fallible. Locking must be technical to be reliable." },
      { fr: "Une sauvegarde quotidienne laisse jusqu'à 24 heures de dérive et ne traite pas du tout le problème d'accès concurrent.", en: "A daily backup leaves up to 24 hours of drift and does not address concurrent access at all." }
    ]
  },

  {
    id: "D5-03",
    domain: "d5",
    topic: "Intégration d'API et gestion des erreurs",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un service de commande appelle une API de paiement externe. En cas de pic, l'API externe renvoie des erreurs 429 et 503. L'implémentation actuelle réessaie immédiatement jusqu'à dix fois, ce qui aggrave la saturation du partenaire et provoque des doubles débits constatés par le support client.",
      en: "An order service calls an external payment API. Under load the external API returns 429 and 503 errors. The current implementation retries immediately up to ten times, which worsens the partner's saturation and causes double charges reported by customer support."
    },
    stem: {
      fr: "Quel conseil d'implémentation donner à l'équipe ?",
      en: "Which implementation guidance should the team receive?"
    },
    options: [
      { fr: "Réessayer avec un délai exponentiel et une part d'aléa, en rendant l'opération idempotente par clé de requête", en: "Retry with exponential backoff and jitter, making the operation idempotent through a request key" },
      { fr: "Augmenter le nombre de tentatives et réduire le délai d'expiration de chaque appel", en: "Increase the retry count and shorten each call's timeout" },
      { fr: "Placer les appels dans une file et les traiter en lot une fois par heure", en: "Queue the calls and process them in hourly batches" },
      { fr: "Supprimer les tentatives et remonter l'erreur à l'utilisateur", en: "Remove retries and surface the error to the user" }
    ],
    correct: [0],
    keywords: ["429 et 503", "réessaie immédiatement", "aggrave la saturation", "doubles débits"],
    rationale: {
      fr: "Deux défauts se cumulent. Le rythme des tentatives amplifie la panne du partenaire : le délai exponentiel avec aléa laisse le service se rétablir et évite la synchronisation des clients. Le double débit vient de l'absence d'idempotence : une clé de requête permet au partenaire de reconnaître une tentative répétée et de ne débiter qu'une fois.",
      en: "Two defects compound. Retry pacing amplifies the partner's outage: exponential backoff with jitter lets the service recover and avoids client synchronization. Double charging stems from missing idempotency: a request key lets the partner recognize a repeated attempt and charge only once."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Aggrave exactement le problème décrit : davantage de tentatives plus rapprochées intensifient la saturation du partenaire et multiplient les doubles débits.", en: "Worsens precisely the described problem: more retries closer together intensify partner saturation and multiply double charges." },
      { fr: "Un paiement est une opération synchrone attendue par l'utilisateur au moment de la commande. Un traitement horaire par lot casse le parcours d'achat.", en: "A payment is a synchronous operation the user awaits at order time. Hourly batch processing breaks the purchase flow." },
      { fr: "Supprimer toute tentative rend le service fragile à la moindre erreur transitoire, alors que 429 et 503 sont par nature temporaires et méritent une nouvelle tentative maîtrisée.", en: "Removing retries makes the service brittle to any transient error, whereas 429 and 503 are inherently temporary and warrant a controlled retry." }
    ]
  },

  {
    id: "D5-04",
    domain: "d5",
    topic: "Séparation des environnements",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un incident a eu lieu : un test de charge lancé en recette a saturé la base de données de production, car les deux environnements partagent le même projet et la même instance Cloud SQL, distingués seulement par un préfixe de nom de table. L'équipe doit proposer une correction structurelle.",
      en: "An incident occurred: a load test run in staging saturated the production database, because both environments share the same project and the same Cloud SQL instance, distinguished only by a table name prefix. The team must propose a structural fix."
    },
    stem: {
      fr: "Quelle organisation recommander ?",
      en: "Which organization should be recommended?"
    },
    options: [
      { fr: "Séparer les environnements dans des projets distincts, avec leurs propres instances, quotas et rôles IAM", en: "Separate environments into distinct projects with their own instances, quotas and IAM roles" },
      { fr: "Conserver le projet unique et créer une seconde instance Cloud SQL pour la recette", en: "Keep the single project and create a second Cloud SQL instance for staging" },
      { fr: "Interdire par procédure les tests de charge en dehors des heures creuses", en: "Forbid load tests outside off-peak hours by procedure" },
      { fr: "Ajouter des règles de pare-feu entre les composants de recette et de production", en: "Add firewall rules between staging and production components" }
    ],
    correct: [0],
    keywords: ["même projet", "même instance", "correction structurelle", "saturation croisée"],
    rationale: {
      fr: "Le projet est la frontière d'isolation de référence sur Google Cloud : il porte les quotas, les politiques IAM, la facturation et le périmètre de panne. Séparer les environnements en projets distincts empêche structurellement qu'une activité de recette consomme la capacité de production, et permet en outre l'imputation des coûts et des droits différenciés.",
      en: "The project is the reference isolation boundary on Google Cloud: it carries quotas, IAM policies, billing and failure domain. Separating environments into distinct projects structurally prevents staging activity from consuming production capacity, and additionally enables cost attribution and differentiated permissions."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Améliore l'isolation de la base mais laisse les deux environnements partager quotas, IAM et périmètre de panne du projet. La correction reste partielle.", en: "Improves database isolation but leaves both environments sharing the project's quotas, IAM and failure domain. The fix remains partial." },
      { fr: "Une procédure repose sur la discipline et n'empêche pas la récidive. L'énoncé demande explicitement une correction structurelle.", en: "A procedure relies on discipline and does not prevent recurrence. The scenario explicitly asks for a structural fix." },
      { fr: "Le pare-feu filtre le trafic réseau mais ne protège pas d'une saturation par des requêtes légitimes vers une instance de base de données partagée.", en: "A firewall filters network traffic but does not protect against saturation by legitimate queries to a shared database instance." }
    ]
  },

  {
    id: "D5-05",
    domain: "d5",
    topic: "Conseil sur l'usage des API",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Des développeurs souhaitent accéder à Cloud Storage depuis une application exécutée sur Compute Engine. Leur proposition consiste à générer une clé de compte de service, à la déposer sur la VM et à la référencer via une variable d'environnement. L'architecte doit se prononcer.",
      en: "Developers want to access Cloud Storage from an application running on Compute Engine. Their proposal is to generate a service account key, place it on the VM and reference it through an environment variable. The architect must give a verdict."
    },
    stem: {
      fr: "Quelle recommandation formuler ?",
      en: "Which recommendation should be given?"
    },
    options: [
      { fr: "Attacher un compte de service à l'instance et laisser la bibliothèque cliente obtenir des jetons via le serveur de métadonnées", en: "Attach a service account to the instance and let the client library obtain tokens from the metadata server" },
      { fr: "Conserver la clé mais la stocker dans Secret Manager et la charger au démarrage", en: "Keep the key but store it in Secret Manager and load it at startup" },
      { fr: "Chiffrer la clé sur le disque de la VM avec une clé CMEK", en: "Encrypt the key on the VM disk using a CMEK key" },
      { fr: "Restreindre la clé par une condition IAM limitant son usage à une plage d'adresses IP", en: "Restrict the key with an IAM condition limiting use to an IP range" }
    ],
    correct: [0],
    keywords: ["application sur Compute Engine", "clé de compte de service déposée sur la VM"],
    rationale: {
      fr: "Sur une ressource Google Cloud, la clé est superflue. Un compte de service attaché à l'instance permet aux bibliothèques clientes de récupérer des jetons de courte durée auprès du serveur de métadonnées, avec rotation automatique et sans secret persistant. La bonne pratique consiste à supprimer le secret, pas à le protéger.",
      en: "On a Google Cloud resource the key is unnecessary. A service account attached to the instance lets client libraries fetch short-lived tokens from the metadata server, with automatic rotation and no persistent secret. Best practice is to remove the secret rather than protect it."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Meilleur que le dépôt en clair, mais conserve une clé longue durée dont l'existence n'est pas justifiée sur une VM Google Cloud.", en: "Better than plaintext placement, but retains a long-lived key whose existence is unjustified on a Google Cloud VM." },
      { fr: "Le disque est déjà chiffré au repos, et CMEK ne protège pas d'un accès au système de fichiers par un processus ou un utilisateur de la VM.", en: "The disk is already encrypted at rest, and CMEK does not protect against filesystem access by a process or user on the VM." },
      { fr: "Une condition IAM réduit la portée en cas de fuite mais laisse subsister la clé longue durée, alors qu'aucune clé n'est nécessaire ici.", en: "An IAM condition narrows blast radius if leaked but still leaves a long-lived key, when no key is needed here." }
    ]
  }
];

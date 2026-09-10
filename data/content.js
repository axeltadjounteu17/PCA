/* ==========================================================================
   Contenu de révision : méthode, WAF, arbres de décision, cas, glossaire,
   planning. Consolidé depuis les documents de travail et recalé sur
   l'examen du mercredi 16 septembre 2026 à 11h00.
   ========================================================================== */

window.PCA_EXAM = {
  date: "2026-09-16T11:00:00",
  label: "mercredi 16 septembre 2026, 11h00",
  duration: 120,
  questionCount: "50 à 60",
  language: "anglais (ou japonais)",
  version: "v6.1"
};

/* ----- Pondération officielle des six sections ----- */
window.PCA_DOMAINS = [
  {
    id: "d1",
    weight: 25,
    fr: "Concevoir et planifier une architecture de solution cloud",
    en: "Designing and planning a cloud solution architecture",
    focus: "Traduire un besoin métier en architecture. Arbitrages coût, performance, sécurité, fiabilité, simplicité. Build / buy / modify / deprecate. C'est le domaine le plus lourd."
  },
  {
    id: "d2",
    weight: 17.5,
    fr: "Gérer et provisionner l'infrastructure de la solution",
    en: "Managing and provisioning a solution infrastructure",
    focus: "Réseau, stockage, calcul, conteneurs. Infrastructure as code. Quotas et API. Connectivité hybride."
  },
  {
    id: "d3",
    weight: 17.5,
    fr: "Concevoir pour la sécurité et la conformité",
    en: "Designing for security and compliance",
    focus: "IAM et moindre privilège, CMEK, VPC Service Controls, résidence des données, séparation des responsabilités, journaux d'audit."
  },
  {
    id: "d4",
    weight: 15,
    fr: "Analyser et optimiser les processus techniques et métier",
    en: "Analyzing and optimizing technical and business processes",
    focus: "Cycle de développement, optimisation des coûts, continuité d'activité, stratégies de migration."
  },
  {
    id: "d5",
    weight: 12.5,
    fr: "Piloter la mise en œuvre",
    en: "Managing implementation",
    focus: "Conseiller les équipes de développement et d'exploitation. Intégration d'API, stratégies de déploiement, SDK et Terraform."
  },
  {
    id: "d6",
    weight: 12.5,
    fr: "Garantir la fiabilité de la solution et des opérations",
    en: "Ensuring solution and operations reliability",
    focus: "SLI, SLO et budget d'erreur. Supervision, alertes actionnables, analyse post-incident sans recherche de faute."
  }
];

/* ----- Méthode de résolution en six étapes ----- */
window.PCA_METHOD = [
  {
    n: 1,
    title: "Identifier le livrable",
    body: "Que demande-t-on exactement : un service, une topologie réseau, une stratégie de migration, une politique de sécurité, un mécanisme de déploiement ou une action opérationnelle ? Répondre à une autre question que celle posée est la première cause d'erreur."
  },
  {
    n: 2,
    title: "Extraire les contraintes",
    body: "Métier, sécurité, conformité, performance, fiabilité, coût, compétences de l'équipe. Une contrainte chiffrée ou explicite pèse toujours plus qu'une préférence implicite. Repère celle qui élimine. Astuce concrète : la contrainte décisive se cache très souvent dans la dernière phrase de l'énoncé, celle qu'on lit trop vite."
  },
  {
    n: 3,
    title: "Reconnaître le profil de charge",
    body: "Transactionnel ou analytique, synchrone ou asynchrone, stable ou variable, régional ou mondial, relationnel ou documentaire, lecture ou écriture dominante. Le profil désigne souvent le service à lui seul."
  },
  {
    n: 4,
    title: "Éliminer les réponses excessives",
    body: "Multi-région, Kubernetes ou base distribuée mondiale sont d'excellentes réponses quand l'énoncé les justifie, et des pièges sinon. La sur-ingénierie est sanctionnée autant que le sous-dimensionnement."
  },
  {
    n: 5,
    title: "Privilégier le service managé",
    body: "À fonctionnalité égale, celui qui délègue le plus la maintenance gagne le plus souvent. Sauf contrainte explicite : licence, version d'OS, accès au noyau, matériel spécifique."
  },
  {
    n: 6,
    title: "Tester la réponse contre le WAF",
    body: "La réponse satisfait-elle le pilier prioritaire sans violer gravement un autre pilier ? Si elle sacrifie la sécurité pour le coût, ou la fiabilité pour la simplicité, ce n'est probablement pas la bonne."
  }
];

/* ----- Well-Architected Framework : six piliers -----
   Vérifié sur le guide d'examen v6.1, qui énumère explicitement six piliers,
   sustainability inclus. Ne pas confondre avec les versions antérieures de la
   documentation, qui n'en listaient que cinq. ----- */
window.PCA_WAF = [
  {
    fr: "Excellence opérationnelle",
    en: "Operational excellence",
    keywords: ["repeatable deployments", "change management", "runbook", "rollback", "SLO", "error budget", "observability"],
    reflex: "Déploiements reproductibles, automatisation, alertes fondées sur des SLO, post-mortem sans recherche de faute."
  },
  {
    fr: "Sécurité, confidentialité et conformité",
    en: "Security, privacy and compliance",
    keywords: ["least privilege", "separation of duties", "data residency", "CMEK", "audit trail", "exfiltration"],
    reflex: "Moindre privilège, contrôles hérités par politique, chiffrement maîtrisé, traçabilité opposable."
  },
  {
    fr: "Fiabilité",
    en: "Reliability",
    keywords: ["RTO", "RPO", "failover", "backup and restore", "disaster recovery", "multi-zone"],
    reflex: "Dimensionner la reprise sur le RTO et le RPO chiffrés, jamais sur une impression."
  },
  {
    fr: "Optimisation des performances",
    en: "Performance optimization",
    keywords: ["latency", "throughput", "p99", "caching", "locality"],
    reflex: "Mesurer en percentile élevé, rapprocher le traitement de l'utilisateur, mettre en cache ce qui est stable."
  },
  {
    fr: "Optimisation des coûts",
    en: "Cost optimization",
    keywords: ["right-sizing", "autoscaling", "lifecycle policy", "committed use", "spot", "cost per transaction"],
    reflex: "Redimensionner avant de s'engager. Éteindre ce qui ne sert pas. Raisonner en coût unitaire, pas en facture totale."
  },
  {
    fr: "Durabilité",
    en: "Sustainability",
    keywords: ["carbon footprint", "right-sizing", "region carbon intensity"],
    reflex: "Le dimensionnement juste et l'élasticité servent aussi l'empreinte environnementale."
  }
];

/* ----- Mots-clés déclencheurs : le réflexe le plus rentable ----- */
window.PCA_TRIGGERS = [
  { en: "minimal operational overhead / fully managed", fr: "charge opérationnelle minimale", reflex: "Cloud Run, BigQuery, Firestore, GKE Autopilot. Écarter les VM auto-gérées." },
  { en: "prevent data exfiltration", fr: "empêcher l'exfiltration", reflex: "VPC Service Controls. IAM seul ne suffit pas." },
  { en: "strict data residency", fr: "résidence des données strictement imposée", reflex: "Organization Policy sur les emplacements, et Assured Workloads si le personnel d'assistance est concerné." },
  { en: "customer-managed keys / revoke access", fr: "clés maîtrisées par le client", reflex: "CMEK via Cloud KMS, avec séparation des rôles d'administration." },
  { en: "strong consistency + global", fr: "cohérence forte et portée mondiale", reflex: "Spanner. Uniquement si les deux conditions sont réunies." },
  { en: "time series / high write throughput", fr: "série temporelle à très haut débit", reflex: "Bigtable, avec une clé de ligne bien conçue." },
  { en: "ad hoc SQL analytics", fr: "analyse SQL ad hoc", reflex: "BigQuery." },
  { en: "cost-sensitive, interruptible batch", fr: "lot interruptible et sensible au coût", reflex: "Spot VMs et mise à l'échelle jusqu'à zéro." },
  { en: "high-throughput private on-prem link", fr: "liaison privée à haut débit", reflex: "Dedicated Interconnect. HA VPN si le débit est modéré." },
  { en: "consume a service privately", fr: "consommer un service en privé", reflex: "Private Service Connect, pas le peering." },
  { en: "global audience, low latency", fr: "audience mondiale à faible latence", reflex: "Équilibreur global et Cloud CDN." },
  { en: "no VPN, any network, internal app", fr: "application interne sans VPN", reflex: "Identity-Aware Proxy." },
  { en: "only trusted images in production", fr: "seules des images de confiance en production", reflex: "Binary Authorization." },
  { en: "no long-lived keys, external workload", fr: "charge externe sans clé statique", reflex: "Workload Identity Federation." },
  { en: "human-in-the-loop", fr: "supervision humaine", reflex: "Jamais d'action IA à risque sans revue humaine, journalisation et garde-fous." },
  { en: "PostgreSQL hitting performance limits / HTAP", fr: "PostgreSQL qui plafonne, charge mixte", reflex: "AlloyDB for PostgreSQL, en restant régional." },
  { en: "expose APIs to external partners", fr: "exposer des API à des partenaires", reflex: "Apigee, pour les quotas, les clés et l'analytique." },
  { en: "discover and mask PII / PHI", fr: "détecter et masquer des données sensibles", reflex: "Sensitive Data Protection, avant le stockage." },
  { en: "block DDoS and application attacks", fr: "bloquer DDoS et attaques applicatives", reflex: "Cloud Armor. Ce n'est pas de l'authentification." },
  { en: "accessed less than once a month / quarter / year", fr: "accès mensuel, trimestriel, annuel", reflex: "Nearline, Coldline, Archive respectivement." },
  { en: "highest disk throughput, data can be lost", fr: "débit disque maximal, données éphémères", reflex: "Local SSD. Attention : tout est perdu à l'arrêt de la VM." }
];

/* ----- Arbres de décision ----- */
window.PCA_DECISIONS = [
  {
    title: "Compute — quelle plateforme ?",
    rows: [
      ["Conteneur HTTP sans état, trafic variable", "Cloud Run", "Serverless, jusqu'à zéro instance", "Ne pas prendre GKE si Kubernetes n'est pas exigé"],
      ["Kubernetes réellement nécessaire, ops minimales", "GKE Autopilot", "Kubernetes managé au niveau des pods", "Autopilot avant Standard, sauf besoin de contrôle des nœuds"],
      ["Contrôle fin des nœuds, opérateurs, sidecars", "GKE Standard", "Maîtrise complète du cluster", "Charge opérationnelle réelle à assumer"],
      ["Legacy, licence liée à l'OS, accès noyau", "Compute Engine", "Contrôle total de la machine", "Patching et disponibilité à votre charge"],
      ["Lot interruptible et sensible au coût", "Spot VMs / Batch", "Remise très forte", "Exige un mécanisme de reprise"],
      ["Réaction à un événement, code court", "Cloud Run functions", "Déclenchement événementiel", "Inadapté aux traitements longs"]
    ]
  },
  {
    title: "Données — quelle base ?",
    rows: [
      ["Relationnel régional, OLTP classique", "Cloud SQL", "Simple, HA régionale, PITR. PostgreSQL, MySQL, SQL Server", "Ne pas surdimensionner vers Spanner"],
      ["Relationnel mondial + cohérence forte", "Spanner", "Cohérence externe, échelle horizontale, SLA 99,999 %", "Coût et refonte du schéma si la portée est régionale"],
      ["PostgreSQL qui plafonne, ou charge mixte HTAP", "AlloyDB for PostgreSQL", "Moteur optimisé Google, 100 % compatible PostgreSQL, pgvector pour l'IA", "Régional : ne remplace pas Spanner sur un besoin mondial"],
      ["Série temporelle, très haut débit, accès par clé", "Bigtable", "Latence inférieure à 10 ms, débit massif", "Aucune jointure SQL ni requête ad hoc"],
      ["Analytique, agrégations, historique long", "BigQuery", "Stockage et calcul séparés, échelle pétaoctet, BigQuery ML", "Pas une base transactionnelle"],
      ["État applicatif mobile ou web, temps réel", "Firestore", "Synchronisation et mode hors ligne", "Transactions à portée limitée"],
      ["Cache, sessions, compteurs", "Memorystore", "Latence sub-milliseconde, soulage la base principale", "Volatile par nature"]
    ]
  },
  {
    title: "Stockage — objet, bloc ou fichier ?",
    rows: [
      ["Fichiers, médias, sauvegardes, data lake", "Cloud Storage (objet)", "Classes de stockage et règles de cycle de vie", "Ne jamais y placer de l'état transactionnel"],
      ["Disque d'une VM ou d'un cluster", "Persistent Disk (bloc)", "Survit à l'arrêt de la VM. Standard ou SSD", "Attaché à une zone"],
      ["Besoin de performance extrême sur disque éphémère", "Local SSD", "Débit très élevé", "Piège classique : les données sont PERDUES à l'arrêt de la VM"],
      ["Système de fichiers partagé POSIX, accès concurrent", "Filestore (NFS)", "Montage par plusieurs machines", "Plus coûteux que le stockage objet"],
      ["Accès fréquent", "Classe Standard", "Aucun frais de récupération", "Coût de stockage le plus élevé"],
      ["Accès moins d'une fois par mois", "Classe Nearline", "Sauvegardes mensuelles", "Frais de récupération"],
      ["Accès moins d'une fois par trimestre", "Classe Coldline", "Archivage légal court", "Frais de récupération plus élevés"],
      ["Accès moins d'une fois par an", "Classe Archive", "Conservation longue très économique", "Restitution la plus coûteuse"]
    ]
  },
  {
    title: "Réseau — quelle connectivité ?",
    rows: [
      ["Haut débit privé, latence stable, SLA", "Dedicated Interconnect", "Capacité dédiée", "Délai de mise en service de plusieurs semaines"],
      ["Privé, débit modéré, haute disponibilité", "HA VPN", "Deux tunnels, BGP, SLA", "Plafond de débit par tunnel"],
      ["Pas de PoP Google à proximité", "Partner Interconnect", "Via un opérateur", "Dépendance au partenaire"],
      ["Consommer ou publier un service en privé", "Private Service Connect", "Pas de contrainte de plages d'IP", "À préférer au peering"],
      ["Relier deux VPC de la même organisation", "VPC Network Peering", "Simple et gratuit en interne", "Non transitif, IP non chevauchantes"],
      ["Centraliser le réseau de plusieurs projets", "Shared VPC", "Une équipe réseau gère les sous-réseaux, les équipes déploient dans des projets de service", "Même organisation uniquement"],
      ["Répartir le trafic mondial, bascule inter-régions", "Cloud Load Balancing global", "Anycast, bascule automatique", "Ne met rien en cache par lui-même"],
      ["Servir du contenu statique à faible latence", "Cloud CDN", "Cache en périphérie", "Inutile sur du contenu personnalisé non cacheable"],
      ["Bloquer attaques applicatives et DDoS", "Cloud Armor", "Pare-feu applicatif et anti-DDoS", "Ce n'est pas de l'authentification"],
      ["Exposer des API à des partenaires externes", "Apigee", "Passerelle d'API : quotas, clés, analytique, monétisation", "Surdimensionné pour un appel interne simple"]
    ]
  },
  {
    title: "Livraison et observabilité",
    rows: [
      ["Décrire l'infrastructure de façon reproductible", "Terraform", "Déclaratif, versionné, revu en pull request", "État distant et verrouillage obligatoires en équipe"],
      ["Construire et tester à chaque commit", "Cloud Build", "CI/CD managé", "Ne gère pas les stratégies de déploiement avancées"],
      ["Stocker et analyser les images de conteneur", "Artifact Registry", "Analyse de vulnérabilités intégrée", "Détecter n'est pas bloquer : voir Binary Authorization"],
      ["Déploiement progressif, canari, retour arrière", "Cloud Deploy", "Pilote la promotion entre environnements", "Exige des SLO pour décider du retour arrière"],
      ["Centraliser et corréler les journaux", "Cloud Logging", "Recherche, export vers BigQuery", "Les journaux d'accès aux données ne sont pas actifs par défaut"],
      ["Alerter sur une dégradation réelle", "Cloud Monitoring", "Alertes fondées sur des SLO", "Ne jamais alerter sur chaque métrique disponible"],
      ["Localiser la latence dans une chaîne de microservices", "Cloud Trace", "Traçage distribué, chemin critique", "Nécessite l'instrumentation des services"]
    ]
  },
  {
    title: "Sécurité — quel mécanisme pour quel besoin ?",
    rows: [
      ["Empêcher la sortie de données", "VPC Service Controls", "Périmètre de service", "Ne gère pas la localisation"],
      ["Imposer une région de stockage", "Organization Policy", "Contrainte héritée", "Ne gère pas l'accès du support Google"],
      ["Résidence + contrôle du personnel d'assistance", "Assured Workloads", "Conformité attestée", "Périmètre de services pris en charge"],
      ["Maîtriser le cycle de vie des clés", "CMEK via Cloud KMS", "Révocation possible", "Exige une séparation des rôles"],
      ["Accès utilisateur à une app interne", "Identity-Aware Proxy", "Authentifie en amont de l'app", "L'app n'a rien à implémenter"],
      ["Identité externe sans clé statique", "Workload Identity Federation", "Jetons de courte durée", "Remplace les clés JSON"],
      ["N'admettre que des images vérifiées", "Binary Authorization", "Contrôle d'admission", "Nécessite une chaîne d'attestation"],
      ["Découvrir et masquer des données sensibles", "Sensitive Data Protection", "Détection et masquage des PII et PHI avant stockage", "Traite le contenu, pas le périmètre"],
      ["Secrets applicatifs", "Secret Manager", "Versionnement et rotation", "Jamais dans le code"]
    ]
  },
  {
    title: "Migration — les 4R par effort et valeur",
    rows: [
      ["Délai court, sortie de centre de données, legacy intransigeant", "Rehost (lift and shift)", "Effort faible, valeur faible. Compute Engine ou VMware Engine", "Reporte la modernisation sans la supprimer"],
      ["Réduire la charge opérationnelle sans réécrire le code", "Replatform (lift, tinker and shift)", "Effort moyen. Conteneurisation sur GKE, passage à Cloud SQL", "Gains limités par l'architecture d'origine"],
      ["Besoin vital de scalabilité, refonte justifiée par le retour sur investissement", "Refactor (re-architect)", "Effort élevé, valeur élevée. Microservices serverless, Spanner", "Irréaliste sous forte contrainte de délai"],
      ["Fonction non différenciante pour le métier", "Repurchase (drop and shop)", "Remplacement par un produit SaaS", "Reprise des données et des processus à prévoir"]
    ]
  }
];

/* ----- Les quatre études de cas officielles ----- */
window.PCA_CASES = [
  {
    id: "altostrat",
    name: "Altostrat Media",
    sector: "Média et divertissement — streaming",
    profile: "Bibliothèque de podcasts et de vidéos, chaîne de transcodage, diffusion mondiale, analytique métier et IA générative appliquée au contenu.",
    watch: [
      "Volume de dépôts très irrégulier",
      "Fichiers sources volumineux et coût du catalogue à long terme",
      "Diffusion mondiale à faible latence",
      "Transcodage à déclencher au dépôt"
    ],
    reflexes: [
      "Coût du stockage média : Cloud Storage avec règles de cycle de vie, Standard vers Coldline ou Archive",
      "Transcodage événementiel : Cloud Run ou Cloud Run functions déclenché par le dépôt, jamais d'interrogation périodique",
      "Diffusion mondiale : Cloud CDN devant un équilibreur de charge global",
      "Séparer les fichiers sources, jamais relus, des fichiers de diffusion, lus en permanence"
    ]
  },
  {
    id: "cymbal",
    name: "Cymbal Retail",
    sector: "Commerce de détail — e-commerce",
    profile: "Catalogue produit hétérogène, personnalisation par IA, analytique de parcours d'achat, trafic très saisonnier.",
    watch: [
      "Base existante à moderniser, MySQL et SQL Server",
      "Pics promotionnels et lecture massive du catalogue",
      "Événements de commande asynchrones",
      "IA générative pour les visuels et les attributs produit"
    ],
    reflexes: [
      "Modernisation de la base : Cloud SQL, et Spanner seulement si un trafic mondial exige une cohérence forte",
      "Découplage de l'interface et du backend de commande : Pub/Sub",
      "Flux d'événements : Pub/Sub, Dataflow puis BigQuery",
      "IA générative : Vertex AI avec validation humaine avant publication"
    ]
  },
  {
    id: "ehr",
    name: "EHR Healthcare",
    sector: "Santé — SaaS médical",
    profile: "Sortie de centre de données, données patient sensibles relevant du PHI, intégrations avec des systèmes legacy, multi-locataires.",
    watch: [
      "Connexion aux assureurs restés sur site",
      "Protection stricte des données patient et conformité",
      "Applications déjà conteneurisées",
      "Isolation entre établissements clients et traçabilité des accès"
    ],
    reflexes: [
      "Liaison vers les partenaires sur site : Cloud Interconnect pour la bande passante dédiée et le SLA",
      "Protection du PHI : VPC Service Controls contre l'exfiltration, complété par Sensitive Data Protection",
      "Applications déjà conteneurisées : GKE, éventuellement en transition hybride",
      "Projet comme frontière d'isolation, CMEK par client, journaux d'accès aux données activés explicitement"
    ]
  },
  {
    id: "knightmotives",
    name: "KnightMotives Automotive",
    sector: "Automobile — véhicules connectés",
    profile: "Télémétrie massive de flotte, partenaires externes, connectivité intermittente, simulation et apprentissage automatique.",
    watch: [
      "Ingestion de milliards d'événements de capteurs",
      "Souveraineté des données en Europe",
      "Partage de données avec les concessionnaires",
      "Sécurité des modèles d'IA et cloisonnement documentaire"
    ],
    reflexes: [
      "Chaîne de télémétrie : Pub/Sub pour l'ingestion, Dataflow pour le traitement, Bigtable pour la série temporelle sous 10 ms",
      "Souveraineté : Organization Policy limitant les ressources aux régions de l'Union européenne",
      "Partage avec les concessionnaires : Apigee pour sécuriser et gouverner l'accès externe",
      "Bigtable pour l'accès opérationnel, BigQuery pour l'analyse de flotte agrégée : les deux coexistent"
    ]
  }
];

/* ----- Planning : 7 jours pleins, du 9 au 15 septembre ----- */
window.PCA_PLAN = [
  {
    date: "2026-09-09",
    label: "Mercredi 9 septembre",
    lang: "FR",
    focus: "Méthode et Well-Architected Framework",
    tasks: [
      "Lire la méthode en six étapes et l'appliquer à voix haute sur trois questions",
      "Mémoriser les six piliers du WAF avec leurs mots-clés anglais",
      "Réviser le tableau des mots-clés déclencheurs",
      "Série de 10 questions du domaine 1, sans chronomètre"
    ]
  },
  {
    date: "2026-09-10",
    label: "Jeudi 10 septembre",
    lang: "FR",
    focus: "Compute et arbitrages de plateforme",
    tasks: [
      "Reconstituer de mémoire l'arbre de décision Compute",
      "Comprendre pourquoi Cloud Run gagne sur « charge opérationnelle minimale »",
      "Identifier les cas où GKE se justifie réellement",
      "Série de questions des domaines 1 et 2"
    ]
  },
  {
    date: "2026-09-11",
    label: "Vendredi 11 septembre",
    lang: "FR",
    focus: "Données et stockage",
    tasks: [
      "Reconstituer de mémoire l'arbre de décision Données",
      "Travailler les frontières : Cloud SQL contre Spanner, Bigtable contre BigQuery",
      "Réviser les classes de stockage et les règles de cycle de vie",
      "Série de questions du domaine 4 sur l'optimisation des coûts"
    ]
  },
  {
    date: "2026-09-12",
    label: "Samedi 12 septembre",
    lang: "EN",
    focus: "Sécurité et conformité — bascule en anglais",
    tasks: [
      "Distinguer nettement VPC-SC, résidence des données et CMEK",
      "Réviser IAP, Workload Identity Federation et Binary Authorization",
      "Série complète du domaine 3, énoncés en anglais",
      "Ne plus traduire mentalement : lire et répondre directement en anglais"
    ]
  },
  {
    date: "2026-09-13",
    label: "Dimanche 13 septembre",
    lang: "EN",
    focus: "Réseau, migration et reprise après sinistre",
    tasks: [
      "Reconstituer l'arbre de décision Réseau",
      "Réviser les 4R et le choix du niveau de reprise selon RTO et RPO",
      "Réviser Backup and DR Service, Database Migration Service, Transfer Appliance",
      "Série des domaines 2, 4 et 5"
    ]
  },
  {
    date: "2026-09-14",
    label: "Lundi 14 septembre",
    lang: "EN",
    focus: "Les quatre études de cas",
    tasks: [
      "Lire les énoncés officiels des quatre cas sur le site Google",
      "Rédiger une fiche d'une page par cas : métier, contraintes, pièges",
      "Traiter les questions de cas du site",
      "Réviser le domaine 6 : SLI, SLO, budget d'erreur, alertes"
    ]
  },
  {
    date: "2026-09-15",
    label: "Mardi 15 septembre",
    lang: "EN",
    focus: "Examen blanc chronométré puis révision légère",
    tasks: [
      "Examen blanc complet en conditions réelles, deux heures sans interruption",
      "Corriger en lisant chaque réfutation, y compris sur les bonnes réponses",
      "Relire uniquement la liste de vos erreurs récurrentes",
      "Vérifier la logistique OnVUE : pièce d'identité, poste, connexion, pièce dégagée",
      "Arrêter tôt. Aucune révision nouvelle la veille."
    ]
  }
];

/* ----- Glossaire bilingue ----- */
window.PCA_GLOSSARY = [
  { en: "availability", fr: "disponibilité", note: "Part du temps où le service répond correctement." },
  { en: "durability", fr: "durabilité", note: "Probabilité de ne pas perdre la donnée. Distincte de la disponibilité." },
  { en: "reliability", fr: "fiabilité", note: "Capacité à fonctionner correctement malgré les défaillances." },
  { en: "resilience", fr: "résilience", note: "Capacité à absorber une panne et à se rétablir." },
  { en: "scalability", fr: "scalabilité", note: "Capacité à absorber la croissance de charge." },
  { en: "elasticity", fr: "élasticité", note: "Adaptation automatique de la capacité, à la hausse et à la baisse." },
  { en: "throughput", fr: "débit", note: "Volume d'opérations par unité de temps." },
  { en: "latency", fr: "latence", note: "Délai de réponse." },
  { en: "p99 latency", fr: "latence au 99e percentile", note: "Seuil sous lequel se situent 99 % des requêtes. Révèle ce que la moyenne masque." },
  { en: "strong consistency", fr: "cohérence forte", note: "Toute lecture voit la dernière écriture validée." },
  { en: "eventual consistency", fr: "cohérence à terme", note: "Les lectures convergent après un délai." },
  { en: "failover", fr: "bascule", note: "Passage automatique ou manuel vers l'instance de secours." },
  { en: "RTO", fr: "durée maximale d'interruption admissible", note: "Combien de temps le service peut rester indisponible." },
  { en: "RPO", fr: "perte de données maximale admissible", note: "Quelle quantité de données récentes peut être perdue." },
  { en: "least privilege", fr: "moindre privilège", note: "N'accorder que les permissions strictement nécessaires." },
  { en: "separation of duties", fr: "séparation des responsabilités", note: "Deux fonctions critiques ne doivent pas être détenues par la même personne." },
  { en: "data residency", fr: "résidence des données", note: "Obligation de localisation géographique. Distincte de l'exfiltration." },
  { en: "exfiltration", fr: "exfiltration", note: "Sortie non autorisée de données hors du périmètre." },
  { en: "egress", fr: "trafic sortant", note: "Données quittant le réseau. Souvent facturé." },
  { en: "managed service", fr: "service managé", note: "Service dont Google assure l'exploitation." },
  { en: "operational overhead", fr: "charge opérationnelle", note: "Effort humain récurrent d'exploitation. Déclencheur majeur à l'examen." },
  { en: "right-sizing", fr: "dimensionnement juste", note: "Ajuster la ressource à l'usage mesuré." },
  { en: "bursty traffic", fr: "trafic en rafales", note: "Charge très irrégulière, avec des pics brefs." },
  { en: "stateless", fr: "sans état", note: "Ne conserve aucun état local entre deux requêtes." },
  { en: "idempotent", fr: "idempotent", note: "Répéter l'opération ne change pas le résultat. Indispensable avec des tentatives répétées." },
  { en: "decoupling", fr: "découplage", note: "Réduire les dépendances directes, souvent par une file de messages." },
  { en: "lifecycle policy", fr: "règle de cycle de vie", note: "Transition ou suppression automatique des objets selon leur âge." },
  { en: "error budget", fr: "budget d'erreur", note: "Marge d'indisponibilité tolérée par le SLO. Arbitre vélocité et fiabilité." },
  { en: "SLI / SLO / SLA", fr: "indicateur, objectif, engagement de service", note: "L'indicateur mesure, l'objectif fixe la cible interne, l'engagement lie contractuellement." },
  { en: "canary release", fr: "déploiement canari", note: "Exposer une fraction du trafic à la nouvelle version." },
  { en: "blameless postmortem", fr: "analyse post-incident sans recherche de faute", note: "Chercher la cause systémique, pas le responsable." },
  { en: "runbook", fr: "procédure d'exploitation", note: "Marche à suivre documentée pour une situation donnée." },
  { en: "prompt injection", fr: "injection d'instruction", note: "Détournement d'un modèle par des instructions malveillantes." },
  { en: "RAG", fr: "génération augmentée par récupération", note: "Le modèle s'appuie sur des documents récupérés. La récupération doit filtrer selon les droits." },
  { en: "human-in-the-loop", fr: "supervision humaine", note: "Validation humaine avant une action à risque." },
  { en: "HTAP", fr: "traitement transactionnel et analytique hybride", note: "Base combinant OLTP et OLAP sans réplication lourde (ex. AlloyDB)." },
  { en: "blue-green deployment", fr: "déploiement bleu-vert", note: "Deux environnements identiques en parallèle, bascule instantanée du routeur sans indisponibilité." },
  { en: "rolling update", fr: "mise à jour progressive", note: "Remplacement progressif des instances ou pods sans interruption de service." },
  { en: "PITR", fr: "restauration à un point précis dans le temps", note: "Capacité d'une base managée à restaurer son état exact à une seconde précise (Cloud SQL, Spanner, AlloyDB)." },
  { en: "cold start", fr: "démarrage à froid", note: "Délai d'initialisation lors de la création d'une nouvelle instance serverless (Cloud Run, Cloud Run functions)." },
  { en: "data gravity", fr: "gravité des données", note: "Principe selon lequel les calculs et applications doivent être déplacés au plus près des volumes massifs de données pour éviter latence et coûts d'egress." },
  { en: "lift and shift", fr: "migration sans modification", note: "Stratégie Rehost : déplacer les machines virtuelles telles quelles vers le cloud sans toucher au code." }
];

/* ----- Rappels pour le jour J ----- */
window.PCA_DDAY = [
  "Deux heures, 50 à 60 questions : environ deux minutes par question. Ne pas s'enliser.",
  "Aucune pénalité pour une mauvaise réponse : répondre à absolument toutes les questions.",
  "Marquer les questions douteuses et y revenir, mais toujours laisser une réponse au passage.",
  "Les études de cas sont consultables en écran partagé : relire l'énoncé fourni plutôt que se fier à sa mémoire.",
  "Surligner mentalement la contrainte qui élimine, puis vérifier chaque option contre elle.",
  "Si deux options restent, préférer la plus simple et la plus managée qui respecte toutes les contraintes.",
  "Vérifier avant de valider qu'aucune question n'est restée sans réponse."
];

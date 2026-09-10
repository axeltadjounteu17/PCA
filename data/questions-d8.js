/* ==========================================================================
   Banque de questions — Série D8 (Enrichissement majeur)
   26 nouvelles questions :
   - D1 (Architecture & Planification) : 8 questions
   - D2 (Infrastructure & Réseau) : 4 questions
   - D3 (Sécurité & Conformité) : 6 questions
   - Études de Cas (Altostrat, Cymbal, EHR, KnightMotives) : 8 questions
   ========================================================================== */

window.PCA_QUESTIONS_D8 = [
  /* --- DOMAINE 1 --- */
  {
    id: "D1-NEW-01",
    domain: "d1",
    topic: "Architecture microservices & découplage asynchrone",
    multi: false,
    scenario: {
      fr: "Une application d'e-commerce subit des ralentissements critiques pendant les ventes flash. Le service de paiement bloque les requêtes HTTP en attendant que le service d'inventaire décrémente les stocks et que le service de notification envoie un e-mail au client. Vous devez découpler ces composants pour absorber les pointes de charge sans perte de messages, tout en conservant une complexité opérationnelle minimale.",
      en: "An e-commerce application experiences severe slowdowns during flash sales. The checkout service blocks incoming HTTP requests while waiting for the inventory service to decrement stock and the notification service to send a customer email. You must decouple these components to absorb traffic spikes without losing messages, maintaining minimal operational complexity."
    },
    stem: {
      fr: "Quelle architecture devez-vous recommander ?",
      en: "Which architecture should you recommend?"
    },
    options: [
      { fr: "Publier les événements d'achat dans un sujet Cloud Pub/Sub, et configurer des abonnements push/pull indépendants pour les services d'inventaire et de notification hébergés sur Cloud Run", en: "Publish purchase events to a Cloud Pub/Sub topic, and configure independent push/pull subscriptions for inventory and notification services hosted on Cloud Run" },
      { fr: "Déployer un cluster RabbitMQ auto-géré sur Compute Engine avec des disques Persistent Disk régionaux", en: "Deploy a self-managed RabbitMQ cluster on Compute Engine with regional Persistent Disks" },
      { fr: "Écrire directement les transactions dans Cloud SQL et configurer les autres services pour interroger la base toutes les secondes", en: "Write transactions directly into Cloud SQL and configure downstream services to poll the database every second" },
      { fr: "Remplacer les appels HTTP par des requêtes gRPC synchrones directes entre microservices avec Cloud Endpoints", en: "Replace HTTP calls with direct synchronous gRPC requests between microservices using Cloud Endpoints" }
    ],
    correct: [0],
    keywords: ["découpler", "pics de charge", "sans perte de messages", "charge opérationnelle minimale"],
    rationale: {
      fr: "Cloud Pub/Sub est un service managé hautement scalable qui découple les producteurs et consommateurs d'événements selon le modèle Publish/Subscribe. Les abonnements séparés garantissent qu'un ralentissement de la notification ne bloque ni la vente ni la mise à jour des stocks. Cloud Run fournit l'élasticité serverless idéale pour absorber les pics.",
      en: "Cloud Pub/Sub is a fully managed, highly scalable service that decouples event producers and consumers under a publish/subscribe pattern. Independent subscriptions ensure that slow notifications do not block checkout or inventory updates. Cloud Run provides serverless elasticity to absorb traffic spikes."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un cluster RabbitMQ sur VM Compute Engine impose une charge d'exploitation lourde (mise à l'échelle, sauvegardes, patching), contredisant l'exigence de simplicité opérationnelle.", en: "A self-managed RabbitMQ cluster on Compute Engine introduces significant operational overhead (patching, autoscaling, backups), violating the minimal operational complexity constraint." },
      { fr: "L'interrogation périodique (polling) d'une base de données relationnelle sature les connexions et introduit de la latence ainsi que des verrous de lignes inutiles.", en: "Polling a relational database exhausts connections, adds latency, and creates unnecessary row locking." },
      { fr: "gRPC reste un protocole synchrone point à point qui ne découple pas les dépendances temporelles en cas de pic de trafic.", en: "gRPC remains a synchronous point-to-point protocol that does not provide temporal decoupling during traffic bursts." }
    ]
  },
  {
    id: "D1-NEW-02",
    domain: "d1",
    topic: "Stockage analytique vs transactionnel (HTAP avec AlloyDB)",
    multi: false,
    scenario: {
      fr: "Une institution financière utilise PostgreSQL sur site. Sa base transactionnelle régionale commence à saturer à cause de requêtes analytiques et de reporting exécutées en continu sur les tables en direct. L'équipe exige une compatibilité stricte à 100 % avec PostgreSQL sans réécriture des requêtes SQL existantes, une haute disponibilité régionale automatique et une accélération massive des requêtes d'agrégation.",
      en: "A financial institution runs on-premises PostgreSQL. Its regional transactional database is struggling due to concurrent analytical and reporting queries executed on live tables. The team requires 100% strict PostgreSQL compatibility without rewriting existing SQL queries, automated regional high availability, and massive acceleration for aggregate queries."
    },
    stem: {
      fr: "Quelle solution de modernisation de base de données devez-vous recommander ?",
      en: "Which database modernization solution should you recommend?"
    },
    options: [
      { fr: "Migrer vers AlloyDB for PostgreSQL en activant le moteur en colonnes AlloyDB Columnar Engine", en: "Migrate to AlloyDB for PostgreSQL and enable the AlloyDB Columnar Engine" },
      { fr: "Migrer vers Cloud Spanner avec l'interface PostgreSQL", en: "Migrate to Cloud Spanner using the PostgreSQL interface" },
      { fr: "Déployer PostgreSQL sur Compute Engine avec des disques Local SSD en RAID 0", en: "Deploy PostgreSQL on Compute Engine with Local SSD disks configured in RAID 0" },
      { fr: "Exporter les données toutes les 10 minutes vers BigQuery à l'aide d'un script cron bash", en: "Export data every 10 minutes into BigQuery using a bash cron script" }
    ],
    correct: [0],
    keywords: ["PostgreSQL 100% compatible", "requêtes analytiques sur tables en direct", "HTAP", "haute disponibilité"],
    rationale: {
      fr: "AlloyDB for PostgreSQL est le moteur managé de Google optimisé pour les charges mixtes transactionnelles et analytiques (HTAP). Il conserve une compatibilité PostgreSQL totale tout en offrant un moteur en colonnes en mémoire qui accélère les requêtes analytiques jusqu'à 100x sans impacter les écritures OLTP.",
      en: "AlloyDB for PostgreSQL is Google's managed database optimized for demanding hybrid transactional and analytical (HTAP) workloads. It provides full PostgreSQL compatibility while offering an in-memory columnar engine accelerating analytical queries up to 100x without degrading OLTP write throughput."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Bien que Cloud Spanner propose un dialecte PostgreSQL, il n'est pas compatible à 100 % avec les extensions ou les procédures stockées existantes et impose une refonte de schéma non justifiée pour un besoin régional.", en: "Although Cloud Spanner offers a PostgreSQL dialect, it is not 100% compatible with existing extensions or stored procedures and requires schema refactoring that is unjustified for a regional scope." },
      { fr: "Local SSD est un stockage éphémère dont les données sont perdues à l'arrêt de la VM ; de plus cela n'offre aucune haute disponibilité managée.", en: "Local SSD is ephemeral storage where data is lost on instance stop; it also provides no managed high availability." },
      { fr: "Un export périodique par script cron est fragile, introduit un décalage de données (RPO élevé) et ne répond pas au besoin d'analytique en direct.", en: "A cron-based export script is brittle, introduces data lag (high RPO), and does not support real-time querying on live tables." }
    ]
  },
  {
    id: "D1-NEW-03",
    domain: "d1",
    topic: "Pipeline de données streaming à grande échelle",
    multi: false,
    scenario: {
      fr: "Une plateforme de mobilité collecte en continu les positions GPS de 500 000 véhicules (100 000 événements par seconde). Les données doivent être nettoyées, enrichies avec des données géospatiales en temps réel avec une garantie de traitement 'exactly-once', puis stockées pour une visualisation cartographique en direct (latence sub-seconde) et archivées pour des analyses historiques annuelles.",
      en: "A mobility platform continuously ingests GPS positions from 500,000 vehicles (100,000 events/sec). The data must be cleaned, enriched with geospatial metadata in real time with an exactly-once processing guarantee, stored for real-time map visualization (sub-second latency), and archived for multi-year historical queries."
    },
    stem: {
      fr: "Quelle combinaison de services Google Cloud répond à ces critères ?",
      en: "Which combination of Google Cloud services fulfills these criteria?"
    },
    options: [
      { fr: "Ingestion dans Pub/Sub, traitement streaming par Dataflow, stockage temps réel dans Cloud Bigtable et archivage analytique dans BigQuery", en: "Ingest into Pub/Sub, stream processing via Dataflow, real-time storage in Cloud Bigtable, and analytical archiving in BigQuery" },
      { fr: "Ingestion dans Cloud Storage, déclenchement par Eventarc vers Cloud Run, écriture dans Cloud SQL", en: "Ingest into Cloud Storage, trigger via Eventarc to Cloud Run, and write to Cloud SQL" },
      { fr: "Ingestion directe dans Cloud Spanner via son API REST, puis export hebdomadaire vers Filestore", en: "Ingest directly into Cloud Spanner via its REST API, then weekly export to Filestore" },
      { fr: "Ingestion dans Kafka sur Compute Engine, traitement par scripts Python sur des VM Spot, stockage sur Persistent Disk", en: "Ingest into Kafka on Compute Engine, processing via Python scripts on Spot VMs, and storage on Persistent Disk" }
    ],
    correct: [0],
    keywords: ["100 000 événements/sec", "exactly-once", "série temporelle", "analytique historique"],
    rationale: {
      fr: "L'architecture canonique d'ingestion streaming sur Google Cloud associe Cloud Pub/Sub (ingestion massive découplée), Cloud Dataflow (moteur Apache Beam managé garantissant le traitement exactly-once et le fenêtrage), Cloud Bigtable (très fort débit d'écriture et lectures temps réel sous 10 ms pour la carte), et BigQuery (stockage pétaoctet pour l'analytique SQL long terme).",
      en: "The canonical streaming ingestion architecture on Google Cloud pairs Cloud Pub/Sub (massive decoupled ingestion), Cloud Dataflow (managed Apache Beam engine guaranteeing exactly-once semantics and windowing), Cloud Bigtable (high write throughput with sub-10ms key-based reads for live maps), and BigQuery (petabyte-scale SQL analytics for long-term history)."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud Storage et Cloud SQL ne sont pas conçus pour absorber 100 000 écritures par seconde avec traitement sub-seconde.", en: "Cloud Storage and Cloud SQL cannot sustain 100,000 events/sec with sub-second processing and query times." },
      { fr: "Cloud Spanner est dimensionné pour de l'OLTP cohérent mondial, pas pour ingérer directement un flux brut de télémétrie IoT qui surcoûterait inutilement.", en: "Cloud Spanner is designed for global consistent OLTP, not raw IoT telemetry ingestion, which would be unnecessarily costly." },
      { fr: "Kafka et VM Spot auto-gérés créent une charge opérationnelle démesurée et risquent des interruptions de traitement dues à la préemption des VM.", en: "Self-managed Kafka and Spot VMs create massive operational overhead and risk processing halts due to VM preemptions." }
    ]
  },
  {
    id: "D1-NEW-04",
    domain: "d1",
    topic: "Stratégie de reprise d'activité (DR) & RTO / RPO stricts",
    multi: false,
    scenario: {
      fr: "Une application critique de santé doit satisfaire un RTO de 15 minutes et un RPO de 0 seconde en cas de panne totale d'une zone Google Cloud. L'application utilise une base de données relationnelle et des microservices conteneurisés. Le budget ne permet pas un déploiement multirégional actif-actif.",
      en: "A mission-critical healthcare application requires an RTO of 15 minutes and an RPO of 0 seconds in the event of a total Google Cloud zone failure. The application uses a relational database and containerized microservices. The budget does not accommodate a multi-region active-active deployment."
    },
    stem: {
      fr: "Quelle architecture répond précisément à ces contraintes au coût optimal ?",
      en: "Which architecture precisely satisfies these constraints at optimal cost?"
    },
    options: [
      { fr: "Déployer un cluster GKE régional avec des nœuds répartis sur 3 zones, et utiliser Cloud SQL configuré en haute disponibilité régionale (multi-zone synchrone)", en: "Deploy a regional GKE cluster with nodes spread across 3 zones, and use Cloud SQL configured with regional High Availability (synchronous multi-zone)" },
      { fr: "Déployer deux clusters GKE zonaux dans deux régions distinctes avec réplication asynchrone Cloud SQL inter-régionale", en: "Deploy two zonal GKE clusters in distinct regions with asynchronous cross-region Cloud SQL replication" },
      { fr: "Sauvegarder la base de données toutes les 15 minutes dans un bucket Cloud Storage multirégional", en: "Back up the database every 15 minutes into a multi-region Cloud Storage bucket" },
      { fr: "Déployer Compute Engine sur une seule zone avec des snapshots de disque persistants planifiés chaque heure", en: "Deploy Compute Engine in a single zone with scheduled hourly persistent disk snapshots" }
    ],
    correct: [0],
    keywords: ["RTO 15 minutes", "RPO 0 seconde", "panne de zone", "coût optimal"],
    rationale: {
      fr: "Une configuration régionale dans une même région avec répartition multi-zones permet d'obtenir un RPO de 0 (car la réplication Cloud SQL HA entre la zone primaire et la zone de secours est synchrone) et un RTO inférieur à quelques minutes (bascule automatique transparente de Cloud SQL et redémarrage automatique des pods GKE sur les nœuds survivants). Cela évite les coûts d'egress inter-régionaux.",
      en: "A regional multi-zone deployment achieves an RPO of 0 (due to synchronous standby replication in Cloud SQL HA) and an RTO of under a few minutes (automatic failover of Cloud SQL and pod rescheduling on surviving nodes in the regional GKE cluster). This avoids cross-region egress and duplicated cluster costs."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "La réplication inter-régionale est asynchrone, ce qui implique une perte possible de transactions récentes (RPO > 0), et engendre des coûts de transfert inter-régions élevés.", en: "Cross-region replication is asynchronous, resulting in potential data loss (RPO > 0) and high inter-region egress costs." },
      { fr: "Des sauvegardes toutes les 15 minutes donnent un RPO maximal de 15 minutes, ce qui viole la contrainte impérative de RPO = 0.", en: "Backups every 15 minutes yield an RPO of up to 15 minutes, violating the RPO = 0 requirement." },
      { fr: "Une solution mono-zone ne tolère pas une panne de zone et des snapshots horaires donnent un RPO d'une heure.", en: "A single-zone setup cannot survive a zonal outage, and hourly snapshots yield an RPO of 1 hour." }
    ]
  },
  {
    id: "D1-NEW-05",
    domain: "d1",
    topic: "Choix de calcul : Batch distribué à coût minimal",
    multi: false,
    scenario: {
      fr: "Un laboratoire de recherche exécute des simulations de dynamique moléculaire nécessitant des milliers de calculs indépendants par semaine. Chaque simulation dure de 2 à 4 heures et peut être relancée depuis un point de contrôle (checkpoint) sans perte de travail significatif. Les budgets sont très stricts et les délais d'obtention des résultats sont flexibles.",
      en: "A research laboratory executes molecular dynamics simulations requiring thousands of independent batch computations weekly. Each computation runs for 2 to 4 hours and implements checkpointing so it can be resumed without major rework. Budgets are severely constrained, and result delivery times are flexible."
    },
    stem: {
      fr: "Quelle solution de calcul offre le coût le plus faible tout en automatisant la gestion des tâches ?",
      en: "Which compute solution offers the lowest cost while automating task management?"
    },
    options: [
      { fr: "Utiliser Cloud Batch avec des machines virtuelles Spot", en: "Use Cloud Batch with Spot virtual machines" },
      { fr: "Réserver des instances Compute Engine avec des Contrats d'engagement d'utilisation (CUD) sur 3 ans", en: "Reserve Compute Engine instances using 3-year Committed Use Discounts (CUDs)" },
      { fr: "Exécuter les simulations sur Cloud Functions (2nd gen) avec allocation maximale de mémoire", en: "Run simulations on Cloud Functions (2nd gen) with maximum memory allocation" },
      { fr: "Déployer un cluster GKE Standard avec des nœuds de type n2-highcpu réservés en continu", en: "Deploy a GKE Standard cluster with n2-highcpu nodes running continuously" }
    ],
    correct: [0],
    keywords: ["calcul distribué", "checkpointing", "budget strict", "tâches par lot"],
    rationale: {
      fr: "Cloud Batch est le service managé dédié à la planification et à l'exécution de charges batch à grande échelle. Couplé avec des VM Spot (remise de 60 à 91 % par rapport au prix à la demande), il constitue la solution la plus économique, d'autant que l'application supporte le checkpointing en cas de préemption.",
      en: "Cloud Batch is a fully managed service purpose-built for scheduling and running containerized batch jobs at scale. When combined with Spot VMs (offering 60-91% discounts compared to on-demand pricing), it delivers maximum cost efficiency, especially since the application supports checkpointing upon preemption."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les CUD sur 3 ans engagent sur une facture mensuelle continue même lorsque le laboratoire n'exécute pas de calculs, ce qui est sous-optimal pour des charges ponctuelles ou par rafales.", en: "3-year CUDs commit to continuous monthly payments even when simulations are not running, which is wasteful for bursty, intermittent workloads." },
      { fr: "Cloud Functions a un timeout maximal de 60 minutes, ce qui rend impossible l'exécution d'un traitement de 2 à 4 heures.", en: "Cloud Functions has a maximum execution timeout of 60 minutes, making it technically unable to run 2 to 4 hour workloads." },
      { fr: "Un cluster GKE allumé en continu engendre des coûts de nœuds et d'administration inutiles pendant les périodes d'inactivité.", en: "A continuously running GKE cluster incurs baseline node and management costs during idle periods." }
    ]
  },
  {
    id: "D1-NEW-06",
    domain: "d1",
    topic: "Arbitrage de migration — 4R & délai court",
    multi: false,
    scenario: {
      fr: "Une entreprise doit fermer son centre de données physique dans 60 jours en raison de l'expiration de son bail. Son système principal comprend 200 machines virtuelles exécutant des applications Java monolithiques et des bases Oracle sur VMware vSphere. L'équipe n'a pas le temps de refactoriser le code ni de convertir les architectures avant l'échéance.",
      en: "An enterprise must exit its physical datacenter within 60 days due to lease expiration. Its core system consists of 200 virtual machines running legacy monolithic Java apps and Oracle databases on VMware vSphere. The engineering team has no time to refactor code or modernize architecture before the deadline."
    },
    stem: {
      fr: "Quelle stratégie de migration et quelle cible d'infrastructure devez-vous préconiser ?",
      en: "Which migration strategy and target infrastructure should you recommend?"
    },
    options: [
      { fr: "Adopter une stratégie Rehost en migrant les machines vers Google Cloud VMware Engine (GCVE)", en: "Adopt a Rehost strategy by migrating workloads to Google Cloud VMware Engine (GCVE)" },
      { fr: "Adopter une stratégie Refactor en découpant le monolithe en microservices sur GKE Autopilot", en: "Adopt a Refactor strategy by decomposing the monolith into microservices on GKE Autopilot" },
      { fr: "Adopter une stratégie Replatform en convertissant toutes les bases de données vers Cloud Spanner", en: "Adopt a Replatform strategy by converting all databases to Cloud Spanner" },
      { fr: "Adopter une stratégie Repurchase en remplaçant l'ensemble du système par un SaaS du commerce", en: "Adopt a Repurchase strategy by replacing the entire core system with commercial SaaS" }
    ],
    correct: [0],
    keywords: ["fermeture sous 60 jours", "VMware vSphere", "Rehost", "sans réécriture"],
    rationale: {
      fr: "Sous une contrainte de délai extrême (60 jours) et avec un environnement VMware existant, Google Cloud VMware Engine (GCVE) permet un Rehost (lift and shift) sans changer les outils d'administration, les adresses IP ni les configurations d'OS. La modernisation applicative interviendra dans une seconde phase.",
      en: "Under strict deadline pressure (60 days) and with existing VMware workloads, Google Cloud VMware Engine (GCVE) enables rapid Rehost (lift and shift) preserving existing operational tooling, networking, and OS configurations. Architecture modernization can be planned as a secondary phase."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un Refactor complet vers des microservices conteneurisés en 60 jours est irréaliste et comporte un risque opérationnel majeur de régression.", en: "Full Refactoring into microservices within 60 days is completely unrealistic and poses catastrophic delivery risk." },
      { fr: "Migrer d'Oracle vers Cloud Spanner nécessite une refonte complète des modèles de données et requêtes SQL, impossible en 2 mois.", en: "Migrating from Oracle to Cloud Spanner requires total schema redesign and query rewrites, impossible in two months." },
      { fr: "Un remplacement SaaS de processus cœur de métier requiert des mois de cadrage, de négociation contractuelle et de reprise de données.", en: "Procuring and migrating to a new core business SaaS typically takes many months of scoping, contracting, and data integration." }
    ]
  },
  {
    id: "D1-NEW-07",
    domain: "d1",
    topic: "Distribution de contenu média mondial (Cloud CDN & Anycast)",
    multi: false,
    scenario: {
      fr: "Un service mondial d'actualités diffuse des articles et des images haute résolution à 10 millions d'utilisateurs répartis sur tous les continents. Les serveurs d'origine sont situés dans la région europe-west1. Les utilisateurs en Asie et en Amérique du Sud signalent des temps de chargement de page supérieurs à 3 secondes pour les images statiques.",
      en: "A global news service delivers articles and high-resolution images to 10 million users across all continents. The origin web servers are located in europe-west1. Users in Asia and South America report page load times exceeding 3 seconds for static imagery."
    },
    stem: {
      fr: "Comment optimiser la latence de distribution de façon performante et économique ?",
      en: "How should you optimize delivery latency efficiently and cost-effectively?"
    },
    options: [
      { fr: "Placer un équilibreur de charge d'application externe global (Global External Application Load Balancer) avec Cloud CDN activé devant le bucket Cloud Storage ou les VM d'origine", en: "Place a Global External Application Load Balancer with Cloud CDN enabled in front of the Cloud Storage bucket or backend VMs" },
      { fr: "Créer des répliques complètes des serveurs Web sur des VM Compute Engine dans 15 régions avec synchronisation NFS", en: "Deploy duplicate web servers on Compute Engine VMs across 15 regions synchronized over NFS" },
      { fr: "Demander aux clients d'utiliser un VPN IPsec vers la région europe-west1", en: "Instruct end-users to establish IPsec VPN tunnels back to the europe-west1 region" },
      { fr: "Déplacer la base de données vers Cloud Spanner multi-région", en: "Migrate the backend database to a multi-region Cloud Spanner instance" }
    ],
    correct: [0],
    keywords: ["latence mondiale", "contenu statique", "Cloud CDN", "Global Load Balancer"],
    rationale: {
      fr: "Le Global External Application Load Balancer utilise le réseau Anycast mondial de Google et permet d'activer Cloud CDN en un clic. Les fichiers statiques sont mis en cache sur les points de présence (PoP / edge) au plus près des utilisateurs finaux, réduisant la latence à quelques millisecondes et déchargeant l'origine.",
      en: "The Global External Application Load Balancer leverages Google's global Anycast IP infrastructure and integrates directly with Cloud CDN. Static assets are cached at edge Points of Presence (PoPs) closest to end-users, slashing latency to milliseconds while offloading the backend origin."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Déployer des VM dans 15 régions avec NFS introduit des coûts d'infrastructure démesurés et une forte complexité d'exploitation.", en: "Deploying VM clusters across 15 regions with NFS creates prohibitive infrastructure costs and synchronization overhead." },
      { fr: "Un VPN grand public dégrade les performances, ajoute du chiffrement superflu pour des images publiques et est impraticable pour 10 millions d'utilisateurs.", en: "A consumer VPN degrades latency, adds needless tunnel overhead for public assets, and is unfeasible for 10 million end users." },
      { fr: "Le problème concerne la distribution d'actifs statiques (images), pas la couche de données relationnelle.", en: "The bottleneck is static asset delivery (images), not the relational database layer." }
    ]
  },
  {
    id: "D1-NEW-08",
    domain: "d1",
    topic: "Gouvernance des données & séparation des responsabilités",
    multi: false,
    scenario: {
      fr: "Une entreprise du secteur de l'énergie met en place une plateforme de données partagée sur Google Cloud. L'équipe d'ingénierie des données produit des tables BigQuery de consommation énergétique. L'équipe de comptabilité et l'équipe de recherche doivent pouvoir exécuter des requêtes SQL sur ces tables, mais l'équipe financière exige que chaque département paye ses propres coûts d'exécution de requêtes sans que personne ne puisse modifier les données brutes.",
      en: "An energy company establishes a shared data platform on Google Cloud. The data engineering team produces energy consumption BigQuery tables. The accounting team and the research team need to run ad-hoc SQL queries on these tables, but finance insists that each department pays for its own query processing costs while ensuring neither can alter raw data."
    },
    stem: {
      fr: "Quelle architecture de projets et de permissions BigQuery devez-vous concevoir ?",
      en: "Which BigQuery project and permission architecture should you design?"
    },
    options: [
      { fr: "Créer un projet de stockage hébergeant le jeu de données avec le rôle 'BigQuery Data Viewer' pour les analystes, et faire exécuter les requêtes depuis des projets consommateurs distincts où chaque équipe dispose du rôle 'BigQuery Job User'", en: "Create a central data storage project granting 'BigQuery Data Viewer' to analysts, and have each team run queries from their own consumer projects with 'BigQuery Job User'" },
      { fr: "Donner le rôle 'BigQuery Admin' à tous les utilisateurs sur le projet central de données", en: "Grant the 'BigQuery Admin' role to all users on the central data project" },
      { fr: "Copier la totalité des tables chaque nuit dans un projet distinct pour chaque département", en: "Copy all tables nightly into dedicated separate departmental projects" },
      { fr: "Créer des comptes de service individuels partageant une clé JSON stockée sur les postes des analystes", en: "Generate individual service accounts sharing a single JSON key stored on analyst workstations" }
    ],
    correct: [0],
    keywords: ["séparation des coûts", "BigQuery Data Viewer", "BigQuery Job User", "partage sécurisé"],
    rationale: {
      fr: "Dans BigQuery, le calcul (requêtes) et le stockage sont complètement dissociés. En donnant le rôle `roles/bigquery.dataViewer` sur le jeu de données central et `roles/bigquery.jobUser` dans le projet propre de chaque équipe, les requêtes sont facturées au projet consommateur (qui exécute le job) tandis que les données d'origine restent protégées en lecture seule.",
      en: "In BigQuery, compute and storage are decoupled. Granting `roles/bigquery.dataViewer` on the central dataset and `roles/bigquery.jobUser` in each team's dedicated project ensures that query execution costs are billed to the consuming project running the job, while source data remains strictly read-only."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le rôle BigQuery Admin confère des droits de modification et de suppression sur les données et facture tous les calculs sur le projet central.", en: "BigQuery Admin grants destructive modification privileges and bills all queries against the central storage project." },
      { fr: "Copier les données démultiplie les coûts de stockage, crée des risques de désynchronisation et alourdit la gouvernance.", en: "Nightly data replication multiplies storage costs, risks data divergence, and creates compliance headaches." },
      { fr: "L'usage de clés de compte de service exportées sur des postes locaux constitue une faille de sécurité majeure bannie par le WAF.", en: "Exporting service account keys to client workstations introduces a critical credential exfiltration vulnerability prohibited by the WAF." }
    ]
  },

  /* --- DOMAINE 2 --- */
  {
    id: "D2-NEW-01",
    domain: "d2",
    topic: "Réseau hybride haut débit & chiffrement en transit (MACsec)",
    multi: false,
    scenario: {
      fr: "Une banque d'investissement doit relier son centre de données privé à son VPC Google Cloud avec une bande passante garantie de 40 Gbit/s et une latence inférieure à 5 ms. L'organisme de réglementation financière impose que toutes les communications physiques soient chiffrées au niveau de la couche liaison (couche 2), sans la surcharge d'encapsulation d'un VPN IPsec.",
      en: "An investment bank must connect its on-premises datacenter to its Google Cloud VPC with a guaranteed 40 Gbps bandwidth and sub-5ms latency. The financial regulatory body mandates that all physical link traffic be encrypted at the data link layer (Layer 2) without the encapsulation overhead of an IPsec VPN."
    },
    stem: {
      fr: "Quelle solution de connectivité hybride Google Cloud devez-vous implémenter ?",
      en: "Which Google Cloud hybrid connectivity solution should you implement?"
    },
    options: [
      { fr: "Dedicated Interconnect avec le chiffrement MACsec activé sur les liaisons physiques", en: "Dedicated Interconnect with MACsec encryption enabled on physical circuits" },
      { fr: "Deux tunnels Cloud HA VPN sur l'Internet public avec routage dynamique BGP", en: "Two Cloud HA VPN tunnels over the public internet with BGP dynamic routing" },
      { fr: "Partner Interconnect sans chiffrement complété par des tunnels SSH sur chaque VM", en: "Partner Interconnect without encryption complemented by ad-hoc SSH tunnels on each VM" },
      { fr: "VPC Network Peering à travers une passerelle tierce hébergée sur Compute Engine", en: "VPC Network Peering routed through a third-party gateway hosted on Compute Engine" }
    ],
    correct: [0],
    keywords: ["40 Gbit/s", "chiffrement couche 2", "MACsec", "Dedicated Interconnect"],
    rationale: {
      fr: "Cloud Interconnect (Dedicated) offre des liaisons privées à 10G ou 100G avec SLA. L'option MACsec (IEEE 802.1AE) permet de chiffrer directement le trafic au niveau de la couche 2 entre les routeurs sur site et les routeurs périphériques de Google, sans impact de débit ni surcharge MTU comme avec IPsec.",
      en: "Cloud Interconnect (Dedicated) provides high-bandwidth private links (10 Gbps or 100 Gbps circuits) with enterprise SLAs. MACsec (IEEE 802.1AE) encrypts traffic directly at Layer 2 between on-premises edge routers and Google edge devices at line rate without IPsec encapsulation overhead."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud HA VPN est limité à 3 Gbit/s par tunnel et dépend des variations de latence de l'Internet public, ce qui ne permet pas d'atteindre 40 Gbit/s garantis.", en: "Cloud HA VPN is capped at 3 Gbps per tunnel and subject to public internet transit variance, failing the 40 Gbps and strict latency criteria." },
      { fr: "Des tunnels SSH gérés manuellement sur chaque machine sont ingérables, fragiles et ne protègent pas l'ensemble des flux du lien physique.", en: "Manual SSH tunnels are unmanageable at scale, fragile, and fail to secure all subnet-level link traffic." },
      { fr: "VPC Network Peering relie deux réseaux VPC internes à Google Cloud, pas un réseau physique sur site.", en: "VPC Network Peering connects two Google Cloud VPCs, not an on-premises physical datacenter." }
    ]
  },
  {
    id: "D2-NEW-02",
    domain: "d2",
    topic: "Architecture Shared VPC & séparation des prérogatives",
    multi: false,
    scenario: {
      fr: "Une grande entreprise structure son organisation Google Cloud. L'équipe Réseau centrale doit garder le contrôle exclusif sur les plages d'adresses IP, les règles de pare-feu et les passerelles NAT. Les équipes de développement d'applications doivent pouvoir déployer des instances Compute Engine et des clusters GKE sans pouvoir modifier la topologie réseau.",
      en: "An enterprise is structuring its Google Cloud organization. The central Network team must retain exclusive control over IP address allocations, firewall rules, and NAT gateways. Application development teams must be able to deploy Compute Engine instances and GKE clusters without altering the network topology."
    },
    stem: {
      fr: "Quelle architecture GCP devez-vous mettre en place ?",
      en: "Which GCP architecture should you implement?"
    },
    options: [
      { fr: "Configurer un Shared VPC avec le projet central comme Host Project et attribuer aux équipes applicatives des Service Projects avec le rôle 'Compute Network User' sur leurs sous-réseaux dédiés", en: "Configure a Shared VPC with the network project as Host Project, granting dev teams Service Projects with the 'Compute Network User' role on specific subnets" },
      { fr: "Créer un VPC par équipe et les connecter tous ensemble avec un maillage complet de VPC Network Peering", en: "Create a distinct VPC per team and connect them all together in a full mesh using VPC Network Peering" },
      { fr: "Donner le rôle 'Network Admin' à tous les développeurs dans un projet unique partagé", en: "Grant the 'Network Admin' role to all developers inside a single shared project" },
      { fr: "Mettre en place des tunnels VPN IPsec entre chaque projet de développement", en: "Establish IPsec VPN tunnels between every development project" }
    ],
    correct: [0],
    keywords: ["Shared VPC", "Host Project", "Service Project", "Compute Network User"],
    rationale: {
      fr: "Le Shared VPC (VPC partagé) permet de centraliser la gestion du réseau dans un projet hôte géré par les administrateurs réseau, tout en déléguant des projets de service aux équipes métier. Le rôle `roles/compute.networkUser` accordé sur des sous-réseaux précis permet aux développeurs d'attacher des VM sans modifier les règles de routage ou de pare-feu.",
      en: "Shared VPC allows an organization to centralize network management in a Host Project governed by network admins, while delegating Service Projects to application teams. Granting `roles/compute.networkUser` on specific subnets allows developers to attach workloads to authorized subnets without altering routing or firewall policies."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un maillage complet de VPC Peering est limité en nombre de pairs, non transitif, et chaque équipe conserve l'administration de son propre réseau, ce qui brise la gouvernance centrale.", en: "A full mesh of VPC Peering hits peering limits, is non-transitive, and leaves network controls fragmented across teams." },
      { fr: "Donner Network Admin aux développeurs viole le principe de moindre privilège et leur permet de modifier ou supprimer les pare-feu de sécurité.", en: "Granting Network Admin to developers violates least privilege and allows them to alter or delete core security firewalls." },
      { fr: "Monter des tunnels VPN internes entre projets cloud est inutilement complexe, coûteux et dégrade les débits.", en: "Building internal VPN tunnels between cloud projects introduces needless latency, cost, and maintenance complexity." }
    ]
  },
  {
    id: "D2-NEW-03",
    domain: "d2",
    topic: "Connectivité privée aux services managés (Private Service Connect)",
    multi: false,
    scenario: {
      fr: "Une entreprise consomme une API SaaS tierce hébergée sur Google Cloud par un partenaire, ainsi que des API Google Cloud Storage. La politique de sécurité interdit tout accès vers l'Internet public et refuse formellement l'utilisation de VPC Network Peering pour éviter les conflits d'adressage IP (chevauchement RFC 1918).",
      en: "An enterprise consumes a third-party SaaS API hosted on Google Cloud by a partner, as well as Google Cloud Storage APIs. Corporate security policy strictly prohibits egress to the public internet and explicitly bans VPC Network Peering to prevent RFC 1918 overlapping IP subnet conflicts."
    },
    stem: {
      fr: "Quelle solution de connectivité sécurisée répond à ces deux exigences ?",
      en: "Which secure connectivity solution satisfies both requirements?"
    },
    options: [
      { fr: "Utiliser Private Service Connect (PSC) pour créer des points de terminaison (endpoints) avec des adresses IP privées locales dans le VPC client", en: "Use Private Service Connect (PSC) to create endpoints with local private IP addresses in the consumer VPC" },
      { fr: "Déployer une passerelle Cloud NAT avec une adresse IP externe statique", en: "Deploy a Cloud NAT gateway with a static external IP address" },
      { fr: "Créer un tunnel HA VPN reliant le VPC client et le VPC du partenaire", en: "Create an HA VPN tunnel connecting the consumer VPC directly to the partner VPC" },
      { fr: "Autoriser temporairement les adresses IP publiques des serveurs partenaires dans les règles de pare-feu", en: "Temporarily whitelist partner public IP addresses in firewall egress rules" }
    ],
    correct: [0],
    keywords: ["Private Service Connect", "pas de peering", "pas d'Internet", "pas de conflit IP"],
    rationale: {
      fr: "Private Service Connect (PSC) permet de consommer des services (API Google ou services managés tiers/partenaires) de manière privée et unidirectionnelle via des adresses IP internes au VPC consommateur. Il élimine totalement les risques de chevauchement d'IP inhérents au peering et ne requiert aucun accès Internet.",
      en: "Private Service Connect (PSC) allows consumers to access Google APIs and third-party partner services privately and unidirectionally via local internal IP addresses. It completely eliminates the IP overlap challenges of VPC Peering and requires no public internet transit."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud NAT permet de sortir vers l'Internet public, ce qui est formellement interdit par la politique de sécurité.", en: "Cloud NAT routes traffic out to the public internet, which violates the strict egress ban." },
      { fr: "Un tunnel HA VPN exige également des plans d'adressage IP distincts et ne résout pas les risques de conflits sans translation d'adresses complexe.", en: "HA VPN requires non-overlapping IP address spaces and complex NAT topologies to avoid subnet collisions." },
      { fr: "Ouvrir des flux Internet viole l'interdiction d'accès au réseau public.", en: "Whitelisting public internet IPs breaches the zero-public-internet security policy." }
    ]
  },
  {
    id: "D2-NEW-04",
    domain: "d2",
    topic: "Stockage partagé haute performance POSIX (Filestore)",
    multi: false,
    scenario: {
      fr: "Une application de rendu d'animation 3D exécutée sur un groupe de 50 machines Compute Engine nécessite d'accéder simultanément au même système de fichiers avec une sémantique POSIX complète, le verrouillage de fichiers et une latence inférieure à la milliseconde pour des fichiers volumineux.",
      en: "A 3D animation rendering workload running on a farm of 50 Compute Engine instances requires concurrent access to the same shared filesystem with full POSIX semantics, file locking, and sub-millisecond read/write latency for large asset files."
    },
    stem: {
      fr: "Quelle solution de stockage devez-vous sélectionner ?",
      en: "Which storage solution should you select?"
    },
    options: [
      { fr: "Filestore (Enterprise ou Zonal)", en: "Filestore (Enterprise or Zonal tier)" },
      { fr: "Cloud Storage monté via le client Cloud Storage FUSE", en: "Cloud Storage mounted using the Cloud Storage FUSE client" },
      { fr: "Persistent Disk Standard attaché en mode lecture-écriture multi-instance", en: "Standard Persistent Disk attached in multi-writer read-write mode" },
      { fr: "Disques Local SSD partagés via NFS auto-hébergé sur une seule VM de petite taille", en: "Local SSD disks shared via a self-hosted NFS server on a single small VM" }
    ],
    correct: [0],
    keywords: ["système de fichiers POSIX", "accès concurrent multi-VM", "Filestore", "NFS"],
    rationale: {
      fr: "Filestore fournit un service managé de stockage de fichiers NFSv3 conforme POSIX, supportant les lectures/écritures concurrentes de dizaines de clients Compute Engine avec un débit élevé et une très faible latence.",
      en: "Filestore delivers fully managed NFSv3 storage adhering to strict POSIX semantics and file locking, designed for concurrent reads/writes across dozens of Compute Engine VMs with sustained high IOPS and low latency."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud Storage FUSE n'est pas un système de fichiers POSIX complet (pas de renommage atomique, pas de verrouillage de fichiers) et présente une latence d'accès objet inadaptée au rendu interactif.", en: "Cloud Storage FUSE is not a true POSIX filesystem (lacks atomic directory renames and file locking) and exhibits object-store latency ill-suited for render farms." },
      { fr: "Persistent Disk en mode multi-writer est réservé à des systèmes de fichiers de cluster spécifiques (ex. GFS2) et ne s'attache pas simplement à 50 VM sans logiciel de clustering complexe.", en: "Persistent Disk multi-writer mode is restricted to clustered filesystems and cannot be attached read-write across 50 generic VMs without complex clustering agents." },
      { fr: "Un serveur NFS auto-hébergé sur une seule VM devient un goulot d'étranglement majeur et un point unique de défaillance (SPOF) risquant la perte des données éphémères du Local SSD.", en: "A DIY NFS server on a single VM is a single point of failure (SPOF) and risks catastrophic data loss on instance reset due to Local SSD volatility." }
    ]
  },

  /* --- DOMAINE 3 --- */
  {
    id: "D3-NEW-01",
    domain: "d3",
    topic: "Prévention de l'exfiltration de données (VPC Service Controls)",
    multi: false,
    scenario: {
      fr: "Une entreprise financière stocke des données de cartes de crédit dans des buckets Cloud Storage et des tables BigQuery. Un audit révèle que même avec des permissions IAM correctement restreintes, un employé malveillant disposant d'identifiants valides pourrait copier des données sensibles vers un bucket Cloud Storage personnel situé dans un projet GCP externe.",
      en: "A financial enterprise stores credit card data in Cloud Storage buckets and BigQuery tables. A security audit highlights that even with strict IAM roles, a malicious insider with authorized credentials could copy sensitive records to an external personal Cloud Storage bucket in an unauthorized GCP project."
    },
    stem: {
      fr: "Quel contrôle de sécurité technique neutralise ce vecteur d'exfiltration ?",
      en: "Which technical security control prevents this data exfiltration vector?"
    },
    options: [
      { fr: "Configurer un périmètre de sécurité VPC Service Controls englobant les projets de l'entreprise pour Cloud Storage et BigQuery", en: "Configure a VPC Service Controls security perimeter encompassing company projects for Cloud Storage and BigQuery" },
      { fr: "Révoquer le rôle 'Storage Object Admin' et attribuer le rôle 'Storage Object Creator'", en: "Revoke 'Storage Object Admin' and grant 'Storage Object Creator'" },
      { fr: "Activer le chiffrement CMEK avec Cloud KMS sur tous les buckets", en: "Enable CMEK encryption with Cloud KMS on all buckets" },
      { fr: "Mettre en place des alertes Cloud Monitoring basées sur le volume d'appels API", en: "Set up Cloud Monitoring alert policies based on API invocation rate" }
    ],
    correct: [0],
    keywords: ["exfiltration vers projet externe", "VPC Service Controls", "périmètre de service", "IAM ne suffit pas"],
    rationale: {
      fr: "VPC Service Controls crée une frontière réseau logique (périmètre de service) autour des services managés Google Cloud (Cloud Storage, BigQuery). Il interdit les requêtes vers des ressources situées en dehors du périmètre même avec des identifiants IAM valides, bloquant ainsi toute copie de données vers des buckets non autorisés.",
      en: "VPC Service Controls creates a logical security perimeter around Google-managed services (Cloud Storage, BigQuery). It blocks requests directed to resources outside the perimeter even if the requester holds valid IAM credentials, completely neutralizing unauthorized data egress to external projects."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les rôles IAM valident qui a le droit d'écrire, mais ne peuvent pas empêcher un utilisateur autorisé d'écrire dans un projet personnel où il est administrateur.", en: "IAM verifies identity and role permissions, but cannot prevent an authorized user from writing to an external bucket where they also hold permissions." },
      { fr: "CMEK chiffre les données au repos contre la compromission de disques ou de clés, mais n'empêche pas la copie de données déchiffrées en mémoire par un compte autorisé.", en: "CMEK encrypts data at rest against media compromise, but does not block authorized users from reading and exfiltrating decrypted content." },
      { fr: "Les alertes de métriques signalent les anomalies a posteriori sans bloquer activement le transfert de données.", en: "Monitoring alerts are passive and retrospective; they do not actively block exfiltration transfers." }
    ]
  },
  {
    id: "D3-NEW-02",
    domain: "d3",
    topic: "Sécurisation CI/CD & signature d'images (Binary Authorization)",
    multi: false,
    scenario: {
      fr: "Une entreprise du secteur de la défense exige que seuls les conteneurs ayant passé avec succès l'analyse de vulnérabilités, les tests unitaires et la validation de sécurité puissent être déployés sur ses clusters GKE en production. Tout déploiement d'image non certifiée doit être automatiquement rejeté au niveau de l'API Kubernetes.",
      en: "A defense-sector company mandates that only container images that have passed vulnerability scanning, unit testing, and security sign-off can be deployed to its production GKE clusters. Any deployment of an uncertified image must be automatically rejected at the Kubernetes API level."
    },
    stem: {
      fr: "Quelle solution garantit cette exigence de sécurité ?",
      en: "Which solution enforces this security requirement?"
    },
    options: [
      { fr: "Activer Binary Authorization sur les clusters GKE avec une politique exigeant des attestations cryptographiques signées par les validateurs du pipeline CI/CD", en: "Enable Binary Authorization on GKE clusters with a policy requiring cryptographic attestations signed by CI/CD pipeline attestors" },
      { fr: "Utiliser uniquement Artifact Registry avec l'analyse automatique des vulnérabilités activée", en: "Rely solely on Artifact Registry with automated vulnerability scanning enabled" },
      { fr: "Configurer une politique IAM empêchant les développeurs d'utiliser la commande `kubectl apply`", en: "Configure an IAM policy preventing developers from executing the `kubectl apply` command" },
      { fr: "Écrire un script d'audit régulier dans Cloud Monitoring qui détruit les pods suspects après leur démarrage", en: "Write a recurring audit script in Cloud Monitoring that kills suspicious pods after they start" }
    ],
    correct: [0],
    keywords: ["Binary Authorization", "attestations signées", "admission controller", "uniquement conteneurs certifiés"],
    rationale: {
      fr: "Binary Authorization est un contrôleur d'admission natif pour GKE. Il vérifie cryptographiquement que les images de conteneurs disposent des attestations requises (fournies par Cloud Build, Kritis ou des outils de scan) avant d'autoriser l'instanciation des pods sur le cluster.",
      en: "Binary Authorization is a native GKE admission controller. It cryptographically enforces that container images bear valid digital signatures (attestations generated by Cloud Build or scanning systems) before allowing pods to deploy to the cluster."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Artifact Registry analyse et signale les failles de sécurité, mais ne bloque pas à lui seul le déploiement d'une image vulnérable sur GKE.", en: "Artifact Registry detects vulnerabilities, but scanning alone does not actively prevent a vulnerable image from being deployed." },
      { fr: "Restreindre kubectl n'empêche pas le déploiement via un compte de service compromis ou un pipeline mal configuré.", en: "Restricting developer kubectl permissions does not guard against deployment through compromised CI service accounts or bad automation." },
      { fr: "Détruire les pods a posteriori laisse une fenêtre d'exécution où un code non certifié ou malveillant peut s'exécuter en production.", en: "Killing pods after deployment leaves a critical window where untrusted code executes inside the production environment." }
    ]
  },
  {
    id: "D3-NEW-03",
    domain: "d3",
    topic: "Accès multi-cloud sans clé statique (Workload Identity Federation)",
    multi: false,
    scenario: {
      fr: "Des serveurs applicatifs déployés dans un centre de données sur site et sur Amazon Web Services (AWS) doivent écrire des journaux et déposer des sauvegardes dans des buckets Google Cloud Storage. L'équipe sécurité interdit expressément la création de clés de compte de service au format JSON en raison du risque de fuite ou de vol d'identifiants.",
      en: "Application servers deployed in an on-premises datacenter and on Amazon Web Services (AWS) must upload logs and backup files into Google Cloud Storage buckets. The infosec team strictly forbids downloading and storing service account JSON keys due to credential leakage risks."
    },
    stem: {
      fr: "Quelle méthode d'authentification recommandée devez-vous mettre en place ?",
      en: "Which recommended authentication mechanism should you implement?"
    },
    options: [
      { fr: "Configurer la fédération d'identité de charge de travail (Workload Identity Federation) avec AWS et OIDC pour échanger des jetons de courte durée contre des jetons d'accès Google Cloud", en: "Configure Workload Identity Federation with AWS and on-prem OIDC to exchange short-lived federated tokens for temporary Google Cloud access tokens" },
      { fr: "Créer une clé de compte de service JSON et la stocker chiffrée dans Secret Manager", en: "Create a service account JSON key and store it encrypted in Secret Manager" },
      { fr: "Ouvrir le bucket Cloud Storage en accès public en écriture seule avec des URL signées valides 1 an", en: "Make the Cloud Storage bucket public in write-only mode using 1-year signed URLs" },
      { fr: "Créer un utilisateur Google Workspace avec mot de passe partagé entre tous les serveurs externes", en: "Create a Google Workspace user account with a shared password configured across all external servers" }
    ],
    correct: [0],
    keywords: ["sans clé JSON", "Workload Identity Federation", "AWS / sur site", "jetons de courte durée"],
    rationale: {
      fr: "Workload Identity Federation permet à des charges de travail externes (AWS, Azure, OIDC/SAML sur site) d'emprunter des comptes de service Google Cloud en échangeant leurs propres jetons d'identité contre des jetons d'accès temporaires (durée de vie maximale d'une heure), sans aucune clé statique à gérer.",
      en: "Workload Identity Federation allows external workloads (AWS, Azure, on-premises OIDC/SAML) to impersonate Google Cloud service accounts by exchanging native identity tokens for short-lived Google access tokens, completely removing the need for downloadable static service account keys."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Stocker la clé JSON dans Secret Manager nécessite quand même une première authentification statique pour lire le secret depuis l'extérieur.", en: "Storing the JSON key in Secret Manager still requires an initial credential to authenticate from outside Google Cloud." },
      { fr: "Les buckets publics et des URL signées à validité excessive créent des failles majeures de sécurité et de conformité.", en: "Public buckets and year-long signed URLs introduce catastrophic security exposure." },
      { fr: "Partager un compte utilisateur avec mot de passe viole toutes les normes de sécurité d'entreprise et empêche l'audit d'identité.", en: "Shared human credentials violate basic security standards and eliminate auditability." }
    ]
  },
  {
    id: "D3-NEW-04",
    domain: "d3",
    topic: "Chiffrement et révocation client (CMEK & Cloud KMS)",
    multi: false,
    scenario: {
      fr: "Un client grand compte du secteur juridique exige contractuellement que toutes ses données au repos stockées dans BigQuery et Cloud Storage soient chiffrées avec des clés dont son propre responsable de la sécurité contrôle le cycle de vie et la révocation immédiate (cryptographic erasure). Les administrateurs de bases de données ne doivent pas pouvoir modifier la politique des clés.",
      en: "A key enterprise client in the legal sector requires that all data at rest stored in BigQuery and Cloud Storage be encrypted using keys whose lifecycle and immediate revocation capability (cryptographic erasure) are strictly governed by their security officer. Database administrators must not have privileges to alter key policies."
    },
    stem: {
      fr: "Quelle configuration répond à ces exigences réglementaires et de séparation des tâches ?",
      en: "Which configuration satisfies these regulatory and separation of duties requirements?"
    },
    options: [
      { fr: "Utiliser des clés de chiffrement gérées par le client (CMEK) via Cloud KMS, isoler le porte-clés dans un projet dédié géré par l'officier de sécurité avec le rôle 'Cloud KMS Admin', et attribuer le rôle 'CryptoKey Encrypter/Decrypter' aux comptes de service BigQuery et Storage", en: "Use Customer-Managed Encryption Keys (CMEK) via Cloud KMS, isolate key rings in a dedicated project managed by the security officer with 'Cloud KMS Admin', and grant 'CryptoKey Encrypter/Decrypter' to BigQuery and Storage service agents" },
      { fr: "Utiliser le chiffrement par défaut de Google avec clés gérées par Google (Google-Managed Keys)", en: "Rely on default Google-managed encryption keys" },
      { fr: "Fournir des clés de chiffrement fournies par le client (CSEK) dans chaque requête API HTTP en texte brut", en: "Supply Customer-Supplied Encryption Keys (CSEK) in plaintext headers with every HTTP API call" },
      { fr: "Chiffrer les données manuellement côté client avant envoi et stocker la clé privée dans un fichier sur chaque VM", en: "Encrypt data manually on the client side before upload and store the private key in a file on each VM" }
    ],
    correct: [0],
    keywords: ["CMEK", "Cloud KMS", "séparation des rôles", "révocation", "cryptographic erasure"],
    rationale: {
      fr: "CMEK via Cloud KMS permet de confier la rotation et la révocation des clés à l'équipe sécurité dans un projet distinct. En détruisant ou désactivant la clé dans KMS, les données associées dans BigQuery et Cloud Storage deviennent instantanément illisibles (effacement cryptographique), tout en garantissant la séparation stricte des privilèges.",
      en: "CMEK through Cloud KMS enables the security team to control key rotation and instant revocation in a dedicated project. Disabling or destroying the key makes the encrypted data in BigQuery and Storage instantly inaccessible (cryptographic erasure), enforcing strict separation of duties between DBAs and security officers."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les clés par défaut de Google ne permettent pas au client de contrôler la rotation ou de révoquer unilatéralement l'accès aux données.", en: "Google-managed default keys do not grant the client unilateral authority to revoke keys or control rotation policies." },
      { fr: "Envoyer des clés CSEK en texte brut dans les requêtes expose les secrets et CSEK n'est pas pris en charge par l'ensemble de l'écosystème BigQuery.", en: "Sending keys in API headers is prone to exposure and CSEK lacks universal integration with BigQuery services." },
      { fr: "Le chiffrement manuel côté client avec stockage de clés locales sur des VM est ingérable à l'échelle et casse les fonctionnalités natives de BigQuery.", en: "Manual client-side encryption with local VM key files breaks native BigQuery querying and creates immense operational vulnerability." }
    ]
  },
  {
    id: "D3-NEW-05",
    domain: "d3",
    topic: "Protection des applications web contre les attaques (Cloud Armor)",
    multi: false,
    scenario: {
      fr: "Une application web de billetterie grand public subit des attaques récurrentes par déni de service distribué (DDoS volumétrique de niveau 7) et des tentatives d'injection SQL sur ses formulaires d'inscription. L'architecture utilise un équilibreur de charge d'application externe global devant des conteneurs Cloud Run.",
      en: "A public ticketing web application experiences recurring Layer 7 distributed denial-of-service (DDoS) attacks and SQL injection attempts on its registration forms. The architecture uses a Global External Application Load Balancer in front of Cloud Run container backends."
    },
    stem: {
      fr: "Quelle mesure de sécurité périmétrique devez-vous déployer ?",
      en: "Which perimeter security measure should you deploy?"
    },
    options: [
      { fr: "Associer une politique de sécurité Cloud Armor à l'équilibreur de charge en activant les règles préconfigurées WAF (OWASP Top 10) et la limitation de débit (rate limiting)", en: "Attach a Cloud Armor security policy to the load balancer enabling preconfigured WAF rules (OWASP Top 10) and rate limiting" },
      { fr: "Déployer des appliances de pare-feu virtuelles (firewall virtuel) sur des VM Compute Engine avec routage personnalisé", en: "Deploy third-party virtual firewall appliances on Compute Engine VMs using complex custom routing" },
      { fr: "Activer Identity-Aware Proxy (IAP) sur l'ensemble des pages publiques de l'application", en: "Enable Identity-Aware Proxy (IAP) across all public pages of the application" },
      { fr: "Augmenter la limite maximale d'instances de Cloud Run pour absorber tout le trafic malveillant", en: "Increase the Cloud Run maximum instance limit to absorb all malicious traffic" }
    ],
    correct: [0],
    keywords: ["Cloud Armor", "OWASP Top 10", "DDoS niveau 7", "rate limiting", "Load Balancer"],
    rationale: {
      fr: "Cloud Armor s'intègre nativement à l'équilibreur de charge externe global. Il filtre le trafic malveillant en périphérie du réseau Google (edge), bloque les attaques DDoS L7, applique des règles anti-injection SQL/XSS préconfigurées (Core Rule Set OWASP) et limite le débit par adresse IP pour protéger les backends.",
      en: "Cloud Armor natively integrates with the Global External Application Load Balancer. It inspects and filters traffic at Google's network edge, blocks Layer 7 DDoS, enforces preconfigured OWASP Top 10 rules (SQLi, XSS), and applies rate limiting by IP to safeguard backends."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Des pare-feu virtuels tiers sur VM introduisent un goulot d'étranglement de scalabilité, augmentent les coûts et suppriment les avantages de l'architecture serverless.", en: "Virtual firewall appliances on VMs create scalability bottlenecks, increase operational overhead, and nullify serverless advantages." },
      { fr: "Identity-Aware Proxy sert à authentifier des employés sur des applications d'entreprise internes, pas à protéger un site public de billetterie.", en: "IAP is designed for employee authentication on internal enterprise apps, not public consumer-facing websites." },
      { fr: "Augmenter les instances Cloud Run va exploser la facture sans bloquer l'attaque (déni de portefeuille ou de service).", en: "Increasing Cloud Run max instances causes billing explosion without stopping the vulnerability exploitation." }
    ]
  },
  {
    id: "D3-NEW-06",
    domain: "d3",
    topic: "Anonymisation et protection des données sensibles (SDP)",
    multi: false,
    scenario: {
      fr: "Un hôpital numérise des milliers de comptes rendus médicaux textuels stockés dans Cloud Storage avant de les transmettre à des chercheurs externes. Les textes contiennent des noms de patients, adresses et numéros de sécurité sociale (PII et PHI). La réglementation exige que ces données sensibles soient automatiquement découvertes et masquées ou tokenisées avant toute analyse.",
      en: "A hospital digitizes thousands of unstructured medical text records stored in Cloud Storage before sharing them with external researchers. The records contain patient names, addresses, and national ID numbers (PII and PHI). Regulation mandates that this sensitive data be automatically discovered and masked or tokenized prior to analysis."
    },
    stem: {
      fr: "Quel service Google Cloud devez-vous intégrer dans le pipeline de traitement ?",
      en: "Which Google Cloud service should you integrate into the processing pipeline?"
    },
    options: [
      { fr: "Sensitive Data Protection (Cloud DLP) avec des infotypes de détection et des transformations de pseudonymisation (masquage/tokenisation)", en: "Sensitive Data Protection (Cloud DLP) configured with detection infotypes and de-identification transformations (masking/tokenization)" },
      { fr: "Cloud Key Management Service (KMS) en générant une clé asymétrique pour chaque fichier", en: "Cloud Key Management Service (KMS) generating an asymmetric key for each file" },
      { fr: "VPC Service Controls en créant un pont de périmètre", en: "VPC Service Controls establishing a perimeter bridge" },
      { fr: "Des expressions régulières manuelles programmées dans une fonction Cloud Run sans bibliothèque tierce", en: "Custom regex rules implemented in a Cloud Run function without external libraries" }
    ],
    correct: [0],
    keywords: ["Sensitive Data Protection", "Cloud DLP", "PII / PHI", "masquage", "tokenisation"],
    rationale: {
      fr: "Sensitive Data Protection (anciennement Cloud DLP) est le service managé dédié à la détection, classification et anonymisation (pseudonymisation, masquage, chiffrement déterministe) des informations personnellement identifiables (PII/PHI) dans des flux ou des fichiers au repos.",
      en: "Sensitive Data Protection (formerly Cloud DLP) is the managed service built for discovering, classifying, and de-identifying (masking, tokenizing, cryptographic hashing) personally identifiable information (PII/PHI) in unstructured text and structured datasets."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "KMS chiffre l'intégralité d'un fichier au repos ou en transit mais ne sait ni analyser le contenu textuel interne ni masquer sélectivement des identifiants.", en: "KMS encrypts binary payloads but cannot inspect text semantics or selectively de-identify personal identifiers." },
      { fr: "VPC Service Controls protège le périmètre réseau contre l'exfiltration mais n'altère pas le contenu des documents échangés avec les chercheurs.", en: "VPC Service Controls establishes network perimeters but does not inspect or redact document content." },
      { fr: "Des regex artisanales sont incomplètes, échouent sur les noms propres complexes et ne disposent pas des dictionnaires d'infotypes éprouvés de Google.", en: "Handcrafted regexes are brittle, fail on contextual personal names, and lack validated infotype coverage." }
    ]
  },

  /* --- ÉTUDES DE CAS (8 questions) --- */
  {
    id: "CS-ALT-03",
    domain: "d1",
    topic: "Altostrat Media — transcodage par lots et élasticité",
    caseStudy: "altostrat",
    multi: false,
    scenario: {
      fr: "Altostrat Media intègre des créateurs indépendants qui déposent des séries de vidéos volumineuses de façon imprévisible. La conversion vidéo multiformat exige d'importantes ressources processeur et mémoire pendant 30 à 45 minutes par vidéo. L'équipe souhaite déléguer complètement l'infrastructure de traitement à un service managé sans gérer d'orchestrateur de machines virtuelles.",
      en: "Altostrat Media onboards independent creators who submit large video batches unpredictably. Multi-format video transcoding requires substantial CPU and RAM resources for 30 to 45 minutes per asset. The engineering team wants to offload the entire processing infrastructure to a managed service without managing VM cluster orchestrators."
    },
    stem: {
      fr: "Quelle solution de calcul managé convient le mieux pour exécuter ces tâches de transcodage ?",
      en: "Which managed compute solution is best suited for executing these transcoding tasks?"
    },
    options: [
      { fr: "Cloud Batch pour orchestrer l'exécution de conteneurs de transcodage éphémères sur des VM dimensionnées à la demande", en: "Cloud Batch to orchestrate ephemeral transcoding containers on appropriately sized on-demand VMs" },
      { fr: "Cloud Run avec un timeout configuré à 15 minutes", en: "Cloud Run with a 15-minute execution timeout" },
      { fr: "Une machine Compute Engine unique de très grande taille allumée 24h/24", en: "A single ultra-large Compute Engine VM running 24/7" },
      { fr: "BigQuery ML pour exécuter le transcodage vidéo en requêtes SQL", en: "BigQuery ML to execute video transcoding via SQL statements" }
    ],
    correct: [0],
    keywords: ["Cloud Batch", "traitement 30 à 45 minutes", "conteneurs éphémères", "sans gestion de cluster"],
    rationale: {
      fr: "Cloud Batch est spécialement conçu pour les traitements par lots (batch jobs) qui dépassent les limites d'exécution des fonctions serverless (jusqu'à plusieurs heures). Il provisionne automatiquement les VM nécessaires, exécute les conteneurs de transcodage et détruit les ressources dès la fin de la tâche.",
      en: "Cloud Batch is specifically engineered for long-running batch jobs that exceed serverless function timeout limits (running for hours if needed). It automatically provisions necessary instances, executes the transcoding container workload, and tears down resources upon completion."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud Run a un délai d'expiration maximal (timeout) qui ne peut pas dépasser 60 minutes, et des tâches de 45 minutes risquent d'être coupées en cas de variation de charge.", en: "While Cloud Run can reach 60 minutes, running heavy sustained compute for 45 minutes on HTTP serverless is fragile compared to native batch orchestration." },
      { fr: "Une VM géante 24/7 est un gaspillage financier immense la nuit et un goulet d'étranglement lors des dépôts massifs simultanés.", en: "A 24/7 giant VM wastes budget during idle periods and forms an unscalable bottleneck during release peaks." },
      { fr: "BigQuery ML est conçu pour l'entraînement et l'inférence de modèles de données tabulaires/multimodales, pas pour l'encodage vidéo binaire.", en: "BigQuery ML is built for machine learning on data warehouse tables, not binary media encoding." }
    ]
  },
  {
    id: "CS-ALT-04",
    domain: "d4",
    topic: "Altostrat Media — IA générative pour sous-titrage et métadonnées",
    caseStudy: "altostrat",
    multi: false,
    scenario: {
      fr: "Altostrat Media souhaite générer automatiquement des sous-titres traduits et des résumés multilingues de ses podcasts vidéo afin de favoriser l'engagement international. La direction exige que les résumés ne contiennent aucune hallucination nuisible à l'image de marque et que le coût unitaire par épisode soit optimisé.",
      en: "Altostrat Media aims to automatically generate translated subtitles and multilingual episode summaries for its video podcasts to accelerate global discovery. Leadership requires zero brand-damaging hallucinations in published summaries and strictly optimized unit costs per episode."
    },
    stem: {
      fr: "Quelle architecture d'IA et de gouvernance devez-vous concevoir ?",
      en: "Which AI architecture and governance workflow should you design?"
    },
    options: [
      { fr: "Utiliser l'API Speech-to-Text puis Vertex AI (Gemini Flash) avec du Grounding sur la transcription et une étape de révision éditoriale humaine (human-in-the-loop) avant publication", en: "Use Speech-to-Text API then Vertex AI (Gemini Flash) with transcript grounding and a human-in-the-loop editorial review step before publication" },
      { fr: "Déployer un grand modèle open source sur un cluster GKE dédié de 8 GPU allumés en permanence avec publication automatique directe", en: "Deploy an open-source LLM on a dedicated GKE cluster with 8 GPUs running 24/7 with direct automated publishing" },
      { fr: "Envoyer directement les fichiers audio bruts dans BigQuery et utiliser une fonction regex pour deviner les sous-titres", en: "Upload raw audio into BigQuery and use regex functions to guess subtitles" },
      { fr: "Publier les sorties brutes du modèle de langage sur les réseaux sociaux sans journalisation ni garde-fous", en: "Publish raw language model outputs directly to social channels without logging or guardrails" }
    ],
    correct: [0],
    keywords: ["Vertex AI", "Gemini Flash", "Grounding", "human-in-the-loop", "coût optimisé"],
    rationale: {
      fr: "L'association de Speech-to-Text pour la transcription audio et de Gemini Flash sur Vertex AI assure un coût par token minimal et une faible latence. Le Grounding sur la transcription vérifiée évite les hallucinations, tandis que le processus human-in-the-loop garantit la conformité éditoriale exigée par la marque.",
      en: "Combining Speech-to-Text for transcription with Gemini Flash on Vertex AI delivers rock-bottom token costs and rapid execution. Grounding on the generated transcript eliminates hallucinations, and a human-in-the-loop editorial checkpoint prevents brand safety incidents."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Maintenir 8 GPU dédiés 24/7 sur GKE entraîne des coûts mensuels colossaux sans justifier le volume intermittent des podcasts.", en: "Maintaining 8 dedicated GPUs 24/7 on GKE incurs massive baseline infrastructure bills unsuited for intermittent batch volumes." },
      { fr: "Une fonction SQL regex est incapable de transcrire un fichier audio binaire.", en: "Regex SQL functions cannot perform acoustic speech-to-text transcription on binary audio." },
      { fr: "La publication directe sans validation viole le principe fondamental de modération et de supervision humaine du WAF.", en: "Direct unmoderated publication breaches core AI safety and human-in-the-loop tenets of the Well-Architected Framework." }
    ]
  },
  {
    id: "CS-CYM-03",
    domain: "d1",
    topic: "Cymbal Retail — gestion des pics de soldes et découplage des paniers",
    caseStudy: "cymbal",
    multi: false,
    scenario: {
      fr: "Pendant le Black Friday, Cymbal Retail fait face à une multiplication par 20 du trafic sur son panier d'achat. Le système existant écrivait directement dans la base de données relationnelle des commandes, provoquant des blocages de verrous (lock contention) et des abandons de paniers par milliers.",
      en: "During Black Friday, Cymbal Retail experiences a 20x traffic surge on its shopping cart service. The legacy system wrote order records directly into a relational database, causing severe database lock contention and thousands of abandoned carts."
    },
    stem: {
      fr: "Quelle architecture garantit la validation immédiate du panier pour le client tout en absorbant les pics d'écriture ?",
      en: "Which architecture ensures immediate checkout acknowledgment for shoppers while smoothly absorbing write spikes?"
    },
    options: [
      { fr: "Accepter la commande sur une API Cloud Run sans état, publier le message dans Cloud Pub/Sub pour confirmer immédiatement au client, et dépiler les commandes de manière régulée vers la base de données via Cloud Dataflow ou des consommateurs asynchrones", en: "Accept orders via stateless Cloud Run APIs, publish events to Cloud Pub/Sub for immediate client acknowledgment, and drain orders into the database via Cloud Dataflow or async workers" },
      { fr: "Surdimensionner l'instance Cloud SQL vers la plus grosse machine disponible avec 96 vCPU pour toute l'année", en: "Upsize the Cloud SQL instance to the largest available 96-vCPU machine year-round" },
      { fr: "Refuser temporairement les clients dès que le nombre de connexions à la base dépasse 100", en: "Temporarily reject customers whenever database active connections exceed 100" },
      { fr: "Enregistrer les commandes dans un fichier texte sur le disque de la VM web", en: "Append orders to a text file on the local web server VM disk" }
    ],
    correct: [0],
    keywords: ["pic Black Friday", "Pub/Sub", "découplage asynchrone", "absorption des écritures"],
    rationale: {
      fr: "Le découplage par file d'attente (Pub/Sub) sépare le chemin critique de paiement/acceptation de la persistance finale dans la base de données. L'utilisateur reçoit une confirmation instantanée, et le système traite les commandes au rythme soutenable par la base de données sans perte d'information.",
      en: "Decoupling via message queue (Pub/Sub) separates user-facing checkout submission from downstream database writes. Shoppers receive immediate confirmation, and backend workers throttle order commits at a sustainable pace for the database without dropping sales."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Surdimensionner une machine géante pour l'année entière afin d'absorber quelques jours de pointe est un désastre financier opposé au pilier d'optimisation des coûts.", en: "Overprovisioning a massive instance year-round for a few peak days wastes massive budget, violating Cost Optimization." },
      { fr: "Rejeter les clients détruit le chiffre d'affaires et la réputation de l'entreprise pendant son moment le plus rentable.", en: "Rejecting shoppers directly destroys revenue and brand loyalty during peak trading hours." },
      { fr: "Écrire sur un disque local de VM sans réplication entraîne une perte certaine de commandes lors de l'autoscaling ou de pannes d'instances.", en: "Writing to local VM disks without durable replication leads to catastrophic data loss during instance restarts or autoscaling events." }
    ]
  },
  {
    id: "CS-CYM-04",
    domain: "d2",
    topic: "Cymbal Retail — catalogue mondial à faible latence de lecture",
    caseStudy: "cymbal",
    multi: false,
    scenario: {
      fr: "Cymbal Retail vend ses produits dans 15 pays. Son catalogue produit (descriptions, prix, photos, avis) représente 50 Go de données lues des millions de fois par jour par des acheteurs mondiaux, avec des mises à jour de prix quelques fois par jour. La base MySQL centrale située dans l'Est des États-Unis est saturée par les requêtes en lecture.",
      en: "Cymbal Retail operates stores in 15 countries. Its product catalog (descriptions, prices, photos, reviews) consists of 50 GB of data read millions of times daily by global shoppers, with price updates occurring only a few times per day. The central MySQL database in us-east1 is overwhelmed by read queries."
    },
    stem: {
      fr: "Quelle solution offre la latence de lecture la plus faible à l'échelle mondiale pour un coût réduit ?",
      en: "Which solution provides the lowest global read latency at reduced cost?"
    },
    options: [
      { fr: "Mettre en cache les données de catalogue fréquemment consultées dans Memorystore (Redis) au niveau régional et diffuser les médias statiques via Cloud CDN devant un Cloud Load Balancer", en: "Cache frequently queried catalog data in regional Memorystore (Redis) instances and serve static product assets via Cloud CDN behind Cloud Load Balancing" },
      { fr: "Remplacer MySQL par un cluster Hadoop auto-géré sur Compute Engine", en: "Replace MySQL with a self-managed Hadoop cluster on Compute Engine" },
      { fr: "Forcer chaque client web à télécharger l'intégralité du catalogue de 50 Go dans son navigateur au premier chargement", en: "Force every web browser to download the entire 50 GB catalog database upon first page visit" },
      { fr: "Créer 15 répliques en lecture Cloud SQL inter-régionales synchrones", en: "Deploy 15 cross-region synchronous Cloud SQL read replicas" }
    ],
    correct: [0],
    keywords: ["lecture massive catalogue", "Memorystore", "Cloud CDN", "faible latence mondiale"],
    rationale: {
      fr: "La mise en cache en mémoire (Memorystore) soulage la base relationnelle des lectures répétitives avec une latence sub-milliseconde. Combiné à Cloud CDN pour les images et éléments statiques sur les PoP Google, l'accès au catalogue devient quasi instantané pour les utilisateurs mondiaux.",
      en: "In-memory caching with Memorystore relieves the relational database of repetitive read queries with sub-millisecond response times. Paired with Cloud CDN on Google edge points for product photos, global shoppers experience instant page rendering."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Hadoop est un framework de traitement analytique par lots, pas une base ou un cache pour un site d'e-commerce à faible latence.", en: "Hadoop is an analytical batch processing framework, completely unsuited for sub-10ms transactional e-commerce reads." },
      { fr: "Faire télécharger 50 Go à chaque internaute est techniquement absurde et bloquerait immédiatement la navigation.", en: "Downloading 50 GB to client mobile browsers is impossible and absurd." },
      { fr: "Cloud SQL ne prend pas en charge la réplication synchrone inter-régionale (la réplication inter-région est asynchrone) et multiplier 15 répliques serait très coûteux.", en: "Cloud SQL cross-region replicas are asynchronous (not synchronous) and maintaining 15 active database instances would incur heavy unnecessary costs." }
    ]
  },
  {
    id: "CS-EHR-03",
    domain: "d3",
    topic: "EHR Healthcare — isolation multi-locataires et conformité HIPAA",
    caseStudy: "ehr",
    multi: false,
    scenario: {
      fr: "EHR Healthcare propose une solution SaaS à des réseaux hospitaliers concurrents. Les contrats exigent une isolation absolue des données entre chaque hôpital client pour satisfaire les exigences HIPAA et HITECH : un administrateur ou une brèche applicative sur l'environnement de l'hôpital A ne doit en aucun cas pouvoir accéder aux dossiers de l'hôpital B.",
      en: "EHR Healthcare provides a SaaS healthcare platform to competing hospital networks. Customer contracts mandate absolute data isolation between tenant hospitals to satisfy HIPAA and HITECH requirements: an administrator or software exploit in Hospital A's environment must never be able to access Hospital B's patient records."
    },
    stem: {
      fr: "Quelle stratégie d'architecture cloud fournit la frontière d'isolation la plus robuste ?",
      en: "Which cloud architecture strategy provides the strongest isolation boundary?"
    },
    options: [
      { fr: "Allouer un projet Google Cloud dédié par hôpital client sous une organisation centralisée, avec ses propres clés CMEK Cloud KMS et des périmètres VPC Service Controls distincts", en: "Provision a dedicated Google Cloud project per hospital tenant within a centralized Organization, using client-specific Cloud KMS CMEK keys and distinct VPC Service Controls perimeters" },
      { fr: "Regrouper tous les hôpitaux dans une seule table BigQuery partagée avec une colonne `tenant_id` filtrée par le code applicatif", en: "Store all hospitals in a single shared BigQuery table with a `tenant_id` column filtered only by application logic" },
      { fr: "Créer un seul sous-réseau VPC et attribuer des balises réseau (network tags) différentes à chaque client", en: "Create a single shared VPC subnet and assign different network tags to each customer VM" },
      { fr: "Faire signer un accord de non-divulgation aux administrateurs sans appliquer de contrôles techniques", en: "Rely solely on signed administrative non-disclosure agreements without technical enforcement" }
    ],
    correct: [0],
    keywords: ["isolation multi-locataires", "HIPAA / HITECH", "projet comme frontière", "CMEK par client"],
    rationale: {
      fr: "Dans Google Cloud, le projet est la frontière d'isolation fondamentale pour l'authentification (IAM), le réseau, les quotas et les politiques de sécurité. Un projet dédié par client avec des clés CMEK autonomes et des périmètres VPC-SC garantit qu'aucune élévation de privilège locale ne peut déborder sur un autre établissement.",
      en: "In Google Cloud, the project is the primary isolation boundary for IAM, networking, audit boundaries, and resource quotas. Assigning a dedicated project per hospital tenant backed by customer-specific CMEK keys and VPC-SC perimeters prevents cross-tenant contamination even in the event of an application exploit."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Une simple colonne `tenant_id` dans une base partagée expose à des failles de sécurité majeures en cas de bug applicatif ou d'injection SQL.", en: "A shared table relying solely on a software `tenant_id` column exposes patients to massive data leaks upon any query bug or SQL injection." },
      { fr: "Les balises réseau ne constituent pas une frontière d'isolation IAM ou de stockage de données médicales.", en: "Network tags only filter firewall traffic between VMs; they provide zero data-at-rest or identity isolation." },
      { fr: "Les accords juridiques ne remplacent pas les garde-fous techniques exigés par HIPAA et le WAF.", en: "Paper agreements without technical policy enforcement violate HIPAA technical safeguard standards." }
    ]
  },
  {
    id: "CS-EHR-04",
    domain: "d2",
    topic: "EHR Healthcare — interconnexion privée hybride vers systèmes hospitaliers",
    caseStudy: "ehr",
    multi: false,
    scenario: {
      fr: "Dans le cadre de sa migration vers le cloud, EHR Healthcare doit maintenir une communication continue et sécurisée entre ses clusters GKE sur Google Cloud et ses systèmes d'imagerie médicale (PACS) restés dans les datacenters de certains hôpitaux partenaires. Les flux échangent des fichiers d'imagerie volumineux (plusieurs téraoctets par jour) avec une exigence de débit dédié et de SLA de disponibilité de 99,99 %.",
      en: "As part of its cloud transition, EHR Healthcare must maintain continuous, secure communication between its GKE clusters on Google Cloud and legacy on-premises Picture Archiving and Communication Systems (PACS) located in partner hospital facilities. Traffic entails multi-terabyte daily DICOM image transfers requiring dedicated bandwidth and a 99.99% availability SLA."
    },
    stem: {
      fr: "Quelle topologie de connectivité hybride devez-vous prescrire ?",
      en: "Which hybrid connectivity topology should you prescribe?"
    },
    options: [
      { fr: "Déployer Cloud Interconnect (Dedicated ou Partner) configuré pour une haute disponibilité à 99,99 % (4 liaisons réparties sur 2 métros et 2 routeurs de périphérie)", en: "Deploy Cloud Interconnect (Dedicated or Partner) configured for 99.99% high availability (4 circuits across 2 metros and 2 edge routers)" },
      { fr: "Configurer un tunnel VPN IPSec unique sur une connexion Internet fibre standard", en: "Configure a single IPsec VPN tunnel over standard commercial broadband internet" },
      { fr: "Transférer les fichiers médicaux via des clés USB expédiées chaque matin par coursier", en: "Transfer medical imaging files via physical USB hard drives shipped daily by postal courier" },
      { fr: "Exposer directement les serveurs PACS sur l'Internet public avec des adresses IP statiques", en: "Expose on-premises PACS image servers directly to the public internet using static IPs" }
    ],
    correct: [0],
    keywords: ["Cloud Interconnect 99,99%", "PACS", "teraoctets par jour", "connexion hybride"],
    rationale: {
      fr: "Pour transporter des téraoctets de flux médicaux critiques avec un SLA garanti de 99,99 %, Google Cloud exige l'architecture Cloud Interconnect 99,99 % composée de quatre circuits physiques terminés dans deux zones métropolitaines distinctes avec double routeur Cloud Router.",
      en: "To reliably transport terabytes of mission-critical healthcare imagery with a 99.99% SLA, Google Cloud prescribes the 99.99% Cloud Interconnect topology using four circuits terminating across two independent metropolitan locations with dual Cloud Routers."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un tunnel VPN unique n'offre pas de SLA de 99,99 %, sature sur des volumes de plusieurs téraoctets et présente un point unique de défaillance.", en: "A single VPN tunnel lacks a 99.99% SLA, chokes on multi-terabyte flows, and constitutes a critical single point of failure." },
      { fr: "L'expédition physique introduit un RTO de 24 à 48 heures incompatible avec les besoins de diagnostics hospitaliers urgents.", en: "Courier transport introduces 24-48 hour latency, wholly unacceptable for acute hospital clinical care." },
      { fr: "Exposer des systèmes médicaux sur l'Internet public est une violation gravissime des réglementations HIPAA et de la confidentialité patient.", en: "Exposing legacy medical servers directly to the public internet violates HIPAA privacy safeguards and invites ransomware." }
    ]
  },
  {
    id: "CS-KNI-03",
    domain: "d1",
    topic: "KnightMotives — stockage de séries temporelles de télémétrie véhicule",
    caseStudy: "knightmotives",
    multi: false,
    scenario: {
      fr: "KnightMotives reçoit des flux télémétriques de capteurs (vitesse, température batterie, freinage) émis par 2 millions de véhicules connectés toutes les 5 secondes. Les ingénieurs du centre de contrôle doivent pouvoir interroger l'historique récent d'un véhicule spécifique en moins de 10 millisecondes par son identifiant VIN et horodatage.",
      en: "KnightMotives ingests streaming sensor data (speed, battery temperature, brake status) broadcast by 2 million connected vehicles every 5 seconds. Diagnostic engineers at the operations center must be able to look up a specific vehicle's recent telemetry by VIN and timestamp with sub-10ms response times."
    },
    stem: {
      fr: "Quelle base de données et quelle conception de clé de ligne devez-vous recommander ?",
      en: "Which database and row key design should you recommend?"
    },
    options: [
      { fr: "Cloud Bigtable avec une clé de ligne structurée sous la forme `{VIN}#{timestamp}` pour assurer une distribution uniforme des écritures sans hotspotting", en: "Cloud Bigtable with a composite row key formatted as `{VIN}#{timestamp}` to ensure balanced write distribution without hotspotting" },
      { fr: "Cloud Bigtable avec une clé de ligne commençant par le `{timestamp}` séquentiel seul", en: "Cloud Bigtable with a row key prefixed strictly by sequential `{timestamp}`" },
      { fr: "Cloud SQL MySQL avec une table unique sans index", en: "Cloud SQL MySQL with a single unindexed table" },
      { fr: "Sauvegarder chaque message télémétrique individuel sous forme de fichier JSON dans Cloud Storage", en: "Save each individual telemetry message as an isolated JSON file in Cloud Storage" }
    ],
    correct: [0],
    keywords: ["2 millions de véhicules", "sub-10ms", "Bigtable", "clé de ligne", "pas de hotspotting"],
    rationale: {
      fr: "Cloud Bigtable est le moteur NoSQL haute performance par excellence pour les séries temporelles et les flux IoT massifs. Structurer la clé de ligne avec l'identifiant du véhicule en préfixe `{VIN}#{timestamp}` évite le phénomène de point chaud (hotspotting) et permet des recherches ponctuelles ou des balayages de plages (scans) en moins de 10 ms.",
      en: "Cloud Bigtable is the premier high-throughput NoSQL engine for massive IoT and time-series telemetry. Designing composite row keys prefixed by vehicle identifier `{VIN}#{timestamp}` distributes traffic evenly across cluster nodes, avoids timestamp hotspotting, and provides sub-10ms point lookups and range scans."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Commencer une clé Bigtable par un horodatage séquentiel concentre toutes les écritures contemporaines sur un seul nœud du cluster (hotspotting sévère) et dégrade dramatiquement les performances.", en: "Prefixing keys with sequential timestamps creates catastrophic hotspotting where all current writes overload a single node." },
      { fr: "Une base Cloud SQL classique sans partitionnement ne peut pas absorber 400 000 écritures par seconde et saturerait immédiatement.", en: "Standard Cloud SQL cannot absorb 400,000 writes per second and would lock up immediately." },
      { fr: "Créer des milliards de micro-fichiers dans Cloud Storage introduit une surcharge d'API et rend impossible les requêtes sous 10 ms.", en: "Generating billions of micro-objects in Cloud Storage causes API rate limits, extreme latency, and query paralysis." }
    ]
  },
  {
    id: "CS-KNI-04",
    domain: "d3",
    topic: "KnightMotives — souveraineté des données en Europe et politiques d'organisation",
    caseStudy: "knightmotives",
    multi: false,
    scenario: {
      fr: "KnightMotives commercialise ses véhicules connectés au sein de l'Union européenne. Les régulateurs européens imposent que toutes les données de télémétrie et informations personnelles des conducteurs soient stockées et traitées exclusivement dans des centres de données situés sur le territoire de l'UE, sous peine de sanctions financières majeures.",
      en: "KnightMotives operates its connected vehicle platform within the European Union. EU regulators enforce strict compliance mandating that all vehicle telemetry and driver personal data be stored and processed exclusively in datacenters located within EU borders, subject to severe penalties."
    },
    stem: {
      fr: "Comment garantir techniquement qu'aucune ressource ne puisse être créée en dehors de l'Union européenne ?",
      en: "How can you technically ensure that no cloud resources can be provisioned outside the European Union?"
    },
    options: [
      { fr: "Appliquer la contrainte de politique d'organisation 'Resource Location Restriction' (`constraints/gcp.resourceLocations`) au niveau du nœud Organisation en limitant les emplacements à `in:eu-locations`", en: "Enforce the 'Resource Location Restriction' Organization Policy constraint (`constraints/gcp.resourceLocations`) at the Organization node restricted to `in:eu-locations`" },
      { fr: "Envoyer un e-mail à tous les ingénieurs pour leur demander de sélectionner des régions européennes dans la console", en: "Send an email reminder asking engineers to only select European regions in the Google Cloud console" },
      { fr: "Bloquer les adresses IP non-européennes dans le pare-feu du VPC", en: "Block non-European IP addresses in the VPC firewall rules" },
      { fr: "Déployer un script hebdomadaire qui supprime les VM créées aux États-Unis", en: "Schedule a weekly cron script to terminate VMs discovered running in US regions" }
    ],
    correct: [0],
    keywords: ["souveraineté UE", "politique d'organisation", "constraints/gcp.resourceLocations", "in:eu-locations"],
    rationale: {
      fr: "Les politiques d'organisation (Organization Policies) permettent aux administrateurs centraux d'imposer des contraintes strictes et héritables sur l'ensemble de la hiérarchie de ressources. La contrainte `constraints/gcp.resourceLocations` configurée sur `in:eu-locations` interdit physiquement et immédiatement toute création de ressource (Compute, Storage, BigQuery) en dehors des régions européennes.",
      en: "Organization Policies provide centralized, inherited guardrails across an enterprise's entire Google Cloud resource hierarchy. Enforcing `constraints/gcp.resourceLocations` set to `in:eu-locations` immediately and definitively prevents any developer or service from provisioning resources (Compute, Storage, BigQuery) outside the EU."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Une consigne verbale ou par e-mail n'offre aucune garantie technique contre l'erreur humaine ou la malveillance.", en: "Email requests provide zero programmatic enforcement against human error, automation scripts, or policy breaches." },
      { fr: "Les règles de pare-feu VPC contrôlent le trafic réseau IP mais n'empêchent pas le provisionnement d'un bucket ou d'une base dans une région étrangère.", en: "VPC firewall rules control packet flow, but cannot restrict where Cloud Storage buckets or databases are provisioned." },
      { fr: "Supprimer des ressources a posteriori expose l'entreprise à des fuites de données pendant la semaine et détruit des charges de production.", en: "A weekly deletion script allows data to reside in non-compliant regions for days before deletion and breaks production systems." }
    ]
  }
];

/* ==========================================================================
   Banque de questions — Études de cas
   Les questions de cas représentent 20 à 30 % de l'examen. Deux cas parmi les
   quatre officiels sont tirés au sort et consultables en écran partagé.

   AVERTISSEMENT MÉTHODOLOGIQUE
   Les contextes ci-dessous sont des RECONSTITUTIONS PÉDAGOGIQUES bâties sur le
   profil sectoriel et technique de chaque cas officiel (média/transcodage,
   retail/catalogue, santé/conformité, automobile/télémétrie). Ce ne sont pas
   les textes officiels de Google, qui doivent être lus séparément :
   https://cloud.google.com/learn/certification/guides/professional-cloud-architect
   L'objectif est d'entraîner le raisonnement d'arbitrage, pas de mémoriser un
   énoncé. Le jour J, relis toujours le cas fourni : les chiffres diffèrent.
   ========================================================================== */

window.PCA_QUESTIONS_CASES = [
  /* ---------------------------- Altostrat Media --------------------------- */
  {
    id: "CS-ALT-01",
    domain: "d1",
    topic: "Altostrat Media — chaîne de traitement média",
    caseStudy: "altostrat",
    multi: false,
    scenario: {
      fr: "Altostrat Media diffuse de la vidéo à la demande dans 40 pays. Les créateurs déposent des fichiers sources pesant de 2 à 60 Go. Chaque dépôt doit déclencher un transcodage en plusieurs résolutions, l'extraction automatique de métadonnées et la génération de sous-titres. Le volume de dépôts est très irrégulier : quelques fichiers la nuit, plusieurs centaines à l'approche des sorties. L'équipe plateforme est réduite et veut éviter d'administrer des serveurs.",
      en: "Altostrat Media streams video on demand in 40 countries. Creators upload source files from 2 to 60 GB. Each upload must trigger multi-resolution transcoding, automatic metadata extraction and subtitle generation. Upload volume is highly irregular: a few files overnight, several hundred approaching releases. The platform team is small and wants to avoid administering servers."
    },
    stem: {
      fr: "Quelle architecture de déclenchement et de traitement retenir ?",
      en: "Which triggering and processing architecture should be selected?"
    },
    options: [
      { fr: "Dépôt dans Cloud Storage, notification d'événement vers Pub/Sub, traitement par des services conteneurisés à mise à l'échelle automatique, puis diffusion via CDN", en: "Upload to Cloud Storage, event notification to Pub/Sub, processing by autoscaling containerized services, then delivery through CDN" },
      { fr: "Dépôt sur un partage Filestore monté par un groupe fixe de VM interrogeant le répertoire toutes les minutes", en: "Upload to a Filestore share mounted by a fixed VM group polling the directory every minute" },
      { fr: "Dépôt dans Cloud Storage puis traitement déclenché par un travail planifié toutes les heures", en: "Upload to Cloud Storage then processing triggered by an hourly scheduled job" },
      { fr: "Dépôt direct dans BigQuery en tant que données binaires, puis traitement par requêtes planifiées", en: "Upload directly into BigQuery as binary data, then processing via scheduled queries" }
    ],
    correct: [0],
    keywords: ["volume irrégulier", "éviter d'administrer des serveurs", "équipe réduite", "déclenchement au dépôt", "40 pays"],
    rationale: {
      fr: "L'architecture événementielle est la réponse attendue sur ce profil. Cloud Storage absorbe des objets de 60 Go, la notification d'événement supprime tout mécanisme d'interrogation périodique, Pub/Sub découple et absorbe les rafales, et des services conteneurisés à mise à l'échelle automatique suivent un volume passant de quelques unités à plusieurs centaines. Le CDN sert l'audience répartie sur 40 pays.",
      en: "The event-driven architecture is the expected answer for this profile. Cloud Storage handles 60 GB objects, event notification removes any polling mechanism, Pub/Sub decouples and absorbs bursts, and autoscaling containerized services track volume swinging from a handful to several hundred. The CDN serves the 40-country audience."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un parc fixe de VM est soit sous-dimensionné pendant les pics, soit payé à vide la nuit, et l'interrogation périodique ajoute de la latence. Contredit aussi la volonté de ne pas administrer de serveurs.", en: "A fixed VM fleet is either undersized during peaks or paid for while idle overnight, and polling adds latency. It also contradicts the goal of not administering servers." },
      { fr: "Un déclenchement horaire introduit jusqu'à une heure de retard avant le début du transcodage, sans nécessité : la notification d'événement est immédiate et moins coûteuse.", en: "Hourly triggering introduces up to an hour of delay before transcoding starts, with no need: event notification is immediate and cheaper." },
      { fr: "BigQuery est un entrepôt analytique, pas un stockage de fichiers vidéo. Erreur de nature de service.", en: "BigQuery is an analytical warehouse, not video file storage. A service-nature error." }
    ]
  },
  {
    id: "CS-ALT-02",
    domain: "d4",
    topic: "Altostrat Media — coût du catalogue",
    caseStudy: "altostrat",
    multi: false,
    scenario: {
      fr: "Le catalogue d'Altostrat Media atteint 1,2 Po. Les fichiers sources d'origine doivent être conservés pour permettre un futur réencodage, mais ils ne sont jamais lus en exploitation courante. Les fichiers transcodés destinés à la diffusion, eux, sont consultés en permanence. Aujourd'hui tout réside en classe Standard dans un bucket multirégional.",
      en: "Altostrat Media's catalog reaches 1.2 PB. Original source files must be retained to allow future re-encoding but are never read in normal operations. The transcoded delivery files, by contrast, are read constantly. Today everything sits in Standard class in a multi-region bucket."
    },
    stem: {
      fr: "Quelle optimisation recommander ?",
      en: "Which optimization should be recommended?"
    },
    options: [
      { fr: "Séparer les sources et les fichiers de diffusion dans des buckets distincts, et appliquer la classe Archive aux sources", en: "Separate sources and delivery files into distinct buckets, applying Archive class to sources" },
      { fr: "Appliquer une règle de cycle de vie unique déplaçant tout le bucket vers Coldline après 30 jours", en: "Apply a single lifecycle rule moving the whole bucket to Coldline after 30 days" },
      { fr: "Supprimer les fichiers sources après validation du transcodage", en: "Delete source files once transcoding is validated" },
      { fr: "Convertir le bucket multirégional en bucket régional pour réduire le coût de stockage", en: "Convert the multi-region bucket to a regional bucket to cut storage cost" }
    ],
    correct: [0],
    keywords: ["1,2 Po", "sources jamais lues mais à conserver", "fichiers de diffusion lus en permanence", "tout en Standard"],
    rationale: {
      fr: "Deux profils d'accès opposés cohabitent dans un même bucket, ce qui interdit une règle unique. Les isoler permet d'appliquer la classe Archive aux sources, jamais lues mais conservées pour un réencodage éventuel, tout en maintenant les fichiers de diffusion en Standard multirégional où la latence et la disponibilité comptent.",
      en: "Two opposite access profiles share one bucket, which rules out a single policy. Isolating them allows Archive class for the never-read sources retained for possible re-encoding, while keeping delivery files in multi-region Standard where latency and availability matter."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Une règle uniforme dégraderait la diffusion : les fichiers consultés en permanence subiraient des frais de récupération et une latence accrue à chaque lecture.", en: "A uniform rule would degrade delivery: constantly read files would incur retrieval fees and higher latency on every read." },
      { fr: "L'énoncé impose explicitement de conserver les sources pour un réencodage futur. La suppression viole une exigence métier.", en: "The scenario explicitly requires retaining sources for future re-encoding. Deletion violates a business requirement." },
      { fr: "Réduit le coût mais dégrade la disponibilité et la proximité géographique pour une audience répartie dans 40 pays, sans traiter le vrai gaspillage qui porte sur la classe des sources.", en: "Cuts cost but degrades availability and geographic proximity for a 40-country audience, without addressing the real waste, which lies in the source files' storage class." }
    ]
  },

  /* ----------------------------- Cymbal Retail ---------------------------- */
  {
    id: "CS-CYM-01",
    domain: "d1",
    topic: "Cymbal Retail — trafic saisonnier",
    caseStudy: "cymbal",
    multi: false,
    scenario: {
      fr: "Cymbal Retail exploite un site marchand dont le trafic est multiplié par trente pendant les périodes promotionnelles. Le catalogue produit est consulté massivement en lecture et change peu dans la journée. Le panier et la commande exigent en revanche des transactions fiables. L'équipe subit chaque année des ruptures de service pendant les pics et veut supprimer ce risque sans payer la capacité de pointe toute l'année.",
      en: "Cymbal Retail runs a storefront whose traffic multiplies thirtyfold during promotional periods. The product catalog is read heavily and changes little during the day. Cart and checkout, by contrast, require reliable transactions. The team suffers service outages during peaks every year and wants to remove that risk without paying peak capacity year-round."
    },
    stem: {
      fr: "Quelle combinaison architecturale retenir ?",
      en: "Which architectural combination should be selected?"
    },
    options: [
      { fr: "Servir le catalogue via un cache et un CDN devant un service à mise à l'échelle automatique, et traiter la commande sur une base transactionnelle managée", en: "Serve the catalog through a cache and CDN in front of an autoscaling service, and process checkout on a managed transactional database" },
      { fr: "Provisionner en permanence la capacité nécessaire au pic de promotion", en: "Permanently provision the capacity required for promotional peak" },
      { fr: "Basculer l'ensemble du site, catalogue et commande, sur une base analytique unique", en: "Move the entire site, catalog and checkout, onto a single analytical database" },
      { fr: "Mettre en file d'attente les commandes et les traiter de façon différée pendant les pics", en: "Queue orders and process them asynchronously during peaks" }
    ],
    correct: [0],
    keywords: ["trafic x30 en promotion", "catalogue en lecture massive", "commande transactionnelle", "ne pas payer le pic toute l'année"],
    rationale: {
      fr: "L'énoncé distingue explicitement deux charges de nature différente, ce qui appelle deux traitements. Le catalogue, très lu et peu modifié, se prête au cache et au CDN qui absorbent l'essentiel du facteur trente. La commande, transactionnelle, reste sur une base managée cohérente. La mise à l'échelle automatique évite de payer la capacité de pointe hors promotion.",
      en: "The scenario explicitly separates two workloads of different nature, which calls for two treatments. The catalog, heavily read and rarely changed, suits cache and CDN which absorb most of the thirtyfold factor. Checkout, being transactional, stays on a consistent managed database. Autoscaling avoids paying peak capacity outside promotions."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Résout la rupture de service mais contredit frontalement l'exigence de ne pas payer la capacité de pointe toute l'année.", en: "Solves the outage but directly contradicts the requirement not to pay peak capacity year-round." },
      { fr: "Une base analytique n'est pas conçue pour des transactions de commande à faible latence. Erreur de nature de charge.", en: "An analytical database is not designed for low-latency order transactions. A workload-nature error." },
      { fr: "Différer les commandes dégrade l'expérience d'achat et le chiffre d'affaires au moment précis où il est le plus élevé. On sacrifie l'objectif métier.", en: "Deferring orders degrades purchase experience and revenue at the exact moment it peaks. It sacrifices the business objective." }
    ]
  },
  {
    id: "CS-CYM-02",
    domain: "d2",
    topic: "Cymbal Retail — analytique et personnalisation",
    caseStudy: "cymbal",
    multi: false,
    scenario: {
      fr: "Cymbal Retail veut analyser le parcours d'achat pour alimenter des recommandations. Les événements de navigation arrivent au rythme de 50 000 par seconde en pointe. Les analystes veulent interroger les données en SQL sur deux ans d'historique, et l'équipe marketing souhaite des tableaux de bord rafraîchis dans la minute.",
      en: "Cymbal Retail wants to analyze the purchase journey to feed recommendations. Navigation events arrive at 50,000 per second at peak. Analysts want to query two years of history in SQL, and marketing wants dashboards refreshed within a minute."
    },
    stem: {
      fr: "Quelle chaîne de données retenir ?",
      en: "Which data pipeline should be selected?"
    },
    options: [
      { fr: "Ingestion via Pub/Sub, traitement en flux avec Dataflow, écriture dans BigQuery interrogé par les analystes et les tableaux de bord", en: "Ingest through Pub/Sub, stream-process with Dataflow, write to BigQuery queried by analysts and dashboards" },
      { fr: "Écriture directe des événements dans Cloud SQL, avec des vues pour les analystes", en: "Write events directly into Cloud SQL, with views for analysts" },
      { fr: "Écriture des événements dans Bigtable, les analystes utilisant une API de lecture par clé", en: "Write events to Bigtable, with analysts using a key-based read API" },
      { fr: "Dépôt des événements en fichiers dans Cloud Storage, chargés dans BigQuery une fois par nuit", en: "Land events as files in Cloud Storage, loaded into BigQuery nightly" }
    ],
    correct: [0],
    keywords: ["50 000 événements par seconde", "SQL sur deux ans", "tableaux de bord à la minute"],
    rationale: {
      fr: "Trois contraintes se combinent : un débit d'ingestion élevé, une interrogation SQL analytique sur un historique long, et une fraîcheur de l'ordre de la minute. Pub/Sub absorbe le débit, Dataflow traite en flux, et BigQuery couvre à la fois l'analyse SQL sur deux ans et l'alimentation des tableaux de bord quasi temps réel.",
      en: "Three constraints combine: high ingestion throughput, analytical SQL querying over long history, and minute-level freshness. Pub/Sub absorbs the throughput, Dataflow processes the stream, and BigQuery covers both two-year SQL analysis and near-real-time dashboard feeding."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud SQL ne soutient pas 50 000 écritures par seconde et n'est pas dimensionné pour des agrégations analytiques sur deux ans d'événements.", en: "Cloud SQL cannot sustain 50,000 writes per second and is not sized for analytical aggregation over two years of events." },
      { fr: "Bigtable encaisse le débit mais n'offre pas d'interrogation SQL ad hoc : les analystes ne pourraient pas explorer librement l'historique.", en: "Bigtable handles the throughput but offers no ad hoc SQL querying: analysts could not freely explore history." },
      { fr: "Un chargement nocturne donne une fraîcheur de 24 heures, incompatible avec l'exigence d'un rafraîchissement à la minute.", en: "A nightly load yields 24-hour freshness, incompatible with the minute-level refresh requirement." }
    ]
  },

  /* ----------------------------- EHR Healthcare --------------------------- */
  {
    id: "CS-EHR-01",
    domain: "d3",
    topic: "EHR Healthcare — conformité et cloisonnement",
    caseStudy: "ehr",
    multi: false,
    scenario: {
      fr: "EHR Healthcare héberge des dossiers médicaux pour plusieurs établissements clients. Chaque établissement exige que ses données soient isolées de celles des autres, qu'aucune donnée ne puisse sortir de l'environnement, et que le client garde la maîtrise du chiffrement. Un audit de conformité annuel vérifie ces trois points, et les régulateurs demandent une traçabilité complète des accès aux données patient.",
      en: "EHR Healthcare hosts medical records for several client institutions. Each institution requires its data isolated from the others, no data able to leave the environment, and customer control over encryption. An annual compliance audit verifies these three points, and regulators require full traceability of patient data access."
    },
    stem: {
      fr: "Quelle conception répond à l'ensemble des exigences ?",
      en: "Which design satisfies all requirements?"
    },
    options: [
      { fr: "Un projet par établissement, un périmètre VPC Service Controls, des clés CMEK distinctes par client et l'activation des journaux d'accès aux données", en: "One project per institution, a VPC Service Controls perimeter, distinct CMEK keys per customer, and data access logs enabled" },
      { fr: "Un projet unique avec des jeux de données séparés et des rôles IAM par établissement", en: "A single project with separate datasets and per-institution IAM roles" },
      { fr: "Un projet par établissement, avec le chiffrement par défaut de Google et des journaux d'audit d'activité d'administration", en: "One project per institution, with Google default encryption and admin activity audit logs" },
      { fr: "Un projet unique, un périmètre VPC Service Controls global et une clé CMEK partagée", en: "A single project, a global VPC Service Controls perimeter and a shared CMEK key" }
    ],
    correct: [0],
    keywords: ["isolation entre clients", "aucune sortie de données", "maîtrise du chiffrement par le client", "traçabilité des accès patient"],
    rationale: {
      fr: "Chaque exigence appelle un mécanisme précis, et l'examen attend qu'on les distingue. L'isolation entre clients passe par la frontière de projet. L'interdiction de sortie relève de VPC Service Controls. La maîtrise du chiffrement impose des clés CMEK propres à chaque client. Enfin la traçabilité des accès aux données patient exige les journaux d'accès aux données, qui ne sont pas activés par défaut, contrairement aux journaux d'activité d'administration.",
      en: "Each requirement maps to a specific mechanism, and the exam expects them distinguished. Cross-customer isolation uses the project boundary. The no-egress requirement is VPC Service Controls. Encryption control mandates per-customer CMEK keys. Finally, patient data access traceability requires Data Access logs, which are not enabled by default, unlike Admin Activity logs."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "IAM seul ne fournit pas l'isolation forte attendue entre établissements concurrents et ne traite ni l'exfiltration ni la maîtrise des clés.", en: "IAM alone does not provide the strong isolation expected between competing institutions and addresses neither exfiltration nor key control." },
      { fr: "Le chiffrement par défaut prive le client de la maîtrise des clés, et les journaux d'activité d'administration ne tracent pas les lectures de données patient.", en: "Default encryption denies the customer key control, and Admin Activity logs do not record patient data reads." },
      { fr: "Une clé partagée annule l'isolation cryptographique entre clients, et un projet unique ne fournit pas la frontière d'isolation exigée.", en: "A shared key defeats cryptographic isolation between customers, and a single project does not provide the required isolation boundary." }
    ]
  },
  {
    id: "CS-EHR-02",
    domain: "d2",
    topic: "EHR Healthcare — connectivité hybride",
    caseStudy: "ehr",
    multi: false,
    scenario: {
      fr: "Les établissements clients d'EHR Healthcare conservent sur site certains systèmes d'imagerie qu'ils ne peuvent pas migrer. Ces systèmes doivent échanger avec la plateforme cloud de façon privée, avec une disponibilité élevée car une interruption bloque la consultation des dossiers en établissement. Le trafic reste modéré, autour de 500 Mb/s, mais il transporte des données de santé.",
      en: "EHR Healthcare's client institutions keep some on-premises imaging systems they cannot migrate. These systems must exchange with the cloud platform privately, with high availability since an interruption blocks record access at the institution. Traffic stays moderate, around 500 Mbps, but carries health data."
    },
    stem: {
      fr: "Quelle solution de connectivité recommander ?",
      en: "Which connectivity solution should be recommended?"
    },
    options: [
      { fr: "HA VPN avec deux tunnels et Cloud Router en BGP, offrant un SLA de disponibilité", en: "HA VPN with two tunnels and Cloud Router using BGP, providing an availability SLA" },
      { fr: "Un tunnel VPN classique unique, suffisant pour 500 Mb/s", en: "A single Classic VPN tunnel, sufficient for 500 Mbps" },
      { fr: "Dedicated Interconnect de 10 Gb/s avec redondance", en: "A redundant 10 Gbps Dedicated Interconnect" },
      { fr: "Exposition des API de la plateforme sur internet, protégées par authentification mutuelle TLS", en: "Expose platform APIs on the internet, protected by mutual TLS authentication" }
    ],
    correct: [0],
    keywords: ["privé", "disponibilité élevée", "500 Mb/s", "données de santé", "systèmes non migrables"],
    rationale: {
      fr: "Le débit modéré ne justifie pas un Interconnect, mais l'exigence de disponibilité élevée impose une topologie redondante : le HA VPN, avec deux tunnels et un SLA, est le point d'équilibre attendu. Le trafic reste chiffré et privé, ce qui convient au caractère sensible des données de santé.",
      en: "Moderate throughput does not justify an Interconnect, yet the high-availability requirement mandates a redundant topology: HA VPN, with two tunnels and an SLA, is the expected balance point. Traffic stays encrypted and private, suiting the sensitivity of health data."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un tunnel unique constitue un point de défaillance unique, incompatible avec l'exigence de disponibilité élevée énoncée.", en: "A single tunnel is a single point of failure, incompatible with the stated high-availability requirement." },
      { fr: "Surdimensionné d'un facteur vingt par rapport au besoin, avec un coût et un délai de mise en service disproportionnés.", en: "Oversized by a factor of twenty against the need, with disproportionate cost and provisioning lead time." },
      { fr: "Contredit l'exigence d'échange privé : le trafic transiterait par internet, ce qui est difficilement défendable devant un auditeur pour des données de santé.", en: "Contradicts the private exchange requirement: traffic would transit the internet, which is hard to defend to an auditor for health data." }
    ]
  },

  /* ------------------------- KnightMotives Automotive -------------------- */
  {
    id: "CS-KNI-01",
    domain: "d1",
    topic: "KnightMotives — télémétrie véhicule",
    caseStudy: "knightmotives",
    multi: false,
    scenario: {
      fr: "KnightMotives Automotive équipe 900 000 véhicules de capteurs qui émettent chacun une mesure toutes les cinq secondes. Les ingénieurs doivent pouvoir récupérer très rapidement la série temporelle d'un véhicule identifié, pour diagnostiquer une panne. Le volume atteint plusieurs dizaines de téraoctets par mois et la latence de lecture doit rester de l'ordre de quelques millisecondes.",
      en: "KnightMotives Automotive equips 900,000 vehicles with sensors each emitting a reading every five seconds. Engineers must very quickly retrieve the time series for an identified vehicle to diagnose a fault. Volume reaches tens of terabytes monthly and read latency must stay in the low-millisecond range."
    },
    stem: {
      fr: "Quel service de stockage retenir pour la télémétrie ?",
      en: "Which storage service should be selected for telemetry?"
    },
    options: [
      { fr: "Bigtable, avec une clé de ligne combinant identifiant de véhicule et horodatage", en: "Bigtable, with a row key combining vehicle identifier and timestamp" },
      { fr: "BigQuery, avec partitionnement par date et regroupement par véhicule", en: "BigQuery, with date partitioning and clustering by vehicle" },
      { fr: "Cloud SQL, avec un index sur l'identifiant de véhicule et l'horodatage", en: "Cloud SQL, with an index on vehicle identifier and timestamp" },
      { fr: "Firestore, un document par relevé de capteur", en: "Firestore, one document per sensor reading" }
    ],
    correct: [0],
    keywords: ["900 000 véhicules toutes les 5 s", "série temporelle par véhicule identifié", "quelques millisecondes", "dizaines de To par mois"],
    rationale: {
      fr: "Le calcul de débit donne environ 180 000 écritures par seconde, et le motif de lecture est un accès par clé sur une plage temporelle. Ces deux caractéristiques désignent Bigtable, conçu pour la série temporelle à très haut débit avec une latence de quelques millisecondes. La clé combinant véhicule et horodatage rend la lecture d'une plage contiguë et donc efficace.",
      en: "Throughput arithmetic gives roughly 180,000 writes per second, and the read pattern is key-based access over a time range. Both characteristics point to Bigtable, designed for very high-throughput time series with low-millisecond latency. A row key combining vehicle and timestamp makes range reads contiguous and therefore efficient."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "BigQuery est le bon choix pour l'analyse de flotte agrégée, mais sa latence n'est pas de quelques millisecondes sur une lecture ponctuelle. Piège fréquent : les deux services peuvent coexister, chacun sur son usage.", en: "BigQuery is right for aggregated fleet analysis, but its latency is not low-millisecond on a point lookup. Common trap: both services can coexist, each for its own purpose." },
      { fr: "Cloud SQL ne soutient pas 180 000 écritures par seconde. La limite d'écriture d'une base relationnelle mono-instance est franchie de plusieurs ordres de grandeur.", en: "Cloud SQL cannot sustain 180,000 writes per second. A single-instance relational write ceiling is exceeded by orders of magnitude." },
      { fr: "Un document par relevé produit un volume de documents ingérable et un coût par opération prohibitif à ce débit. Firestore vise l'état applicatif, pas la télémétrie de masse.", en: "One document per reading produces an unmanageable document count and prohibitive per-operation cost at this rate. Firestore targets application state, not mass telemetry." }
    ]
  },
  {
    id: "CS-KNI-02",
    domain: "d3",
    topic: "KnightMotives — IA et sécurité des modèles",
    caseStudy: "knightmotives",
    multi: false,
    scenario: {
      fr: "KnightMotives déploie un assistant conversationnel pour ses concessionnaires, appuyé sur un modèle de fondation et sur la documentation technique interne. Deux risques ont été identifiés en revue de sécurité : un utilisateur pourrait détourner le modèle par des instructions malveillantes, et l'assistant pourrait restituer à un concessionnaire des documents réservés à un autre réseau.",
      en: "KnightMotives is deploying a conversational assistant for its dealers, built on a foundation model and internal technical documentation. Two risks were identified in security review: a user could subvert the model through malicious instructions, and the assistant could surface documents restricted to another dealer network."
    },
    stem: {
      fr: "Quelle conception traite les deux risques ?",
      en: "Which design addresses both risks?"
    },
    options: [
      { fr: "Filtrer les entrées et sorties du modèle par un dispositif de protection dédié, et restreindre la récupération documentaire selon l'identité et les droits du demandeur", en: "Filter model inputs and outputs through a dedicated protection layer, and restrict document retrieval according to the requester's identity and permissions" },
      { fr: "Affiner le modèle sur l'ensemble de la documentation interne pour améliorer la pertinence des réponses", en: "Fine-tune the model on the entire internal documentation to improve answer relevance" },
      { fr: "Consigner toutes les conversations et les auditer chaque semaine", en: "Log all conversations and audit them weekly" },
      { fr: "Limiter la longueur des questions posées par les utilisateurs", en: "Limit the length of user questions" }
    ],
    correct: [0],
    keywords: ["détournement par instructions malveillantes", "cloisonnement documentaire entre réseaux", "modèle de fondation", "documentation interne"],
    rationale: {
      fr: "Les deux risques sont de nature différente et exigent deux réponses. Le détournement par instructions malveillantes relève d'un filtrage dédié des entrées et sorties du modèle. La fuite entre réseaux de concessionnaires est un problème d'autorisation dans la phase de récupération : le RAG doit filtrer les documents selon l'identité du demandeur, jamais interroger l'ensemble du corpus sans contrôle de droits.",
      en: "The two risks differ in nature and require two answers. Subversion through malicious instructions calls for dedicated input and output filtering around the model. Leakage between dealer networks is an authorization problem in the retrieval phase: RAG must filter documents by requester identity and never query the whole corpus without permission checks."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "L'affinage aggrave le second risque : les informations réservées seraient absorbées dans les poids du modèle, sans possibilité de filtrage par droits au moment de la réponse.", en: "Fine-tuning worsens the second risk: restricted information would be absorbed into model weights, with no way to filter by permission at answer time." },
      { fr: "L'audit est un contrôle de détection hebdomadaire : il constate la fuite bien après qu'elle a eu lieu, sans l'empêcher.", en: "Auditing is a weekly detective control: it records the leak long after it happened, without preventing it." },
      { fr: "La longueur d'une question n'a pas de rapport avec sa malveillance, et cette limite ne traite pas du tout le cloisonnement documentaire.", en: "Question length is unrelated to maliciousness, and this limit does not address document partitioning at all." }
    ]
  }
];

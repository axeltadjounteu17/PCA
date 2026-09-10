/* ==========================================================================
   Banque de questions — Domaine 1
   « Designing and planning a cloud solution architecture » (~25 % de l'examen)

   Questions ORIGINALES calquées sur le format et le niveau d'arbitrage réels.
   Aucune question mémorisée ou issue de l'examen : ce serait une violation de
   l'accord de confidentialité Google et un motif de révocation définitive.

   Schéma d'un item :
     id         identifiant stable
     domain     d1..d6
     topic      étiquette de révision
     caseStudy  null ou altostrat | cymbal | ehr | knightmotives
     multi      true si plusieurs réponses attendues
     scenario   contexte long (l'examen en donne toujours un)
     stem       la question
     options    4 propositions, TOUTES techniquement plausibles
     correct    index(es) de la ou des bonnes réponses
     keywords   déclencheurs à repérer dans l'énoncé
     rationale  pourquoi la bonne réponse gagne
     refute     pourquoi chaque option perd (même longueur que options)
   ========================================================================== */

window.PCA_QUESTIONS_D1 = [
  {
    id: "D1-01",
    domain: "d1",
    topic: "Exigences non fonctionnelles / RPO",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un assureur migre son moteur de tarification vers Google Cloud. Le métier impose un RPO de 5 minutes et un RTO de 30 minutes. La base actuelle est un PostgreSQL de 4 To en région unique, avec un pic de 12 000 écritures par seconde en fin de mois. Le DSI veut limiter la charge opérationnelle de l'équipe, qui compte deux DBA.",
      en: "An insurer is migrating its pricing engine to Google Cloud. The business mandates a 5-minute RPO and a 30-minute RTO. The current database is a single-region 4 TB PostgreSQL instance peaking at 12,000 writes per second at month end. The CIO wants to limit operational load on a two-DBA team."
    },
    stem: {
      fr: "Quelle architecture de données répond le mieux à ces exigences ?",
      en: "Which data architecture best meets these requirements?"
    },
    options: [
      { fr: "Cloud SQL pour PostgreSQL en configuration haute disponibilité régionale, avec réplication synchrone vers une zone secondaire et sauvegardes automatisées + PITR", en: "Cloud SQL for PostgreSQL in regional HA configuration, with synchronous replication to a secondary zone plus automated backups and PITR" },
      { fr: "Spanner en configuration multi-régionale, avec migration du schéma relationnel", en: "Spanner in a multi-region configuration, migrating the relational schema" },
      { fr: "PostgreSQL auto-géré sur Compute Engine avec réplication en flux vers une seconde région et snapshots de disque toutes les 5 minutes", en: "Self-managed PostgreSQL on Compute Engine with streaming replication to a second region and disk snapshots every 5 minutes" },
      { fr: "Cloud SQL pour PostgreSQL en zone unique, avec exports quotidiens vers Cloud Storage en classe Nearline", en: "Single-zone Cloud SQL for PostgreSQL with daily exports to Nearline Cloud Storage" }
    ],
    correct: [0],
    keywords: ["RPO 5 min", "RTO 30 min", "limiter la charge opérationnelle", "région unique"],
    rationale: {
      fr: "La HA régionale de Cloud SQL réplique de façon synchrone vers une zone secondaire : le RPO tend vers zéro, donc bien en dessous des 5 minutes, et la bascule automatique tient les 30 minutes de RTO. Le PITR couvre l'erreur logique (un DROP TABLE n'est pas un sinistre d'infrastructure). Avec deux DBA seulement, le service managé est l'arbitrage attendu.",
      en: "Cloud SQL regional HA replicates synchronously to a secondary zone, so RPO approaches zero, well inside 5 minutes, and automatic failover meets the 30-minute RTO. PITR covers logical error, since a DROP TABLE is not an infrastructure disaster. With only two DBAs, the managed service is the expected trade-off."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Sur-ingénierie. Rien n'exige une distribution mondiale ni une cohérence externe : l'énoncé décrit une base régionale. Spanner impose une refonte du schéma et un coût supérieur pour un besoin que Cloud SQL couvre. Piège classique du PCA.", en: "Over-engineering. Nothing requires global distribution or external consistency: the scenario is regional. Spanner forces schema rework and higher cost for a need Cloud SQL already covers. Classic PCA trap." },
      { fr: "Techniquement viable mais contredit la contrainte opérationnelle : patching, bascule et supervision restent à la charge de deux DBA. De plus, des snapshots de disque toutes les 5 minutes sur 4 To ne garantissent pas la cohérence transactionnelle.", en: "Technically viable but contradicts the operational constraint: patching, failover and monitoring stay with two DBAs. Also, 5-minute disk snapshots on 4 TB do not guarantee transactional consistency." },
      { fr: "Un export quotidien donne un RPO de 24 heures, soit 288 fois la cible. Élimination immédiate sur la contrainte chiffrée.", en: "Daily export yields a 24-hour RPO, 288 times the target. Immediate elimination on the stated numeric constraint." }
    ]
  },

  {
    id: "D1-02",
    domain: "d1",
    topic: "Arbitrage coût / performance",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une plateforme de e-learning exécute un traitement de transcodage vidéo par lots chaque nuit, entre 1h et 5h. Le travail est découpé en tâches indépendantes de 3 à 8 minutes, tolérantes à l'interruption grâce à un mécanisme de reprise. La facture Compute Engine représente 60 % du budget cloud et la direction financière demande une réduction substantielle sans allonger la fenêtre de traitement.",
      en: "An e-learning platform runs nightly batch video transcoding between 1am and 5am. The work is split into independent 3-to-8-minute tasks that tolerate interruption thanks to a checkpoint mechanism. Compute Engine is 60% of the cloud bill and finance wants a substantial reduction without extending the processing window."
    },
    stem: {
      fr: "Quelle approche réduit le plus le coût tout en respectant la fenêtre ?",
      en: "Which approach cuts cost the most while respecting the window?"
    },
    options: [
      { fr: "Exécuter les tâches sur des Spot VMs via un groupe d'instances géré, avec reprise sur préemption", en: "Run tasks on Spot VMs through a managed instance group, resuming on preemption" },
      { fr: "Souscrire des engagements d'usage sur trois ans pour le parc de VM actuel", en: "Purchase three-year committed use discounts for the current VM fleet" },
      { fr: "Réduire de moitié le nombre de vCPU par VM et doubler la durée du traitement", en: "Halve vCPUs per VM and double the processing duration" },
      { fr: "Migrer le traitement vers Cloud Run avec un maximum d'instances élevé", en: "Move the workload to Cloud Run with a high maximum instance count" }
    ],
    correct: [0],
    keywords: ["tolérantes à l'interruption", "tâches indépendantes", "par lots", "réduction de coût"],
    rationale: {
      fr: "Les trois signaux « lots », « tâches indépendantes » et « tolérantes à l'interruption avec reprise » désignent les Spot VMs, jusqu'à 60-91 % moins chères que le tarif à la demande. Le MIG relance les tâches préemptées, ce qui préserve la fenêtre. C'est l'arbitrage coût attendu quand la charge accepte l'interruption.",
      en: "The three signals batch, independent tasks, and interruption-tolerant with checkpointing point to Spot VMs, 60-91% cheaper than on-demand. The MIG restarts preempted tasks, protecting the window. This is the expected cost trade-off when the workload tolerates interruption."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les engagements d'usage conviennent à une charge stable 24/7. Ici la charge tourne 4 heures par nuit : s'engager sur trois ans de capacité continue paierait 20 heures d'inactivité quotidienne.", en: "Committed use discounts fit steady 24/7 workloads. Here the load runs 4 hours nightly, so a three-year commitment on continuous capacity would pay for 20 idle hours per day." },
      { fr: "Doubler la durée fait sortir le traitement de la fenêtre 1h-5h, ce que l'énoncé interdit explicitement.", en: "Doubling duration pushes the job outside the 1am-5am window, which the scenario explicitly forbids." },
      { fr: "Cloud Run est pertinent pour du HTTP à la demande, pas pour un lot long. Surtout, il ne fournit pas la remise majeure des Spot VMs : on change de plateforme sans atteindre l'objectif de coût.", en: "Cloud Run suits on-demand HTTP, not long batch jobs. More importantly it lacks the deep Spot discount, changing platform without hitting the cost goal." }
    ]
  },

  {
    id: "D1-03",
    domain: "d1",
    topic: "Résidence des données / conformité",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une banque européenne doit garantir que les données de ses clients allemands ne quittent jamais le territoire de l'Union européenne, y compris pendant les opérations de support de Google. L'audit réclame une preuve technique opposable, pas une simple consigne interne. L'équipe déploie sur plusieurs projets et craint les erreurs de configuration humaines.",
      en: "A European bank must guarantee that German customer data never leaves EU territory, including during Google support operations. The auditor requires enforceable technical proof, not an internal guideline. The team deploys across several projects and fears human misconfiguration."
    },
    stem: {
      fr: "Quelle combinaison répond à l'exigence d'audit ?",
      en: "Which combination satisfies the audit requirement?"
    },
    options: [
      { fr: "Assured Workloads pour appliquer la résidence et le contrôle du personnel d'assistance, complété par une Organization Policy de restriction des emplacements de ressources", en: "Assured Workloads to enforce residency and support-personnel controls, combined with a resource location Organization Policy" },
      { fr: "VPC Service Controls autour des projets concernés, avec un périmètre limitant les API accessibles", en: "VPC Service Controls around the relevant projects, with a perimeter restricting reachable APIs" },
      { fr: "CMEK avec des clés Cloud KMS créées dans la région europe-west3", en: "CMEK with Cloud KMS keys created in europe-west3" },
      { fr: "Une convention de nommage documentée et une revue trimestrielle des régions déployées", en: "A documented naming convention plus a quarterly review of deployed regions" }
    ],
    correct: [0],
    keywords: ["ne quittent jamais l'UE", "y compris support Google", "preuve technique opposable", "erreurs de configuration"],
    rationale: {
      fr: "Deux exigences se cumulent. La résidence géographique s'impose par l'Organization Policy `gcp.resourceLocations`, héritée et donc à l'épreuve des erreurs projet par projet. Mais le contrôle du personnel d'assistance Google relève d'Assured Workloads, qui restreint l'accès du support à du personnel situé dans la juridiction et fournit les attestations de conformité attendues par un auditeur.",
      en: "Two requirements stack. Geographic residency is enforced by the gcp.resourceLocations Organization Policy, inherited and therefore resistant to per-project mistakes. Control over Google support personnel, however, requires Assured Workloads, which restricts support access to in-jurisdiction staff and provides the compliance attestations an auditor expects."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "VPC-SC empêche l'exfiltration vers l'extérieur du périmètre, mais n'impose aucune contrainte de localisation géographique : on peut créer un bucket us-central1 dans un périmètre parfaitement configuré. Confusion fréquente entre exfiltration et résidence.", en: "VPC-SC prevents exfiltration outside the perimeter but imposes no geographic constraint: you can create a us-central1 bucket inside a perfectly configured perimeter. Common confusion between exfiltration and residency." },
      { fr: "CMEK contrôle le cycle de vie des clés, pas l'emplacement des données chiffrées. Une clé européenne peut chiffrer une donnée stockée ailleurs.", en: "CMEK governs key lifecycle, not the location of encrypted data. A European key can encrypt data stored elsewhere." },
      { fr: "Un contrôle organisationnel a posteriori ne constitue pas une preuve technique opposable et n'empêche pas l'erreur de configuration que l'énoncé redoute.", en: "A retrospective organizational control is not enforceable technical proof and does not prevent the misconfiguration the scenario fears." }
    ]
  },

  {
    id: "D1-04",
    domain: "d1",
    topic: "Patterns d'intégration",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un distributeur possède un ERP sur site qui publie des mises à jour de stock par lots toutes les heures. Le nouveau site de vente en ligne, sur Google Cloud, doit refléter le stock en quasi temps réel. L'ERP ne peut pas être modifié et supporte mal les sollicitations : plus de 5 requêtes par seconde le dégradent. Les pics de trafic du site sont imprévisibles.",
      en: "A retailer runs an on-premises ERP that publishes stock updates in hourly batches. The new Google Cloud storefront must reflect stock in near real time. The ERP cannot be modified and degrades beyond 5 requests per second. Storefront traffic peaks are unpredictable."
    },
    stem: {
      fr: "Quel pattern d'intégration retenir ?",
      en: "Which integration pattern should be adopted?"
    },
    options: [
      { fr: "Publier les changements de l'ERP dans Pub/Sub via un connecteur de capture de changements, et faire consommer les abonnés côté cloud pour alimenter un cache de lecture", en: "Publish ERP changes to Pub/Sub through a change-capture connector, with cloud-side subscribers feeding a read cache" },
      { fr: "Faire interroger l'ERP directement par le site à chaque affichage de fiche produit, via Cloud Interconnect", en: "Have the storefront query the ERP directly on every product page view over Cloud Interconnect" },
      { fr: "Répliquer l'ERP dans Cloud SQL et faire lire le site sur le réplica", en: "Replicate the ERP into Cloud SQL and have the storefront read from the replica" },
      { fr: "Conserver le lot horaire et afficher un avertissement de fraîcheur sur le site", en: "Keep the hourly batch and display a freshness warning on the storefront" }
    ],
    correct: [0],
    keywords: ["quasi temps réel", "ERP non modifiable", "5 req/s maximum", "pics imprévisibles"],
    rationale: {
      fr: "Le découplage par file est le seul pattern qui protège l'ERP fragile tout en offrant la fraîcheur demandée. Pub/Sub absorbe les pics et lisse la charge, les abonnés consomment à leur rythme, et le nombre de lecteurs du site devient indépendant de la capacité de l'ERP. C'est le principe « découpler les composants » du WAF.",
      en: "Queue-based decoupling is the only pattern that protects the fragile ERP while delivering the required freshness. Pub/Sub absorbs spikes and smooths load, subscribers consume at their own pace, and storefront read volume becomes independent of ERP capacity. This is the WAF decoupling principle."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Couplage synchrone direct sur un système qui s'effondre au-delà de 5 req/s, alors que les pics sont imprévisibles. Interconnect améliore la liaison réseau mais ne change rien à la limite de l'ERP.", en: "Direct synchronous coupling to a system that collapses beyond 5 rps, with unpredictable peaks. Interconnect improves the network link but does nothing about the ERP limit." },
      { fr: "Une réplication continue suppose d'attaquer l'ERP en lecture soutenue ou d'y installer un agent, ce que la contrainte de non-modification et la fragilité interdisent.", en: "Continuous replication implies sustained reads against the ERP or installing an agent there, which the no-modification and fragility constraints rule out." },
      { fr: "Renonce à l'exigence métier de quasi temps réel. On ne résout pas une contrainte en la documentant.", en: "Abandons the near-real-time business requirement. Documenting a constraint does not solve it." }
    ]
  },

  {
    id: "D1-05",
    domain: "d1",
    topic: "Build vs buy",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une chaîne hôtelière veut ajouter un moteur de recommandation de séjours sur son application. Elle dispose d'un historique de réservations dans BigQuery mais d'aucun profil data science en interne. Le time-to-market visé est de six semaines et le budget ne permet pas de recruter. La direction accepte une qualité de recommandation perfectible au lancement.",
      en: "A hotel chain wants to add a stay-recommendation engine to its app. It has booking history in BigQuery but no in-house data science profile. Target time to market is six weeks and the budget does not allow hiring. Leadership accepts imperfect recommendation quality at launch."
    },
    stem: {
      fr: "Quelle stratégie de disposition de charge de travail recommander ?",
      en: "Which workload disposition strategy should be recommended?"
    },
    options: [
      { fr: "Acheter la capacité : utiliser un service de recommandation managé alimenté par les données BigQuery existantes", en: "Buy the capability: use a managed recommendation service fed from existing BigQuery data" },
      { fr: "Construire un modèle personnalisé avec Vertex AI Training et un pipeline d'entraînement sur mesure", en: "Build a custom model with Vertex AI Training and a bespoke training pipeline" },
      { fr: "Construire une heuristique SQL dans BigQuery classant les séjours par popularité et saisonnalité", en: "Build a SQL heuristic in BigQuery ranking stays by popularity and seasonality" },
      { fr: "Reporter le projet jusqu'au recrutement d'une équipe data science", en: "Defer the project until a data science team is hired" }
    ],
    correct: [0],
    keywords: ["aucun profil data science", "six semaines", "pas de recrutement", "qualité perfectible acceptée"],
    rationale: {
      fr: "Le domaine 1 attend explicitement un raisonnement build / buy / modify / deprecate. Trois contraintes convergent : pas de compétence interne, délai court, budget fermé. Acheter une capacité managée qui se branche sur les données existantes est l'arbitrage cohérent, et la tolérance affichée sur la qualité initiale lève le dernier obstacle.",
      en: "Domain 1 explicitly expects build/buy/modify/deprecate reasoning. Three constraints converge: no internal skill, short deadline, closed budget. Buying a managed capability that plugs into existing data is the coherent trade-off, and the stated tolerance on initial quality removes the last objection."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Construire sur mesure exige précisément la compétence absente et dépasse largement six semaines. C'est le piège du « meilleur techniquement » contre le « meilleur sous contraintes ».", en: "Building custom demands exactly the missing skill and far exceeds six weeks. This is the classic best-technically versus best-under-constraints trap." },
      { fr: "Une heuristique de popularité n'est pas une recommandation personnalisée : elle ignore le profil de l'utilisateur et ne remplit pas le besoin métier, même si elle est rapide à livrer.", en: "A popularity heuristic is not personalized recommendation: it ignores user profile and misses the business need, even though it ships fast." },
      { fr: "Deprecate ou reporter est un choix valide dans d'autres contextes, mais ici le budget exclut le recrutement : reporter revient à annuler.", en: "Deferring is a valid choice in other contexts, but here the budget rules out hiring, so deferring equals cancelling." }
    ]
  },

  {
    id: "D1-06",
    domain: "d1",
    topic: "Haute disponibilité / bascule",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une API de paiement doit rester disponible même en cas de perte complète d'une région Google Cloud. L'objectif de disponibilité est de 99,99 % et la latence au 99e percentile doit rester sous 150 ms pour des utilisateurs répartis entre l'Europe et l'Amérique du Nord. Les données de transaction exigent une cohérence forte : un paiement ne peut jamais être vu deux fois.",
      en: "A payment API must stay available even if an entire Google Cloud region is lost. The availability target is 99.99% and p99 latency must stay under 150 ms for users across Europe and North America. Transaction data requires strong consistency: a payment must never be seen twice."
    },
    stem: {
      fr: "Quelle architecture retenir ?",
      en: "Which architecture should be selected?"
    },
    options: [
      { fr: "Backends dans plusieurs régions derrière un équilibreur de charge applicatif externe global, avec Spanner en configuration multi-régionale", en: "Backends in several regions behind a global external Application Load Balancer, with Spanner in multi-region configuration" },
      { fr: "Backends dans plusieurs régions derrière un équilibreur global, avec Cloud SQL HA et un réplica de lecture interrégional", en: "Backends in several regions behind a global load balancer, with Cloud SQL HA and a cross-region read replica" },
      { fr: "Une région active et une région passive, bascule DNS manuelle, base Cloud SQL restaurée depuis sauvegarde", en: "One active and one passive region, manual DNS failover, Cloud SQL restored from backup" },
      { fr: "Backends dans plusieurs régions avec Firestore en mode multi-régional", en: "Multi-region backends with Firestore in multi-region mode" }
    ],
    correct: [0],
    keywords: ["perte complète d'une région", "99,99 %", "p99 < 150 ms", "cohérence forte", "mondial"],
    rationale: {
      fr: "Ici la sur-ingénierie apparente est justifiée par l'énoncé, contrairement à la question D1-01. Trois exigences cumulées — survie à la perte d'une région, audience sur deux continents, cohérence forte transactionnelle — désignent Spanner multi-régional, qui offre la cohérence externe et un SLA de 99,999 %. L'équilibreur global route vers le backend le plus proche, ce qui sert la cible de latence.",
      en: "Here apparent over-engineering is justified by the scenario, unlike D1-01. Three stacked requirements, surviving regional loss, two-continent audience, and strong transactional consistency, point to multi-region Spanner, which provides external consistency and a 99.999% SLA. The global load balancer routes to the nearest backend, serving the latency target."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un réplica de lecture interrégional est asynchrone : en cas de perte de la région primaire, la promotion entraîne une perte de données et rompt la cohérence forte exigée pour un paiement.", en: "A cross-region read replica is asynchronous: on primary region loss, promotion causes data loss and breaks the strong consistency a payment requires." },
      { fr: "Bascule manuelle et restauration depuis sauvegarde sont incompatibles avec 99,99 % : le budget d'indisponibilité annuel est d'environ 52 minutes, une restauration seule le consomme.", en: "Manual failover and backup restore are incompatible with 99.99%: the annual error budget is about 52 minutes, which a restore alone consumes." },
      { fr: "Firestore multi-région est très disponible mais orienté document et pensé pour des transactions à portée limitée. Sur un moteur de paiement relationnel exigeant une cohérence externe, Spanner est le choix attendu.", en: "Multi-region Firestore is highly available but document-oriented and designed for limited-scope transactions. For a relational payment engine needing external consistency, Spanner is the expected choice." }
    ]
  },

  {
    id: "D1-07",
    domain: "d1",
    topic: "Mesures de succès / KPI",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Après la migration d'un portail client vers Cloud Run, l'équipe veut prouver au comité de direction que l'opération est un succès. Le portail sert 300 000 sessions par mois. La direction avait justifié le projet par deux arguments : réduire les incidents visibles par les clients et maîtriser le coût unitaire par session.",
      en: "After migrating a customer portal to Cloud Run, the team wants to prove success to the executive committee. The portal serves 300,000 sessions monthly. Leadership justified the project on two grounds: reducing customer-visible incidents and controlling unit cost per session."
    },
    stem: {
      fr: "Quel jeu d'indicateurs démontre le mieux l'atteinte des objectifs ?",
      en: "Which set of indicators best demonstrates the objectives were met?"
    },
    options: [
      { fr: "Un SLO de disponibilité et de latence mesuré du point de vue de l'utilisateur, associé au coût par session", en: "An availability and latency SLO measured from the user's viewpoint, paired with cost per session" },
      { fr: "Le taux d'utilisation CPU moyen des services et la facture mensuelle totale", en: "Average service CPU utilization and total monthly bill" },
      { fr: "Le nombre de déploiements par semaine et la couverture de tests", en: "Deployments per week and test coverage" },
      { fr: "Le nombre de tickets ouverts par l'équipe d'exploitation", en: "Number of tickets opened by the operations team" }
    ],
    correct: [0],
    keywords: ["incidents visibles par les clients", "coût unitaire par session", "prouver le succès"],
    rationale: {
      fr: "Les indicateurs doivent refléter les objectifs annoncés. « Incidents visibles par les clients » impose une mesure côté utilisateur, donc un SLO de disponibilité et de latence, et non une métrique d'infrastructure. « Coût unitaire » impose de normaliser la dépense par session : une facture qui monte parce que le trafic double n'est pas un échec.",
      en: "Indicators must mirror the stated objectives. Customer-visible incidents demands user-side measurement, an availability and latency SLO rather than an infrastructure metric. Unit cost demands normalizing spend per session: a bill rising because traffic doubled is not a failure."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le CPU est une métrique de ressource, pas d'expérience client : un service peut être à 30 % de CPU et renvoyer des erreurs. La facture totale ignore la variation de trafic et ne mesure donc pas le coût unitaire.", en: "CPU is a resource metric, not a customer-experience one: a service can sit at 30% CPU and still return errors. Total bill ignores traffic variation and therefore does not measure unit cost." },
      { fr: "Ce sont de bons indicateurs de vélocité d'ingénierie, mais ils ne mesurent aucun des deux objectifs invoqués devant la direction.", en: "These are sound engineering-velocity indicators but measure neither objective presented to leadership." },
      { fr: "Le volume de tickets internes est un signal indirect et ambigu : il peut baisser parce que les clients renoncent à signaler les pannes.", en: "Internal ticket volume is an indirect, ambiguous signal: it can fall because customers stop bothering to report outages." }
    ]
  },

  {
    id: "D1-08",
    domain: "d1",
    topic: "Mouvement de données / migration initiale",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un institut de recherche doit transférer 900 To d'archives scientifiques depuis son centre de données vers Cloud Storage. Le lien internet du site offre 500 Mb/s partagés avec l'activité quotidienne, qui ne doit pas être dégradée. Les données ne sont pas nécessaires en ligne avant huit semaines, mais elles sont confidentielles.",
      en: "A research institute must transfer 900 TB of scientific archives from its data center to Cloud Storage. The site internet link offers 500 Mbps shared with daily operations, which must not be degraded. The data is not needed online for eight weeks but is confidential."
    },
    stem: {
      fr: "Quelle méthode de transfert choisir ?",
      en: "Which transfer method should be chosen?"
    },
    options: [
      { fr: "Transfer Appliance : expédition physique du matériel chiffré, puis chargement dans Cloud Storage", en: "Transfer Appliance: ship encrypted physical hardware, then load into Cloud Storage" },
      { fr: "Storage Transfer Service en ligne, avec limitation de bande passante hors heures ouvrées", en: "Online Storage Transfer Service with bandwidth throttling outside business hours" },
      { fr: "gcloud storage cp en parallèle depuis plusieurs machines du centre de données", en: "Parallel gcloud storage cp from multiple data center machines" },
      { fr: "Provisionner un Dedicated Interconnect de 10 Gb/s pour la durée du transfert", en: "Provision a 10 Gbps Dedicated Interconnect for the duration of the transfer" }
    ],
    correct: [0],
    keywords: ["900 To", "500 Mb/s partagés", "ne pas dégrader l'activité", "huit semaines", "confidentiel"],
    rationale: {
      fr: "Le calcul tranche. À 500 Mb/s utilisés en totalité, 900 To demandent environ 166 jours, et il est exclu de saturer le lien. Au-delà de quelques centaines de téraoctets sur une liaison contrainte, Transfer Appliance est la réponse attendue : le matériel est chiffré au repos, ce qui couvre la confidentialité, et le délai de huit semaines laisse le temps de l'aller-retour.",
      en: "The arithmetic decides. At a fully used 500 Mbps, 900 TB needs roughly 166 days, and saturating the link is ruled out. Beyond a few hundred terabytes on a constrained link, Transfer Appliance is the expected answer: hardware is encrypted at rest, covering confidentiality, and the eight-week window accommodates the round trip."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Storage Transfer Service est l'outil correct pour un transfert en ligne, mais restreindre encore la bande passante allonge une durée déjà largement supérieure à huit semaines.", en: "Storage Transfer Service is the right online tool, but further throttling extends a duration already far beyond eight weeks." },
      { fr: "Paralléliser ne crée pas de bande passante : la limite est le lien de 500 Mb/s, et saturer celui-ci dégrade l'activité quotidienne que l'énoncé protège.", en: "Parallelism does not create bandwidth: the 500 Mbps link is the ceiling, and saturating it degrades the daily operations the scenario protects." },
      { fr: "Un Dedicated Interconnect implique un délai de mise en service de plusieurs semaines et un engagement contractuel disproportionné pour une migration unique.", en: "Dedicated Interconnect involves weeks of provisioning lead time and a contractual commitment disproportionate for a one-off migration." }
    ]
  },

  {
    id: "D1-09",
    domain: "d1",
    topic: "Observabilité dès la conception",
    caseStudy: null,
    multi: true,
    scenario: {
      fr: "Une équipe conçoit une chaîne de traitement de commandes composée de sept microservices sur GKE. En préproduction, une commande sur mille met plus de dix secondes à aboutir, sans que l'équipe parvienne à identifier le service responsable. La conception initiale n'avait pas prévu de volet observabilité.",
      en: "A team is designing an order pipeline of seven microservices on GKE. In pre-production, one order in a thousand takes over ten seconds to complete, and the team cannot identify the responsible service. The initial design had no observability workstream."
    },
    stem: {
      fr: "Quelles deux mesures permettent de localiser la latence ? (choisir deux réponses)",
      en: "Which two measures locate the latency? (choose two)"
    },
    options: [
      { fr: "Instrumenter les services avec du traçage distribué et exploiter Cloud Trace pour visualiser le chemin critique", en: "Instrument services with distributed tracing and use Cloud Trace to visualize the critical path" },
      { fr: "Propager un identifiant de corrélation dans les logs de tous les services et centraliser dans Cloud Logging", en: "Propagate a correlation ID through all service logs and centralize in Cloud Logging" },
      { fr: "Augmenter le nombre de répliques de chaque service pour réduire la latence", en: "Increase replica count for every service to reduce latency" },
      { fr: "Activer une alerte sur le CPU de chaque pod au-delà de 80 %", en: "Alert on every pod's CPU above 80%" }
    ],
    correct: [0, 1],
    keywords: ["sept microservices", "une sur mille", "identifier le service responsable"],
    rationale: {
      fr: "Le problème est un défaut de visibilité, pas de capacité. Le traçage distribué reconstitue le parcours d'une requête à travers les sept services et fait apparaître le segment lent : c'est l'outil conçu pour cette question. L'identifiant de corrélation dans les logs complète le tableau en permettant de retrouver toutes les traces d'une même commande, en particulier pour les cas rares au 99,9e percentile.",
      en: "The problem is missing visibility, not capacity. Distributed tracing reconstructs a request path across the seven services and exposes the slow segment: it is the purpose-built tool here. A correlation ID in logs completes the picture by letting you retrieve every record for one order, which matters for rare p99.9 cases."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Ajouter des répliques sans diagnostic augmente le coût et peut ne rien changer : si la lenteur vient d'un verrou en base ou d'un appel externe, la réplication n'y touche pas.", en: "Adding replicas without diagnosis raises cost and may change nothing: if slowness comes from a database lock or an external call, replication does not address it." },
      { fr: "Une alerte CPU par pod produit du bruit et ne relie pas les symptômes à une requête donnée. Le WAF recommande d'alerter sur des SLO, pas sur chaque métrique disponible.", en: "Per-pod CPU alerts create noise and do not tie symptoms to a specific request. The WAF recommends alerting on SLOs, not on every available metric." }
    ]
  },

  {
    id: "D1-10",
    domain: "d1",
    topic: "Sur-ingénierie / simplicité",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une association gère un site de gestion d'adhérents : 400 utilisateurs, tous en France, environ 50 requêtes par minute en pointe. Le trésorier signale que la facture cloud a triplé après une refonte technique menée par un prestataire, qui a livré un cluster GKE régional multi-zones, une base Spanner et un maillage de services. Les fonctionnalités sont inchangées.",
      en: "A nonprofit runs a member-management site: 400 users, all in France, about 50 requests per minute at peak. The treasurer reports the cloud bill tripled after a technical overhaul by a contractor who delivered a multi-zone regional GKE cluster, a Spanner database and a service mesh. Functionality is unchanged."
    },
    stem: {
      fr: "Quelle recommandation d'architecte formuler ?",
      en: "What architectural recommendation should be made?"
    },
    options: [
      { fr: "Revenir à une architecture proportionnée : conteneur sur Cloud Run et base Cloud SQL régionale", en: "Return to a right-sized architecture: container on Cloud Run with a regional Cloud SQL database" },
      { fr: "Conserver l'architecture et souscrire des engagements d'usage pour réduire la facture", en: "Keep the architecture and buy committed use discounts to reduce the bill" },
      { fr: "Conserver GKE mais basculer vers Autopilot et remplacer Spanner par Firestore", en: "Keep GKE but move to Autopilot and replace Spanner by Firestore" },
      { fr: "Réduire le cluster GKE à une seule zone et conserver Spanner pour la fiabilité", en: "Shrink the GKE cluster to a single zone and keep Spanner for reliability" }
    ],
    correct: [0],
    keywords: ["400 utilisateurs", "tous en France", "50 req/min", "fonctionnalités inchangées", "facture triplée"],
    rationale: {
      fr: "L'examen sanctionne la sur-ingénierie autant que le sous-dimensionnement. À cette échelle, aucun élément ne justifie Kubernetes, une base distribuée mondiale ni un maillage de services. Cloud Run couvre 50 requêtes par minute en descendant à zéro entre les pics, et Cloud SQL régional suffit à un usage national. Le pilier optimisation des coûts et le principe de simplicité convergent.",
      en: "The exam penalizes over-engineering as much as under-sizing. At this scale nothing justifies Kubernetes, a globally distributed database or a service mesh. Cloud Run handles 50 requests per minute while scaling to zero between peaks, and regional Cloud SQL is enough for national usage. The cost pillar and the simplicity principle agree."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les engagements réduisent le tarif d'une capacité qui reste inutile. On optimise le prix d'une erreur d'architecture au lieu de la corriger, et on s'y engage pour un à trois ans.", en: "Commitments cut the price of capacity that remains unnecessary. You optimize the cost of an architectural error instead of fixing it, and lock it in for one to three years." },
      { fr: "Amélioration partielle, mais Kubernetes reste injustifié pour un seul service à 50 requêtes par minute : la complexité opérationnelle demeure sans bénéfice.", en: "A partial improvement, but Kubernetes remains unjustified for a single service at 50 requests per minute: operational complexity persists without benefit." },
      { fr: "Réduire à une zone dégrade la disponibilité tout en conservant le composant le plus coûteux et le moins nécessaire. Le pire des deux mondes.", en: "Shrinking to one zone degrades availability while keeping the most expensive and least necessary component. Worst of both worlds." }
    ]
  }
];

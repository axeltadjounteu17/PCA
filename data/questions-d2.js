/* ==========================================================================
   Banque de questions — Domaine 2
   « Managing and provisioning a solution infrastructure » (~17,5 %)
   Couvre volontairement les angles morts repérés dans les documents source :
   Private Service Connect, Backup and DR Service, Database Migration Service,
   Cloud Composer, IaC / Terraform, quotas.
   ========================================================================== */

window.PCA_QUESTIONS_D2 = [
  {
    id: "D2-01",
    domain: "d2",
    topic: "Private Service Connect",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un éditeur SaaS héberge son produit dans son propre projet Google Cloud. Ses clients, également sur Google Cloud, doivent consommer l'API en privé, sans passer par internet et sans que les plages d'adresses IP des deux côtés se chevauchent. L'éditeur refuse d'exposer l'ensemble de son VPC et veut publier un point d'accès unique par client.",
      en: "A SaaS vendor hosts its product in its own Google Cloud project. Its customers, also on Google Cloud, must consume the API privately, without traversing the internet, and without IP range overlap between the two sides. The vendor refuses to expose its whole VPC and wants to publish a single access endpoint per customer."
    },
    stem: {
      fr: "Quelle solution de connectivité répond à ce besoin ?",
      en: "Which connectivity solution meets this need?"
    },
    options: [
      { fr: "Private Service Connect : l'éditeur publie un service rattaché, chaque client crée un point de terminaison dans son propre VPC", en: "Private Service Connect: the vendor publishes a service attachment and each customer creates an endpoint in their own VPC" },
      { fr: "VPC Network Peering entre le VPC de l'éditeur et celui de chaque client", en: "VPC Network Peering between the vendor VPC and each customer VPC" },
      { fr: "Shared VPC, l'éditeur devenant projet hôte et les clients des projets de service", en: "Shared VPC, with the vendor as host project and customers as service projects" },
      { fr: "HA VPN entre les deux VPC, avec des routes annoncées par Cloud Router", en: "HA VPN between both VPCs, with routes advertised by Cloud Router" }
    ],
    correct: [0],
    keywords: ["consommer en privé", "pas de chevauchement d'IP", "ne pas exposer tout le VPC", "point d'accès unique"],
    rationale: {
      fr: "Private Service Connect est conçu exactement pour le modèle producteur / consommateur de service. Le producteur publie un service rattaché, le consommateur instancie un point de terminaison avec une IP de son propre plan d'adressage : il n'y a donc aucune exigence de non-chevauchement, et seul le service publié est joignable, pas le VPC entier.",
      en: "Private Service Connect is built precisely for the service producer/consumer model. The producer publishes a service attachment, the consumer instantiates an endpoint using an IP from its own addressing plan, so there is no non-overlap requirement, and only the published service is reachable rather than the entire VPC."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le peering exige des plages d'IP non chevauchantes, ce que l'énoncé écarte, il n'est pas transitif, et il expose mutuellement les réseaux au lieu d'un seul service. Il ne passe pas non plus à l'échelle sur un grand nombre de clients.", en: "Peering requires non-overlapping IP ranges, which the scenario excludes, is non-transitive, and mutually exposes networks instead of a single service. It also does not scale to many customers." },
      { fr: "Shared VPC s'applique à des projets d'une même organisation, pas à des clients externes. Le modèle de gouvernance est inadapté à une relation éditeur / client.", en: "Shared VPC applies to projects within one organization, not external customers. The governance model does not fit a vendor/customer relationship." },
      { fr: "Un VPN fonctionne mais impose un tunnel et une gestion de routage par client, avec la même contrainte de non-chevauchement. Complexité opérationnelle élevée pour un besoin que PSC couvre nativement.", en: "A VPN works but imposes a tunnel and per-customer routing management, with the same non-overlap constraint. High operational complexity for a need PSC covers natively." }
    ]
  },

  {
    id: "D2-02",
    domain: "d2",
    topic: "Backup and DR Service",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une entreprise exploite 120 VM Compute Engine et 15 instances Cloud SQL réparties sur quatre projets. L'audit interne exige un plan de sauvegarde centralisé, avec des politiques de rétention prouvables, une restauration testable et un reporting unifié. Aujourd'hui chaque équipe gère ses propres snapshots via des scripts, avec des rétentions divergentes.",
      en: "A company operates 120 Compute Engine VMs and 15 Cloud SQL instances across four projects. Internal audit requires centralized backup planning, provable retention policies, testable restore and unified reporting. Today each team manages its own snapshots through scripts with divergent retention."
    },
    stem: {
      fr: "Quelle approche recommander ?",
      en: "Which approach should be recommended?"
    },
    options: [
      { fr: "Adopter Backup and DR Service avec des plans de sauvegarde centralisés appliqués par politique", en: "Adopt Backup and DR Service with centralized, policy-driven backup plans" },
      { fr: "Standardiser les scripts existants et les planifier via Cloud Scheduler dans chaque projet", en: "Standardize the existing scripts and schedule them with Cloud Scheduler in each project" },
      { fr: "Activer les snapshots planifiés de disque persistant et les sauvegardes automatiques Cloud SQL, projet par projet", en: "Enable scheduled persistent disk snapshots and Cloud SQL automated backups, project by project" },
      { fr: "Exporter les données vers Cloud Storage avec des règles de cycle de vie vers Archive", en: "Export data to Cloud Storage with lifecycle rules to Archive" }
    ],
    correct: [0],
    keywords: ["centralisé", "rétention prouvable", "restauration testable", "reporting unifié", "quatre projets"],
    rationale: {
      fr: "Quatre exigences convergent vers un service dédié : centralisation, politiques de rétention opposables, restauration testable et reporting transverse. Backup and DR Service couvre plusieurs types de charges depuis une console unique, applique des plans par politique et conserve un journal exploitable en audit. C'est le service que les documents de révision omettent le plus souvent.",
      en: "Four requirements converge on a purpose-built service: centralization, enforceable retention policies, testable restore and cross-project reporting. Backup and DR Service covers multiple workload types from a single console, applies policy-driven plans, and keeps an audit-usable record. It is the service most often missing from revision documents."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Maintenir des scripts reste une charge opérationnelle et ne fournit ni reporting unifié ni preuve de rétention. On industrialise le problème au lieu de le supprimer.", en: "Maintaining scripts remains operational load and provides neither unified reporting nor retention proof. It industrializes the problem instead of removing it." },
      { fr: "Ces mécanismes natifs sont corrects individuellement mais restent cloisonnés par projet et par type de ressource : ni vue centralisée, ni politique commune, ni test de restauration orchestré.", en: "These native mechanisms are individually fine but stay siloed per project and per resource type: no central view, no common policy, no orchestrated restore test." },
      { fr: "Un export vers Cloud Storage archive des données mais n'est pas une sauvegarde applicative restaurable : on ne redémarre pas une VM ni une instance Cloud SQL depuis un simple export.", en: "Exporting to Cloud Storage archives data but is not a restorable application backup: you cannot bring back a VM or a Cloud SQL instance from a plain export." }
    ]
  },

  {
    id: "D2-03",
    domain: "d2",
    topic: "Database Migration Service",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un client migre un MySQL 8 de 2 To hébergé sur site vers Cloud SQL. La fenêtre d'indisponibilité acceptée par le métier est de quinze minutes. La base subit des écritures continues pendant la journée et l'équipe ne dispose pas d'expertise en réplication MySQL.",
      en: "A customer is migrating a 2 TB on-premises MySQL 8 database to Cloud SQL. The business accepts a fifteen-minute downtime window. The database receives continuous daytime writes and the team has no MySQL replication expertise."
    },
    stem: {
      fr: "Quelle méthode de migration retenir ?",
      en: "Which migration method should be selected?"
    },
    options: [
      { fr: "Database Migration Service en migration continue, puis bascule applicative une fois le retard de réplication proche de zéro", en: "Database Migration Service in continuous mode, then application cutover once replication lag nears zero" },
      { fr: "mysqldump vers Cloud Storage, puis import dans Cloud SQL pendant une fenêtre planifiée", en: "mysqldump to Cloud Storage, then import into Cloud SQL during a planned window" },
      { fr: "Configurer manuellement une réplication binlog vers une instance Cloud SQL puis promouvoir", en: "Manually configure binlog replication to a Cloud SQL instance, then promote" },
      { fr: "Créer un snapshot du disque de la VM sur site et l'importer comme image dans Compute Engine", en: "Snapshot the on-premises VM disk and import it as a Compute Engine image" }
    ],
    correct: [0],
    keywords: ["2 To", "quinze minutes d'indisponibilité", "écritures continues", "pas d'expertise réplication"],
    rationale: {
      fr: "DMS réalise une copie initiale puis une réplication continue des changements : la bascule ne dure que le temps d'arrêter l'application et de basculer la connexion, ce qui tient dans quinze minutes indépendamment des 2 To. Le service est managé, ce qui répond à l'absence d'expertise interne en réplication.",
      en: "DMS performs an initial copy then continuously replicates changes, so cutover lasts only long enough to stop the application and switch the connection, fitting fifteen minutes regardless of the 2 TB. The service is managed, addressing the lack of in-house replication expertise."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un dump/import de 2 To dépasse très largement quinze minutes, et toutes les écritures survenues pendant l'opération seraient perdues ou à rejouer manuellement.", en: "A 2 TB dump/import far exceeds fifteen minutes, and every write during the operation would be lost or need manual replay." },
      { fr: "Techniquement possible et proche de la bonne réponse, mais contredit la contrainte d'expertise : le pilotage manuel du binlog, la gestion des erreurs et la promotion sont précisément ce que DMS automatise.", en: "Technically possible and close to the right answer, but it contradicts the expertise constraint: manual binlog handling, error management and promotion are exactly what DMS automates." },
      { fr: "Migrer la VM vers Compute Engine reproduit une base auto-gérée alors que la cible demandée est Cloud SQL. Hors sujet par rapport à l'énoncé.", en: "Migrating the VM to Compute Engine recreates a self-managed database while the stated target is Cloud SQL. Off-target for the scenario." }
    ]
  },

  {
    id: "D2-04",
    domain: "d2",
    topic: "Infrastructure as Code",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Trois équipes provisionnent des environnements de développement à la demande. Les dérives de configuration se multiplient : certains environnements n'ont pas les mêmes règles de pare-feu ni les mêmes labels de facturation. Le responsable plateforme veut garantir que tout environnement créé soit identique, revu en amont et traçable dans l'historique Git.",
      en: "Three teams provision development environments on demand. Configuration drift is spreading: some environments lack matching firewall rules or billing labels. The platform lead wants every created environment to be identical, reviewed beforehand and traceable in Git history."
    },
    stem: {
      fr: "Quelle pratique met en place cette garantie ?",
      en: "Which practice establishes that guarantee?"
    },
    options: [
      { fr: "Décrire l'environnement en Terraform, versionner les modules, et appliquer via un pipeline CI/CD après revue de la pull request", en: "Describe the environment in Terraform, version the modules, and apply through a CI/CD pipeline after pull request review" },
      { fr: "Rédiger un guide d'exploitation détaillé et former les trois équipes à la console", en: "Write a detailed runbook and train the three teams on the console" },
      { fr: "Créer une image de VM de référence et demander son usage systématique", en: "Create a golden VM image and mandate its use" },
      { fr: "Auditer chaque mois les écarts avec un script et corriger manuellement", en: "Audit drift monthly with a script and fix manually" }
    ],
    correct: [0],
    keywords: ["environnements identiques", "revus en amont", "traçable dans Git", "dérive de configuration"],
    rationale: {
      fr: "Les trois exigences — reproductibilité, revue préalable, traçabilité — définissent l'infrastructure as code associée à un pipeline. Terraform décrit l'état désiré, le dépôt Git fournit l'historique et la revue par pull request, le pipeline supprime l'écart entre l'intention et le déploiement réel.",
      en: "The three requirements, reproducibility, prior review and traceability, define infrastructure as code plus a pipeline. Terraform declares desired state, the Git repository provides history and pull request review, and the pipeline removes the gap between intent and actual deployment."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un guide repose sur la discipline humaine et n'empêche pas la dérive : c'est précisément le mode de fonctionnement actuel qui échoue.", en: "A runbook depends on human discipline and does not prevent drift: it is exactly the current failing mode." },
      { fr: "Une image de référence normalise le contenu d'une VM mais pas le réseau, les règles de pare-feu, l'IAM ni les labels de facturation cités dans l'énoncé.", en: "A golden image standardizes VM content but not the networking, firewall rules, IAM or billing labels cited in the scenario." },
      { fr: "Détecter la dérive après coup ne l'empêche pas et ajoute une charge récurrente. On traite le symptôme mensuellement au lieu de supprimer la cause.", en: "Detecting drift after the fact does not prevent it and adds recurring toil. It treats the symptom monthly instead of removing the cause." }
    ]
  },

  {
    id: "D2-05",
    domain: "d2",
    topic: "Orchestration de traitements",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un service data doit enchaîner chaque nuit onze étapes : extraction depuis Cloud SQL, dépôt dans Cloud Storage, transformation Dataflow, chargement BigQuery, contrôles qualité, puis notification. Certaines étapes dépendent de plusieurs autres, des reprises sur échec sont nécessaires, et les analystes veulent visualiser l'état de chaque exécution ainsi que rejouer une étape isolée.",
      en: "A data team must chain eleven nightly steps: extract from Cloud SQL, land in Cloud Storage, transform with Dataflow, load into BigQuery, run quality checks, then notify. Some steps depend on several others, retries are required, and analysts want to see each run's state and replay an individual step."
    },
    stem: {
      fr: "Quel service d'orchestration choisir ?",
      en: "Which orchestration service should be chosen?"
    },
    options: [
      { fr: "Cloud Composer, qui exécute des graphes de dépendances Apache Airflow avec reprise et interface de suivi", en: "Cloud Composer, running Apache Airflow dependency graphs with retries and a monitoring UI" },
      { fr: "Cloud Scheduler déclenchant successivement chaque étape à heure fixe", en: "Cloud Scheduler triggering each step at fixed times in sequence" },
      { fr: "Des tâches Cron dans un pod GKE exécutant un script séquentiel", en: "Cron jobs in a GKE pod running a sequential script" },
      { fr: "Pub/Sub, chaque étape publiant un message déclenchant la suivante", en: "Pub/Sub, with each step publishing a message that triggers the next" }
    ],
    correct: [0],
    keywords: ["onze étapes", "dépendances multiples", "reprise sur échec", "visualiser", "rejouer une étape"],
    rationale: {
      fr: "Les signaux sont explicites : graphe de dépendances non linéaire, reprise, observabilité des exécutions, rejeu ciblé. C'est la définition d'un orchestrateur de workflows, et Cloud Composer, qui est Airflow managé, fournit ces quatre capacités nativement, y compris l'interface de suivi réclamée par les analystes.",
      en: "The signals are explicit: non-linear dependency graph, retries, run observability, targeted replay. That is the definition of a workflow orchestrator, and Cloud Composer, managed Airflow, provides all four natively, including the monitoring UI the analysts want."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Cloud Scheduler déclenche à l'heure, sans notion de dépendance ni de résultat de l'étape précédente. Enchaîner par horaires estimés est fragile dès qu'une étape déborde.", en: "Cloud Scheduler fires on time with no notion of dependency or previous step outcome. Chaining by estimated clock times breaks as soon as one step overruns." },
      { fr: "Un script séquentiel ne gère pas un graphe à dépendances multiples et n'offre ni visualisation ni rejeu d'une étape isolée. La charge de maintenance retombe sur l'équipe.", en: "A sequential script cannot express a multi-dependency graph and offers neither visualization nor single-step replay. Maintenance falls back on the team." },
      { fr: "Le chaînage par messages crée une orchestration implicite, difficile à visualiser et à rejouer partiellement. Pub/Sub excelle au découplage d'événements, pas au pilotage d'un batch à dépendances.", en: "Message chaining creates implicit orchestration that is hard to visualize and partially replay. Pub/Sub excels at event decoupling, not at driving a dependency-heavy batch." }
    ]
  },

  {
    id: "D2-06",
    domain: "d2",
    topic: "Connectivité hybride",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un industriel doit relier son usine à Google Cloud pour remonter des données de production. Le besoin est de 8 Gb/s soutenus, avec une latence stable et un engagement de service contractuel, car un arrêt de la liaison stoppe la chaîne d'analyse temps réel. Le site est raccordé à un point de présence Google.",
      en: "A manufacturer must link its plant to Google Cloud to stream production data. The need is 8 Gbps sustained with stable latency and a contractual service commitment, since a link outage halts the real-time analytics chain. The site is served by a Google point of presence."
    },
    stem: {
      fr: "Quelle option de connectivité retenir ?",
      en: "Which connectivity option should be selected?"
    },
    options: [
      { fr: "Dedicated Interconnect avec redondance, pour une capacité dédiée et un SLA", en: "Dedicated Interconnect with redundancy, for dedicated capacity and an SLA" },
      { fr: "HA VPN sur internet, avec deux tunnels et Cloud Router en BGP", en: "HA VPN over the internet, with two tunnels and Cloud Router using BGP" },
      { fr: "Partner Interconnect via un fournisseur de services", en: "Partner Interconnect through a service provider" },
      { fr: "Direct Peering vers le réseau Google", en: "Direct Peering to Google's network" }
    ],
    correct: [0],
    keywords: ["8 Gb/s soutenus", "latence stable", "SLA contractuel", "raccordé à un PoP Google"],
    rationale: {
      fr: "Trois éléments désignent le Dedicated Interconnect : un débit soutenu de plusieurs gigabits, une exigence de latence stable qu'internet ne garantit pas, et la présence du site sur un point de présence Google, qui rend le raccordement direct possible. La redondance est indispensable pour obtenir le SLA.",
      en: "Three elements point to Dedicated Interconnect: multi-gigabit sustained throughput, a stable-latency requirement the internet cannot guarantee, and site presence at a Google point of presence enabling direct attachment. Redundancy is mandatory to obtain the SLA."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le HA VPN plafonne autour de quelques gigabits par tunnel et transite par internet : la latence varie et aucun engagement de bout en bout n'est offert. Insuffisant pour 8 Gb/s à latence stable.", en: "HA VPN caps around a few gigabits per tunnel and transits the internet: latency varies and no end-to-end commitment is offered. Insufficient for 8 Gbps at stable latency." },
      { fr: "Partner Interconnect est la bonne réponse quand le site n'est pas à proximité d'un PoP Google, ou pour des débits inférieurs. Ici la proximité du PoP rend le raccordement direct préférable.", en: "Partner Interconnect is right when the site is not near a Google PoP, or for lower bandwidths. Here PoP proximity makes direct attachment preferable." },
      { fr: "Le Direct Peering échange du trafic vers les services publics Google et ne fournit pas un accès privé aux ressources d'un VPC. Ce n'est pas une solution de connectivité hybride vers ses propres charges.", en: "Direct Peering exchanges traffic toward Google public services and does not provide private access to VPC resources. It is not a hybrid connectivity solution to your own workloads." }
    ]
  },

  {
    id: "D2-07",
    domain: "d2",
    topic: "Quotas et montée en charge",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une billetterie prépare une mise en vente exceptionnelle qui multipliera par quarante le trafic habituel pendant deux heures. L'application tourne sur Cloud Run derrière un équilibreur global et écrit dans Cloud SQL. L'équipe a déjà validé la montée en charge applicative en test de charge sur un environnement réduit.",
      en: "A ticketing platform is preparing an exceptional on-sale event that will multiply normal traffic forty-fold for two hours. The application runs on Cloud Run behind a global load balancer and writes to Cloud SQL. The team has already validated application scaling through load testing on a scaled-down environment."
    },
    stem: {
      fr: "Quelle action de préparation est la plus critique ?",
      en: "Which preparation action is the most critical?"
    },
    options: [
      { fr: "Vérifier et faire relever en amont les quotas concernés, et valider la capacité de connexions de Cloud SQL", en: "Review and pre-emptively raise the relevant quotas, and validate Cloud SQL connection capacity" },
      { fr: "Augmenter le nombre maximum d'instances Cloud Run et laisser l'autoscaling absorber la charge", en: "Raise the Cloud Run maximum instance count and let autoscaling absorb the load" },
      { fr: "Activer Cloud CDN devant l'équilibreur de charge", en: "Enable Cloud CDN in front of the load balancer" },
      { fr: "Passer Cloud SQL sur une machine plus puissante la veille de l'événement", en: "Move Cloud SQL to a larger machine type the day before the event" }
    ],
    correct: [0],
    keywords: ["multiplier par quarante", "deux heures", "test de charge sur environnement réduit"],
    rationale: {
      fr: "Le domaine 2 attend une vigilance sur les quotas, souvent négligée. Un test sur environnement réduit ne révèle jamais un plafond de quota, qui est une limite de projet et non d'application. Par ailleurs Cloud Run peut créer un très grand nombre d'instances qui ouvriront chacune des connexions vers Cloud SQL : la limite de connexions devient le point de rupture réel.",
      en: "Domain 2 expects quota vigilance, which is often overlooked. A scaled-down load test never reveals a quota ceiling, since that is a project limit rather than an application one. Additionally Cloud Run can create a very large number of instances each opening connections to Cloud SQL, making the connection limit the real breaking point."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Relever le maximum d'instances est nécessaire mais insuffisant, et même dangereux seul : davantage d'instances signifie davantage de connexions vers une base dont la limite n'a pas été vérifiée.", en: "Raising max instances is necessary but insufficient, and even risky alone: more instances means more connections to a database whose limit has not been checked." },
      { fr: "Le CDN aide sur le contenu cacheable, mais une mise en vente est massivement transactionnelle et personnalisée : l'essentiel du trafic n'est pas cacheable.", en: "CDN helps with cacheable content, but an on-sale event is heavily transactional and personalized: most traffic is not cacheable." },
      { fr: "Redimensionner la base est utile mais ne traite ni les quotas ni le nombre de connexions simultanées, et le faire la veille sans nouveau test de charge introduit un risque.", en: "Resizing the database helps but addresses neither quotas nor concurrent connection count, and doing it the day before without a fresh load test introduces risk." }
    ]
  }
];

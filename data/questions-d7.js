/* ==========================================================================
   Banque de questions — complément
   Couvre les services identifiés comme absents après recoupement avec le
   playbook stratégique : AlloyDB, Apigee, Sensitive Data Protection,
   Local SSD, classes de stockage, Cloud Deploy, Cloud Trace.
   Le champ domain rattache chaque item à sa section officielle.
   ========================================================================== */

window.PCA_QUESTIONS_D7 = [
  {
    id: "D7-01",
    domain: "d1",
    topic: "AlloyDB — PostgreSQL sous contrainte de performance",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une plateforme logistique exploite un PostgreSQL de 6 To sur Cloud SQL. Les requêtes de reporting, lancées sur la même base que les transactions, saturent l'instance aux heures de pointe malgré un redimensionnement déjà maximal. L'entreprise dispose de nombreuses extensions PostgreSQL et de procédures stockées qu'elle ne veut pas réécrire. Toute l'activité est européenne.",
      en: "A logistics platform runs a 6 TB PostgreSQL on Cloud SQL. Reporting queries, executed against the same database as transactions, saturate the instance at peak despite already maximal sizing. The company relies on many PostgreSQL extensions and stored procedures it does not want to rewrite. All activity is European."
    },
    stem: {
      fr: "Quelle évolution recommander ?",
      en: "Which change should be recommended?"
    },
    options: [
      { fr: "Migrer vers AlloyDB for PostgreSQL, qui conserve la compatibilité PostgreSQL et absorbe une charge mixte transactionnelle et analytique", en: "Migrate to AlloyDB for PostgreSQL, which preserves PostgreSQL compatibility and absorbs a mixed transactional and analytical workload" },
      { fr: "Migrer vers Spanner pour bénéficier de la scalabilité horizontale", en: "Migrate to Spanner to gain horizontal scalability" },
      { fr: "Migrer l'ensemble vers BigQuery et réécrire les transactions en requêtes SQL", en: "Move everything to BigQuery and rewrite transactions as SQL queries" },
      { fr: "Conserver Cloud SQL et ajouter un réplica de lecture pour les requêtes de reporting", en: "Keep Cloud SQL and add a read replica for reporting queries" }
    ],
    correct: [0],
    keywords: ["Cloud SQL déjà au maximum", "extensions et procédures à conserver", "charge mixte transactionnelle et analytique", "activité européenne uniquement"],
    rationale: {
      fr: "Trois signaux convergent vers AlloyDB : Cloud SQL a atteint sa limite, la compatibilité PostgreSQL doit être préservée, et la charge est mixte. AlloyDB est le moteur optimisé par Google pour ce cas précis, avec une compatibilité PostgreSQL complète et de bonnes performances analytiques. L'activité restant européenne, rien n'appelle une base distribuée mondialement.",
      en: "Three signals converge on AlloyDB: Cloud SQL has hit its ceiling, PostgreSQL compatibility must be preserved, and the workload is mixed. AlloyDB is Google's optimized engine for exactly this case, with full PostgreSQL compatibility and strong analytical performance. Since activity remains European, nothing calls for a globally distributed database."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Spanner impose de réécrire les extensions et les procédures stockées, ce que l'énoncé exclut, et sa valeur réside dans la distribution mondiale, inutile pour une activité européenne. Sur-ingénierie coûteuse.", en: "Spanner requires rewriting extensions and stored procedures, which the scenario excludes, and its value lies in global distribution, unnecessary for European-only activity. Costly over-engineering." },
      { fr: "BigQuery n'est pas une base transactionnelle : réécrire les transactions en requêtes analytiques est un contresens architectural.", en: "BigQuery is not a transactional database: rewriting transactions as analytical queries is an architectural contradiction." },
      { fr: "Option la plus proche et défendable, mais l'énoncé indique que le redimensionnement est déjà maximal : un réplica soulage la lecture sans lever le plafond du moteur sur la charge analytique lourde.", en: "The closest and most defensible alternative, but the scenario states sizing is already maximal: a replica offloads reads without lifting the engine's ceiling on heavy analytical load." }
    ]
  },

  {
    id: "D7-02",
    domain: "d2",
    topic: "Apigee — exposition d'API à des partenaires",
    caseStudy: "knightmotives",
    multi: false,
    scenario: {
      fr: "KnightMotives doit ouvrir ses données de diagnostic à 340 concessionnaires indépendants. Chaque concessionnaire ne doit voir que ses propres véhicules, dans la limite d'un quota d'appels mensuel contractuel. Le service souhaite mesurer l'usage par partenaire, révoquer un accès en cas de litige, et faire évoluer l'API sans casser les intégrations existantes.",
      en: "KnightMotives must open diagnostic data to 340 independent dealers. Each dealer must see only its own vehicles, within a contractual monthly call quota. The team wants to measure per-partner usage, revoke access in case of dispute, and evolve the API without breaking existing integrations."
    },
    stem: {
      fr: "Quelle solution d'exposition retenir ?",
      en: "Which exposure solution should be selected?"
    },
    options: [
      { fr: "Apigee, avec des clés par partenaire, des quotas, le versionnement de l'API et l'analytique d'usage", en: "Apigee, with per-partner keys, quotas, API versioning and usage analytics" },
      { fr: "Un équilibreur de charge global avec Cloud Armor et une règle de limitation de débit par adresse IP", en: "A global load balancer with Cloud Armor and a per-IP rate limiting rule" },
      { fr: "Private Service Connect, chaque concessionnaire créant un point de terminaison privé", en: "Private Service Connect, with each dealer creating a private endpoint" },
      { fr: "Un compte de service par concessionnaire, avec appel direct des API internes", en: "One service account per dealer, calling the internal APIs directly" }
    ],
    correct: [0],
    keywords: ["340 partenaires externes", "quota contractuel par partenaire", "mesurer l'usage", "révoquer un accès", "faire évoluer sans casser"],
    rationale: {
      fr: "Les cinq exigences décrivent une passerelle d'API : identification par partenaire, application de quotas, analytique d'usage, révocation et gestion de versions. Apigee est le service dédié à la gouvernance d'API exposées à des tiers, ce qui est exactement le contexte d'un réseau de concessionnaires indépendants.",
      en: "The five requirements describe an API gateway: per-partner identification, quota enforcement, usage analytics, revocation and version management. Apigee is the service dedicated to governing APIs exposed to third parties, which is exactly the context of an independent dealer network."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "La limitation par adresse IP ne permet pas d'appliquer un quota contractuel par partenaire, dont les IP varient, et n'offre ni versionnement ni analytique par partenaire.", en: "Per-IP rate limiting cannot enforce a contractual per-partner quota, since dealer IPs vary, and offers neither versioning nor per-partner analytics." },
      { fr: "PSC établit une connectivité privée mais ne gère ni quotas, ni clés, ni versionnement, ni analytique. Le déployer chez 340 partenaires indépendants serait par ailleurs très lourd.", en: "PSC establishes private connectivity but manages no quotas, keys, versioning or analytics. Rolling it out to 340 independent partners would also be very heavy." },
      { fr: "Distribuer des identités internes à des tiers expose directement les API internes et ne fournit aucun des contrôles contractuels demandés.", en: "Distributing internal identities to third parties directly exposes internal APIs and provides none of the required contractual controls." }
    ]
  },

  {
    id: "D7-03",
    domain: "d3",
    topic: "Sensitive Data Protection",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une compagnie d'assurance ingère chaque jour des milliers de courriers clients numérisés et convertis en texte, puis les stocke dans BigQuery pour analyse. Ces textes contiennent de façon imprévisible des numéros de carte bancaire et des données de santé. L'équipe conformité exige que ces éléments n'atteignent jamais l'entrepôt analytique, tout en conservant l'exploitabilité statistique des documents.",
      en: "An insurance company ingests thousands of scanned customer letters daily, converted to text, then stores them in BigQuery for analysis. These texts unpredictably contain payment card numbers and health data. The compliance team requires those elements never reach the analytical warehouse, while keeping the documents statistically usable."
    },
    stem: {
      fr: "Quelle solution mettre en place ?",
      en: "Which solution should be implemented?"
    },
    options: [
      { fr: "Insérer Sensitive Data Protection dans la chaîne d'ingestion pour détecter et masquer les données sensibles avant l'écriture", en: "Insert Sensitive Data Protection into the ingestion pipeline to detect and mask sensitive data before writing" },
      { fr: "Chiffrer la table BigQuery avec une clé CMEK et restreindre l'accès à la clé", en: "Encrypt the BigQuery table with a CMEK key and restrict key access" },
      { fr: "Établir un périmètre VPC Service Controls autour du projet analytique", en: "Establish a VPC Service Controls perimeter around the analytics project" },
      { fr: "Appliquer des contrôles d'accès au niveau des colonnes de la table BigQuery", en: "Apply column-level access controls on the BigQuery table" }
    ],
    correct: [0],
    keywords: ["données sensibles imprévisibles dans du texte libre", "ne doivent jamais atteindre l'entrepôt", "conserver l'exploitabilité statistique"],
    rationale: {
      fr: "L'exigence porte sur le contenu et non sur le périmètre : il faut identifier des éléments sensibles noyés dans du texte libre, donc imprévisibles en position. Sensitive Data Protection est le service de découverte et de masquage conçu pour cela, et le masquage préserve la valeur analytique du reste du document. Placé avant l'écriture, il garantit que la donnée sensible n'entre jamais dans l'entrepôt.",
      en: "The requirement concerns content rather than perimeter: sensitive elements must be identified inside free text, hence unpredictable in position. Sensitive Data Protection is the discovery and masking service built for this, and masking preserves the analytical value of the remaining document. Placed before the write, it guarantees sensitive data never enters the warehouse."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le chiffrement protège la donnée au repos mais ne l'empêche pas d'entrer dans l'entrepôt : elle serait déchiffrée de façon transparente pour toute identité autorisée à lire la table.", en: "Encryption protects data at rest but does not prevent it entering the warehouse: it would decrypt transparently for any identity allowed to read the table." },
      { fr: "VPC-SC empêche la donnée de sortir du périmètre, alors que l'exigence est qu'elle n'y entre pas. Confusion entre exfiltration et filtrage de contenu.", en: "VPC-SC prevents data leaving the perimeter, whereas the requirement is that it never enters. Confusion between exfiltration and content filtering." },
      { fr: "Les contrôles par colonne supposent que la donnée sensible occupe une colonne identifiée. Ici elle est noyée dans du texte libre, à une position imprévisible.", en: "Column-level controls assume sensitive data occupies an identified column. Here it is buried in free text at an unpredictable position." }
    ]
  },

  {
    id: "D7-04",
    domain: "d2",
    topic: "Local SSD — le piège de la persistance",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une équipe de calcul scientifique demande le stockage offrant le débit le plus élevé possible pour un espace de travail temporaire pendant des simulations. Chaque simulation dure quatre heures, écrit massivement des fichiers intermédiaires, puis ne conserve qu'un résultat final de quelques mégaoctets, qui doit être durablement archivé.",
      en: "A scientific computing team asks for the highest possible throughput storage for a temporary workspace during simulations. Each simulation runs four hours, writes intermediate files heavily, then keeps only a final result of a few megabytes, which must be durably archived."
    },
    stem: {
      fr: "Quelle configuration de stockage recommander ?",
      en: "Which storage configuration should be recommended?"
    },
    options: [
      { fr: "Local SSD pour l'espace de travail temporaire, et écriture du résultat final dans Cloud Storage", en: "Local SSD for the temporary workspace, writing the final result to Cloud Storage" },
      { fr: "Persistent Disk SSD pour l'espace de travail, conservé entre les simulations", en: "Persistent Disk SSD for the workspace, retained between simulations" },
      { fr: "Filestore pour disposer d'un espace partagé performant entre les nœuds", en: "Filestore to provide a high-performance shared space across nodes" },
      { fr: "Cloud Storage monté comme système de fichiers pour l'ensemble des écritures intermédiaires", en: "Cloud Storage mounted as a filesystem for all intermediate writes" }
    ],
    correct: [0],
    keywords: ["débit le plus élevé possible", "espace de travail temporaire", "résultat final à archiver durablement"],
    rationale: {
      fr: "Le Local SSD offre le débit le plus élevé et sa limite majeure, la perte des données à l'arrêt de la VM, est ici sans conséquence puisque l'espace est explicitement temporaire. Le point à ne pas manquer est que le résultat final, lui, doit être écrit ailleurs : Cloud Storage assure la durabilité. C'est cette combinaison que l'examen attend.",
      en: "Local SSD offers the highest throughput and its major limitation, data loss when the VM stops, is inconsequential here since the workspace is explicitly temporary. The point not to miss is that the final result must be written elsewhere: Cloud Storage provides durability. The exam expects this combination."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le Persistent Disk SSD est durable mais n'atteint pas le débit du Local SSD, et conserver un espace de travail entre des simulations qui n'en ont pas besoin ajoute un coût inutile.", en: "Persistent Disk SSD is durable but does not match Local SSD throughput, and retaining a workspace between simulations that do not need it adds unnecessary cost." },
      { fr: "Filestore répond à un besoin d'accès concurrent partagé, que l'énoncé ne mentionne pas, et son débit reste inférieur à celui d'un SSD local attaché.", en: "Filestore addresses a shared concurrent access need the scenario does not mention, and its throughput remains below a locally attached SSD." },
      { fr: "Le stockage objet n'est pas adapté à des écritures intermédiaires intensives : la latence par opération pénaliserait fortement la simulation.", en: "Object storage is unsuited to intensive intermediate writes: per-operation latency would heavily penalize the simulation." }
    ]
  },

  {
    id: "D7-05",
    domain: "d5",
    topic: "Cloud Deploy et retour arrière automatisé",
    caseStudy: null,
    multi: true,
    scenario: {
      fr: "Une équipe veut industrialiser la promotion de ses versions entre les environnements de développement, de recette et de production sur GKE. Elle exige une exposition progressive du trafic en production, un retour arrière déclenché automatiquement si le taux d'erreur dépasse le seuil du SLO, et une trace de qui a approuvé chaque promotion.",
      en: "A team wants to industrialize release promotion across development, staging and production environments on GKE. It requires progressive traffic exposure in production, automatic rollback if the error rate exceeds the SLO threshold, and a record of who approved each promotion."
    },
    stem: {
      fr: "Quels deux éléments sont indispensables à cette chaîne ? (choisir deux réponses)",
      en: "Which two elements are indispensable to this pipeline? (choose two)"
    },
    options: [
      { fr: "Un pipeline de livraison gérant la promotion entre environnements avec approbation explicite", en: "A delivery pipeline managing promotion across environments with explicit approval" },
      { fr: "Des SLO instrumentés et des alertes associées, servant de critère de décision au retour arrière", en: "Instrumented SLOs with associated alerts, serving as the rollback decision criterion" },
      { fr: "Un cluster GKE distinct par version déployée", en: "A separate GKE cluster per deployed version" },
      { fr: "Une fenêtre de déploiement hebdomadaire fixe pour regrouper les changements", en: "A fixed weekly deployment window to batch changes together" }
    ],
    correct: [0, 1],
    keywords: ["promotion entre environnements", "exposition progressive", "retour arrière automatique sur seuil de SLO", "trace des approbations"],
    rationale: {
      fr: "Deux briques sont nécessaires et complémentaires. Le pipeline de livraison porte la promotion entre environnements, l'exposition progressive et la trace des approbations. Mais un retour arrière automatique exige un critère mesurable : sans SLO instrumenté ni alerte, aucun mécanisme ne peut décider objectivement de revenir en arrière. C'est le lien entre livraison et observabilité que l'examen cherche à vérifier.",
      en: "Two complementary building blocks are required. The delivery pipeline carries promotion across environments, progressive exposure and the approval record. But automatic rollback demands a measurable criterion: without instrumented SLOs and alerts, no mechanism can objectively decide to roll back. This link between delivery and observability is what the exam probes."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Un cluster par version multiplie le coût et la charge opérationnelle. L'exposition progressive se gère par répartition du trafic à l'intérieur d'un même cluster.", en: "A cluster per version multiplies cost and operational load. Progressive exposure is handled by traffic splitting within a single cluster." },
      { fr: "Regrouper les changements dans une fenêtre hebdomadaire augmente la taille des lots, donc le risque par déploiement. C'est l'inverse de ce que recherche une livraison progressive.", en: "Batching changes into a weekly window increases batch size and therefore per-deployment risk. That is the opposite of what progressive delivery seeks." }
    ]
  },

  {
    id: "D7-06",
    domain: "d4",
    topic: "Classes de stockage et fréquence d'accès",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un service juridique conserve des dossiers clôturés qui doivent rester accessibles pendant dix ans. Les statistiques d'accès montrent qu'un dossier clôturé est consulté en moyenne une fois tous les huit mois, généralement lors d'une demande contradictoire, avec une tolérance de quelques heures pour la restitution. Le volume est de 60 To et croît de 8 To par an.",
      en: "A legal department retains closed case files that must remain accessible for ten years. Access statistics show a closed file is read on average once every eight months, typically during a dispute, with a tolerance of several hours for retrieval. Volume is 60 TB growing by 8 TB per year."
    },
    stem: {
      fr: "Quelle classe de stockage retenir pour ces dossiers clôturés ?",
      en: "Which storage class should be selected for these closed files?"
    },
    options: [
      { fr: "Archive, dont le modèle correspond à un accès de l'ordre d'une fois par an", en: "Archive, whose model matches access on the order of once per year" },
      { fr: "Coldline, dont le modèle correspond à un accès trimestriel", en: "Coldline, whose model matches quarterly access" },
      { fr: "Nearline, dont le modèle correspond à un accès mensuel", en: "Nearline, whose model matches monthly access" },
      { fr: "Standard, pour garantir la disponibilité immédiate en cas de contentieux", en: "Standard, to guarantee immediate availability in case of dispute" }
    ],
    correct: [0],
    keywords: ["une fois tous les huit mois", "tolérance de quelques heures", "conservation dix ans", "60 To"],
    rationale: {
      fr: "Le raisonnement est arithmétique. Une consultation tous les huit mois correspond à moins d'un accès par an, soit le profil de la classe Archive. La tolérance de plusieurs heures pour la restitution lève le seul obstacle qui aurait pu écarter cette classe. Sur 60 To croissant de 8 To par an, l'écart de coût avec les classes plus chaudes est déterminant.",
      en: "The reasoning is arithmetic. A read every eight months means fewer than one access per year, which is the Archive class profile. The several-hour retrieval tolerance removes the only obstacle that could have ruled out this class. Across 60 TB growing by 8 TB yearly, the cost gap against warmer classes is decisive."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Coldline viserait un accès trimestriel, soit environ trois fois plus fréquent que l'usage constaté. Le coût de stockage serait supérieur sans bénéfice, la tolérance de restitution étant déjà satisfaite.", en: "Coldline targets quarterly access, roughly three times more frequent than observed usage. Storage cost would be higher without benefit, since the retrieval tolerance is already satisfied." },
      { fr: "Nearline correspond à un accès mensuel, très loin du profil décrit. Écart de coût injustifié.", en: "Nearline matches monthly access, far from the described profile. An unjustified cost gap." },
      { fr: "L'énoncé accorde explicitement plusieurs heures pour la restitution : la disponibilité immédiate n'est pas exigée, et Standard est la classe la plus coûteuse.", en: "The scenario explicitly grants several hours for retrieval: immediate availability is not required, and Standard is the most expensive class." }
    ]
  }
];

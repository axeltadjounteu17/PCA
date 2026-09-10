/* ==========================================================================
   Banque de questions — Domaine 4
   « Analyzing and optimizing technical and business processes » (~15 %)
   Migration 4R, optimisation des coûts, continuité d'activité, SDLC.
   ========================================================================== */

window.PCA_QUESTIONS_D4 = [
  {
    id: "D4-01",
    domain: "d4",
    topic: "Stratégie de migration 4R",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un groupe doit quitter son centre de données dans neuf mois, bail non renouvelable. Le parc compte 220 applications, dont une quarantaine développées en interne et le reste acheté sur étagère. Une application de facturation critique repose sur un système d'exploitation en fin de support et personne dans l'équipe n'en maîtrise le code. La priorité affichée est de tenir la date.",
      en: "A group must vacate its data center in nine months under a non-renewable lease. The estate holds 220 applications, about forty developed in house and the rest off the shelf. A critical billing application runs on an end-of-support operating system and nobody on the team understands its code. The stated priority is meeting the date."
    },
    stem: {
      fr: "Quelle stratégie globale recommander pour le parc ?",
      en: "Which overall strategy should be recommended for the estate?"
    },
    options: [
      { fr: "Rehost en priorité pour tenir l'échéance, puis moderniser par vagues une fois la sortie du centre de données sécurisée", en: "Rehost first to meet the deadline, then modernize in waves once data center exit is secured" },
      { fr: "Refactor l'ensemble du parc vers des services managés pour maximiser les bénéfices du cloud", en: "Refactor the whole estate onto managed services to maximize cloud benefits" },
      { fr: "Repurchase systématiquement en remplaçant chaque application par une solution SaaS équivalente", en: "Repurchase systematically, replacing each application with an equivalent SaaS solution" },
      { fr: "Retain les applications critiques sur site et migrer uniquement les applications secondaires", en: "Retain critical applications on premises and migrate only secondary applications" }
    ],
    correct: [0],
    keywords: ["neuf mois", "bail non renouvelable", "220 applications", "tenir la date", "code non maîtrisé"],
    rationale: {
      fr: "La contrainte dominante est une échéance immuable sur un parc volumineux. Le rehost, ou lift-and-shift, est la voie la plus rapide et la moins risquée pour évacuer le centre de données, puis la modernisation se fait ensuite sans pression calendaire. L'examen valorise cette séquence : d'abord respecter la contrainte non négociable, ensuite optimiser.",
      en: "The dominant constraint is an immovable deadline over a large estate. Rehost, or lift-and-shift, is the fastest and lowest-risk path out of the data center, with modernization following afterwards free of calendar pressure. The exam rewards this sequence: satisfy the non-negotiable constraint first, optimize second."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Refactoriser 220 applications en neuf mois est irréaliste, en particulier celle dont personne ne maîtrise le code. On optimise la cible au prix de l'échéance, qui est justement la contrainte impérative.", en: "Refactoring 220 applications in nine months is unrealistic, especially the one nobody understands. It optimizes the target at the expense of the deadline, which is the hard constraint." },
      { fr: "Le repurchase convient à certaines applications sur étagère mais impose une reprise de données et une reconduite des processus métier sur chaque cas. Le généraliser à 220 applications en neuf mois est intenable.", en: "Repurchase suits some off-the-shelf applications but forces data migration and business process rework case by case. Generalizing it to 220 applications in nine months is untenable." },
      { fr: "Retain suppose de conserver un site : impossible ici, le bail n'est pas renouvelable. L'option contredit la contrainte de départ.", en: "Retain assumes keeping a site, which is impossible here since the lease cannot be renewed. The option contradicts the founding constraint." }
    ]
  },

  {
    id: "D4-02",
    domain: "d4",
    topic: "Optimisation des coûts de stockage",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une plateforme d'imagerie médicale conserve 400 To d'examens dans Cloud Storage en classe Standard. L'analyse des accès montre que 92 % des objets ne sont plus consultés après 45 jours, mais la réglementation impose une conservation de dix ans et un accès possible sous 24 heures en cas de contentieux. Le coût de stockage devient le premier poste de dépense.",
      en: "A medical imaging platform keeps 400 TB of studies in Standard class Cloud Storage. Access analysis shows 92% of objects are never read after 45 days, yet regulation mandates ten-year retention with retrieval possible within 24 hours in case of litigation. Storage cost has become the largest expense line."
    },
    stem: {
      fr: "Quelle optimisation appliquer ?",
      en: "Which optimization should be applied?"
    },
    options: [
      { fr: "Une règle de cycle de vie faisant transiter les objets vers Nearline puis Coldline et Archive selon leur âge", en: "A lifecycle rule transitioning objects to Nearline then Coldline and Archive as they age" },
      { fr: "Supprimer les objets non consultés depuis 45 jours", en: "Delete objects not accessed in 45 days" },
      { fr: "Basculer l'intégralité du bucket en classe Archive immédiatement", en: "Switch the entire bucket to Archive class immediately" },
      { fr: "Activer la classe Autoclass et conserver la classe Standard comme point d'entrée", en: "Enable Autoclass and keep Standard as the entry class" }
    ],
    correct: [0],
    keywords: ["92 % inactifs après 45 jours", "conservation dix ans", "accès sous 24 heures", "coût dominant"],
    rationale: {
      fr: "Le profil est net : un accès concentré sur les premières semaines puis une conservation longue à froid. Une règle de cycle de vie par paliers aligne le coût sur l'usage réel, et la classe Archive reste compatible avec un délai de restitution de 24 heures. La rétention réglementaire de dix ans est préservée puisqu'on déclasse sans supprimer.",
      en: "The profile is clear: access concentrated in the first weeks then long cold retention. A tiered lifecycle rule aligns cost with actual usage, and the Archive class remains compatible with a 24-hour retrieval window. The ten-year regulatory retention is preserved since objects are downgraded, not deleted."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Violation directe de l'obligation de conservation de dix ans. L'inactivité n'autorise pas la suppression quand la loi impose la rétention.", en: "Direct violation of the ten-year retention obligation. Inactivity does not permit deletion when law mandates retention." },
      { fr: "Les 8 % d'objets encore consultés subiraient des frais de récupération et une latence de restitution à chaque lecture, ce qui peut annuler l'économie. Le déclassement doit suivre l'âge, pas s'appliquer d'un bloc.", en: "The 8% still being read would incur retrieval fees and restore latency on every access, potentially cancelling the savings. Downgrading must follow age rather than apply wholesale." },
      { fr: "Autoclass est une option défendable et proche de la bonne réponse, mais le profil d'accès est ici parfaitement connu et stable. Une règle explicite est plus prévisible et moins coûteuse qu'une gestion automatique facturée par objet.", en: "Autoclass is defensible and close to correct, but the access profile here is precisely known and stable. An explicit rule is more predictable and cheaper than automatic management billed per object." }
    ]
  },

  {
    id: "D4-03",
    domain: "d4",
    topic: "Continuité d'activité / niveau de DR",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un site de réservation en ligne réalise 80 % de son chiffre d'affaires annuel sur six semaines. Hors saison, une indisponibilité de quatre heures est tolérable. En pleine saison, le métier chiffre la perte à 40 000 euros par heure et n'accepte pas plus de quinze minutes d'interruption. Le budget de continuité est contraint.",
      en: "An online booking site earns 80% of annual revenue over six weeks. Off season, a four-hour outage is tolerable. In peak season the business values loss at 40,000 euros per hour and accepts no more than fifteen minutes of interruption. The continuity budget is constrained."
    },
    stem: {
      fr: "Quelle approche de reprise après sinistre recommander ?",
      en: "Which disaster recovery approach should be recommended?"
    },
    options: [
      { fr: "Adapter le niveau de DR à la saison : warm standby pendant les six semaines critiques, sauvegarde et restauration le reste de l'année", en: "Match the DR tier to the season: warm standby during the six critical weeks, backup and restore for the rest of the year" },
      { fr: "Maintenir une architecture active/active multi-régionale toute l'année", en: "Maintain an active/active multi-region architecture all year" },
      { fr: "Retenir la sauvegarde et restauration toute l'année, en accélérant la procédure de restauration", en: "Use backup and restore all year, speeding up the restore procedure" },
      { fr: "Maintenir un pilote réduit toute l'année et le dimensionner à la hausse en saison", en: "Keep a pilot light all year and scale it up in season" }
    ],
    correct: [0],
    keywords: ["deux RTO distincts", "quinze minutes en saison", "quatre heures hors saison", "budget contraint"],
    rationale: {
      fr: "L'énoncé fournit deux RTO différents selon la période, ce qui est le signal d'une stratégie modulée. Payer une architecture à quinze minutes de RTO pendant les 46 semaines où quatre heures suffisent gaspille le budget contraint. Le warm standby saisonnier fait correspondre la dépense au risque réel, ce qui satisfait à la fois le pilier fiabilité et le pilier coût.",
      en: "The scenario supplies two different RTOs by period, which signals a modulated strategy. Paying for a fifteen-minute RTO architecture during the 46 weeks when four hours suffices wastes the constrained budget. Seasonal warm standby matches spend to actual risk, satisfying both the reliability and cost pillars."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "L'active/active tient le RTO mais coûte le maximum pendant les 46 semaines où l'exigence est vingt fois plus faible. Incompatible avec le budget contraint mentionné.", en: "Active/active meets the RTO but costs the most during the 46 weeks when the requirement is twenty times looser. Incompatible with the stated budget constraint." },
      { fr: "Une restauration complète tient difficilement en quinze minutes, et l'échec en pleine saison coûterait 40 000 euros par heure. Le risque financier dépasse largement l'économie réalisée.", en: "A full restore hardly fits fifteen minutes, and failing in peak season would cost 40,000 euros per hour. The financial risk far exceeds the savings." },
      { fr: "Option intermédiaire crédible, mais un pilote réduit demande une montée en charge au moment du sinistre, ce qui tient mal quinze minutes. Le maintenir toute l'année coûte aussi plus que nécessaire hors saison.", en: "A credible middle option, but a pilot light requires scale-up at disaster time, which fits fifteen minutes poorly. Keeping it year-round also costs more than needed off season." }
    ]
  },

  {
    id: "D4-04",
    domain: "d4",
    topic: "Attribution des coûts",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une direction financière ne parvient pas à refacturer la dépense cloud aux six unités opérationnelles. Toutes les charges cohabitent dans quatre projets partagés et les ressources ne portent aucune métadonnée. Le directeur financier veut une répartition mensuelle fiable et une responsabilisation des équipes sur leur consommation.",
      en: "A finance department cannot charge cloud spend back to six business units. All workloads share four projects and resources carry no metadata. The CFO wants reliable monthly allocation and teams held accountable for their consumption."
    },
    stem: {
      fr: "Quelle démarche mettre en place ?",
      en: "Which approach should be established?"
    },
    options: [
      { fr: "Imposer une taxonomie de libellés appliquée par politique, exporter la facturation vers BigQuery et publier des tableaux de bord par unité", en: "Enforce a label taxonomy by policy, export billing to BigQuery and publish per-unit dashboards" },
      { fr: "Créer un budget avec alertes sur chacun des quatre projets existants", en: "Create a budget with alerts on each of the four existing projects" },
      { fr: "Répartir la facture mensuelle au prorata de l'effectif de chaque unité", en: "Allocate the monthly bill pro rata to each unit's headcount" },
      { fr: "Demander à chaque équipe de déclarer sa consommation estimée chaque mois", en: "Ask each team to self-report estimated consumption monthly" }
    ],
    correct: [0],
    keywords: ["refacturer aux six unités", "aucune métadonnée", "répartition fiable", "responsabilisation"],
    rationale: {
      fr: "L'attribution des coûts exige une donnée d'imputation portée par la ressource, donc des libellés normalisés et appliqués de façon contraignante. L'export de la facturation vers BigQuery permet ensuite l'analyse fine et la restitution par unité, ce qui crée la responsabilisation demandée. Sans métadonnée, aucun outil ne peut inventer l'imputation.",
      en: "Cost attribution requires an allocation attribute carried by the resource, meaning standardized labels applied through enforcement. Exporting billing to BigQuery then enables granular analysis and per-unit reporting, which creates the requested accountability. Without metadata, no tool can invent the allocation."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les budgets alertent sur un dépassement mais ne répartissent rien : quatre projets partagés resteront quatre agrégats indistincts pour six unités.", en: "Budgets alert on overruns but allocate nothing: four shared projects remain four indistinguishable aggregates for six units." },
      { fr: "Une clé de répartition par effectif est arbitraire et déconnectée de l'usage réel. Elle décourage l'optimisation puisque réduire sa consommation ne réduit pas sa facture.", en: "A headcount allocation key is arbitrary and disconnected from real usage. It discourages optimization since cutting consumption does not cut your charge." },
      { fr: "L'auto-déclaration n'est ni fiable ni vérifiable, alors que la donnée de facturation existe déjà de façon objective.", en: "Self-reporting is neither reliable nor verifiable, while objective billing data already exists." }
    ]
  },

  {
    id: "D4-05",
    domain: "d4",
    topic: "Amélioration du cycle de développement",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une équipe livre en production une fois par trimestre. Chaque mise en production dure une nuit entière, mobilise huit personnes et échoue une fois sur trois, imposant un retour arrière manuel. La direction veut réduire le délai de mise sur le marché sans dégrader la stabilité, que l'équipe invoque pour justifier la cadence actuelle.",
      en: "A team releases to production once per quarter. Each release takes a full night, mobilizes eight people and fails one time in three, forcing a manual rollback. Leadership wants shorter time to market without degrading stability, which the team cites to justify the current cadence."
    },
    stem: {
      fr: "Quelle évolution du processus recommander ?",
      en: "Which process change should be recommended?"
    },
    options: [
      { fr: "Automatiser la chaîne de livraison et livrer de petits lots fréquents avec déploiement progressif et retour arrière automatisé", en: "Automate the delivery pipeline and ship small frequent batches with progressive rollout and automated rollback" },
      { fr: "Conserver la cadence trimestrielle et renforcer la phase de test manuel avant chaque livraison", en: "Keep the quarterly cadence and strengthen manual testing before each release" },
      { fr: "Doubler la taille de l'équipe mobilisée les nuits de mise en production", en: "Double the team mobilized on release nights" },
      { fr: "Figer les livraisons pendant les périodes sensibles et regrouper les changements", en: "Freeze releases during sensitive periods and batch changes together" }
    ],
    correct: [0],
    keywords: ["une fois par trimestre", "échoue une fois sur trois", "retour arrière manuel", "réduire le délai sans dégrader la stabilité"],
    rationale: {
      fr: "L'intuition de l'équipe est inversée : ce sont les gros lots trimestriels qui produisent l'instabilité, car ils accumulent un volume de changement dont l'échec devient difficile à diagnostiquer. Des lots petits et fréquents, associés à un déploiement progressif et à un retour arrière automatique, réduisent simultanément le délai et le risque. C'est le cœur du pilier excellence opérationnelle.",
      en: "The team's intuition is inverted: large quarterly batches cause the instability, since they accumulate a volume of change whose failure becomes hard to diagnose. Small frequent batches with progressive rollout and automated rollback reduce lead time and risk at the same time. This is the core of the operational excellence pillar."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Renforcer le test manuel allonge encore le cycle et laisse intacte la cause racine, à savoir la taille des lots et l'absence d'automatisation.", en: "Strengthening manual testing lengthens the cycle further and leaves the root cause untouched, namely batch size and lack of automation." },
      { fr: "Ajouter des personnes à une opération manuelle risquée augmente le coût et la coordination sans réduire le taux d'échec d'une sur trois.", en: "Adding people to a risky manual operation raises cost and coordination without reducing the one-in-three failure rate." },
      { fr: "Le gel des livraisons grossit les lots suivants, donc aggrave le problème tout en dégradant le délai de mise sur le marché.", en: "Release freezes enlarge subsequent batches, worsening the problem while degrading time to market." }
    ]
  },

  {
    id: "D4-06",
    domain: "d4",
    topic: "Optimisation du calcul",
    caseStudy: null,
    multi: true,
    scenario: {
      fr: "Un audit de coûts révèle que les environnements de développement et de recette représentent 45 % de la dépense Compute Engine. Ces environnements tournent 24 heures sur 24 alors que les équipes travaillent en heures ouvrées, et le dimensionnement des VM a été copié depuis la production, avec une utilisation CPU moyenne mesurée à 8 %.",
      en: "A cost audit reveals development and staging environments account for 45% of Compute Engine spend. These environments run around the clock although teams work business hours, and VM sizing was copied from production, with measured average CPU utilization of 8%."
    },
    stem: {
      fr: "Quelles deux actions produisent l'économie la plus directe ? (choisir deux réponses)",
      en: "Which two actions deliver the most direct savings? (choose two)"
    },
    options: [
      { fr: "Planifier l'arrêt automatique des instances hors heures ouvrées", en: "Schedule automatic instance shutdown outside business hours" },
      { fr: "Redimensionner les VM d'après les recommandations d'usage observé", en: "Right-size the VMs based on observed usage recommendations" },
      { fr: "Souscrire des engagements d'usage sur un an pour ces environnements", en: "Buy one-year committed use discounts for these environments" },
      { fr: "Migrer ces environnements vers une autre région moins chère", en: "Move these environments to a cheaper region" }
    ],
    correct: [0, 1],
    keywords: ["24h/24 pour un usage en heures ouvrées", "utilisation CPU 8 %", "dimensionnement copié de la production"],
    rationale: {
      fr: "Les deux gaspillages sont explicitement décrits, donc les deux actions correspondantes s'imposent. L'arrêt hors heures ouvrées supprime environ deux tiers du temps de fonctionnement facturé. Le redimensionnement corrige un surdimensionnement massif révélé par 8 % d'utilisation. Les deux se cumulent et sont sans effet sur la production.",
      en: "Both wastes are explicitly described, so the two matching actions follow. Shutting down outside business hours removes roughly two thirds of billed runtime. Right-sizing corrects massive over-provisioning revealed by 8% utilization. The two compound and leave production untouched."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "S'engager sur une capacité qu'il faut au contraire réduire et éteindre verrouille le gaspillage pour un an. Les engagements viennent après le redimensionnement, jamais avant.", en: "Committing to capacity that should instead be reduced and switched off locks in the waste for a year. Commitments come after right-sizing, never before." },
      { fr: "L'écart tarifaire entre régions est marginal face à un facteur trois sur le temps d'exécution et à un surdimensionnement d'un ordre de grandeur. La migration ajoute par ailleurs un risque et une charge.", en: "Regional price differences are marginal against a threefold runtime factor and an order-of-magnitude over-provisioning. Migration also adds risk and effort." }
    ]
  }
];

/* ==========================================================================
   Banque de questions — Domaine 6
   « Ensuring solution and operations reliability » (~12,5 %)
   SLI/SLO, budget d'erreur, supervision, alertes, analyse post-incident.
   ========================================================================== */

window.PCA_QUESTIONS_D6 = [
  {
    id: "D6-01",
    domain: "d6",
    topic: "SLI / SLO",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une équipe veut définir un SLO pour son API publique. Les utilisateurs se plaignent de lenteurs alors que les tableaux de bord affichent une latence moyenne de 120 ms, jugée satisfaisante. L'analyse montre que 3 % des requêtes dépassent 4 secondes, principalement sur les comptes possédant beaucoup de données.",
      en: "A team wants to define an SLO for its public API. Users complain about slowness although dashboards show a 120 ms average latency considered satisfactory. Analysis shows 3% of requests exceed 4 seconds, mainly on accounts holding large amounts of data."
    },
    stem: {
      fr: "Comment formuler l'indicateur et l'objectif ?",
      en: "How should the indicator and objective be formulated?"
    },
    options: [
      { fr: "Un SLI de latence exprimé en percentile élevé, par exemple 99 % des requêtes sous un seuil défini, mesuré côté utilisateur", en: "A latency SLI expressed at a high percentile, for example 99% of requests under a defined threshold, measured on the user side" },
      { fr: "Un SLI de latence moyenne avec un objectif abaissé à 100 ms", en: "An average latency SLI with the objective lowered to 100 ms" },
      { fr: "Un SLI de disponibilité fondé sur le taux de réponses HTTP 200", en: "An availability SLI based on the HTTP 200 response rate" },
      { fr: "Un SLI d'utilisation CPU avec un objectif de 70 % maximum", en: "A CPU utilization SLI with a 70% maximum objective" }
    ],
    correct: [0],
    keywords: ["moyenne satisfaisante mais plaintes", "3 % dépassent 4 secondes", "queue de distribution"],
    rationale: {
      fr: "La moyenne masque la queue de distribution : c'est exactement l'écart entre le tableau de bord et le ressenti. Un objectif exprimé en percentile élevé capture les 3 % de requêtes lentes qui génèrent les plaintes. La mesure doit se faire côté utilisateur, car c'est son expérience qui définit la qualité de service.",
      en: "The average hides the distribution tail, which is exactly the gap between dashboard and perception. An objective expressed at a high percentile captures the 3% of slow requests generating complaints. Measurement must happen on the user side, since their experience defines service quality."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Abaisser la cible d'une moyenne ne corrige pas l'aveuglement : la moyenne resterait bonne pendant que 3 % des utilisateurs attendent 4 secondes.", en: "Lowering an average target does not fix the blind spot: the average would stay healthy while 3% of users wait 4 seconds." },
      { fr: "Un SLI de disponibilité est utile mais ne mesure pas la lenteur : une réponse en 4 secondes est un HTTP 200 et compterait comme un succès.", en: "An availability SLI is useful but does not measure slowness: a 4-second response is an HTTP 200 and would count as a success." },
      { fr: "Le CPU est une métrique de ressource interne, pas un indicateur de niveau de service perçu. Le WAF recommande d'asseoir les SLO sur l'expérience utilisateur.", en: "CPU is an internal resource metric, not a perceived service level indicator. The WAF recommends grounding SLOs in user experience." }
    ]
  },

  {
    id: "D6-02",
    domain: "d6",
    topic: "Budget d'erreur",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un service affiche un SLO de disponibilité de 99,9 % sur 30 jours. À la moitié du mois, le budget d'erreur est déjà consommé à 90 % à cause de deux incidents. L'équipe produit demande la mise en production d'une refonte majeure de l'authentification, prévue depuis longtemps.",
      en: "A service has a 99.9% availability SLO over 30 days. Halfway through the month, 90% of the error budget is already consumed due to two incidents. The product team requests release of a long-planned major authentication rewrite."
    },
    stem: {
      fr: "Quelle décision d'exploitation est cohérente avec la pratique du budget d'erreur ?",
      en: "Which operational decision aligns with error budget practice?"
    },
    options: [
      { fr: "Suspendre les livraisons risquées et prioriser les travaux de fiabilité jusqu'au rétablissement du budget", en: "Pause risky releases and prioritize reliability work until the budget recovers" },
      { fr: "Livrer comme prévu, le SLO n'étant pas encore formellement dépassé", en: "Release as planned, since the SLO is not yet formally breached" },
      { fr: "Abaisser le SLO à 99,5 % pour reconstituer immédiatement le budget", en: "Lower the SLO to 99.5% to immediately replenish the budget" },
      { fr: "Livrer la refonte en désactivant temporairement les alertes pour éviter le bruit", en: "Release the rewrite while temporarily disabling alerts to avoid noise" }
    ],
    correct: [0],
    keywords: ["90 % du budget consommé", "moitié du mois", "refonte majeure", "budget d'erreur"],
    rationale: {
      fr: "Le budget d'erreur sert précisément à arbitrer entre vélocité et fiabilité sans débat d'opinion. Un budget presque épuisé à mi-période impose de suspendre les changements risqués et de réinvestir dans la fiabilité : c'est le mécanisme prévu, et une refonte de l'authentification est typiquement un changement à fort risque.",
      en: "The error budget exists precisely to arbitrate velocity against reliability without opinion-based debate. A nearly exhausted budget at mid-period mandates pausing risky changes and reinvesting in reliability: that is the intended mechanism, and an authentication rewrite is a textbook high-risk change."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Attendre le dépassement formel vide le dispositif de son sens : le budget est un signal d'anticipation, pas un constat après échec.", en: "Waiting for a formal breach empties the mechanism of meaning: the budget is a leading signal, not a post-failure finding." },
      { fr: "Ajuster le SLO pour s'accommoder de la réalité au lieu de la corriger. Le SLO doit refléter l'attente des utilisateurs, pas la performance obtenue.", en: "Adjusting the SLO to accommodate reality instead of fixing it. The SLO must reflect user expectation, not achieved performance." },
      { fr: "Désactiver les alertes pendant un changement risqué supprime la capacité de détection au moment où elle est la plus nécessaire. Pratique dangereuse.", en: "Disabling alerts during a risky change removes detection capability exactly when it matters most. A dangerous practice." }
    ]
  },

  {
    id: "D6-03",
    domain: "d6",
    topic: "Conception des alertes",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "L'équipe d'astreinte reçoit environ 200 alertes par semaine. La majorité ne nécessite aucune action et les ingénieurs commencent à les ignorer. Un incident client réel est passé inaperçu pendant quarante minutes, noyé dans le flux.",
      en: "The on-call team receives about 200 alerts per week. Most require no action and engineers are starting to ignore them. A real customer-facing incident went unnoticed for forty minutes, buried in the stream."
    },
    stem: {
      fr: "Quelle refonte de la stratégie d'alerte appliquer ?",
      en: "Which alerting strategy overhaul should be applied?"
    },
    options: [
      { fr: "Alerter sur la consommation du budget d'erreur des SLO, et transformer le reste en tableaux de bord consultables", en: "Alert on SLO error budget burn, and turn the remainder into dashboards for review" },
      { fr: "Relever les seuils de chaque alerte existante pour réduire le volume", en: "Raise the thresholds of every existing alert to cut volume" },
      { fr: "Router les alertes vers des canaux distincts par équipe", en: "Route alerts to separate channels per team" },
      { fr: "Instaurer une rotation d'astreinte plus large pour répartir la charge", en: "Introduce a broader on-call rotation to spread the load" }
    ],
    correct: [0],
    keywords: ["200 alertes par semaine", "aucune action nécessaire", "incident réel passé inaperçu", "fatigue d'alerte"],
    rationale: {
      fr: "Le problème n'est pas le volume en soi mais l'absence de lien entre alerte et impact utilisateur. Alerter sur la consommation du budget d'erreur garantit qu'un déclenchement signale une dégradation réellement perçue et donc actionnable. Les autres métriques restent utiles au diagnostic, à leur place : dans des tableaux de bord.",
      en: "The problem is not volume itself but the missing link between alert and user impact. Alerting on error budget burn guarantees a trigger signals genuinely perceived, and therefore actionable, degradation. Other metrics remain useful for diagnosis in their proper place: dashboards."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Relever les seuils réduit le bruit mais conserve des alertes déconnectées de l'impact client, avec le risque inverse de masquer une dégradation réelle sous le nouveau seuil.", en: "Raising thresholds cuts noise but keeps alerts disconnected from customer impact, with the opposite risk of hiding real degradation below the new threshold." },
      { fr: "Répartir le bruit ne le supprime pas : chaque équipe reçoit moins d'alertes non actionnables, mais la cause de la fatigue demeure.", en: "Distributing noise does not remove it: each team gets fewer non-actionable alerts, but the cause of fatigue persists." },
      { fr: "Élargir l'astreinte fait subir le problème à davantage de personnes au lieu de le résoudre.", en: "Broadening on-call exposes more people to the problem instead of solving it." }
    ]
  },

  {
    id: "D6-04",
    domain: "d6",
    topic: "Analyse post-incident",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une panne de trois heures a été causée par une modification de configuration appliquée manuellement en production par un ingénieur expérimenté, sans revue. La direction demande des mesures. Certains responsables réclament une sanction disciplinaire pour marquer le coup.",
      en: "A three-hour outage was caused by a configuration change applied manually in production by an experienced engineer without review. Leadership demands measures. Some managers call for disciplinary action to set an example."
    },
    stem: {
      fr: "Quelle démarche recommander ?",
      en: "Which approach should be recommended?"
    },
    options: [
      { fr: "Conduire une analyse post-incident sans recherche de faute, et supprimer la possibilité de modification manuelle non revue", en: "Run a blameless postmortem and remove the ability to make unreviewed manual changes" },
      { fr: "Documenter l'incident et rappeler à l'ensemble des équipes la procédure existante", en: "Document the incident and remind all teams of the existing procedure" },
      { fr: "Restreindre les droits de production à un unique administrateur de confiance", en: "Restrict production rights to a single trusted administrator" },
      { fr: "Instaurer une validation hiérarchique écrite avant toute modification de production", en: "Require written managerial approval before any production change" }
    ],
    correct: [0],
    keywords: ["modification manuelle sans revue", "ingénieur expérimenté", "sanction réclamée"],
    rationale: {
      fr: "Qu'un ingénieur expérimenté ait provoqué la panne démontre que la cause est systémique et non individuelle : le système autorisait une modification non revue en production. L'analyse sans recherche de faute préserve la remontée d'information honnête, et la correction durable consiste à rendre le geste dangereux impossible plutôt qu'à le décourager.",
      en: "That an experienced engineer caused the outage demonstrates the cause is systemic rather than individual: the system permitted an unreviewed production change. A blameless postmortem preserves honest reporting, and the durable fix is making the dangerous action impossible rather than merely discouraged."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Rappeler une procédure qui existait déjà et n'a pas empêché l'incident ne change rien au risque.", en: "Restating a procedure that already existed and failed to prevent the incident does not change the risk." },
      { fr: "Créer un point de passage unique génère un goulot d'étranglement et une dépendance critique à une personne, sans garantir la revue du changement.", en: "Creating a single gate produces a bottleneck and a critical single-person dependency, without guaranteeing change review." },
      { fr: "Une validation hiérarchique écrite ralentit sans apporter de compétence technique de revue : un responsable n'est pas en position d'évaluer une modification de configuration.", en: "Written managerial approval slows things down without adding technical review competence: a manager is not positioned to assess a configuration change." }
    ]
  },

  {
    id: "D6-05",
    domain: "d6",
    topic: "Supervision d'une chaîne asynchrone",
    caseStudy: null,
    multi: true,
    scenario: {
      fr: "Une chaîne de traitement asynchrone consomme des messages Pub/Sub et écrit dans BigQuery. Les utilisateurs signalent parfois des données manquantes, mais aucune erreur n'apparaît dans les journaux du service, qui accuse réception correctement. L'équipe veut détecter le problème avant les utilisateurs.",
      en: "An asynchronous pipeline consumes Pub/Sub messages and writes to BigQuery. Users occasionally report missing data, yet no errors appear in the service logs, which acknowledge correctly. The team wants to detect the problem before users do."
    },
    stem: {
      fr: "Quels deux signaux superviser en priorité ? (choisir deux réponses)",
      en: "Which two signals should be monitored first? (choose two)"
    },
    options: [
      { fr: "L'ancienneté du plus vieux message non acquitté dans l'abonnement", en: "The age of the oldest unacknowledged message in the subscription" },
      { fr: "Le volume de messages routés vers la file de lettres mortes", en: "The volume of messages routed to the dead-letter queue" },
      { fr: "Le nombre total de messages publiés dans le sujet", en: "The total number of messages published to the topic" },
      { fr: "La mémoire utilisée par les instances de traitement", en: "Memory used by the processing instances" }
    ],
    correct: [0, 1],
    keywords: ["données manquantes", "aucune erreur dans les journaux", "asynchrone", "détecter avant les utilisateurs"],
    rationale: {
      fr: "Dans une chaîne asynchrone, la perte se manifeste par des messages qui stagnent ou qui sortent du circuit, pas par une exception dans le service. L'ancienneté du plus vieux message non acquitté révèle un retard ou un blocage de traitement, et la file de lettres mortes recueille précisément les messages définitivement échoués, ce qui explique l'absence d'erreur visible côté service.",
      en: "In an asynchronous pipeline, loss shows up as messages stalling or leaving the circuit, not as a service exception. Oldest unacknowledged message age reveals processing lag or blockage, and the dead-letter queue collects exactly the permanently failed messages, which explains the absence of visible service errors."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le volume publié mesure l'entrée du système et varie avec l'activité métier. Sans comparaison avec le volume traité, il n'indique aucune perte.", en: "Published volume measures system input and varies with business activity. Without comparison to processed volume it indicates no loss." },
      { fr: "La mémoire peut expliquer une cause parmi d'autres, mais ne détecte pas la perte de données : le symptôme à surveiller est le sort des messages, pas l'état des ressources.", en: "Memory may explain one possible cause but does not detect data loss: the symptom to watch is message fate, not resource state." }
    ]
  }
];

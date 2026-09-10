/* ==========================================================================
   Banque de questions — Domaine 3
   « Designing for security and compliance » (~17,5 %)
   Couvre les angles morts repérés : Binary Authorization, Identity-Aware Proxy,
   Workload Identity Federation, distinction VPC-SC / résidence / CMEK.
   ========================================================================== */

window.PCA_QUESTIONS_D3 = [
  {
    id: "D3-01",
    domain: "d3",
    topic: "Prévention de l'exfiltration",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un laboratoire pharmaceutique stocke ses données d'essais cliniques dans BigQuery et Cloud Storage. Le risque identifié par la sécurité est qu'un collaborateur disposant légitimement de droits de lecture copie un jeu de données vers un projet Google Cloud personnel. Les droits IAM sont déjà appliqués selon le moindre privilège et ne peuvent être réduits davantage sans bloquer le travail des chercheurs.",
      en: "A pharmaceutical lab stores clinical trial data in BigQuery and Cloud Storage. Security's identified risk is that an employee with legitimate read access copies a dataset to a personal Google Cloud project. IAM is already least-privilege and cannot be tightened further without blocking researchers' work."
    },
    stem: {
      fr: "Quel contrôle traite ce risque ?",
      en: "Which control addresses this risk?"
    },
    options: [
      { fr: "VPC Service Controls, avec un périmètre de service englobant les projets concernés", en: "VPC Service Controls, with a service perimeter enclosing the relevant projects" },
      { fr: "Réduire encore les rôles IAM et supprimer les accès en lecture aux chercheurs", en: "Further reduce IAM roles and remove researchers' read access" },
      { fr: "Chiffrer les jeux de données avec CMEK et restreindre l'accès aux clés", en: "Encrypt datasets with CMEK and restrict key access" },
      { fr: "Activer Cloud Audit Logs et alerter sur les opérations de copie volumineuses", en: "Enable Cloud Audit Logs and alert on large copy operations" }
    ],
    correct: [0],
    keywords: ["exfiltration", "droits légitimes", "vers un projet personnel", "IAM déjà minimal"],
    rationale: {
      fr: "C'est le cas d'usage canonique de VPC Service Controls : IAM répond à la question « qui a le droit », le périmètre répond à « vers où la donnée peut aller ». En établissant une frontière autour des projets, une copie vers un projet extérieur au périmètre est refusée même si l'identité possède les droits de lecture. Le déclencheur `prevent data exfiltration` doit orienter directement vers VPC-SC.",
      en: "This is the canonical VPC Service Controls use case: IAM answers who is allowed, while the perimeter answers where data may go. By drawing a boundary around the projects, a copy to a project outside the perimeter is denied even when the identity holds read permission. The prevent data exfiltration trigger should point straight to VPC-SC."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "L'énoncé précise que les droits sont déjà minimaux et que les réduire bloquerait les chercheurs. Retirer l'accès en lecture supprime le risque en supprimant l'usage : ce n'est pas un arbitrage acceptable.", en: "The scenario states access is already minimal and reducing it would block researchers. Removing read access eliminates the risk by eliminating the use case, which is not an acceptable trade-off." },
      { fr: "CMEK protège contre un accès au support de stockage, pas contre une copie effectuée par une identité autorisée : la lecture déchiffre de façon transparente pour qui a le droit de lire.", en: "CMEK protects against storage-media access, not against a copy performed by an authorized identity: reads decrypt transparently for whoever may read." },
      { fr: "Les journaux d'audit sont un contrôle de détection : ils constatent l'exfiltration après coup. La demande est d'empêcher, pas d'observer.", en: "Audit logs are a detective control: they record exfiltration after the fact. The requirement is to prevent, not to observe." }
    ]
  },

  {
    id: "D3-02",
    domain: "d3",
    topic: "Identité de charge externe",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un pipeline d'intégration continue hébergé chez un fournisseur externe doit déployer sur Google Cloud. Aujourd'hui l'équipe a créé une clé de compte de service en JSON et l'a stockée dans les variables secrètes du pipeline. L'audit de sécurité exige la suppression de toutes les clés statiques longue durée.",
      en: "A continuous integration pipeline hosted with an external provider must deploy to Google Cloud. Today the team created a JSON service account key and stored it in the pipeline's secret variables. A security audit requires eliminating all long-lived static keys."
    },
    stem: {
      fr: "Quelle solution retenir ?",
      en: "Which solution should be adopted?"
    },
    options: [
      { fr: "Workload Identity Federation : le fournisseur externe présente un jeton d'identité échangé contre des identifiants Google Cloud de courte durée", en: "Workload Identity Federation: the external provider presents an identity token exchanged for short-lived Google Cloud credentials" },
      { fr: "Stocker la clé JSON dans Secret Manager et la récupérer au début de chaque exécution", en: "Store the JSON key in Secret Manager and fetch it at the start of each run" },
      { fr: "Mettre en place une rotation automatique de la clé de compte de service toutes les 24 heures", en: "Implement automatic service account key rotation every 24 hours" },
      { fr: "Créer un utilisateur Cloud Identity dédié au pipeline avec un mot de passe fort", en: "Create a dedicated Cloud Identity user for the pipeline with a strong password" }
    ],
    correct: [0],
    keywords: ["fournisseur externe", "supprimer les clés statiques longue durée"],
    rationale: {
      fr: "Workload Identity Federation supprime la clé plutôt que de la protéger : la charge externe prouve son identité auprès de son propre fournisseur d'identité, et Google Cloud échange ce jeton contre des identifiants temporaires. Aucun secret durable ne subsiste, ce qui est exactement l'exigence de l'audit.",
      en: "Workload Identity Federation removes the key rather than protecting it: the external workload proves its identity to its own identity provider, and Google Cloud exchanges that token for short-lived credentials. No durable secret remains, which is precisely the audit requirement."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "La clé longue durée existe toujours, on déplace seulement son emplacement. L'audit demande sa suppression, pas son stockage amélioré.", en: "The long-lived key still exists, only its location changes. The audit demands elimination, not better storage." },
      { fr: "La rotation réduit la fenêtre d'exposition mais conserve le mécanisme de clé statique, et ajoute une automatisation à maintenir. On atténue au lieu de supprimer.", en: "Rotation shrinks the exposure window but keeps the static key mechanism and adds automation to maintain. It mitigates instead of eliminating." },
      { fr: "Un compte utilisateur représente une personne, jamais une charge de travail. C'est une mauvaise pratique IAM qui empêche en plus l'attribution des actions et le MFA.", en: "A user account represents a person, never a workload. This is an IAM anti-pattern that also breaks action attribution and MFA." }
    ]
  },

  {
    id: "D3-03",
    domain: "d3",
    topic: "Accès aux applications internes",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Une application RH interne tourne sur un groupe d'instances Compute Engine. Elle doit être accessible aux salariés en télétravail depuis n'importe quel réseau, sans VPN d'entreprise, avec authentification par les comptes Google Workspace de l'organisation et vérification de l'appartenance à un groupe. L'application elle-même n'implémente aucune authentification.",
      en: "An internal HR application runs on a Compute Engine instance group. It must be reachable by remote employees from any network without a corporate VPN, authenticating with the organization's Google Workspace accounts and verifying group membership. The application itself implements no authentication."
    },
    stem: {
      fr: "Quelle solution répond au besoin ?",
      en: "Which solution meets the need?"
    },
    options: [
      { fr: "Identity-Aware Proxy devant un équilibreur de charge, avec autorisation IAM par groupe", en: "Identity-Aware Proxy in front of a load balancer, with IAM group-based authorization" },
      { fr: "Exposer l'application via une IP publique et restreindre les règles de pare-feu aux IP des domiciles", en: "Expose the application on a public IP and restrict firewall rules to home IP addresses" },
      { fr: "Déployer un HA VPN et distribuer un client VPN aux salariés", en: "Deploy HA VPN and distribute a VPN client to employees" },
      { fr: "Placer Cloud Armor devant l'équilibreur avec une règle de géolocalisation", en: "Put Cloud Armor in front of the load balancer with a geolocation rule" }
    ],
    correct: [0],
    keywords: ["sans VPN", "depuis n'importe quel réseau", "comptes Workspace", "appartenance à un groupe", "app sans authentification"],
    rationale: {
      fr: "IAP applique l'authentification et l'autorisation au niveau de la couche d'accès, en amont de l'application : celle-ci n'a donc rien à implémenter. Les salariés s'authentifient avec leur identité Workspace, l'autorisation s'exprime en IAM sur un groupe, et l'accès ne dépend plus du réseau d'origine. C'est le modèle BeyondCorp, explicitement sans VPN.",
      en: "IAP enforces authentication and authorization at the access layer, ahead of the application, so the application implements nothing. Employees authenticate with their Workspace identity, authorization is expressed in IAM against a group, and access no longer depends on the originating network. This is the BeyondCorp model, explicitly VPN-free."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Les IP résidentielles sont dynamiques et non maîtrisées, la maintenance serait ingérable, et le filtrage réseau ne fournit ni authentification ni contrôle d'appartenance à un groupe.", en: "Residential IPs are dynamic and uncontrolled, maintenance would be unmanageable, and network filtering provides neither authentication nor group membership checks." },
      { fr: "Contredit directement la contrainte « sans VPN d'entreprise » et impose un client sur chaque poste.", en: "Directly contradicts the no-corporate-VPN constraint and requires a client on every device." },
      { fr: "Cloud Armor protège contre les attaques applicatives et le DDoS. Le filtrage géographique n'est pas de l'authentification : il n'identifie pas le salarié ni son groupe.", en: "Cloud Armor protects against application attacks and DDoS. Geographic filtering is not authentication: it identifies neither the employee nor their group." }
    ]
  },

  {
    id: "D3-04",
    domain: "d3",
    topic: "Chaîne d'approvisionnement logicielle",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Après un incident où une image de conteneur non vérifiée a atteint la production, la direction technique exige que seules des images construites par le pipeline officiel et analysées pour vulnérabilités puissent être déployées sur les clusters GKE de production. Les développeurs conservent un accès de déploiement sur les clusters de développement.",
      en: "After an incident where an unverified container image reached production, engineering leadership requires that only images built by the official pipeline and scanned for vulnerabilities may deploy to production GKE clusters. Developers keep deploy access on development clusters."
    },
    stem: {
      fr: "Quel mécanisme applique cette règle ?",
      en: "Which mechanism enforces this rule?"
    },
    options: [
      { fr: "Binary Authorization, exigeant une attestation signée par le pipeline avant admission des images en production", en: "Binary Authorization, requiring a pipeline-signed attestation before admitting images in production" },
      { fr: "Artifact Registry avec analyse de vulnérabilités activée sur le dépôt", en: "Artifact Registry with vulnerability scanning enabled on the repository" },
      { fr: "Une Organization Policy interdisant la création de pods privilégiés", en: "An Organization Policy forbidding privileged pod creation" },
      { fr: "Retirer aux développeurs le rôle de déploiement sur tous les clusters", en: "Remove developers' deploy role on all clusters" }
    ],
    correct: [0],
    keywords: ["seules des images du pipeline officiel", "analysées", "sur les clusters de production"],
    rationale: {
      fr: "Binary Authorization est un contrôle d'admission : au moment du déploiement, il refuse toute image dépourvue de l'attestation attendue. C'est le seul mécanisme de la liste qui empêche techniquement le déploiement d'une image non conforme, et sa politique peut différer entre clusters de production et de développement.",
      en: "Binary Authorization is an admission control: at deploy time it rejects any image lacking the expected attestation. It is the only listed mechanism that technically blocks deployment of a non-compliant image, and its policy can differ between production and development clusters."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "L'analyse détecte les vulnérabilités et produit l'information, mais n'empêche pas le déploiement d'une image vulnérable ou d'origine inconnue. Elle alimente utilement l'attestation sans la remplacer.", en: "Scanning detects vulnerabilities and produces the information but does not block deployment of a vulnerable or unknown-origin image. It usefully feeds the attestation without replacing it." },
      { fr: "Interdire les pods privilégiés durcit l'exécution mais ne dit rien de la provenance de l'image, qui est le problème décrit.", en: "Forbidding privileged pods hardens runtime but says nothing about image provenance, which is the described problem." },
      { fr: "Trop large : l'énoncé maintient explicitement l'accès des développeurs en développement. Et un accès légitime en production pourrait toujours déployer une image non attestée.", en: "Too broad: the scenario explicitly preserves developer access in development. Also, a legitimate production access could still deploy a non-attested image." }
    ]
  },

  {
    id: "D3-05",
    domain: "d3",
    topic: "Séparation des responsabilités / CMEK",
    caseStudy: null,
    multi: false,
    scenario: {
      fr: "Un client du secteur public exige de pouvoir révoquer à tout moment l'accès de Google à ses données, et que l'équipe d'exploitation cloud qui administre les ressources ne puisse pas, à elle seule, déchiffrer les données de production. Un régulateur contrôlera l'effectivité de cette séparation.",
      en: "A public sector customer requires the ability to revoke Google's access to its data at any time, and that the cloud operations team administering resources cannot, on its own, decrypt production data. A regulator will verify the separation is effective."
    },
    stem: {
      fr: "Quelle conception répond aux deux exigences ?",
      en: "Which design satisfies both requirements?"
    },
    options: [
      { fr: "CMEK via Cloud KMS, avec l'administration des clés confiée à une équipe distincte de l'équipe d'exploitation", en: "CMEK through Cloud KMS, with key administration assigned to a team separate from operations" },
      { fr: "Chiffrement par défaut de Google, complété par des journaux d'accès aux données", en: "Google default encryption, complemented by data access logs" },
      { fr: "CMEK via Cloud KMS, l'équipe d'exploitation gérant les clés et les ressources", en: "CMEK through Cloud KMS, with operations managing both keys and resources" },
      { fr: "Chiffrement applicatif avec une clé stockée dans un secret aux côtés du code", en: "Application-level encryption with the key stored in a secret alongside the code" }
    ],
    correct: [0],
    keywords: ["révoquer l'accès", "l'exploitation ne peut pas déchiffrer seule", "contrôle du régulateur"],
    rationale: {
      fr: "Deux exigences distinctes. La révocabilité impose CMEK, car seule une clé gérée par le client peut être désactivée ou détruite à son initiative. La seconde exigence est organisationnelle : la séparation des responsabilités n'existe que si l'administration des clés est détenue par une équipe différente de celle qui administre les données. CMEK sans séparation des rôles ne produit aucune garantie.",
      en: "Two distinct requirements. Revocability mandates CMEK, since only a customer-managed key can be disabled or destroyed at the customer's initiative. The second requirement is organizational: separation of duties exists only if key administration is held by a different team from the one administering data. CMEK without role separation yields no guarantee."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Le chiffrement par défaut utilise des clés gérées par Google : le client ne peut pas les révoquer. Les journaux constatent les accès sans les empêcher.", en: "Default encryption uses Google-managed keys, which the customer cannot revoke. Logs record access without preventing it." },
      { fr: "Réponse piège, très proche de la bonne. La révocabilité est acquise, mais confier clés et ressources à la même équipe annule la séparation des responsabilités que le régulateur vérifiera.", en: "A trap answer, very close to correct. Revocability is achieved, but giving keys and resources to the same team defeats the separation of duties the regulator will verify." },
      { fr: "Une clé stockée avec le code est accessible à quiconque accède au code ou au dépôt, ce qui contredit la séparation demandée et constitue une mauvaise pratique de gestion des secrets.", en: "A key stored with the code is available to anyone accessing the code or repository, contradicting the required separation and constituting poor secret management." }
    ]
  },

  {
    id: "D3-06",
    domain: "d3",
    topic: "Gouvernance par contraintes",
    caseStudy: null,
    multi: true,
    scenario: {
      fr: "Une organisation compte 60 projets répartis dans 8 dossiers. La sécurité constate que des VM avec adresse IP publique et des buckets accessibles publiquement apparaissent régulièrement, malgré une consigne écrite. Elle veut une application technique héritée et non contournable par les équipes projet.",
      en: "An organization has 60 projects across 8 folders. Security observes that VMs with public IPs and publicly accessible buckets keep appearing despite a written guideline. It wants technical enforcement that is inherited and cannot be bypassed by project teams."
    },
    stem: {
      fr: "Quelles deux contraintes d'Organization Policy appliquer ? (choisir deux réponses)",
      en: "Which two Organization Policy constraints should be applied? (choose two)"
    },
    options: [
      { fr: "La contrainte interdisant l'attribution d'adresses IP externes aux instances de VM", en: "The constraint denying external IP assignment to VM instances" },
      { fr: "La contrainte de prévention de l'accès public sur Cloud Storage", en: "The public access prevention constraint on Cloud Storage" },
      { fr: "Un rôle IAM personnalisé retirant la permission de création de VM aux développeurs", en: "A custom IAM role removing VM creation permission from developers" },
      { fr: "Une règle de pare-feu par défaut refusant tout le trafic entrant", en: "A default firewall rule denying all ingress traffic" }
    ],
    correct: [0, 1],
    keywords: ["héritée", "non contournable", "IP publiques", "buckets publics", "consigne écrite insuffisante"],
    rationale: {
      fr: "Les Organization Policy s'appliquent à un nœud de la hiérarchie et sont héritées par tous les projets descendants, y compris ceux créés ensuite : c'est ce qui les rend non contournables, contrairement à une consigne. Les deux contraintes retenues traitent précisément les deux dérives constatées, à la source, au moment de la création de la ressource.",
      en: "Organization Policies apply at a hierarchy node and are inherited by all descendant projects, including future ones, which is what makes them non-bypassable unlike a guideline. The two selected constraints address exactly the two observed drifts, at the source, when the resource is created."
    },
    refute: [
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Bonne réponse.", en: "Correct answer." },
      { fr: "Retirer la création de VM bloque le travail légitime au lieu d'interdire la configuration dangereuse. On confond restriction d'identité et contrainte de configuration.", en: "Removing VM creation blocks legitimate work instead of forbidding the dangerous configuration. It confuses identity restriction with configuration constraint." },
      { fr: "Le trafic entrant est déjà refusé par défaut dans un VPC, et une règle de pare-feu ne traite pas l'accès public à un bucket, qui ne dépend pas du réseau VPC.", en: "Ingress is already denied by default in a VPC, and a firewall rule does not address public bucket access, which does not traverse the VPC network." }
    ]
  }
];

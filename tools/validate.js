/* Validation de la banque de questions.
   Usage : node tools/validate.js
   Vérifie l'intégrité structurelle et bilingue de chaque item. */

const path = require("path");

global.window = {};

const files = ["d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "cases"];
const loaded = [];

for (const d of files) {
  const p = path.join(__dirname, "..", "data", `questions-${d}.js`);
  try {
    require(p);
    loaded.push(d);
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") throw e;
  }
}

const all = [];
for (const key of Object.keys(global.window)) {
  if (/^PCA_QUESTIONS_/.test(key)) all.push(...global.window[key]);
}

let errors = 0;
const fail = (...a) => {
  console.log("  [!]", ...a);
  errors++;
};

const ids = new Set();
const DOMAINS = ["d1", "d2", "d3", "d4", "d5", "d6"];

for (const q of all) {
  if (!q.id) fail("item sans id");
  if (ids.has(q.id)) fail("id dupliqué :", q.id);
  ids.add(q.id);

  if (!DOMAINS.includes(q.domain)) fail(q.id, "domaine invalide :", q.domain);
  if (!Array.isArray(q.options) || q.options.length !== 4)
    fail(q.id, "doit avoir exactement 4 options");
  if (!Array.isArray(q.refute) || q.refute.length !== q.options.length)
    fail(q.id, "refute ne couvre pas toutes les options");

  if (!Array.isArray(q.correct) || q.correct.length === 0)
    fail(q.id, "aucune réponse correcte");
  else {
    for (const i of q.correct)
      if (!Number.isInteger(i) || i < 0 || i >= q.options.length)
        fail(q.id, "index de réponse hors bornes :", i);
    if (new Set(q.correct).size !== q.correct.length)
      fail(q.id, "index de réponse dupliqué");
  }

  if (q.multi === true && q.correct.length < 2)
    fail(q.id, "marqué multi mais une seule réponse");
  if (q.multi === false && q.correct.length !== 1)
    fail(q.id, "marqué simple mais plusieurs réponses");

  for (const k of ["scenario", "stem", "rationale"]) {
    if (!q[k] || !q[k].fr || !q[k].en) fail(q.id, `${k} non bilingue`);
  }
  q.options.forEach((o, i) => {
    if (!o || !o.fr || !o.en) fail(q.id, `option ${i} non bilingue`);
  });
  q.refute.forEach((o, i) => {
    if (!o || !o.fr || !o.en) fail(q.id, `refute ${i} non bilingue`);
  });

  if (!Array.isArray(q.keywords) || q.keywords.length === 0)
    fail(q.id, "aucun mot-clé déclencheur");
  if (!q.topic) fail(q.id, "aucun topic");
}

const byDomain = {};
for (const q of all) byDomain[q.domain] = (byDomain[q.domain] || 0) + 1;

console.log("Fichiers chargés :", loaded.join(", ") || "aucun");
console.log("Questions        :", all.length);
console.log("Par domaine      :", JSON.stringify(byDomain));
console.log("Multi-réponses   :", all.filter((q) => q.multi).length);
console.log("Sujets distincts :", new Set(all.map((q) => q.topic)).size);
console.log(
  errors === 0
    ? "\nVALIDATION OK — aucune anomalie"
    : `\nVALIDATION ÉCHOUÉE — ${errors} anomalie(s)`
);

process.exit(errors === 0 ? 0 : 1);

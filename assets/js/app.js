/* ==========================================================================
   PCA Prep — application
   Site statique, sans dépendance externe, sans backend.
   Persistance locale uniquement (localStorage) : aucune donnée ne quitte
   le navigateur, donc aucun secret ni PII à protéger côté serveur.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- Données */
  const Q = []
    .concat(
      window.PCA_QUESTIONS_D1 || [],
      window.PCA_QUESTIONS_D2 || [],
      window.PCA_QUESTIONS_D3 || [],
      window.PCA_QUESTIONS_D4 || [],
      window.PCA_QUESTIONS_D5 || [],
      window.PCA_QUESTIONS_D6 || [],
      window.PCA_QUESTIONS_D7 || [],
      window.PCA_QUESTIONS_D8 || [],
      window.PCA_QUESTIONS_CASES || []
    );

  const DOMAINS = window.PCA_DOMAINS || [];
  const EXAM = window.PCA_EXAM || {};

  /* ------------------------------------------------------- Sécurité du DOM */
  /* Tout le contenu injecté passe par du texte, jamais par innerHTML avec
     interpolation. Cela élimine par construction tout risque d'injection,
     y compris si un futur contenu de données comportait des chevrons. */
  function el(tag, opts, children) {
    const node = document.createElement(tag);
    if (opts) {
      if (opts.class) node.className = opts.class;
      if (opts.text != null) node.textContent = String(opts.text);
      if (opts.attrs) {
        for (const k in opts.attrs) {
          if (opts.attrs[k] != null) node.setAttribute(k, String(opts.attrs[k]));
        }
      }
      if (opts.on) {
        for (const k in opts.on) node.addEventListener(k, opts.on[k]);
      }
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  /* ------------------------------------------------------------ Persistance */
  const STORE_KEY = "pca-prep-v1";

  const defaultState = {
    lang: "fr",
    theme: "light",
    answers: {}, // id -> { ok:bool, at:ISO }
    tasks: {}, // "date#index" -> bool
    exams: [] // { at, score, total, durationSec }
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return Object.assign({}, defaultState);
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return Object.assign({}, defaultState);
      // Fusion défensive : une donnée locale corrompue ne doit pas casser l'app.
      return {
        lang: parsed.lang === "en" ? "en" : "fr",
        theme: parsed.theme === "dark" ? "dark" : "light",
        answers: parsed.answers && typeof parsed.answers === "object" ? parsed.answers : {},
        tasks: parsed.tasks && typeof parsed.tasks === "object" ? parsed.tasks : {},
        exams: Array.isArray(parsed.exams) ? parsed.exams : []
      };
    } catch (e) {
      return Object.assign({}, defaultState);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(S));
    } catch (e) {
      /* Quota dépassé ou mode privé : l'app continue sans persistance. */
    }
  }

  const S = loadState();

  /* --------------------------------------------------------------- Langue */
  function L(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return S.lang === "en" ? obj.en || obj.fr : obj.fr || obj.en;
  }

  const T = {
    check: { fr: "Valider", en: "Submit" },
    next: { fr: "Question suivante", en: "Next question" },
    finish: { fr: "Terminer", en: "Finish" },
    correct: { fr: "Correct", en: "Correct" },
    wrong: { fr: "Incorrect", en: "Incorrect" },
    why: { fr: "Pourquoi cette réponse", en: "Why this answer" },
    others: { fr: "Pourquoi les autres options échouent", en: "Why the other options fail" },
    triggers: { fr: "Déclencheurs dans l'énoncé", en: "Triggers in the scenario" },
    multi: { fr: "Plusieurs réponses attendues", en: "Multiple answers expected" },
    of: { fr: "sur", en: "of" },
    score: { fr: "Score", en: "Score" },
    restart: { fr: "Relancer", en: "Restart" },
    noQ: { fr: "Aucune question dans cette sélection.", en: "No question in this selection." },
    start: { fr: "Démarrer", en: "Start" },
    reveal: { fr: "Afficher la réponse", en: "Reveal answer" },
    submitExam: { fr: "Terminer l'examen", en: "Finish exam" },
    confirmExam: {
      fr: "Terminer l'examen maintenant ? Les questions sans réponse seront comptées comme fausses.",
      en: "Finish the exam now? Unanswered questions will count as incorrect."
    },
    timeUp: { fr: "Temps écoulé. L'examen est terminé.", en: "Time is up. The exam is over." },
    flag: { fr: "Marquer", en: "Flag" },
    review: { fr: "Revoir la correction", en: "Review answers" }
  };

  /* ------------------------------------------------------------- Utilitaires */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    const sa = a.slice().sort();
    const sb = b.slice().sort();
    return sa.every(function (v, i) {
      return v === sb[i];
    });
  }

  function domainLabel(id) {
    const d = DOMAINS.find(function (x) {
      return x.id === id;
    });
    if (!d) return id;
    return S.lang === "en" ? d.en : d.fr;
  }

  function pct(n, d) {
    return d === 0 ? 0 : Math.round((n / d) * 100);
  }

  /* ----------------------------------------------------------- Chrome / nav */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", S.theme);
  }

  function initChrome() {
    applyTheme();
    document.documentElement.lang = S.lang;

    const themeBtn = $("#themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        S.theme = S.theme === "dark" ? "light" : "dark";
        applyTheme();
        saveState();
      });
    }

    const langBtn = $("#langToggle");
    if (langBtn) {
      langBtn.textContent = S.lang === "fr" ? "EN" : "FR";
      langBtn.addEventListener("click", function () {
        S.lang = S.lang === "fr" ? "en" : "fr";
        saveState();
        location.reload();
      });
    }

    // Marque la page courante dans la navigation.
    const here = location.pathname.split("/").pop() || "index.html";
    Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
      const target = a.getAttribute("href");
      if (target === here) a.setAttribute("aria-current", "page");
    });

    renderCountdown();
    setInterval(renderCountdown, 60000);
  }

  function renderCountdown() {
    const host = $("#countdown");
    if (!host || !EXAM.date) return;
    const diff = new Date(EXAM.date).getTime() - Date.now();
    clear(host);
    if (diff <= 0) {
      host.appendChild(el("span", { text: S.lang === "fr" ? "Jour J" : "Exam day" }));
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    host.appendChild(
      el("span", { class: "countdown__num", text: (S.lang === "fr" ? "J-" : "D-") + days })
    );
    host.appendChild(
      el("span", { class: "muted", text: "· " + hours + " h" })
    );
  }

  /* ------------------------------------------------------- Moteur de quiz */
  /* Rend une question. mode "practice" corrige immédiatement,
     mode "exam" enregistre sans révéler. */
  function renderQuestion(host, q, opts) {
    opts = opts || {};
    clear(host);

    const meta = el("div", { class: "q-meta" });
    meta.appendChild(el("span", { class: "badge badge--primary", text: domainLabel(q.domain) }));
    meta.appendChild(el("span", { text: q.topic }));
    if (q.multi) meta.appendChild(el("span", { class: "badge badge--accent", text: L(T.multi) }));
    if (opts.position) meta.appendChild(el("span", { class: "muted", text: opts.position }));
    host.appendChild(meta);

    host.appendChild(el("div", { class: "q-scenario", text: L(q.scenario) }));
    host.appendChild(el("p", { class: "q-stem", text: L(q.stem) }));

    const list = el("ul", { class: "options" });
    const selected = new Set(opts.preselected || []);
    const buttons = [];

    q.options.forEach(function (opt, i) {
      const li = el("li");
      const btn = el(
        "button",
        {
          class: "option" + (selected.has(i) ? " option--selected" : ""),
          attrs: { type: "button", "aria-pressed": selected.has(i) ? "true" : "false" }
        },
        [
          el("span", { class: "option__key", text: "ABCD"[i] }),
          el("span", { text: L(opt) })
        ]
      );
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        if (q.multi) {
          if (selected.has(i)) selected.delete(i);
          else selected.add(i);
        } else {
          selected.clear();
          selected.add(i);
        }
        buttons.forEach(function (b, bi) {
          const on = selected.has(bi);
          b.classList.toggle("option--selected", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        if (opts.onSelect) opts.onSelect(Array.from(selected));
      });
      buttons.push(btn);
      li.appendChild(btn);
      list.appendChild(li);
    });
    host.appendChild(list);

    return {
      getSelected: function () {
        return Array.from(selected);
      },
      lock: function () {
        buttons.forEach(function (b) {
          b.disabled = true;
        });
      },
      mark: function () {
        buttons.forEach(function (b, i) {
          b.classList.remove("option--selected");
          if (q.correct.indexOf(i) !== -1) b.classList.add("option--correct");
          else if (selected.has(i)) b.classList.add("option--wrong");
        });
      }
    };
  }

  function buildExplanation(q, ok) {
    const box = el("div", { class: "explain" });
    box.appendChild(
      el("div", {
        class: "explain__verdict " + (ok ? "explain__verdict--ok" : "explain__verdict--ko"),
        text: ok ? L(T.correct) : L(T.wrong)
      })
    );

    box.appendChild(el("h4", { text: L(T.why) }));
    box.appendChild(el("p", { text: L(q.rationale) }));

    box.appendChild(el("h4", { text: L(T.others) }));
    const ul = el("ul");
    q.refute.forEach(function (r, i) {
      if (q.correct.indexOf(i) !== -1) return;
      ul.appendChild(
        el("li", {}, [el("strong", { text: "ABCD"[i] + ". " }), document.createTextNode(L(r))])
      );
    });
    box.appendChild(ul);

    if (q.keywords && q.keywords.length) {
      box.appendChild(el("h4", { text: L(T.triggers) }));
      const kw = el("p");
      q.keywords.forEach(function (k, i) {
        if (i) kw.appendChild(document.createTextNode("  •  "));
        kw.appendChild(el("span", { class: "keyword", text: k }));
      });
      box.appendChild(kw);
    }
    return box;
  }

  function recordAnswer(id, ok) {
    S.answers[id] = { ok: !!ok, at: new Date().toISOString() };
    saveState();
  }

  /* ------------------------------------------------------ Mode entraînement */
  function initPractice() {
    const host = $("#quiz");
    if (!host) return;

    const filters = $("#quizFilters");
    let pool = Q.slice();
    let queue = [];
    let idx = 0;
    let score = 0;
    let currentFilter = "all";

    function setPool() {
      if (currentFilter === "all") pool = Q.slice();
      else if (currentFilter === "cases") pool = Q.filter(function (q) { return q.caseStudy; });
      else if (currentFilter === "wrong") {
        pool = Q.filter(function (q) {
          return S.answers[q.id] && S.answers[q.id].ok === false;
        });
      } else pool = Q.filter(function (q) { return q.domain === currentFilter; });
      queue = shuffle(pool);
      idx = 0;
      score = 0;
    }

    if (filters) {
      const defs = [{ id: "all", label: { fr: "Tout", en: "All" } }]
        .concat(
          DOMAINS.map(function (d) {
            return { id: d.id, label: { fr: d.id.toUpperCase() + " · " + d.fr, en: d.id.toUpperCase() + " · " + d.en } };
          })
        )
        .concat([
          { id: "cases", label: { fr: "Études de cas", en: "Case studies" } },
          { id: "wrong", label: { fr: "Mes erreurs", en: "My mistakes" } }
        ]);

      defs.forEach(function (d) {
        const chip = el("button", {
          class: "chip",
          text: L(d.label),
          attrs: { type: "button", "aria-pressed": d.id === "all" ? "true" : "false" }
        });
        chip.addEventListener("click", function () {
          currentFilter = d.id;
          Array.prototype.forEach.call(filters.children, function (c) {
            c.setAttribute("aria-pressed", "false");
          });
          chip.setAttribute("aria-pressed", "true");
          setPool();
          step();
        });
        filters.appendChild(chip);
      });
    }

    function step() {
      clear(host);
      if (!queue.length) {
        host.appendChild(el("p", { class: "muted", text: L(T.noQ) }));
        return;
      }
      if (idx >= queue.length) {
        const done = el("div", { class: "card center stack" });
        done.appendChild(el("h3", { text: L(T.score) + " : " + score + " / " + queue.length }));
        done.appendChild(
          el("p", { class: "muted", text: pct(score, queue.length) + " %" })
        );
        const again = el("button", { class: "btn btn--primary", text: L(T.restart), attrs: { type: "button" } });
        again.addEventListener("click", function () {
          setPool();
          step();
        });
        done.appendChild(again);
        host.appendChild(done);
        return;
      }

      const q = queue[idx];
      const card = el("div", { class: "card" });
      host.appendChild(card);

      const ctrl = renderQuestion(card, q, {
        position: idx + 1 + " " + L(T.of) + " " + queue.length
      });

      const row = el("div", { class: "btn-row" });
      const submit = el("button", {
        class: "btn btn--primary",
        text: L(T.check),
        attrs: { type: "button" }
      });
      submit.addEventListener("click", function () {
        const sel = ctrl.getSelected();
        if (!sel.length) return;
        const ok = sameSet(sel, q.correct);
        if (ok) score++;
        recordAnswer(q.id, ok);
        ctrl.lock();
        ctrl.mark();
        submit.remove();
        card.appendChild(buildExplanation(q, ok));
        const nextBtn = el("button", {
          class: "btn btn--primary",
          text: idx + 1 >= queue.length ? L(T.finish) : L(T.next),
          attrs: { type: "button" }
        });
        nextBtn.addEventListener("click", function () {
          idx++;
          step();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        card.appendChild(nextBtn);
        nextBtn.focus();
      });
      row.appendChild(submit);
      card.appendChild(row);
    }

    setPool();
    step();
  }

  /* ------------------------------------------------------------ Mode examen */
  function initExam() {
    const host = $("#exam");
    if (!host) return;

    const TOTAL = Math.min(50, Q.length);
    const DURATION = 120 * 60; // secondes

    let queue = [];
    let answers = {}; // index -> [choix]
    let flags = {};
    let cur = 0;
    let remaining = DURATION;
    let ticker = null;
    let finished = false;

    function startScreen() {
      clear(host);
      const card = el("div", { class: "card stack" });
      card.appendChild(
        el("h2", { text: S.lang === "fr" ? "Examen blanc chronométré" : "Timed mock exam" })
      );
      card.appendChild(
        el("p", {
          text:
            S.lang === "fr"
              ? TOTAL +
                " questions en 120 minutes, dans les conditions de l'épreuve : aucune correction avant la fin, navigation libre, questions marquables."
              : TOTAL +
                " questions in 120 minutes under exam conditions: no feedback until the end, free navigation, flaggable questions."
        })
      );
      card.appendChild(
        el("div", {
          class: "alert alert--warn",
          text:
            S.lang === "fr"
              ? "Installe-toi comme le jour J : deux heures sans interruption, sans documentation, sans téléphone."
              : "Set up as on exam day: two uninterrupted hours, no documentation, no phone."
        })
      );
      const go = el("button", { class: "btn btn--primary", text: L(T.start), attrs: { type: "button" } });
      go.addEventListener("click", begin);
      card.appendChild(go);
      host.appendChild(card);
    }

    function begin() {
      queue = shuffle(Q).slice(0, TOTAL);
      answers = {};
      flags = {};
      cur = 0;
      remaining = DURATION;
      finished = false;
      ticker = setInterval(tick, 1000);
      render();
    }

    /* Format h:mm:ss, plus lisible que 120:00 sur une épreuve de deux heures. */
    function fmtTime(total) {
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      return (
        h + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
      );
    }

    function tick() {
      remaining--;
      const t = $("#examTimer");
      if (t) {
        t.textContent = fmtTime(remaining);
        t.classList.toggle("timer--warn", remaining <= 900 && remaining > 300);
        t.classList.toggle("timer--critical", remaining <= 300);
      }
      if (remaining <= 0) {
        clearInterval(ticker);
        window.alert(L(T.timeUp));
        finish();
      }
    }

    function render() {
      clear(host);

      const bar = el("div", { class: "exam-bar" });
      bar.appendChild(
        el("span", {
          class: "timer",
          attrs: { id: "examTimer", role: "timer", "aria-live": "off" },
          text: fmtTime(remaining)
        })
      );
      bar.appendChild(
        el("span", {
          class: "muted",
          text: Object.keys(answers).length + " / " + queue.length + (S.lang === "fr" ? " répondues" : " answered")
        })
      );

      const nav = el("div", { class: "qnav" });
      queue.forEach(function (_, i) {
        const b = el("button", {
          class:
            "qnav__item" +
            (answers[i] ? " qnav__item--answered" : "") +
            (flags[i] ? " qnav__item--flagged" : "") +
            (i === cur ? " qnav__item--current" : ""),
          text: i + 1,
          attrs: { type: "button", "aria-label": "Question " + (i + 1) }
        });
        b.addEventListener("click", function () {
          cur = i;
          render();
        });
        nav.appendChild(b);
      });
      bar.appendChild(nav);

      const end = el("button", {
        class: "btn btn--danger btn--sm",
        text: L(T.submitExam),
        attrs: { type: "button" }
      });
      end.addEventListener("click", function () {
        if (window.confirm(L(T.confirmExam))) finish();
      });
      bar.appendChild(end);
      host.appendChild(bar);

      const card = el("div", { class: "card" });
      host.appendChild(card);

      const q = queue[cur];
      const ctrl = renderQuestion(card, q, {
        position: cur + 1 + " " + L(T.of) + " " + queue.length,
        preselected: answers[cur] || [],
        onSelect: function (sel) {
          if (sel.length) answers[cur] = sel;
          else delete answers[cur];
          render();
        }
      });
      void ctrl;

      const row = el("div", { class: "btn-row" });
      const prev = el("button", {
        class: "btn btn--ghost",
        text: S.lang === "fr" ? "Précédente" : "Previous",
        attrs: { type: "button" }
      });
      prev.disabled = cur === 0;
      prev.addEventListener("click", function () {
        cur--;
        render();
        window.scrollTo({ top: 0 });
      });

      const flag = el("button", {
        class: "btn btn--ghost",
        text: L(T.flag),
        attrs: { type: "button", "aria-pressed": flags[cur] ? "true" : "false" }
      });
      flag.addEventListener("click", function () {
        flags[cur] = !flags[cur];
        render();
      });

      const next = el("button", {
        class: "btn btn--primary",
        text: S.lang === "fr" ? "Suivante" : "Next",
        attrs: { type: "button" }
      });
      next.disabled = cur >= queue.length - 1;
      next.addEventListener("click", function () {
        cur++;
        render();
        window.scrollTo({ top: 0 });
      });

      row.appendChild(prev);
      row.appendChild(flag);
      row.appendChild(next);
      card.appendChild(row);
    }

    function finish() {
      if (finished) return;
      finished = true;
      clearInterval(ticker);

      let score = 0;
      queue.forEach(function (q, i) {
        const ok = answers[i] ? sameSet(answers[i], q.correct) : false;
        if (ok) score++;
        recordAnswer(q.id, ok);
      });

      S.exams.push({
        at: new Date().toISOString(),
        score: score,
        total: queue.length,
        durationSec: DURATION - remaining
      });
      saveState();

      clear(host);
      const head = el("div", { class: "card stack" });
      head.appendChild(
        el("h2", { text: L(T.score) + " : " + score + " / " + queue.length + "  (" + pct(score, queue.length) + " %)" })
      );

      const barWrap = el("div", { class: "bar" });
      const fill = el("div", { class: "bar__fill" + (pct(score, queue.length) >= 70 ? " bar__fill--accent" : " bar__fill--danger") });
      fill.style.width = pct(score, queue.length) + "%";
      barWrap.appendChild(fill);
      head.appendChild(barWrap);

      head.appendChild(
        el("p", {
          class: "muted",
          text:
            S.lang === "fr"
              ? "Google ne publie pas de seuil officiel. Viser 75 % ou plus en blanc laisse une marge de sécurité confortable."
              : "Google does not publish an official passing score. Aiming for 75% or more in mock conditions leaves a comfortable margin."
        })
      );

      // Répartition par domaine, pour cibler la révision restante.
      const perDom = {};
      queue.forEach(function (q, i) {
        const d = (perDom[q.domain] = perDom[q.domain] || { ok: 0, n: 0 });
        d.n++;
        if (answers[i] && sameSet(answers[i], q.correct)) d.ok++;
      });
      const table = el("table");
      const thead = el("thead");
      thead.appendChild(
        el("tr", {}, [
          el("th", { text: S.lang === "fr" ? "Domaine" : "Domain" }),
          el("th", { text: S.lang === "fr" ? "Réussite" : "Success" })
        ])
      );
      table.appendChild(thead);
      const tbody = el("tbody");
      Object.keys(perDom).forEach(function (k) {
        const d = perDom[k];
        tbody.appendChild(
          el("tr", {}, [
            el("td", { text: domainLabel(k) }),
            el("td", { text: d.ok + " / " + d.n + "  (" + pct(d.ok, d.n) + " %)" })
          ])
        );
      });
      table.appendChild(tbody);
      const scroll = el("div", { class: "table-scroll" }, table);
      head.appendChild(scroll);
      host.appendChild(head);

      // Correction détaillée.
      const title = el("h3", { text: L(T.review) });
      title.style.marginTop = "2rem";
      host.appendChild(title);

      queue.forEach(function (q, i) {
        const ok = answers[i] ? sameSet(answers[i], q.correct) : false;
        const card = el("div", { class: "card" });
        card.style.marginBottom = "1rem";
        const ctrl = renderQuestion(card, q, {
          position: i + 1 + " " + L(T.of) + " " + queue.length,
          preselected: answers[i] || []
        });
        ctrl.lock();
        ctrl.mark();
        card.appendChild(buildExplanation(q, ok));
        host.appendChild(card);
      });
    }

    startScreen();
  }

  /* ------------------------------------------------------------- Tableau de bord */
  function initDashboard() {
    const statHost = $("#stats");
    if (statHost) {
      const answered = Object.keys(S.answers).length;
      const okCount = Object.keys(S.answers).filter(function (k) {
        return S.answers[k].ok;
      }).length;
      const best = S.exams.reduce(function (m, e) {
        return Math.max(m, pct(e.score, e.total));
      }, 0);

      const cards = [
        { label: { fr: "Questions traitées", en: "Questions attempted" }, value: answered + " / " + Q.length },
        { label: { fr: "Taux de réussite", en: "Success rate" }, value: pct(okCount, answered || 1) + " %" },
        { label: { fr: "Examens blancs", en: "Mock exams" }, value: String(S.exams.length) },
        { label: { fr: "Meilleur score", en: "Best score" }, value: best + " %" }
      ];
      cards.forEach(function (c) {
        statHost.appendChild(
          el("div", { class: "stat" }, [
            el("div", { class: "stat__label", text: L(c.label) }),
            el("div", { class: "stat__value", text: c.value })
          ])
        );
      });
    }

    // Progression par domaine : sert à décider quoi réviser ensuite.
    const domHost = $("#domainProgress");
    if (domHost) {
      DOMAINS.forEach(function (d) {
        const qs = Q.filter(function (q) {
          return q.domain === d.id;
        });
        const seen = qs.filter(function (q) {
          return S.answers[q.id];
        });
        const ok = qs.filter(function (q) {
          return S.answers[q.id] && S.answers[q.id].ok;
        });
        const rate = seen.length ? pct(ok.length, seen.length) : 0;

        const row = el("div", { class: "stack" });
        row.style.marginBottom = "1rem";
        const head = el("div");
        head.style.display = "flex";
        head.style.justifyContent = "space-between";
        head.style.gap = "1rem";
        head.appendChild(el("strong", { text: (S.lang === "en" ? d.en : d.fr) + "  (" + d.weight + " %)" }));
        head.appendChild(
          el("span", {
            class: "muted",
            text: seen.length ? rate + " %  ·  " + seen.length + "/" + qs.length : "—"
          })
        );
        row.appendChild(head);

        const bar = el("div", { class: "bar" });
        const fill = el("div", {
          class: "bar__fill" + (seen.length === 0 ? "" : rate >= 70 ? " bar__fill--accent" : " bar__fill--danger")
        });
        fill.style.width = (seen.length ? rate : 0) + "%";
        bar.appendChild(fill);
        row.appendChild(bar);
        row.appendChild(el("p", { class: "muted", text: d.focus }));
        domHost.appendChild(row);
      });
    }

    // Historique des examens blancs
    const examHistHost = $("#examHistory");
    if (examHistHost) {
      clear(examHistHost);
      const exams = (S.exams || []).slice().reverse();
      if (!exams.length) {
        const empty = el("div", { class: "stack" });
        empty.appendChild(
          el("p", {
            class: "muted",
            text: S.lang === "fr"
              ? "Aucun examen blanc n'a encore été complété. Lance une session de 50 questions pour mesurer ton niveau."
              : "No mock exam completed yet. Launch a 50-question session to benchmark your level."
          })
        );
        const btnRow = el("div", { class: "btn-row" });
        const startBtn = el("a", {
          class: "btn btn--primary",
          attrs: { href: "examen.html" },
          text: S.lang === "fr" ? "Démarrer un examen blanc" : "Start mock exam"
        });
        btnRow.appendChild(startBtn);
        empty.appendChild(btnRow);
        examHistHost.appendChild(empty);
      } else {
        const table = el("table");
        const thead = el("thead");
        thead.appendChild(
          el("tr", {}, [
            el("th", { text: S.lang === "fr" ? "Date" : "Date" }),
            el("th", { text: S.lang === "fr" ? "Score" : "Score" }),
            el("th", { text: S.lang === "fr" ? "Réussite" : "Percentage" }),
            el("th", { text: S.lang === "fr" ? "Durée" : "Duration" }),
            el("th", { text: S.lang === "fr" ? "Mention" : "Status" })
          ])
        );
        table.appendChild(thead);
        const tbody = el("tbody");
        exams.forEach(function (e) {
          const d = new Date(e.at);
          const dateStr = d.toLocaleDateString(S.lang === "fr" ? "fr-FR" : "en-US", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          });
          const percentage = pct(e.score, e.total);
          const durMin = Math.floor((e.durationSec || 0) / 60);
          const durSec = (e.durationSec || 0) % 60;
          const durStr = durMin + " min " + durSec + " s";
          const pass = percentage >= 75;

          const badge = el("span", {
            class: "badge " + (pass ? "badge--accent" : "badge--danger"),
            text: pass
              ? (S.lang === "fr" ? "Prêt (≥75%)" : "Pass (≥75%)")
              : (S.lang === "fr" ? "À approfondir" : "Needs review")
          });

          tbody.appendChild(
            el("tr", {}, [
              el("td", { text: dateStr }),
              el("td", {}, el("strong", { text: e.score + " / " + e.total })),
              el("td", { text: percentage + " %" }),
              el("td", { class: "muted", text: durStr }),
              el("td", {}, badge)
            ])
          );
        });
        table.appendChild(tbody);
        examHistHost.appendChild(el("div", { class: "table-scroll" }, table));
      }
    }

    // Réinitialisation de la progression.
    const reset = $("#resetProgress");
    if (reset) {
      reset.addEventListener("click", function () {
        const msg =
          S.lang === "fr"
            ? "Effacer toute la progression enregistrée ? Cette action est irréversible."
            : "Erase all recorded progress? This cannot be undone.";
        if (!window.confirm(msg)) return;
        S.answers = {};
        S.exams = [];
        S.tasks = {};
        saveState();
        location.reload();
      });
    }
  }

  /* ------------------------------------------------------------- Planning */
  function initPlan() {
    const host = $("#plan");
    if (!host) return;
    const plan = window.PCA_PLAN || [];
    const today = new Date().toISOString().slice(0, 10);

    plan.forEach(function (day) {
      const isToday = day.date === today;
      const isPast = day.date < today;
      const card = el("div", {
        class: "day" + (isToday ? " day--today" : "") + (isPast ? " day--past" : "")
      });

      const head = el("div", { class: "day__head" });
      head.appendChild(el("span", { class: "day__title", text: day.label }));
      head.appendChild(el("span", { class: "badge", text: day.lang }));
      if (isToday) head.appendChild(el("span", { class: "badge badge--primary", text: S.lang === "fr" ? "Aujourd'hui" : "Today" }));
      head.appendChild(el("span", { class: "muted", text: day.focus }));
      card.appendChild(head);

      const body = el("div", { class: "day__body" });
      day.tasks.forEach(function (task, i) {
        const key = day.date + "#" + i;
        const label = el("label", { class: "task" + (S.tasks[key] ? " task--done" : "") });
        const cb = el("input", { attrs: { type: "checkbox" } });
        cb.checked = !!S.tasks[key];
        cb.addEventListener("change", function () {
          S.tasks[key] = cb.checked;
          saveState();
          label.classList.toggle("task--done", cb.checked);
          updatePlanProgress();
        });
        label.appendChild(cb);
        label.appendChild(el("span", { text: task }));
        body.appendChild(label);
      });
      card.appendChild(body);
      host.appendChild(card);
    });

    updatePlanProgress();

    function updatePlanProgress() {
      const wrap = $("#planProgress");
      if (!wrap) return;
      let total = 0;
      let done = 0;
      plan.forEach(function (d) {
        d.tasks.forEach(function (_, i) {
          total++;
          if (S.tasks[d.date + "#" + i]) done++;
        });
      });
      clear(wrap);
      wrap.appendChild(
        el("div", { class: "stat__label", text: S.lang === "fr" ? "Progression du plan" : "Plan progress" })
      );
      wrap.appendChild(el("div", { class: "stat__value", text: pct(done, total) + " %" }));
      const bar = el("div", { class: "bar" });
      const fill = el("div", { class: "bar__fill bar__fill--accent" });
      fill.style.width = pct(done, total) + "%";
      bar.appendChild(fill);
      wrap.appendChild(bar);
      wrap.appendChild(el("div", { class: "stat__hint", text: done + " / " + total }));
    }
  }

  /* --------------------------------------------------------- Fiches / contenu */
  function initContent() {
    // Méthode en six étapes
    const mHost = $("#method");
    if (mHost && window.PCA_METHOD) {
      window.PCA_METHOD.forEach(function (s) {
        const d = el("details");
        d.appendChild(el("summary", { text: s.n + ". " + s.title }));
        d.appendChild(el("p", { text: s.body }));
        mHost.appendChild(d);
      });
    }

    // Piliers du WAF
    const wHost = $("#waf");
    if (wHost && window.PCA_WAF) {
      window.PCA_WAF.forEach(function (p) {
        const d = el("details");
        d.appendChild(el("summary", { text: p.fr + "  —  " + p.en }));
        d.appendChild(el("p", { text: p.reflex }));
        const kw = el("p");
        p.keywords.forEach(function (k, i) {
          if (i) kw.appendChild(document.createTextNode("  •  "));
          kw.appendChild(el("span", { class: "keyword", text: k }));
        });
        d.appendChild(kw);
        wHost.appendChild(d);
      });
    }

    // Mots-clés déclencheurs
    const tHost = $("#triggers");
    if (tHost && window.PCA_TRIGGERS) {
      const table = el("table");
      const thead = el("thead");
      thead.appendChild(
        el("tr", {}, [
          el("th", { text: "Signal (EN)" }),
          el("th", { text: "Sens" }),
          el("th", { text: "Réflexe" })
        ])
      );
      table.appendChild(thead);
      const tb = el("tbody");
      window.PCA_TRIGGERS.forEach(function (t) {
        tb.appendChild(
          el("tr", {}, [
            el("td", {}, el("span", { class: "keyword", text: t.en })),
            el("td", { text: t.fr }),
            el("td", { text: t.reflex })
          ])
        );
      });
      table.appendChild(tb);
      tHost.appendChild(el("div", { class: "table-scroll" }, table));
    }

    // Arbres de décision
    const dHost = $("#decisions");
    if (dHost && window.PCA_DECISIONS) {
      window.PCA_DECISIONS.forEach(function (block) {
        dHost.appendChild(el("h3", { text: block.title }));
        const table = el("table");
        const thead = el("thead");
        thead.appendChild(
          el("tr", {}, [
            el("th", { text: S.lang === "fr" ? "Besoin" : "Need" }),
            el("th", { text: S.lang === "fr" ? "Choix" : "Choice" }),
            el("th", { text: S.lang === "fr" ? "Pourquoi" : "Why" }),
            el("th", { text: S.lang === "fr" ? "Piège" : "Pitfall" })
          ])
        );
        table.appendChild(thead);
        const tb = el("tbody");
        block.rows.forEach(function (r) {
          tb.appendChild(
            el("tr", {}, [
              el("td", { text: r[0] }),
              el("td", {}, el("strong", { text: r[1] })),
              el("td", { text: r[2] }),
              el("td", { class: "muted", text: r[3] })
            ])
          );
        });
        table.appendChild(tb);
        dHost.appendChild(el("div", { class: "table-scroll" }, table));
      });
    }

    // Études de cas
    const cHost = $("#cases");
    if (cHost && window.PCA_CASES) {
      window.PCA_CASES.forEach(function (c) {
        const card = el("div", { class: "card stack" });
        card.style.marginBottom = "1rem";
        card.appendChild(el("h3", { text: c.name }));
        card.appendChild(el("span", { class: "badge", text: c.sector }));
        card.appendChild(el("p", { text: c.profile }));

        card.appendChild(el("h4", { text: S.lang === "fr" ? "À surveiller" : "Watch for" }));
        const ul1 = el("ul");
        c.watch.forEach(function (w) {
          ul1.appendChild(el("li", { text: w }));
        });
        card.appendChild(ul1);

        card.appendChild(el("h4", { text: S.lang === "fr" ? "Réflexes" : "Reflexes" }));
        const ul2 = el("ul");
        c.reflexes.forEach(function (r) {
          ul2.appendChild(el("li", { text: r }));
        });
        card.appendChild(ul2);
        cHost.appendChild(card);
      });
    }

    // Glossaire, avec filtre de recherche
    const gHost = $("#glossary");
    if (gHost && window.PCA_GLOSSARY) {
      const search = $("#glossarySearch");
      const table = el("table");
      const thead = el("thead");
      thead.appendChild(
        el("tr", {}, [el("th", { text: "English" }), el("th", { text: "Français" }), el("th", { text: "Note" })])
      );
      table.appendChild(thead);
      const tb = el("tbody");
      table.appendChild(tb);
      gHost.appendChild(el("div", { class: "table-scroll" }, table));

      function draw(filter) {
        clear(tb);
        const f = (filter || "").trim().toLowerCase();
        window.PCA_GLOSSARY.filter(function (g) {
          return !f || g.en.toLowerCase().indexOf(f) !== -1 || g.fr.toLowerCase().indexOf(f) !== -1;
        }).forEach(function (g) {
          tb.appendChild(
            el("tr", {}, [
              el("td", {}, el("strong", { text: g.en })),
              el("td", { text: g.fr }),
              el("td", { class: "muted", text: g.note })
            ])
          );
        });
      }
      draw("");
      if (search) {
        search.addEventListener("input", function () {
          draw(search.value);
        });
      }
    }

    // Rappels du jour J
    const ddHost = $("#dday");
    if (ddHost && window.PCA_DDAY) {
      const ul = el("ul");
      window.PCA_DDAY.forEach(function (t) {
        ul.appendChild(el("li", { text: t }));
      });
      ddHost.appendChild(ul);
    }
  }

  /* ---------------------------------------------------------- Flashcards */
  function initFlashcards() {
    const host = $("#flashcards");
    if (!host) return;
    const items = shuffle(window.PCA_GLOSSARY || []);
    let i = 0;
    let shown = false;

    function draw() {
      clear(host);
      if (!items.length) return;
      const item = items[i % items.length];

      const card = el("div", { class: "flashcard", attrs: { tabindex: "0", role: "button" } });
      if (!shown) {
        card.appendChild(
          el("div", {}, [
            el("div", { class: "flashcard__term", text: item.en }),
            el("div", { class: "flashcard__hint", text: L(T.reveal) })
          ])
        );
      } else {
        card.appendChild(
          el("div", {}, [
            el("div", { class: "flashcard__term", text: item.fr }),
            el("p", { class: "muted", text: item.note }),
            el("div", { class: "flashcard__hint", text: item.en })
          ])
        );
      }
      const flip = function () {
        shown = !shown;
        draw();
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flip();
        }
      });
      host.appendChild(card);

      const row = el("div", { class: "btn-row" });
      row.style.marginTop = "1rem";
      row.style.justifyContent = "center";
      const next = el("button", {
        class: "btn btn--primary",
        text: S.lang === "fr" ? "Carte suivante" : "Next card",
        attrs: { type: "button" }
      });
      next.addEventListener("click", function () {
        i++;
        shown = false;
        draw();
      });
      row.appendChild(next);
      row.appendChild(
        el("span", { class: "muted", text: ((i % items.length) + 1) + " / " + items.length })
      );
      host.appendChild(row);
    }
    draw();
  }

  /* ------------------------------------------------------------------ Boot */
  document.addEventListener("DOMContentLoaded", function () {
    initChrome();
    initDashboard();
    initPlan();
    initContent();
    initPractice();
    initExam();
    initFlashcards();

    // Enregistrement du Service Worker pour fonctionnement hors-ligne (PWA)
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js").then(function (reg) {
          console.log("PCA Prep SW enregistré :", reg.scope);
        }).catch(function (err) {
          console.warn("PCA Prep SW non enregistré :", err);
        });
      });
    }
  });
})();

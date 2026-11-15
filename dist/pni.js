"use strict";

// Seção "Gramática": a Emma escolhe e corrige os exercícios, a Sophia agenda as revisões.
// O progresso fica só neste navegador.
(() => {
  const get = (name) => document.getElementById("pni-" + name);
  const storageKey = "ingles-em-10:pni-grammar:v1";
  const {catalog, explanations} = pniData;
  const core = pniCore;
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {day: "numeric", month: "long"});
  const timeLabel = new Intl.DateTimeFormat("pt-BR", {hour: "2-digit", minute: "2-digit"});
  let progress = core.emptyProgress();
  let item = null;
  let graded = false;
  let answered = 0;
  let hits = 0;
  let locked = false; // progresso de outra versão do site: não sobrescrever

  function backup(raw) {
    try {
      localStorage.setItem(storageKey + ":copia:" + new Date().toISOString(), raw);
    } catch {
      // sem espaço ou sem acesso: segue sem a cópia
    }
  }

  // Lê o progresso salvo. Itens com problema são separados (com cópia) sem perder os outros.
  function load() {
    let raw = null;
    try {
      raw = localStorage.getItem(storageKey);
    } catch {
      return "Este navegador não deixa salvar o progresso.";
    }
    if (raw === null) {
      progress = core.emptyProgress();
      return "";
    }
    let saved;
    try {
      saved = JSON.parse(raw);
    } catch {
      saved = null;
    }
    if (saved && typeof saved.schema === "number" && saved.schema > 1) {
      locked = true;
      progress = core.emptyProgress();
      return "Seu progresso foi salvo por uma versão mais nova do site. Recarregue a página.";
    }
    if (saved?.schema !== 1 || !saved.items || typeof saved.items !== "object" || Array.isArray(saved.items)) {
      backup(raw);
      progress = core.emptyProgress();
      return "Não deu para ler o progresso salvo. Guardamos uma cópia e começamos do zero.";
    }
    const items = {};
    let dropped = 0;
    for (const [id, entry] of Object.entries(saved.items)) {
      try {
        core.states({schema: 1, items: {[id]: entry}}, catalog);
        items[id] = entry;
      } catch {
        dropped++;
      }
    }
    progress = {...saved, items};
    if (!dropped) return "";
    backup(raw);
    return dropped === 1 ? "Um registro estava com problema e foi separado. O resto do progresso continua."
      : dropped + " registros estavam com problema e foram separados. O resto do progresso continua.";
  }

  function save() {
    if (locked) return false;
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      return true;
    } catch {
      return false;
    }
  }

  function whenLabel(time) {
    const now = Date.now();
    if (time - now < 60 * 60 * 1000) return "daqui a " + Math.max(1, Math.round((time - now) / 60000)) + " min";
    const day = (moment) => new Date(moment).toDateString();
    if (day(now) === day(time)) return "hoje às " + timeLabel.format(time);
    if (day(now + 24 * 60 * 60 * 1000) === day(time)) return "amanhã";
    return "em " + dateLabel.format(time);
  }

  function renderStatus() {
    const {due, fresh, nextReviewAt} = core.summary(progress, catalog, Date.now());
    const parts = [];
    if (due) parts.push(due === 1 ? "1 revisão para agora" : due + " revisões para agora");
    if (fresh) parts.push(fresh === 1 ? "1 exercício novo" : fresh + " exercícios novos");
    if (!parts.length) parts.push(nextReviewAt ? "Tudo em dia · próxima revisão " + whenLabel(nextReviewAt) : "Tudo em dia");
    get("status").textContent = parts.join(" · ");
    get("begin").disabled = locked || (!due && !fresh);
  }

  function showHome() {
    get("start").hidden = false;
    get("round").hidden = true;
    renderStatus();
  }

  function finish(message) {
    get("round").hidden = true;
    get("start").hidden = false;
    renderStatus();
    get("note").textContent = message;
    get("note").focus();
  }

  function showItem() {
    item = core.nextItem(progress, catalog, Date.now());
    if (!item) {
      finish(answered ? "Você respondeu " + answered + " e acertou " + hits + ". Por hoje é isso!" : "Tudo em dia por agora.");
      return;
    }
    graded = false;
    const known = core.states(progress, catalog).get(item.id);
    get("kind").textContent = known ? "REVISÃO" : "NOVO";
    get("prompt").textContent = item.prompt;
    get("hint").textContent = item.type === "choice" ? "Escolha a resposta." : "Escreva a resposta em inglês.";
    get("feedback").textContent = "";
    get("explanation").textContent = "";
    get("next").hidden = true;
    get("fill").hidden = item.type === "choice";
    get("check").hidden = item.type === "choice";
    get("input").value = "";
    get("input").disabled = false;
    const buttons = (item.choices ?? []).map((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.lang = "en";
      button.textContent = choice;
      button.addEventListener("click", () => grade(choice, button));
      return button;
    });
    get("choices").hidden = !buttons.length;
    get("choices").replaceChildren(...buttons);
    if (item.type === "choice") get("prompt").focus();
    else get("input").focus();
  }

  function grade(answer, selectedButton) {
    if (graded || !item || !answer.trim()) return;
    const correct = core.isCorrect(answer, item.accepted);
    load(); // outra aba pode ter salvo algo desde a última leitura
    let state;
    try {
      ({progress, state} = core.recordAttempt(progress, item.id, correct, Date.now()));
    } catch (error) {
      get("feedback").textContent = error instanceof RangeError
        ? "O relógio do aparelho parece errado. Confira a data e a hora."
        : "Algo deu errado ao registrar a resposta. Recarregue a página.";
      return;
    }
    graded = true;
    const saved = save();
    answered++;
    if (correct) hits++;
    get("input").disabled = true;
    get("check").hidden = true;
    for (const button of get("choices").children) {
      button.disabled = true;
      if (core.isCorrect(button.textContent, item.accepted)) button.classList.add("correct");
    }
    if (!correct) selectedButton?.classList.add("incorrect");
    get("feedback").textContent = (correct ? "Acertou!" : "Resposta: " + item.accepted[0] + ".")
      + " Volta para revisão " + whenLabel(state.nextReviewAt) + "."
      + (saved ? "" : " (Não deu para salvar neste navegador.)");
    get("explanation").textContent = explanations[item.explanation_key] ?? "";
    get("next").hidden = false;
    get("next").focus();
  }

  get("begin").addEventListener("click", () => {
    answered = 0;
    hits = 0;
    get("note").textContent = "";
    get("start").hidden = true;
    get("round").hidden = false;
    showItem();
  });
  get("form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!get("input").value.trim()) {
      get("input").focus();
      return;
    }
    grade(get("input").value);
  });
  get("next").addEventListener("click", showItem);
  get("stop").addEventListener("click", () => finish(answered
    ? "Você respondeu " + answered + " e acertou " + hits + ". Até a próxima!" : "Tudo bem. Até a próxima!"));
  const refreshHome = () => {
    if (!document.hidden && !get("start").hidden) renderStatus();
  };
  document.addEventListener("visibilitychange", refreshHome);
  setInterval(refreshHome, 30 * 1000); // "volta em 10 min" aparece sem recarregar
  window.addEventListener("storage", (event) => {
    if (event.key !== storageKey) return;
    load();
    refreshHome();
  });

  get("note").textContent = load();
  showHome();
})();

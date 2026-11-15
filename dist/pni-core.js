"use strict";

// Núcleo determinístico da Emma (ensino) e da Sophia (revisão), portado de
// GladistoneSouza/English_PNI (english_pni/grading.py, sophia.py, emma.py).
// Sem LLM e sem rede. tests/pni-core.test.mjs confere este arquivo contra
// resultados gerados pelo Python (tests/pni-golden.json).
(function (root) {
  const MINUTE = 60 * 1000;
  const DAY = 24 * 60 * MINUTE;
  const RETRY_AFTER = 10 * MINUTE;
  const BOX_INTERVALS = [RETRY_AFTER, 1 * DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY];
  const MAX_BOX = BOX_INTERVALS.length - 1;
  const MIN_TIME = Date.UTC(2000, 0, 1);
  const MAX_TIME = Date.UTC(2200, 0, 1);
  const QUOTES = {"’": "'", "‘": "'", "ʼ": "'", "`": "'", "“": "\"", "”": "\""};

  function normalize(text) {
    return String(text).normalize("NFKC")
      .replace(/[’‘ʼ`“”]/g, (char) => QUOTES[char])
      .replace(/\s+/g, " ").trim().toLowerCase()
      .replace(/[.!?;,\s]+$/, "");
  }

  function isCorrect(answer, accepted) {
    const given = normalize(answer);
    return given !== "" && accepted.some((option) => normalize(option) === given);
  }

  function checkTime(time) {
    if (!Number.isFinite(time) || time < MIN_TIME || time >= MAX_TIME) {
      throw new RangeError("horário fora do intervalo aceito");
    }
    return time;
  }

  function nextBox(box, correct) {
    return correct ? Math.min(box + 1, MAX_BOX) : 0;
  }

  // attempts: [{correct: boolean, at: milissegundos UTC}] em ordem.
  function replay(attempts) {
    if (!attempts.length) throw new Error("sem tentativas");
    let box = 0;
    for (const attempt of attempts) box = nextBox(box, attempt.correct);
    const last = attempts[attempts.length - 1].at;
    return {
      box,
      nextReviewAt: last + BOX_INTERVALS[box],
      attempts: attempts.length,
      correct: attempts.filter((attempt) => attempt.correct).length
    };
  }

  function emptyProgress() {
    return {schema: 1, items: {}};
  }

  function readAttempts(progress, itemId) {
    const raw = progress.items[itemId]?.attempts ?? [];
    if (!Array.isArray(raw)) throw new Error("progresso corrompido: " + itemId);
    const attempts = raw.map((entry) => {
      const at = Date.parse(entry?.at);
      if (typeof entry?.correct !== "boolean") throw new Error("progresso corrompido: " + itemId);
      return {correct: entry.correct, at: checkTime(at)};
    });
    for (let index = 1; index < attempts.length; index++) {
      if (attempts[index].at < attempts[index - 1].at) throw new Error("progresso fora de ordem: " + itemId);
    }
    return attempts;
  }

  // Devolve um novo objeto de progresso; não altera o recebido.
  function recordAttempt(progress, itemId, correct, now) {
    if (typeof correct !== "boolean") throw new TypeError("correct precisa ser booleano");
    let at = checkTime(now);
    const attempts = readAttempts(progress, itemId);
    if (attempts.length && at < attempts[attempts.length - 1].at) {
      at = attempts[attempts.length - 1].at; // relógio voltou: nunca grava fora de ordem
    }
    const stored = (progress.items[itemId]?.attempts ?? []).slice();
    stored.push({correct, at: new Date(at).toISOString()});
    const next = {...progress, items: {...progress.items, [itemId]: {attempts: stored}}};
    return {progress: next, state: replay([...attempts, {correct, at}])};
  }

  function states(progress, catalog) {
    const result = new Map();
    for (const item of catalog.items) {
      const attempts = readAttempts(progress, item.id);
      if (attempts.length) result.set(item.id, replay(attempts));
    }
    return result;
  }

  // Revisões vencidas primeiro (por horário, depois ordem do catálogo); depois itens novos.
  function nextItem(progress, catalog, now) {
    const known = states(progress, catalog);
    const due = catalog.items
      .map((item, order) => ({item, order, state: known.get(item.id)}))
      .filter((entry) => entry.state && entry.state.nextReviewAt <= now)
      .sort((a, b) => a.state.nextReviewAt - b.state.nextReviewAt || a.order - b.order);
    if (due.length) return due[0].item;
    return catalog.items.find((item) => !known.has(item.id)) ?? null;
  }

  function summary(progress, catalog, now) {
    const known = states(progress, catalog);
    let due = 0;
    let next = null;
    for (const state of known.values()) {
      if (state.nextReviewAt <= now) due++;
      else if (next === null || state.nextReviewAt < next) next = state.nextReviewAt;
    }
    return {due, fresh: catalog.items.length - known.size, nextReviewAt: next};
  }

  const core = {normalize, isCorrect, nextBox, replay, emptyProgress, recordAttempt, states, nextItem, summary,
    RETRY_AFTER, BOX_INTERVALS};
  root.pniCore = core;
  if (typeof module !== "undefined") module.exports = core;
})(globalThis);

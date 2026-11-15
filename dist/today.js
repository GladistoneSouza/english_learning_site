"use strict";

// Mostrador de hoje: minutos de listening e dias seguidos com treino.
// Usa readDay/practiced de app.js quando existem; senão lê o localStorage direto.
(() => {
  const prefix = "ingles-em-10:v1:";
  const goal = 10;
  const fill = document.getElementById("dial-fill");
  const minutesEl = document.getElementById("dial-minutes");
  const dial = document.getElementById("today-dial");
  const streakEl = document.getElementById("today-streak");
  if (!fill || !minutesEl || !dial || !streakEl) return;

  function key(date) {
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
  }

  function record(date) {
    if (typeof readDay === "function") return readDay(date);
    try {
      const raw = localStorage.getItem(prefix + key(date));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function didPractice(day) {
    if (!day) return false;
    if (typeof practiced === "function") {
      try { return practiced(day); } catch { /* registro antigo */ }
    }
    return day.minutes > 0 || Boolean(day.shadow) || Boolean(day.grammar);
  }

  function streak() {
    const date = new Date();
    let count = 0;
    if (!didPractice(record(date))) date.setDate(date.getDate() - 1);
    while (count < 366 && didPractice(record(date))) {
      count += 1;
      date.setDate(date.getDate() - 1);
    }
    return count;
  }

  function render() {
    const today = record(new Date());
    const minutes = Math.max(0, Math.round(Number(today?.minutes) || 0));
    const shown = Math.min(minutes, goal);
    fill.setAttribute("stroke-dasharray", (shown / goal * 100) + " 100");
    dial.classList.toggle("done", minutes >= goal);
    minutesEl.textContent = String(minutes);
    dial.setAttribute("aria-label", "Listening de hoje: " + minutes + " de " + goal + " minutos");
    const days = streak();
    streakEl.textContent = days === 0 ? "Comece hoje a sua sequência."
      : days === 1 ? "1 dia de treino seguido."
      : days + " dias de treino seguidos.";
  }

  let pending = 0;
  function schedule() {
    clearTimeout(pending);
    pending = setTimeout(render, 150);
  }

  ["input", "change", "click"].forEach((type) => document.addEventListener(type, schedule, true));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
  window.addEventListener("storage", schedule);
  setInterval(render, 15000);
  render();
})();

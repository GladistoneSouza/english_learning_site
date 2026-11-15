// Paridade com o núcleo Python do English_PNI. Rodar: node --test
import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const core = require("../dist/pni-core.js");
const golden = JSON.parse(readFileSync(new URL("./pni-golden.json", import.meta.url), "utf8"));
const context = {};
vm.runInNewContext(readFileSync(new URL("../dist/pni-data.js", import.meta.url), "utf8") + "\nthis.pniData = pniData;", context);
const {catalog, explanations} = JSON.parse(JSON.stringify(context.pniData)); // tira do contexto vm
const T0 = Date.parse("2026-11-15T12:00:00Z");

test("normalize matches Python", () => {
  for (const [text, expected] of golden.normalize) assert.equal(core.normalize(text), expected, JSON.stringify(text));
});

test("isCorrect matches Python", () => {
  for (const [text, accepted, expected] of golden.is_correct) assert.equal(core.isCorrect(text, accepted), expected, text);
});

test("schedule and next item match Python step by step", () => {
  let progress = core.emptyProgress();
  for (const step of golden.steps) {
    const item = catalog.items.find((entry) => entry.id === step.item);
    const correct = core.isCorrect(step.answer, item.accepted);
    const result = core.recordAttempt(progress, step.item, correct, Date.parse(step.at));
    progress = result.progress;
    const label = step.item + " " + step.at;
    assert.equal(correct, step.correct, label);
    assert.equal(result.state.box, step.box, label);
    assert.equal(result.state.nextReviewAt, Date.parse(step.next_review_at), label);
    assert.equal(core.nextItem(progress, catalog, Date.parse(step.probe))?.id ?? null, step.next_item, label);
    const known = core.states(progress, catalog);
    const due = catalog.items.map((entry, order) => ({id: entry.id, order, state: known.get(entry.id)}))
      .filter((entry) => entry.state && entry.state.nextReviewAt <= Date.parse(step.probe))
      .sort((a, b) => a.state.nextReviewAt - b.state.nextReviewAt || a.order - b.order).map((entry) => entry.id);
    assert.deepEqual(due, step.due, label);
  }
});

test("an answer empty after normalization is never correct", () => {
  assert.equal(core.isCorrect(".", ["."]), false);
  assert.equal(core.isCorrect("", [""]), false);
});

test("recordAttempt does not mutate its input", () => {
  const progress = core.emptyProgress();
  const frozen = JSON.stringify(progress);
  core.recordAttempt(progress, "a1.be.001", true, T0);
  assert.equal(JSON.stringify(progress), frozen);
});

test("bad times and corrupted progress are rejected", () => {
  const progress = core.emptyProgress();
  for (const time of [NaN, Date.UTC(1999, 0, 1), Date.UTC(9999, 0, 1)]) {
    assert.throws(() => core.recordAttempt(progress, "a1.be.001", true, time));
  }
  assert.throws(() => core.recordAttempt(progress, "a1.be.001", 1, T0));
  for (const items of [{"a1.be.001": {attempts: "x"}}, {"a1.be.001": {attempts: [{correct: "yes", at: "2026-11-15T12:00:00Z"}]}},
    {"a1.be.001": {attempts: [{correct: true, at: "nope"}]}},
    {"a1.be.001": {attempts: [{correct: true, at: "2026-11-15T12:00:00Z"}, {correct: true, at: "2026-11-14T12:00:00Z"}]}}]) {
    assert.throws(() => core.states({schema: 1, items}, catalog), JSON.stringify(items));
  }
});

test("summary counts due, new and next review", () => {
  let {progress} = core.recordAttempt(core.emptyProgress(), "a1.be.001", false, T0);
  ({progress} = core.recordAttempt(progress, "a1.be.002", true, T0));
  assert.deepEqual(core.summary(progress, catalog, T0),
    {due: 0, fresh: catalog.items.length - 2, nextReviewAt: T0 + core.RETRY_AFTER});
  assert.equal(core.summary(progress, catalog, T0 + core.RETRY_AFTER).due, 1);
});

test("every item has a pt-BR explanation and valid choices", () => {
  for (const item of catalog.items) {
    assert.ok(explanations[item.explanation_key], item.id);
    if (item.type === "choice") {
      for (const answer of item.accepted) assert.ok(item.choices.some((choice) => core.isCorrect(choice, [answer])), item.id);
    }
  }
});

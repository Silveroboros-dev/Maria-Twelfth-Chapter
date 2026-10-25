(function (root) {
  "use strict";
  const VERSION = 1;
  const STORAGE_KEY = "maria-twelfth-chapter-2026-progress-v1";
  const normalize = (value) => String(value ?? "").trim().toUpperCase().replace(/\s+/g, " ");
  const validTime = value => Number.isSafeInteger(value) && value > 0;
  const fresh = () => ({ version: VERSION, phase: "cover", completed: [], hints: {}, attempts: {}, firstTry: [], celebrations: {}, correctStreak: 0, puzzleStartedAt: 0, input: "" });
  function stageList(quest) { return [...quest.stages, { ...quest.gate, id: "gate" }]; }
  function hydrate(saved, quest) {
    if (!saved || saved.version !== VERSION) return fresh();
    const ids = stageList(quest).map(s => s.id);
    const completed = [];
    // Progress is always a contiguous prefix. A saved celebration flag cannot skip chapters.
    for (const id of ids) {
      if (saved.completed?.[completed.length] !== id) break;
      completed.push(id);
    }
    let phase = saved.phase;
    if (completed.length === ids.length) phase = phase === "success" ? "success" : "finale";
    else if (completed.length) phase = phase === "success" ? "success" : "puzzle";
    else if (!["cover", "opening", "search", "puzzle"].includes(phase)) phase = "cover";
    const hints = {};
    for (const id of [...ids, "search"]) hints[id] = Math.max(0, Math.min(3, Number(saved.hints?.[id]) || 0));
    const attempts = {};
    for (const id of ids) attempts[id] = Math.max(0, Math.min(9999, Math.floor(Number(saved.attempts?.[id]) || 0)));
    const firstTry = completed.filter(id => saved.firstTry?.includes(id) && attempts[id] === 1);
    const celebrations = {};
    for (const id of completed) {
      if (["quick", "streak", "both"].includes(saved.celebrations?.[id])) celebrations[id] = saved.celebrations[id];
    }
    const correctStreak = Number.isInteger(saved.correctStreak) && Number.isFinite(saved.correctStreak)
      ? Math.max(0, Math.min(completed.length, saved.correctStreak)) : 0;
    const puzzleStartedAt = phase === "puzzle" && validTime(saved.puzzleStartedAt) ? saved.puzzleStartedAt : 0;
    return { version: VERSION, phase, completed, hints, attempts, firstTry, celebrations, correctStreak, puzzleStartedAt, input: typeof saved.input === "string" ? saved.input.slice(0, 80) : "" };
  }
  function current(state, quest) {
    const index = state.phase === "success" ? state.completed.length-1 : state.completed.length;
    return stageList(quest)[index];
  }
  function matches(stage, input) { return stage.accepted_answers.some(answer => normalize(answer) === normalize(input)); }
  function beginPuzzle(state, now=Date.now()) {
    if (state.phase !== "puzzle" || validTime(state.puzzleStartedAt)) return state;
    return { ...state, puzzleStartedAt: validTime(now) ? now : 0 };
  }
  function complete(state, quest, input, rescue=false) {
    const stage = current(state, quest);
    if (state.phase !== "puzzle" || !stage || (!rescue && !matches(stage, input))) return null;
    return { ...state, phase: "success", completed: [...state.completed, stage.id],
      correctStreak: rescue ? 0 : (state.correctStreak || 0), puzzleStartedAt: 0, input: "" };
  }
  function submit(state, quest, input, now=Date.now()) {
    const stage = current(state, quest);
    // Empty taps are not attempts. Hints never remove a team's chance of a first key.
    if (state.phase !== "puzzle" || !stage || !normalize(input)) return { state, correct: false, firstTry: false, empty: true, celebration: "" };
    const count = (state.attempts?.[stage.id] || 0) + 1;
    const attempted = { ...state, attempts: { ...state.attempts, [stage.id]: count }, input,
      correctStreak: matches(stage, input) ? (state.correctStreak || 0) + 1 : 0 };
    const solved = complete(attempted, quest, input);
    const firstTry = !!solved && count === 1;
    if (firstTry) solved.firstTry = [...(state.firstTry || []), stage.id];
    let celebration = "";
    if (solved) {
      const quick = validTime(state.puzzleStartedAt) && validTime(now)
        && now >= state.puzzleStartedAt && now - state.puzzleStartedAt < 60000;
      const streak = solved.correctStreak % 3 === 0;
      celebration = quick && streak ? "both" : quick ? "quick" : streak ? "streak" : "";
      if (celebration) solved.celebrations = { ...state.celebrations, [stage.id]: celebration };
    }
    return { state: solved || attempted, correct: !!solved, firstTry, empty: false, celebration };
  }
  function advance(state, quest, now=Date.now()) {
    const next = {cover:"opening", opening:"search", search:"puzzle"}[state.phase];
    if (next) return {...state, phase:next, puzzleStartedAt:next === "puzzle" && validTime(now) ? now : 0, input:""};
    if (state.phase === "success") {
      const phase = state.completed.length===stageList(quest).length ? "finale" : "puzzle";
      return {...state, phase, puzzleStartedAt:phase === "puzzle" && validTime(now) ? now : 0, input:""};
    }
    return state;
  }
  function finished(state, quest) { return stageList(quest).every((s,i) => state.completed[i]===s.id); }
  function lastClue(state, quest) {
    const safe = hydrate(state, quest);
    if (!["search", "puzzle", "success", "finale"].includes(safe.phase)) return null;
    if (finished(safe, quest)) return { heading: "The FINAL envelope", text: quest.finale.text.at(-1) };
    const count = safe.completed.length;
    if (!count) return { heading: "Envelope I", text: quest.opening.first_search };
    const target = stageList(quest)[count];
    return { heading: target.id === "gate" ? "The Dawn Gate" : "Envelope " + target.number, text: quest.stages[count-1].success_text };
  }
  const api={VERSION,STORAGE_KEY,normalize,fresh,hydrate,stageList,current,matches,beginPuzzle,complete,submit,advance,finished,lastClue};
  root.QuestCore=api;
  if(typeof module!=="undefined" && module.exports) module.exports=api;
})(typeof window!=="undefined" ? window : globalThis);

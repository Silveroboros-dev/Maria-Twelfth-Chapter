(function (root) {
  "use strict";
  const VERSION = 1;
  const STORAGE_KEY = "maria-twelfth-chapter-2026-progress-v1";
  const normalize = (value) => String(value ?? "").trim().toUpperCase().replace(/\s+/g, " ");
  const fresh = () => ({ version: VERSION, phase: "cover", completed: [], hints: {}, input: "" });
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
    return { version: VERSION, phase, completed, hints, input: typeof saved.input === "string" ? saved.input.slice(0, 80) : "" };
  }
  function current(state, quest) {
    const index = state.phase === "success" ? state.completed.length-1 : state.completed.length;
    return stageList(quest)[index];
  }
  function matches(stage, input) { return stage.accepted_answers.some(answer => normalize(answer) === normalize(input)); }
  function complete(state, quest, input, rescue=false) {
    const stage = current(state, quest);
    if (state.phase !== "puzzle" || !stage || (!rescue && !matches(stage, input))) return null;
    return { ...state, phase: "success", completed: [...state.completed, stage.id], input: "" };
  }
  function advance(state, quest) {
    const next = {cover:"opening", opening:"search", search:"puzzle"}[state.phase];
    if (next) return {...state, phase:next, input:""};
    if (state.phase === "success") return {...state, phase:state.completed.length===stageList(quest).length ? "finale" : "puzzle", input:""};
    return state;
  }
  function finished(state, quest) { return stageList(quest).every((s,i) => state.completed[i]===s.id); }
  const api={VERSION,STORAGE_KEY,normalize,fresh,hydrate,stageList,current,matches,complete,advance,finished};
  root.QuestCore=api;
  if(typeof module!=="undefined" && module.exports) module.exports=api;
})(typeof window!=="undefined" ? window : globalThis);

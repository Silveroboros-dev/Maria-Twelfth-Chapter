/* Original castle effects ship with the game; playback never controls quest progress. */
(function (root) {
  "use strict";
  const SOUNDS = { door: "assets/castle-door.mp3?v=11", gate: "assets/dawn-gate.mp3?v=11", failure: "assets/locked-door.mp3?v=11" };
  function create(audio, options = {}) {
    let enabled = options.enabled !== false, revision = 0, active = "", message = "";
    const snapshot = () => ({ enabled, active, playing: !!active && !audio.paused, message });
    const notify = () => options.onChange?.(snapshot());
    function stop() {
      revision++;
      active = "";
      message = "";
      audio.pause();
      try { audio.currentTime = 0; } catch { /* no metadata yet */ }
      notify();
    }
    function failed(token) {
      if (token !== revision) return;
      active = "";
      message = "Sound could not play. Try a preview below; the quest can continue quietly.";
      notify();
    }
    function play(kind) {
      if (!enabled || !SOUNDS[kind]) return false;
      stop();
      const token = revision;
      active = kind;
      message = kind === "failure" ? "The lock holds. Try another key." : kind === "gate" ? "The Dawn Gate is opening." : "The iron door is opening.";
      if (audio.getAttribute("src") !== SOUNDS[kind]) {
        audio.src = SOUNDS[kind]; audio.load();
      }
      // Call play directly during the answer/preview tap, including on iPad Safari.
      try { Promise.resolve(audio.play()).then(() => { if (token === revision) notify(); }).catch(() => failed(token)); }
      catch { failed(token); }
      notify();
      return true;
    }
    function setEnabled(value) {
      enabled = !!value;
      if (!enabled) stop();
      message = enabled ? "Castle sounds are on." : "Castle sounds are muted.";
      notify();
    }
    audio.addEventListener("ended", () => {
      if (!audio.ended) return;
      active = ""; message = ""; notify();
    });
    audio.addEventListener("error", () => { if (active && audio.error) failed(revision); });
    return { play, stop, setEnabled, snapshot };
  }
  const api = { SOUNDS, create };
  root.QuestEffects = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

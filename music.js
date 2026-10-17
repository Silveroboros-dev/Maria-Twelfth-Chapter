/* Device-only soundtrack. No file bytes or names leave this tab. */
(function (root) {
  "use strict";
  const TRACKS = {
    main: { title: "Towards the Sun", artist: "Rihanna" },
    victory: { title: "Unstoppable", artist: "Sia" },
    finale: { title: "Unwritten", artist: "Natasha Bedingfield" }
  };
  function create(audio, options = {}) {
    const makeURL = options.makeURL || (file => URL.createObjectURL(file));
    const revokeURL = options.revokeURL || (url => URL.revokeObjectURL(url));
    const files = {};
    let context = "main", active = "", intent = false, revision = 0, expectedPauses = 0;
    let cueStart = 0, cueEnd = 12, returnTo = null, pendingSeek = null, message = "Choose the songs below, then tap Start music.";
    const snapshot = () => ({ context, active, playing: intent && !audio.paused, intent, message,
      files: Object.fromEntries(Object.entries(files).map(([key, file]) => [key, file.name])), cueStart });
    const notify = () => options.onChange?.(snapshot());
    function pauseMedia() {
      if (!audio.paused) expectedPauses++;
      audio.pause();
    }
    function seek() {
      if (!pendingSeek || pendingSeek.revision !== revision) return;
      if (!Number.isFinite(audio.duration)) return;
      const time = pendingSeek.time < audio.duration ? pendingSeek.time : 0;
      try { audio.currentTime = time; pendingSeek = null; if (active === "victory") cueEnd = time + 12; } catch { /* retry on metadata */ }
    }
    function play() {
      const token = revision;
      intent = true;
      message = "";
      // Keep this call synchronous with the button tap for Safari's media policy.
      let result;
      try { result = audio.play(); } catch (error) { result = Promise.reject(error); }
      Promise.resolve(result).then(() => { if (token === revision) notify(); }).catch(() => {
        if (token !== revision) return;
        failed("Tap Start music to resume. If it still cannot play, choose a downloaded MP3 or M4A file.");
      });
      notify();
    }
    function switchTo(kind, time, shouldPlay) {
      revision++;
      pauseMedia();
      pendingSeek = null;
      active = files[kind] ? kind : "";
      intent = false;
      if (!active) {
        audio.removeAttribute("src"); audio.load();
        message = `Choose ${TRACKS[kind].title} below to play this part.`;
        notify(); return;
      }
      audio.src = files[kind].url;
      audio.loop = kind === "main";
      pendingSeek = { revision, time: Math.max(0, time || 0) };
      audio.load(); seek();
      message = "";
      if (shouldPlay) play(); else notify();
    }
    function endCue() {
      if (active !== "victory" || !returnTo) return;
      const resume = returnTo;
      returnTo = null;
      switchTo(context, context === "main" ? resume.time : 0, resume.play && intent);
    }
    function failed(note) {
      if (active === "victory" && returnTo) {
        const resume = returnTo, shouldPlay = resume.play && intent;
        returnTo = null;
        switchTo(context, context === "main" ? resume.time : 0, shouldPlay);
        message = active === context ? "The Unstoppable cue could not play. Returned to the main theme; choose another victory file to try again." : "The Unstoppable cue could not play. Choose the main theme file below to continue with music.";
      } else { intent = false; message = note; }
      notify();
    }
    audio.addEventListener("loadedmetadata", seek);
    audio.addEventListener("playing", notify);
    audio.addEventListener("pause", () => {
      if (expectedPauses) { expectedPauses--; return; }
      intent = false; notify();
    });
    audio.addEventListener("timeupdate", () => { if (!pendingSeek && active === "victory" && audio.currentTime >= cueEnd) endCue(); });
    audio.addEventListener("ended", () => {
      // Ignore an ended event queued by a source which has since been replaced.
      if (!audio.ended) return;
      if (active === "victory") endCue();
      else { intent = false; notify(); }
    });
    audio.addEventListener("error", () => {
      if (!audio.error) return;
      failed("This file could not play. Choose a downloaded MP3 or M4A file. The quest can continue without music.");
    });
    function select(kind, file) {
      if (!TRACKS[kind] || !file) return;
      if (!/^audio\//.test(file.type || "") && !/\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(file.name || "")) {
        message = "Please choose an audio file, such as MP3 or M4A."; notify(); return;
      }
      const old = files[kind], wasPlaying = intent;
      const extension = file.name?.split(".").pop().toLowerCase();
      const mime = { mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg", flac: "audio/flac" }[extension];
      const typed = !/^audio\//.test(file.type || "") && mime ? new Blob([file], { type: mime }) : file;
      files[kind] = { url: makeURL(typed), name: file.name };
      if (active === kind || (!active && kind === context)) {
        if (kind === "victory") {
          const resume = returnTo || { time: 0, play: false };
          returnTo = null; switchTo(context, resume.time, resume.play && wasPlaying);
        }
        else switchTo(kind, 0, wasPlaying);
      }
      if (old) revokeURL(old.url);
      message = "File ready on this device. Keep this tab open; reloading means selecting the files again.";
      notify();
    }
    function start() {
      if (active) play(); else switchTo(context, 0, true);
    }
    function pause() { revision++; if (pendingSeek) pendingSeek.revision = revision; intent = false; pauseMedia(); message = "Music paused."; notify(); }
    function setContext(finale) {
      const next = finale ? "finale" : "main";
      if (next === context) return;
      context = next; returnTo = null;
      switchTo(context, 0, intent);
    }
    function victory(preview = false) {
      if (context === "finale" || !files.victory || active === "victory" || (!preview && !intent)) return false;
      returnTo = { time: active === "main" ? audio.currentTime : 0, play: intent };
      cueEnd = cueStart + 12;
      switchTo("victory", cueStart, true);
      return true;
    }
    function setCueStart(value) { cueStart = Math.max(0, Math.min(3600, Number(value) || 0)); notify(); }
    function reset() { context = "main"; returnTo = null; switchTo("main", 0, false); }
    return { select, start, pause, setContext, victory, setCueStart, reset, snapshot };
  }
  const api = { TRACKS, create };
  root.QuestMusic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

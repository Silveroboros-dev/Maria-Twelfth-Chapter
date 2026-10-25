/* Visible YouTube soundtrack. The player is created only after a play request. */
(function (root) {
  "use strict";

  const TRACKS = Object.freeze({
    main: Object.freeze({ title: "Towards the Sun", artist: "Rihanna", videoId: "G3jq77_P-cA", start: 0 }),
    victory: Object.freeze({ title: "Unstoppable", artist: "Sia", videoId: "lIaGs-bWxEk", start: 46 }),
    finale: Object.freeze({ title: "Unwritten", artist: "Natasha Bedingfield", videoId: "b7k0a5hYnSI", start: 121 })
  });
  let apiPromise;

  function defaultLoadApi(doc) {
    if (root.YT?.Player) return Promise.resolve(root.YT);
    if (apiPromise) return apiPromise;
    apiPromise = new Promise((resolve, reject) => {
      const previous = root.onYouTubeIframeAPIReady;
      const script = doc.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      root.onYouTubeIframeAPIReady = function () {
        if (typeof previous === "function") previous();
        if (root.YT?.Player) resolve(root.YT);
        else reject(new Error("YouTube player API did not initialize"));
      };
      script.onerror = () => reject(new Error("YouTube player API could not load"));
      (doc.head || doc.body).appendChild(script);
    }).catch(error => { apiPromise = null; throw error; });
    return apiPromise;
  }

  function create(container, options = {}) {
    if (!container) throw new TypeError("A persistent video container is required");
    const doc = options.document || root.document;
    const loadApi = options.loadApi || (() => defaultLoadApi(doc));
    const playerFactory = options.playerFactory || ((iframe, config, YT) => new YT.Player(iframe, config));
    const setTimer = options.setInterval || root.setInterval.bind(root);
    const clearTimer = options.clearInterval || root.clearInterval.bind(root);
    const origin = options.origin || root.location?.origin || "";
    let context = "main", active = "", visible = false, playing = false, intent = false;
    let message = "Tap Play video to open YouTube inside the quest.", cueStart = TRACKS.victory.start;
    let iframe = null, player = null, playerReady = false, timer = null, returnTo = null;
    let revision = 0, playerEpoch = 0, sourceStart = 0, sourceStarted = false;

    const snapshot = () => ({ context, active, visible, playing, intent, message, cueStart });
    const notify = () => options.onChange?.(snapshot());
    const track = kind => TRACKS[kind];
    const sourceId = () => track(active)?.videoId;

    function urlFor(kind, start, autoplay) {
      const args = new URLSearchParams({ controls: "1", playsinline: "1", rel: "0", enablejsapi: "1", autoplay: autoplay ? "1" : "0", start: String(Math.floor(start)) });
      if (kind === "victory") args.set("end", String(Math.floor(start + 12)));
      if (/^https?:\/\//.test(origin)) args.set("origin", origin);
      return `https://www.youtube-nocookie.com/embed/${track(kind).videoId}?${args}`;
    }

    function createIframe(kind, start, autoplay) {
      const frame = doc.createElement("iframe");
      frame.title = `${track(kind).title} — ${track(kind).artist} on YouTube`;
      frame.src = urlFor(kind, start, autoplay);
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      frame.allowFullscreen = true;
      frame.setAttribute("loading", "eager");
      container.replaceChildren(frame);
      iframe = frame;
      visible = true;
    }

    function stopTimer() {
      if (timer !== null) { clearTimer(timer); timer = null; }
    }

    function currentTime() {
      if (!playerReady || typeof player?.getCurrentTime !== "function") return sourceStart;
      try {
        const time = Number(player.getCurrentTime());
        return Number.isFinite(time) && time >= 0 ? time : sourceStart;
      } catch { return sourceStart; }
    }

    function matchesSource(target) {
      if (!player || target !== player || !visible || !active) return false;
      try {
        const id = target.getVideoData?.()?.video_id;
        return !id || id === sourceId();
      } catch { return true; }
    }

    function startTimer() {
      stopTimer();
      if (active !== "victory" || !playing || !intent || !playerReady) return;
      const token = revision;
      timer = setTimer(() => {
        if (token !== revision || active !== "victory" || !playing || !intent) { stopTimer(); return; }
        if (currentTime() >= sourceStart + 12) restoreMain();
      }, 250);
    }

    function destroyPlayer() {
      stopTimer();
      playerEpoch++;
      const old = player;
      player = null;
      playerReady = false;
      if (old) { try { old.destroy(); } catch { /* Remove the iframe below regardless. */ } }
      container.replaceChildren();
      iframe = null;
    }

    function close() {
      revision++;
      destroyPlayer();
      active = "";
      visible = false;
      playing = false;
      intent = false;
      returnTo = null;
      message = "Video closed. Tap Start music to open it again.";
      notify();
    }

    function sourceSpec(kind, start) {
      const spec = { videoId: track(kind).videoId, startSeconds: start };
      if (kind === "victory") spec.endSeconds = start + 12;
      return spec;
    }

    function switchSource(kind, start, shouldPlay) {
      revision++;
      stopTimer();
      active = kind;
      sourceStart = start;
      sourceStarted = false;
      intent = shouldPlay;
      playing = false;
      if (iframe) iframe.title = `${track(kind).title} — ${track(kind).artist} on YouTube`;
      message = shouldPlay
        ? "Video opened. If it does not start, tap Play in the video."
        : "Video ready. Tap Play in the video.";
      if (player && playerReady) {
        try {
          const command = shouldPlay ? "loadVideoById" : "cueVideoById";
          player[command](sourceSpec(kind, start));
        } catch {
          message = "YouTube controls are unavailable. Use Play in the visible video.";
          destroyPlayer();
          createIframe(kind, start, shouldPlay);
          ensureSdk();
        }
      } else if (player) {
        // An SDK player still initializing may be bound to the previous source.
        destroyPlayer();
        createIframe(kind, start, shouldPlay);
        ensureSdk();
      } else {
        if (iframe) iframe.src = urlFor(kind, start, shouldPlay);
        else createIframe(kind, start, shouldPlay);
        ensureSdk();
      }
      notify();
    }

    function restoreMain() {
      if (context !== "main" || active !== "victory" || !returnTo) return;
      const saved = returnTo;
      returnTo = null;
      switchSource("main", saved.time, saved.intent && intent);
    }

    function ensureSdk() {
      if (player || !visible) return;
      const token = revision, frame = iframe, epoch = playerEpoch;
      Promise.resolve().then(loadApi).then(YT => {
        if (token !== revision || epoch !== playerEpoch || frame !== iframe || !visible || !intent || player) return;
        const handlerEpoch = playerEpoch;
        const events = {
          onReady(event) {
            if (handlerEpoch !== playerEpoch || !matchesSource(event.target)) return;
            playerReady = true;
            if (intent) {
              try { player.playVideo(); } catch { message = "Tap Play in the visible video."; notify(); }
            }
          },
          onStateChange(event) {
            if (handlerEpoch !== playerEpoch || !matchesSource(event.target)) return;
            const state = event.data;
            if (state === 1) {
              sourceStarted = true;
              playing = true;
              intent = true;
              message = "";
              startTimer();
            } else if (state === 2) {
              playing = false;
              intent = false;
              stopTimer();
              message = "Video paused. Tap Play in the video to resume.";
            } else if (state === 0) {
              if(active === "victory" && !sourceStarted)return;
              playing = false;
              stopTimer();
              if (active === "victory" && intent) { restoreMain(); return; }
              intent = false;
              message = "Video ended. Use the music controls to replay.";
            } else if (state === 3 || state === 5) {
              playing = false;
              stopTimer();
            }
            notify();
          },
          onAutoplayBlocked(event) {
            if (handlerEpoch !== playerEpoch || !matchesSource(event.target)) return;
            playing = false;
            intent = false;
            stopTimer();
            message = "Autoplay was blocked. Tap Play in the visible YouTube video.";
            notify();
          },
          onError(event) {
            if (handlerEpoch !== playerEpoch || !matchesSource(event.target)) return;
            options.onError?.({code:event.data,videoId:sourceId()});
            if(active === "victory" && returnTo){
              restoreMain();
              message = "The Unstoppable clip could not play. Returned to Towards the Sun.";
              notify();return;
            }
            playing = false;
            intent = false;
            stopTimer();
            message = event.data===101||event.data===150 ? "YouTube does not allow this video to play here. Use Open on YouTube below." : event.data===153 ? "Open the public quest link in Safari to play this video, or use Open on YouTube below." : "YouTube could not play this video here. Use Open on YouTube below.";
            notify();
          }
        };
        try { player = playerFactory(frame, { events }, YT); }
        catch { message = "YouTube controls are unavailable. Use Play in the visible video."; notify(); }
      }).catch(() => {
        if (token !== revision || frame !== iframe || !visible) return;
        message = "YouTube controls could not load. Use Play in the visible video; choose the main video again after a celebration clip.";
        notify();
      });
    }

    function start(restart = false) {
      if (restart || active !== context || !visible) {
        if (typeof options.onOpen === "function") options.onOpen();
        returnTo = null;
        switchSource(context, track(context).start, true);
      } else {
        if (typeof options.onOpen === "function") options.onOpen();
        intent = true;
        message = "Video opened. If it does not start, tap Play in the video.";
        if (player && playerReady) {
          try { player.playVideo(); } catch { message = "Tap Play in the visible video."; }
        } else {
          iframe.src = urlFor(active, sourceStart, true);
          ensureSdk();
        }
        notify();
      }
      return true;
    }

    function pause() {
      if(!visible)return;
      revision++;
      stopTimer();
      intent = false;
      playing = false;
      message = "Video paused.";
      if (player && playerReady) {
        try { player.pauseVideo(); }
        catch { destroyPlayer(); createIframe(active, sourceStart, false); }
      } else if (player) {
        destroyPlayer();
        createIframe(active, sourceStart, false);
      } else if (iframe && active) {
        // Reloading without autoplay is the only reliable stop when the API is blocked.
        iframe.src = urlFor(active, sourceStart, false);
      }
      notify();
    }

    function setContext(finale) {
      const next = finale ? "finale" : "main";
      if (next === context) return;
      close();
      context = next;
      message = next === "finale" ? "Finale ready. Play the celebration video from 2:01." : "Tap Play video to open YouTube inside the quest.";
      notify();
    }

    function victory() {
      // A qualifying answer is itself the play request, even before the main theme starts.
      if (context === "finale" || active === "victory") return false;
      if (typeof options.onOpen === "function") options.onOpen();
      returnTo = { time: active === "main" ? currentTime() : track("main").start, intent: active === "main" && intent };
      switchSource("victory", cueStart, true);
      return true;
    }

    function setCueStart(value) {
      cueStart = Math.max(0, Math.min(3600, Number(value) || 0));
      notify();
    }

    function reset() {
      close();
      context = "main";
      message = "Tap Play video to open YouTube inside the quest.";
      notify();
    }

    return { start, pause, close, setContext, victory, setCueStart, reset, snapshot };
  }

  const api = { TRACKS, create };
  root.QuestMusic = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

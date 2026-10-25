/* Maria's birthday edition. The Easter original is preserved in baseline/. */
(() => {
  "use strict";
  const q=window.MARIA_QUEST, C=window.QuestCore, R=window.QuestRehearsal, app=document.getElementById("app");
  const rehearsal=new URLSearchParams(location.search).get("rehearsal")==="1";
  const storageKey=C.STORAGE_KEY+(rehearsal?"-rehearsal":"");
  document.querySelector(".wordmark").href=rehearsal?"?rehearsal=1":"./";
  const all=C.stageList(q);
  let storageOK=true, state=C.fresh(), error="", keeperUnlocked=false, props=rehearsal?R.fresh():{};
  try { const saved=JSON.parse(localStorage.getItem(storageKey));state=C.hydrate(saved,q);if(rehearsal)props=R.hydrate(saved?.rehearsalProps,q); } catch { storageOK=false; }
  const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const paragraphs=arr=>arr.map(t=>`<p>${e(t)}</p>`).join("");
  function save(){ try{localStorage.setItem(storageKey,JSON.stringify(rehearsal?{...state,rehearsalProps:props}:state));}catch{storageOK=false;} }
  function button(label,action,cls="primary"){return `<button type="button" class="${cls}" data-action="${action}">${label}</button>`;}
  function sealTray(){
    const seals=q.stages.filter(s=>state.completed.includes(s.id)).map(s=>q.seals.find(t=>t.symbol===s.seal));
    const display=C.finished(state,q)?["COMPASS","LANTERN","BRIDGE","MAP","SUN"].map(symbol=>q.seals.find(s=>s.symbol===symbol)):q.seals;
    return `<div class="seal-tray" aria-label="Collected sun seals">${display.map(s=>`<span class="seal ${seals.includes(s)?"collected":""}" ${seals.includes(s)?`title="${e(s.symbol)} seal"`:""}>${seals.includes(s)?`<strong>${e(s.letter)}</strong><small>${e(s.symbol)}</small>`:"✧"}</span>`).join("")}</div>`;
  }
  function progress(){
    const n=state.completed.length;
    return `<div class="chapter-progress"><span>${Math.min(n,5)} OF 5 SEALS</span><div class="progress-track" aria-label="${n} of 6 puzzles solved">${all.map((s,i)=>`<i class="${state.completed.includes(s.id)?"done":""}" title="${e(s.title)}"></i>`).join("")}</div><span>${n===6?"GATE OPEN":n===5?"THE DAWN GATE":"TOWARDS THE SUN"}</span></div>`;
  }
  function previousClue(){
    const clue=C.lastClue(state,q);
    return clue?`<details class="last-clue"><summary>Show last clue</summary><div><span class="eyebrow">${e(clue.heading)}</span><p>${e(clue.text)}</p>${rehearsal?'<p class="small-note">This is the physical hiding clue. Your rehearsal envelope is already on screen.</p>':""}</div></details>`:"";
  }
  function hints(id,items){
    const count=state.hints[id]||0;
    return `<section class="hints" aria-label="Hints">${count?items.slice(0,count).map((h,i)=>`<p><span>HINT ${i+1}</span> ${e(h)}</p>`).join(""):""}${count<items.length?button(count?"Another hint":"A whisper from the Keeper", "hint", "text-button"):"<span class=\"hint-end\">You can ask your host for a little more help.</span>"}</section>`;
  }
  function cover(){
    const resume=state.completed.length>0;
    return `<section class="cover"><div class="cover-copy"><span class="eyebrow">MARIA'S 12TH BIRTHDAY / HALLOWEEN EDITION</span><p class="cover-kicker">Towards the Sun</p><h1>The Twelfth<br><em>Chapter.</em></h1><p class="cover-description">A mysterious book.<br>Five missing seals.<br>One adventure written together.</p><div class="cover-actions">${button(rehearsal?"Start the rehearsal <span>↗</span>":resume?"Return to the Archive <span>↗</span>":"Open the book <span>↗</span>","advance")}</div><p class="cover-caption">FOR MARIA & THE FRIENDS WHO MAKE HER STORY.</p></div><div class="cover-art"><img src="assets/archive.svg?v=11" alt="A pumpkin with glowing eyes, an open book and cobwebs beneath an arched moonlit window"><span class="art-caption">THE MIDNIGHT ARCHIVE<br>VOLUME XII / A PAGE ONLY YOU CAN OPEN</span></div></section>`;
  }
  function opening(){return `<section class="reading opening"><span class="eyebrow">A NOTE BETWEEN THE PAGES</span><h1>${e(q.opening.heading)}</h1><div class="story-text">${paragraphs(q.opening.text)}</div><div class="reading-bottom"><span>ONE TEAM. ALL THE TIME YOU NEED.</span>${button("Find the first clue <span>→</span>","advance")}</div></section>`;}
  function search(){return `<section class="reading"><span class="eyebrow">THE FIRST SEARCH / ENVELOPE I</span><h1>A familiar place.<br><em>A hidden beginning.</em></h1><p class="lead">${e(q.opening.first_search)}</p>${rehearsal?R.search(error):'<div class="rule-note">Open only the envelope the story names. Keep every sun seal. Share the clues and take turns.</div>'}${hints("search",q.opening.first_search_hints)}${rehearsal?"":`<div class="reading-bottom">${button("We found envelope I <span>→</span>","advance")}</div>`}</section>`;}
  function clueCompanion(s){
    if(rehearsal)return R.stage(s,q,props);
    if(s.id==="gate")return `<div class="gate-rules">${s.rules.map((r,i)=>`<p><span>0${i+1}</span>${e(r)}</p>`).join("")}</div>`;
    if(s.id==="embers")return `<div class="beacon-notes">${s.beacons.map(b=>`<div><span>${e(b.heading)}</span><p>${e(b.body)}</p></div>`).join("")}</div>`;
    return `<div class="envelope-note"><span class="envelope-icon">✉</span><div><strong>Share the pieces from envelope ${e(s.number)}.</strong><p>The paper clues are part of the adventure. Keep the iPad here while your team investigates.</p></div></div>`;
  }
  function puzzle(){
    const s=C.current(state,q), numerical=["mirror","embers","gate"].includes(s.id);
    return `<section class="chapter"><div class="chapter-heading"><span class="eyebrow">CHAPTER ${e(s.number)} / ${s.id==="gate"?"THE LAST DOOR":"ENVELOPE "+e(s.number)}</span><h1>${e(s.title)}</h1></div><p class="lead">${e(s.screen_text)}</p>${clueCompanion(s)}<form id="answer-form" novalidate><label for="answer">${s.id==="gate"?"The five-digit gate code":s.id==="mirror"?"The new time / four digits":s.id==="embers"?"DAWN · DAY · DUSK / three digits":"Your team's answer"}</label><div class="answer-row"><input id="answer" name="answer" type="text" inputmode="${numerical?"numeric":"text"}" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" maxlength="40" value="${e(state.input)}" aria-describedby="answer-feedback" placeholder="${s.id==="gate"?"_ _ _ _ _":s.id==="mirror"?"_ _ _ _":s.id==="embers"?"_ _ _":"Enter your answer"}"><button class="primary" type="submit">${s.id==="gate"?"Open the gate":"Try the key"}<span>→</span></button></div><p id="answer-feedback" role="status" class="feedback ${error?"error":""}">${error?e(error):"Discuss it together. There is no penalty for trying."}</p></form>${hints(s.id,s.hints)}</section>`;
  }
  function success(){
    const s=C.current(state,q), gate=s.id==="gate", seal=q.seals.find(t=>t.symbol===s.seal);
    const next=all[state.completed.length];
    return `<section class="reading success"><span class="eyebrow">${gate?"THE DAWN GATE IS OPEN":"CHAPTER "+e(s.number)+" / UNLOCKED"}</span><h1>${gate?"You brought<br><em>the light back.</em>":"Another page<br><em>turns towards dawn.</em>"}</h1>${state.celebrations[s.id]?`<p class="first-key">✦ ${e({quick:"UNDER ONE MINUTE. UNSTOPPABLE.",streak:"THREE CORRECT IN A ROW. UNSTOPPABLE.",both:"UNDER ONE MINUTE. THREE IN A ROW. UNSTOPPABLE."}[state.celebrations[s.id]])}</p>`:""}${seal?`<div class="earned-seal"><span>✦</span><div><strong>${e(seal.symbol)} SEAL</strong><small>LETTER ${e(seal.letter)} / DIGIT ${e(seal.digit)}</small></div></div>`:""}<p class="lead">${e(gate?"The five digits hold. Now read the letters on your seals, from left to right. The Keeper is waiting on the other side.":s.success_text)}</p>${rehearsal&&!gate?'<p class="rehearsal-note">In the party game, follow that hiding-place clue. For this rehearsal, the next envelope is ready on screen.</p>':""}<div class="reading-bottom">${button(gate?"Turn the twelfth page <span>→</span>":rehearsal?(next.id==="gate"?"Open the Dawn Gate card <span>→</span>":`Open envelope ${e(next.number)} <span>→</span>`):"We’re ready for the next chapter <span>→</span>","advance")}</div></section>`;
  }
  function finale(){
    return `<section class="reading finale"><span class="eyebrow">HAPPY TWELFTH BIRTHDAY, MARIA</span><div class="sunburst" aria-hidden="true">✺</div><h1>Chapter Twelve<br><em>is yours.</em></h1><div class="shine" aria-label="The seals spell SHINE">S H I N E</div><div class="finale-song"><span class="eyebrow">LET YOUR CELEBRATION BEGIN / FROM 2:01</span><h2>Unwritten</h2><p>Natasha Bedingfield</p>${button("Play celebration video · 2:01 <span>▶</span>","finale-music")}<p class="small-note" id="finale-music-status"></p></div><div class="story-text">${paragraphs(q.finale.text)}</div></section>`;
  }
  function render(focus=true){
    state=C.hydrate(state,q);
    document.body.dataset.phase=state.phase;
    document.body.style.setProperty("--dawn",String(Math.min(state.completed.length/6,1)));
    const views={cover,opening,search,puzzle,success,finale};
    app.innerHTML=(rehearsal?R.banner():"")+(state.phase!=="cover"?progress():"")+previousClue()+(views[state.phase]||cover)()+(state.phase!=="cover"?sealTray():"")+(!storageOK?`<p class="storage-notice" role="status">This browser could not save progress. Keep this tab open during the quest.</p>`:"");
    if(focus){app.focus({preventScroll:true});window.scrollTo({top:0,behavior:"auto"});}
    updateMusic();
  }
  app.addEventListener("input",event=>{if(event.target.id==="answer"){state.input=event.target.value;save();}});
  app.addEventListener("submit",event=>{
    if(event.target.id!=="answer-form")return;
    event.preventDefault();
    state.input=document.getElementById("answer").value;
    const result=C.submit(state,q,state.input);
    state=result.state;save();
    if(result.correct){effects.play(C.current(state,q).id==="gate"?"gate":"door");if(result.celebration)music.victory();error="";render();}
    else{if(!result.empty)effects.play("failure");error=result.empty?"Enter your team's answer first.":"That key hasn’t turned yet. Compare your clues and try again.";render(false);document.getElementById("answer").focus();}
  });
  app.addEventListener("click",event=>{
    const control=event.target.closest("[data-rehearsal]");
    if(control&&rehearsal){
      const action=control.dataset.rehearsal;
      if(action==="letter"&&state.phase==="search"){
        if(control.dataset.index==="7"){state=C.advance(state,q);error="";save();render();return;}
        effects.play("failure");error="No envelope behind that letter. Read the clue and try another.";
      }
      if(action==="mirror"&&C.current(state,q)?.id==="mirror")props={...props,mirror:!props.mirror};
      if(action==="spark"&&C.current(state,q)?.id==="embers")props=R.adjustSpark(props,control.dataset.beacon,Number(control.dataset.delta));
      if(action==="seal"&&C.current(state,q)?.id==="gate")props=R.toggleSeal(props,control.dataset.symbol,q);
      const focusId=control.id;save();render(false);document.getElementById(focusId)?.focus({preventScroll:true});return;
    }
    const action=event.target.closest("[data-action]")?.dataset.action;
    if(action==="advance"){state=C.advance(state,q);if(state.phase==="finale")effects.stop();error="";save();render();if(state.phase==="finale")music.start(true);}
    if(action==="finale-music"&&state.phase==="finale"&&C.finished(state,q)){music.start(true);}
    if(action==="hint"){
      const id=state.phase==="search"?"search":C.current(state,q).id;
      state.hints[id]=Math.min(3,(state.hints[id]||0)+1);save();render(false);
    }
  });
  const dialog=document.getElementById("keeper-dialog"), kc=document.getElementById("keeper-content");
  let keeperRequest=0;
  function lockKeeper(){keeperUnlocked=false;keeperRequest++;kc.replaceChildren();}
  function closeKeeper(){lockKeeper();if(dialog.open)dialog.close();else dialog.removeAttribute("open");}
  function showKeeper(){
    if(!keeperUnlocked){kc.innerHTML=`<button class="dialog-close quiet" data-keeper="close" aria-label="Close host controls">Close ×</button><span class="eyebrow">FOR THE ADULT HOST</span><h2 id="keeper-title">The Keeper’s desk</h2><p>Enter the parent PIN to open the answer key and host controls.</p><form id="keeper-pin-form" novalidate><label for="keeper-pin">Parent PIN</label><input id="keeper-pin" type="password" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="off" autocorrect="off" spellcheck="false" aria-describedby="keeper-pin-error" placeholder="Four digits"><p id="keeper-pin-error" class="feedback" role="status"></p><button class="primary" type="submit">Unlock the Keeper’s desk</button></form>`;}
    else{
      const s=state.phase==="puzzle"?C.current(state,q):null;
      kc.innerHTML=`<button class="dialog-close quiet" data-keeper="close">Close ×</button><span class="eyebrow">HOST CONTROLS / THIS DEVICE</span><h2 id="keeper-title">Keep the story moving.</h2><p>${rehearsal?"This rehearsal saves separately. Resetting it leaves the party game’s progress alone.":"Progress saves on this device. Hints and help carry no penalty."}</p><p><a class="secondary" href="${rehearsal?"./":"?rehearsal=1"}">${rehearsal?"Return to party game":"Rehearse with all clues on screen"} ↗</a></p><details><summary>Hiding places and answer key</summary><ol>${q.stages.map(t=>`<li><strong>${e(t.number)} / ${e(t.title)}: ${e(t.answer)}</strong><p>${e({court:"Behind the rightmost R of THRILLER beside the pumpkin.",mirror:"Under the MOON-marked chair; include a small mirror.",case:"Behind the STAR-marked sofa cushion.",map:"Under the closed SUN-marked book on a table.",embers:"Behind the reachable brown-and-white plush fox."}[t.id])}</p></li>`).join("")}<li><strong>VI / Dawn Gate: ${e(q.gate.answer)}</strong><p>COMPASS, LANTERN, BRIDGE, MAP, SUN. Keep the gate card and FINAL with you.</p></li></ol></details>${s?`<div class="rescue"><p>Stuck at ${e(s.title)}? First offer the printed hints. A rescue awards this chapter’s seal and reveals its next location.</p><button class="secondary" data-keeper="rescue-confirm">Help with this chapter</button></div>`:""}<div class="restart-zone"><p>${rehearsal?"Start a fresh rehearsal whenever you want.":"Testing finished? Reset before Maria begins."}</p><button class="text-button" data-keeper="reset-confirm">Start again from the cover</button></div>`;
    }
    if(!dialog.open){if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");}
    if(!keeperUnlocked)document.getElementById("keeper-pin")?.focus({preventScroll:true});
  }
  document.getElementById("keeper-toggle").addEventListener("click",()=>{music.close();effects.stop();lockKeeper();showKeeper();});
  dialog.addEventListener("cancel",lockKeeper);
  dialog.addEventListener("close",()=>{if(!dialog.open){lockKeeper();document.getElementById("keeper-toggle").focus({preventScroll:true});}});
  document.addEventListener("visibilitychange",()=>{if(document.hidden){music.pause();effects.stop();if(dialog.open)closeKeeper();}});
  kc.addEventListener("submit",async event=>{
    if(event.target.id!=="keeper-pin-form")return;
    event.preventDefault();
    const input=document.getElementById("keeper-pin"), feedback=document.getElementById("keeper-pin-error"), submit=event.target.querySelector('button[type="submit"]');
    const pin=input.value, request=++keeperRequest;
    input.value="";submit.disabled=true;
    try{
      const valid=await window.QuestKeeper.checkPin(pin);
      if(request!==keeperRequest||!dialog.open)return;
      if(valid){keeperUnlocked=true;showKeeper();kc.querySelector('.dialog-close')?.focus({preventScroll:true});}
      else{feedback.textContent="That PIN did not open the desk. Ask your parent or host.";submit.disabled=false;input.focus({preventScroll:true});}
    }catch{
      if(request!==keeperRequest||!dialog.open)return;
      feedback.textContent="Open the quest's HTTPS link in Safari, then try again.";submit.disabled=false;input.focus({preventScroll:true});
    }
  });
  kc.addEventListener("click",event=>{
    const a=event.target.closest("[data-keeper]")?.dataset.keeper;
    if(a==="close"){closeKeeper();return;}
    if(!keeperUnlocked||!dialog.open)return;
    if(a==="desk")showKeeper();
    if(a==="reset-confirm")kc.innerHTML=`<button class="dialog-close quiet" data-keeper="close" aria-label="Close host controls">Close ×</button><h2 id="keeper-title">Start a fresh ${rehearsal?"rehearsal":"adventure"}?</h2><p>${rehearsal?"This clears only the rehearsal. Party progress is unchanged.":"This clears the answers and seals saved on this device."}</p><div class="dialog-actions"><button class="secondary" data-keeper="desk">Keep our progress</button><button class="primary" data-keeper="reset">Reset the quest</button></div>`;
    if(a==="reset"){state=C.fresh();if(rehearsal)props=R.fresh();effects.stop();music.reset();error="";save();closeKeeper();render();}
    if(a==="rescue-confirm")kc.innerHTML=`<button class="dialog-close quiet" data-keeper="close" aria-label="Close host controls">Close ×</button><h2 id="keeper-title">Help this chapter along?</h2><p>This completes only the current chapter. The team will still solve every later puzzle.</p><div class="dialog-actions"><button class="secondary" data-keeper="desk">Back to hints</button><button class="primary" data-keeper="rescue">Award this chapter</button></div>`;
    if(a==="rescue"){const next=C.complete(state,q,"",true);if(next){state=next;effects.play(C.current(state,q).id==="gate"?"gate":"door");error="";save();closeKeeper();render();}}
  });
  const panel=document.getElementById("soundtrack"), mt=document.getElementById("music-toggle"), videoDock=document.getElementById("video-dock");
  let musicScroll=0;
  function drawMusic(s){
    const kind=s.active||s.context, track=window.QuestMusic.TRACKS[kind];
    document.getElementById("music-title").textContent=track.title;
    document.getElementById("music-artist").textContent=track.artist;
    videoDock.hidden=!s.visible;
    document.getElementById("music-status").textContent=s.message||(s.playing?`${track.title} is playing.`:"Play a YouTube video inside the quest. No music files are needed.");
    document.getElementById("start-music").textContent=s.playing?"Video playing":s.context==="finale"?"Play celebration video · 2:01":"Play Towards the Sun video";
    document.getElementById("start-music").disabled=s.playing;
    document.getElementById("pause-music").disabled=!s.intent;
    document.getElementById("preview-victory").disabled=s.context==="finale";
    document.getElementById("video-kicker").textContent=kind==="finale"?"MARIA'S CELEBRATION / FROM 2:01":"THE PARTY VIDEO";
    document.getElementById("video-title").textContent=`${track.title} / ${track.artist}`;
    document.getElementById("video-status").textContent=s.message||(s.playing?"Your video is playing.":"Tap ▶ in the video if playback waits.");
    const credit=document.getElementById("music-credit-link");
    credit.href="https://www.youtube.com/watch?v="+track.videoId+(kind==="finale"?"&t=121s":kind==="victory"?`&t=${Math.floor(s.cueStart)}s`:"");
    credit.textContent=`${track.title} / ${track.artist} ↗`;
    document.getElementById("video-link").href=credit.href;
    const finaleStatus=document.getElementById("finale-music-status");
    if(finaleStatus)finaleStatus.textContent=s.playing&&s.active==="finale"?"Your celebration video is playing.":s.visible&&s.active==="finale"?(s.message||"Tap Play in the YouTube player above."):"Your celebration video starts at 2:01. Tap the button to open it.";
  }
  const music=window.QuestMusic.create(document.getElementById("music-player"),{onChange:drawMusic,onError:detail=>console.warn("YouTube player unavailable",detail.code,detail.videoId),onOpen:()=>{panel.hidden=true;mt.setAttribute("aria-expanded","false");videoDock.hidden=false;videoDock.scrollIntoView({behavior:"auto",block:"start"});}});
  function updateMusic(){music.setContext(state.phase==="finale"&&C.finished(state,q));drawMusic(music.snapshot());}
  function toggleMusic(open){
    if(open)musicScroll=window.scrollY;
    panel.hidden=!open;mt.setAttribute("aria-expanded",String(open));
    if(open)panel.scrollIntoView({behavior:"auto",block:"start"});
    else{window.scrollTo({top:musicScroll,behavior:"auto"});mt.focus({preventScroll:true});}
  }
  mt.addEventListener("click",()=>toggleMusic(panel.hidden));
  document.getElementById("music-close").addEventListener("click",()=>toggleMusic(false));
  document.getElementById("start-music").addEventListener("click",()=>music.start(music.snapshot().context==="finale"));
  document.getElementById("pause-music").addEventListener("click",()=>music.pause());
  document.getElementById("close-video").addEventListener("click",()=>music.close());
  document.getElementById("cue-start").addEventListener("input",event=>music.setCueStart(event.target.value));
  document.getElementById("preview-victory").addEventListener("click",()=>music.victory(true));
  const effectsPreference="maria-twelfth-chapter-effects-v1", effectsToggle=document.getElementById("effects-toggle");
  let effectsEnabled=true;
  try{effectsEnabled=localStorage.getItem(effectsPreference)!=="off";}catch{/* Effects remain usable without browser storage. */}
  function drawEffects(s){
    effectsToggle.textContent=s.enabled?"Effects on":"Effects off";
    effectsToggle.setAttribute("aria-pressed",String(s.enabled));
    effectsToggle.setAttribute("aria-label",s.enabled?"Sound effects on":"Sound effects off");
    document.getElementById("preview-door").disabled=!s.enabled;
    document.getElementById("preview-gate").disabled=!s.enabled;
    document.getElementById("preview-failure").disabled=!s.enabled;
    document.getElementById("effects-status").textContent=s.message||(s.enabled?"Tap a preview to hear the castle.":"Turn Effects on above to hear the castle.");
  }
  const effects=window.QuestEffects.create(document.getElementById("quest-effects"),{enabled:effectsEnabled,onChange:drawEffects});
  effectsToggle.addEventListener("click",()=>{
    effects.setEnabled(!effects.snapshot().enabled);
    try{localStorage.setItem(effectsPreference,effects.snapshot().enabled?"on":"off");}catch{}
  });
  document.getElementById("preview-door").addEventListener("click",()=>effects.play("door"));
  document.getElementById("preview-gate").addEventListener("click",()=>effects.play("gate"));
  document.getElementById("preview-failure").addEventListener("click",()=>effects.play("failure"));
  drawEffects(effects.snapshot());
  if("IntersectionObserver" in window)new IntersectionObserver(entries=>{if(entries.at(-1).intersectionRatio<0.5&&music.snapshot().visible&&music.snapshot().intent)music.pause();},{threshold:[0,0.5,1]}).observe(document.getElementById("music-player"));
  state=C.beginPuzzle(state);save();render(false);
  if("serviceWorker" in navigator && location.protocol!=="file:")navigator.serviceWorker.register("sw.js").catch(()=>{});
})();

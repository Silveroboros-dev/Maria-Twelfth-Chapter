/* On-screen versions of the paper props, used only by the rehearsal URL. */
(function(root){
  "use strict";
  const e=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const BEACONS=["DAWN","DAY","DUSK"];
  const fresh=()=>({mirror:false,sparks:{DAWN:0,DAY:0,DUSK:0},seals:[]});
  function hydrate(raw,q){
    const props=fresh();
    props.mirror=raw?.mirror===true;
    for(const name of BEACONS){const n=Number(raw?.sparks?.[name]);props.sparks[name]=Number.isInteger(n)&&n>=0&&n<=12?n:0;}
    if(Object.values(props.sparks).reduce((a,b)=>a+b,0)>12)props.sparks=fresh().sparks;
    const allowed=new Set(q.seals.map(s=>s.symbol));
    props.seals=Array.isArray(raw?.seals)?[...new Set(raw.seals.filter(s=>allowed.has(s)))]:[];
    return props;
  }
  function adjustSpark(props,name,delta){
    if(!BEACONS.includes(name)||![-1,1].includes(delta))return props;
    const total=Object.values(props.sparks).reduce((a,b)=>a+b,0);
    if(props.sparks[name]+delta<0 || (delta>0&&total>=12))return props;
    return {...props,sparks:{...props.sparks,[name]:props.sparks[name]+delta}};
  }
  function toggleSeal(props,symbol,q){
    if(!q.seals.some(s=>s.symbol===symbol))return props;
    return {...props,seals:props.seals.includes(symbol)?props.seals.filter(s=>s!==symbol):[...props.seals,symbol]};
  }
  function banner(){return '<div class="rehearsal-banner"><div><strong>REHEARSAL</strong><span>All clues on screen · separate progress</span></div><a href="./">Return to party game ↗</a></div>';}
  function search(error){
    return `<section class="virtual-props"><span class="eyebrow">THE PRACTICE BOOKSHELF</span><p>Tap the letter you would look behind.</p><div class="letter-shelf" aria-label="THRILLER letters with a pumpkin on the right">${[..."THRILLER"].map((letter,i)=>`<button type="button" id="rehearsal-letter-${i}" data-rehearsal="letter" data-index="${i}" aria-label="Letter ${letter}, position ${i+1}">${letter}</button>`).join("")}<span aria-label="pumpkin">🎃</span></div><p class="feedback" role="status">${e(error||"The pumpkin is at the right-hand end of the word.")}</p></section>`;
  }
  function cards(items){return `<div class="virtual-cards">${items.map(c=>`<article><h2>${e(c.heading)}</h2><p>${e(c.body)}</p></article>`).join("")}</div>`;}
  function sealCard(s,placed=false){return `<button type="button" id="rehearsal-seal-${e(s.symbol)}" class="virtual-seal" data-rehearsal="seal" data-symbol="${e(s.symbol)}" aria-label="${placed?"Return":"Place"} ${e(s.symbol)} seal, letter ${e(s.letter)}, digit ${e(s.digit)}"><strong>${e(s.symbol)}</strong><span>${e(s.letter)} <small>LETTER</small></span><span>${e(s.digit)} <small>DIGIT</small></span></button>`;}
  function stage(s,q,props){
    if(s.id==="court")return `<section class="virtual-props" aria-label="Envelope I cards">${cards(s.cards)}</section>`;
    if(s.id==="mirror")return `<section class="virtual-props" aria-label="Envelope II mirrored page"><div class="virtual-mirror ${props.mirror?"readable":""}">${s.mirror_lines.map(t=>`<p>${e(t)}</p>`).join("")}</div><button type="button" class="secondary" id="rehearsal-mirror" data-rehearsal="mirror" aria-pressed="${props.mirror}">${props.mirror?"Put the mirror down":"Hold up the mirror"}</button><p class="small-note">For this rehearsal, the button stands in for a small mirror. You still calculate the time.</p></section>`;
    if(s.id==="case")return `<section class="virtual-props" aria-label="Envelope III case file and witnesses"><div class="case-scroll"><table><caption>THE CASE FILE</caption><thead><tr>${s.case_columns.map(t=>`<th scope="col">${e(t)}</th>`).join("")}</tr></thead><tbody>${s.case_rows.map(row=>`<tr>${row.map((t,i)=>i===0?`<th scope="row">${e(t)}</th>`:`<td>${e(t)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>${cards(s.evidence)}</section>`;
    if(s.id==="map")return `<section class="virtual-props" aria-label="Envelope IV map and route"><div class="virtual-map"><div class="map-north">NORTH / UP</div><div class="map-middle"><span>WEST<br>LEFT</span><div class="map-grid">${s.map_rows.flat().map(t=>`<div class="${t==="LIBRARY"?"map-start":""}">${e(t)}${t==="LIBRARY"?"<small>START HERE</small>":""}</div>`).join("")}</div><span>EAST<br>RIGHT</span></div><div class="map-north">SOUTH / DOWN</div></div>${cards(s.route)}</section>`;
    if(s.id==="embers"){
      const remaining=12-Object.values(props.sparks).reduce((a,b)=>a+b,0);
      return `<section class="virtual-props" aria-label="Envelope V sparks"><p class="spark-total" role="status">${remaining} of 12 sparks still to place</p><div class="virtual-beacons">${s.beacons.map(b=>`<article><h2>${e(b.heading)}</h2><p>${e(b.body)}</p><div class="spark-controls"><button type="button" class="secondary" id="rehearsal-minus-${b.heading}" data-rehearsal="spark" data-beacon="${b.heading}" data-delta="-1" aria-label="Remove a spark from ${b.heading}">−</button><output aria-label="${props.sparks[b.heading]} sparks on ${b.heading}">${props.sparks[b.heading]}</output><button type="button" class="secondary" id="rehearsal-plus-${b.heading}" data-rehearsal="spark" data-beacon="${b.heading}" data-delta="1" aria-label="Add a spark to ${b.heading}">+</button></div></article>`).join("")}</div><p class="small-note">Use the + and − buttons in place of paper sparks. Read the three counts in DAWN, DAY, DUSK order and enter your answer below.</p></section>`;
    }
    if(s.id==="gate"){
      const by=Object.fromEntries(q.seals.map(t=>[t.symbol,t]));
      return `<section class="virtual-props" aria-label="Dawn Gate seals"><div class="gate-rules">${s.rules.map((r,i)=>`<p><span>0${i+1}</span>${e(r)}</p>`).join("")}</div><p>Tap a seal to place it in the next space. Tap a placed seal to return it.</p><div class="seal-slots" aria-label="Seals in left to right order">${Array.from({length:5},(_,i)=>props.seals[i]?sealCard(by[props.seals[i]],true):`<div class="empty-seal" aria-label="Empty position ${i+1}">${i+1}</div>`).join("")}</div><div class="available-seals" aria-label="Available seals">${q.seals.filter(t=>!props.seals.includes(t.symbol)).map(t=>sealCard(t)).join("")}</div><p class="small-note" role="status">${props.seals.length===5?"All five seals are placed. Read their digits from left to right, then enter the code below.":"Every seal has a letter and a digit. Use all five."}</p></section>`;
    }
    return "";
  }
  const api={fresh,hydrate,adjustSpark,toggleSeal,banner,search,stage};
  root.QuestRehearsal=api;
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);

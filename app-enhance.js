// app-enhance.js — non-invasive enhancements layered on top of existing app.js
(function(){
  const isIndex = () => location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.includes('/loy-krathong-online/');
  function once(target, type, handler, opts){ const h=(e)=>{target.removeEventListener(type,h,opts); handler(e)}; target.addEventListener(type,h,opts); }

  // 1) Ensure name input exists
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.wish-form');
    if (form && !document.getElementById('name')){
      const name = document.createElement('input');
      name.id = 'name';
      name.type = 'text';
      name.maxLength = 50;
      name.placeholder = 'พิมพ์ชื่อของคุณ';
      name.style.marginRight = '6px';
      form.insertBefore(name, form.querySelector('#wish') || form.firstChild);
    }
  });

  // 2) Make Storage.save include "name: wish" if a name is present
  const patchStorage = () => {
    const S = window.Storage;
    if (!S || !S.save || S.__patched_name_merge) return;
    const origSave = S.save.bind(S);
    S.save = async (item) => {
      try{
        const nameEl = document.getElementById('name');
        const wishEl = document.getElementById('wish');
        const rawName = (nameEl && nameEl.value || '').trim().slice(0,50);
        const rawText = (wishEl && wishEl.value || item.text || '').trim().slice(0,120);
        const displayText = rawName ? (rawName + ' : ' + rawText) : rawText;
        const style = (item.style || 1);
        const merged = Object.assign({}, item, { text: displayText, style, name: rawName });
        return await origSave(merged);
      }catch(e){
        return await origSave(item);
      }
    };
    S.__patched_name_merge = true;
  };
  document.addEventListener('DOMContentLoaded', () => patchStorage());
  setTimeout(patchStorage, 800);

  // 3) Load all krathongs on index at startup
  document.addEventListener('DOMContentLoaded', async () => {
    if (!isIndex()) return;
    try{
      if (window.Storage && window.Storage.getAllDetailed){
        const river = document.getElementById('river');
        const list = await window.Storage.getAllDetailed();
        if (Array.isArray(list) && list.length && river){
          for (const it of list){
            const txt = String(it.text || '').slice(0,120);
            const style = Number(it.style || 1);
            if (typeof window.renderKrathong === 'function'){
              window.renderKrathong(txt, style);
            }
          }
        }
      }
    }catch(e){}
  });

  // 4) Auto-start fireworks visuals on index; play audio only after first user gesture
  document.addEventListener('DOMContentLoaded', () => {
    if (!isIndex()) return;
    const fx = window.fireworks || window.startFireworks || window.initFireworks;
    if (typeof fx === 'function'){ try{ fx(); }catch(e){} }

    let audioCtx = null;
    function playSoftFirework(){
      try{
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const t0 = audioCtx.currentTime;
        const bufferSize = audioCtx.sampleRate * 0.25;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i=0; i<bufferSize; i++){ data[i] = (Math.random()*2-1) * Math.exp(-i/bufferSize*6); }
        const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
        const bp = audioCtx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1200; bp.Q.value = 0.6;
        const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.0, t0); gain.gain.linearRampToValueAtTime(0.25, t0+0.02); gain.gain.exponentialRampToValueAtTime(0.001, t0+0.35);
        noise.connect(bp); bp.connect(gain); gain.connect(audioCtx.destination); noise.start(t0); noise.stop(t0+0.35);
        const osc = audioCtx.createOscillator(); osc.type = 'sine';
        const gain2 = audioCtx.createGain(); gain2.gain.setValueAtTime(0.0001, t0);
        osc.frequency.setValueAtTime(600, t0); osc.frequency.exponentialRampToValueAtTime(120, t0+0.3);
        gain2.gain.exponentialRampToValueAtTime(0.18, t0+0.02); gain2.gain.exponentialRampToValueAtTime(0.0001, t0+0.32);
        osc.connect(gain2); gain2.connect(audioCtx.destination); osc.start(t0); osc.stop(t0+0.34);
      }catch(e){}
    }
    const unlock = () => { playSoftFirework(); window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
    window.addEventListener('pointerdown', unlock, { once:true });
    window.addEventListener('keydown', unlock, { once:true });

    const btn = document.getElementById('launchBtn');
    if (btn){ btn.addEventListener('click', () => { playSoftFirework(); }, { passive:true }); }
  });

  // 5) Ensure readable white Thai text
  const ensureStyle = () => {
    if (document.getElementById('krathongTextStyle')) return;
    const css = document.createElement('style');
    css.id = 'krathongTextStyle';
    css.textContent = '.krathong .text{color:#fff!important;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.7);font-family:"Sarabun","Noto Sans Thai",system-ui,sans-serif}';
    document.head.appendChild(css);
  };
  document.addEventListener('DOMContentLoaded', ensureStyle);
})();

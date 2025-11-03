// main.js — speed-tuned & resilient
(function(){
  function ready(fn){ document.readyState!=='loading' ? fn() : document.addEventListener('DOMContentLoaded', fn) }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)) }

  // Time-of-day theme
  (function(){ const h=new Date().getHours(), r=document.documentElement;
    r.classList.remove('evening','late');
    if(h>=18&&h<22) r.classList.add('evening'); else if(h>=22||h<2) r.classList.add('late');
  })();

  ready(function(){
    const river = document.getElementById('river');
    const btn   = document.getElementById('launchBtn');
    const input = document.getElementById('wish');
    const picker= document.getElementById('picker');
    const shareBox = document.getElementById('shareBox');
    const shareLinkEl = document.getElementById('shareLink');
    const toastEl = document.getElementById('toast');

    let styleId = 1;
    if (picker){
      picker.querySelectorAll('button').forEach(b=>{
        b.addEventListener('click',()=>{
          picker.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          styleId = Number(b.dataset.style||'1');
        });
      });
    }

    function setToast(msg){
      if(!toastEl) return;
      toastEl.textContent = msg;
      toastEl.style.display = 'block';
      setTimeout(()=> toastEl.style.display='none', 1400);
    }
    function imgForStyle(id){ return 'assets/krathong'+id+'.png' }

    // Compute speed so it crosses in ~12–16s depending on screen
    function computeSpeed(rw){
      const isMobile = Math.max(window.innerWidth, window.innerHeight) < 820;
      const target = isMobile ? 15.0 : 12.0; // seconds to cross
      const travel = (rw||window.innerWidth) + 140 + 100; // river width + right margin + start offset
      return clamp(travel / target, 26, 90); // px/sec
    }

    function renderKrathong(text, id){
  if (!river) return;
  const el = document.createElement('div');
  el.className = 'krathong';
  el.style.animation = 'none';
  el.style.bottom = '0px';
  el.style.left = '-60px'; // ⬅️ เริ่มใกล้จอมากขึ้น (ขึ้นไว)
  el.innerHTML = '<img class="emoji" src="'+imgForStyle(id)+'" alt="krathong"><div class="text"></div>';
  el.querySelector('.text').textContent = text;
  river.appendChild(el);

  // ค่าความเร็วใหม่ (ลอยช้า ๆ)
  let last = 0, x = -60, t = 0;
  const speed = 10;  // ⬅️ ลดความเร็วลง (ยิ่งน้อยยิ่งลอยช้า)
  const amp = 6;     // แกว่งเบา ๆ เหมือนคลื่น
  const maxLeft = (river.getBoundingClientRect().width || window.innerWidth) + 150;

  function step(ts){
    if (!last) last = ts;
    const dt = Math.min(64, ts - last) / 1000;
    last = ts;

    x += speed * dt;
    t += dt * 1.4;
    const y = Math.sin(t) * amp;
    el.style.transform = `translate3d(${x}px, ${-y}px, 0)`;
    if (x < maxLeft) requestAnimationFrame(step);
    else el.remove();
  }
  requestAnimationFrame(step);
}


    function buildIdUrl(id){
      const url=new URL(location.href); url.searchParams.clear(); url.searchParams.set('id', id); return url.toString();
    }

    async function launch(){
      const text = ((input && input.value) ? input.value : 'สุขใจทุกคืนวันเพ็ญ 🌕').trim().slice(0,120);
      if (input) input.value = '';
      let id = '';
      try{
        if (window.Storage?.save){
          const res = await window.Storage.save({ text, style: styleId });
          id = (res && res.id) || '';
        }else{
          const lid = Math.random().toString(36).slice(2,8);
          id = lid;
          const key='loy-wishes', mapKey='loy-map';
          const arr = JSON.parse(localStorage.getItem(key)||'[]');
          const payload = { text, ts: Date.now(), style: styleId };
          arr.push(payload); localStorage.setItem(key, JSON.stringify(arr));
          const map = JSON.parse(localStorage.getItem(mapKey)||'{}'); map[lid]=payload; localStorage.setItem(mapKey, JSON.stringify(map));
        }
      }catch(e){}

      renderKrathong(text, styleId);
      if (shareBox && shareLinkEl){
        const link = id ? buildIdUrl(id) : location.href;
        shareLinkEl.textContent = link;
        shareBox.style.display = 'block';
      }
    }

    if (btn)   btn.addEventListener('click', launch);
    if (input) input.addEventListener('keydown', e=>{ if(e.key==='Enter') launch() });

    // Deep-link
    const id = new URLSearchParams(location.search).get('id');
    if (id && window.Storage?.getById){
      window.Storage.getById(id).then(doc=>{
        if(!doc) return;
        styleId = Number(doc.style||1);
        renderKrathong(String(doc.text||'').slice(0,120), styleId);
        if (shareBox && shareLinkEl){
          const link = buildIdUrl(id);
          shareLinkEl.textContent = link;
          shareBox.style.display = 'block';
        }
      });
    }

    // Sharebar
    const sharebar = document.querySelector('.sharebar');
    function fallbackShare(app, link, text){
      const u=encodeURIComponent(link), t=encodeURIComponent(text);
      if (app==='facebook') window.open('https://www.facebook.com/sharer/sharer.php?u='+u,'_blank','noopener');
      if (app==='line')     window.open('https://line.me/R/msg/text/?'+t+'%20'+u,'_blank','noopener');
      if (app==='x')        window.open('https://twitter.com/intent/tweet?text='+t+'&url='+u,'_blank','noopener');
      if (app==='copy')     navigator.clipboard?.writeText(text+' '+link);
      if (app==='tiktok')   navigator.clipboard?.writeText(text+' '+link);
    }
    if (sharebar){
      sharebar.addEventListener('click', e=>{
        const b=e.target.closest('button[data-app]'); if(!b) return;
        const app=b.dataset.app;
        const link=(document.getElementById('shareLink')?.textContent)||window.__SHARE_URL__||location.href;
        const text=window.__SHARE_TEXT__||'มาร่วมลอยกระทงออนไลน์กันนะครับ 🌕';
        if (navigator.share){
          navigator.share({ title:'ลอยกระทงออนไลน์', text, url: link }).catch(()=>fallbackShare(app, link, text));
        }else fallbackShare(app, link, text);
      });
    }
  });
})();

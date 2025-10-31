
(function(){
  const area=document.getElementById('floatArea');
  const btn=document.getElementById('floatBtn');
  const wishText=document.getElementById('wishText');
  const bgm=document.getElementById('bgm'); const sfx=document.getElementById('sfxLaunch');
  const muteBtn=document.getElementById('muteBtn');
  let ktype='krathong1', muted=false;

  function ensureAudioStart(){ if(!bgm||bgm.dataset.started) return; bgm.volume=0.22; bgm.play().then(()=>bgm.dataset.started='1').catch(()=>{}); }
  document.addEventListener('pointerdown', ensureAudioStart, {once:true});

  if(muteBtn&&bgm){
    muteBtn.addEventListener('click', ()=>{
      muted=!muted; bgm.muted=muted; if(sfx) sfx.muted=muted;
      muteBtn.setAttribute('aria-pressed', String(!muted));
      muteBtn.textContent = muted ? '🔇 ปิดเสียง' : '🔈 เสียง';
      if(!muted) ensureAudioStart();
    });
  }

  document.querySelectorAll('.kbtn').forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.kbtn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); ktype=b.dataset.type||'krathong1';
    });
  });

  function addWish(text){
    const arr=JSON.parse(localStorage.getItem('wishes')||'[]');
    arr.push({text, time: Date.now(), type: ktype});
    localStorage.setItem('wishes', JSON.stringify(arr));
  }

  function spawn(){
    const river=document.getElementById('river');
    const el=document.createElement('div'); el.className='krathong';
    const src=`assets/${ktype}.png`; const img=new Image(); img.src=src; img.alt='กระทง';
    const refl=new Image(); refl.src=src; refl.className='reflection';
    el.appendChild(img); el.appendChild(refl); area.appendChild(el);

    function position(){
      const H=river.clientHeight;
      const kh=img.naturalHeight||img.height||100;
      const wl=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--waterline'))||0.62;
      const waterline=H*wl; const bob=kh*0.58; const jitter=(H*0.06)*(Math.random()-0.5);
      el.style.left='-120px'; el.style.top=(waterline-bob+jitter)+'px';
      const total=area.clientWidth+300; const speed=44+Math.random()*22; let x=-130;
      function step(){ x+=speed*0.016; el.style.transform=`translateX(${x}px)`; if(x<total) requestAnimationFrame(step); else el.remove(); }
      requestAnimationFrame(step);
    }
    if(img.complete) position(); else img.onload=position;
    if(sfx && !muted){ try{ sfx.currentTime=0; sfx.play(); }catch(e){} }
  }

  if(btn){ btn.addEventListener('click', ()=>{ const text=(wishText.value||'').trim(); addWish(text); spawn(); wishText.value=''; }); }

  const btnSave=document.getElementById('saveImageBtn'); const river=document.getElementById('river');
  if(btnSave && window.html2canvas){
    btnSave.addEventListener('click', async ()=>{
      btnSave.disabled=true;
      try{ const canvas=await html2canvas(river,{useCORS:true,backgroundColor:null,scale:2}); const a=document.createElement('a'); a.download='loy-krathong.png'; a.href=canvas.toDataURL('image/png'); a.click(); }catch(e){ alert('ไม่สามารถบันทึกรูปได้'); }
      btnSave.disabled=false;
    });
  }
})();
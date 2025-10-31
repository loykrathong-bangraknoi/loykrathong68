// regions.js — switchable Thai regions background
(function(){
  const el = document.querySelector('.scene-background');
  if(!el) return;
  const map = {
    central: 'assets/bg-temple.png',
    north: 'assets/bg-temple.png',
    northeast: 'assets/bg-temple.png',
    south: 'assets/bg-temple.png'
  };
  function apply(v){ el.style.backgroundImage = `url('${map[v]||map.central}')`; }
  document.addEventListener('DOMContentLoaded', ()=>{
    const sel = document.getElementById('region');
    if(!sel) return;
    const saved = localStorage.getItem('region') || 'central';
    sel.value = saved; apply(saved);
    sel.addEventListener('change', ()=>{ localStorage.setItem('region', sel.value); apply(sel.value); });
  });
})();
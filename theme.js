
(function(){
  function applyTheme(){
    const h = new Date().getHours();
    let mode = 'night';           // ค่าดีฟอลต์
    if (h >= 18 && h <= 21) mode = 'evening';   // ฟ้าอมเขียว
    if (h >= 22 || h <= 1) mode = 'late';       // ม่วงอมชมพู
    document.documentElement.setAttribute('data-time-theme', mode);
  }
  applyTheme();
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) applyTheme(); });
})();

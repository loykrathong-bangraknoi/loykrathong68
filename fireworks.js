// fireworks.js — simple canvas fireworks with toggle
(function(){
  let c,ctx,run=false,ps=[],id,btn;
  function init(){ if(c) return;
    c=document.createElement('canvas'); c.className='fireworks-layer';
    ctx=c.getContext('2d');
    function rs(){ c.width=innerWidth; c.height=Math.max(400,(innerHeight*0.6)|0); }
    rs(); addEventListener('resize',rs);
    Object.assign(c.style,{position:'fixed',left:0,top:0,zIndex:40,pointerEvents:'none'});
    document.body.appendChild(c);
  }
  function launch(){
    const x=Math.random()*c.width*0.9+c.width*0.05;
    const y=Math.random()*c.height*0.35+c.height*0.05;
    const hue=(Math.random()*360)|0, n=50+((Math.random()*30)|0);
    for(let i=0;i<n;i++){
      const a=6.283*i/n, s=1.5+Math.random()*2.5;
      ps.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:60+Math.random()*20,h:hue,a:1});
    }
  }
  function step(){ if(!run) return;
    ctx.clearRect(0,0,c.width,c.height);
    for(let i=ps.length-1;i>=0;i--){
      const p=ps[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.02; p.life--;
      const alpha=Math.max(0,p.life/80);
      ctx.globalCompositeOperation='lighter';
      ctx.fillStyle=`hsla(${p.h},100%,60%,${alpha})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,2,0,6.283); ctx.fill();
      if(p.life<=0) ps.splice(i,1);
    }
    if(Math.random()<0.04) launch();
    id=requestAnimationFrame(step);
  }
  function start(){ if(!run){ init(); run=true; step(); } }
  function stop(){ run=false; if(id) cancelAnimationFrame(id); }
  function toggle(){ run?stop():start(); btn.textContent=run?'🎆':'🎇'; }
  btn=document.createElement('button'); btn.className='fx-toggle'; btn.type='button';
  btn.textContent='🎇'; btn.title='เปิด/ปิด Fireworks';
  btn.addEventListener('click',e=>{ e.stopPropagation(); toggle(); });
  addEventListener('DOMContentLoaded',()=>{ document.body.appendChild(btn); });
})();
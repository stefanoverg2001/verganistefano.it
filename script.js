const preview=document.querySelector('.cursor-preview');
if(preview){
 const fine=matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const image=preview.querySelector('img');let x=0,y=0,tx=0,ty=0,raf=0,active=false;
 const hide=()=>{active=false;preview.classList.remove('visible');cancelAnimationFrame(raf);raf=0};
 function draw(){x+=(tx-x)*(reduced.matches?1:.22);y+=(ty-y)*(reduced.matches?1:.22);preview.style.transform=`translate3d(${x}px,${y}px,0)`;if(active)raf=requestAnimationFrame(draw)}
 function position(e){const pw=preview.offsetWidth||360,ph=preview.offsetHeight||270;tx=Math.max(12,Math.min(e.clientX+28,innerWidth-pw-12));ty=Math.max(12,Math.min(e.clientY+24,innerHeight-ph-12))}
 document.querySelectorAll('.project-row[data-cover]').forEach(row=>{
 row.addEventListener('pointerenter',e=>{if(!fine.matches||e.pointerType==='touch')return;var ar=parseFloat(row.dataset.ar)||4/3;preview.style.width=Math.round(Math.min(440,Math.sqrt(97200*ar)))+'px';image.src=row.dataset.cover;position(e);x=tx;y=ty;active=true;preview.classList.add('visible');cancelAnimationFrame(raf);draw()});
 row.addEventListener('pointermove',position);row.addEventListener('pointerleave',hide);row.addEventListener('click',hide);
 });
 addEventListener('scroll',hide,{passive:true});addEventListener('resize',hide);addEventListener('blur',hide);fine.addEventListener('change',hide);
}

// Page transitions between internal pages.
(()=>{
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const pix=(t,mode)=>{const d=document.createElement('div');d.className='pt-bars '+mode;d.setAttribute('aria-hidden','true');
  const c=document.createElement('i');d.appendChild(c);
  const s=document.createElement('span'),m=document.createElement('em'),w=document.createElement('b');w.textContent=t;m.appendChild(w);s.appendChild(m);d.appendChild(s);return d};
 if(root.classList.contains('pt-enter')){const o=pix(root.getAttribute('data-pt')||'','out');document.body.appendChild(o);root.classList.add('pt-ready');setTimeout(()=>o.remove(),1200)}
 if(root.classList.contains('intro')){
  try{sessionStorage.setItem('intro','1')}catch(_){}
  let go=false;const play=()=>{if(go)return;go=true;requestAnimationFrame(()=>{root.classList.add('intro-play');setTimeout(()=>root.classList.remove('intro','intro-play'),2600)})};
  if(document.readyState==='complete')play();else{addEventListener('load',play);setTimeout(play,1500)}}
 const label=a=>{const u=new URL(a.href,location.href).pathname;
  if(/\/work\//.test(u))return 'Work';
  if(/\/about\//.test(u))return 'About';
  if(/\/projects\//.test(u)){const n=a.querySelector('.project-name,em');return n?n.textContent.trim():'Progetto'}
  return 'Stefano Vergani'};
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  if(a.target==='_blank'||a.hasAttribute('download'))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||!/^https?:|^file:/.test(url.protocol))return;
  if(url.pathname===location.pathname&&url.hash)return;
  if(reduced.matches)return;
  e.preventDefault();
  const t=label(a);
  try{sessionStorage.setItem('pt',t)}catch(_){}
  document.querySelectorAll('.pt-bars').forEach(x=>x.remove());
  document.body.appendChild(pix(t,'in'));
  setTimeout(()=>{location.href=url.href},600);
 });
 addEventListener('pageshow',e=>{if(e.persisted){root.classList.remove('pt-leave','pt-enter');document.querySelectorAll('.pt-bars').forEach(x=>x.remove())}});
 root.addEventListener('animationend',()=>{},{passive:true});
})();

// About: CV folder tabs.
(()=>{
 const tabs=[...document.querySelectorAll('.cv-tab')];if(!tabs.length)return;
 const folder=document.querySelector('.cv-folder');
 const select=t=>{tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on});
  if(folder){folder.style.borderTopLeftRadius=t===tabs[0]?'0':'';folder.parentElement.dataset.active=t.id==='tab-edu'?'edu':'exp'}};
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(t));
  t.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const n=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];select(n);n.focus()}})});
})();

/* Video dei casi studio: si caricano e partono solo quando arrivano vicino allo schermo */
(function(){var v=document.querySelectorAll("video[data-src]");if(!v.length)return;function go(el){if(!el.src){el.src=el.dataset.src}var p=el.play();if(p&&p.catch)p.catch(function(){})}if(!("IntersectionObserver" in window)){v.forEach(go);return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)go(e.target);else if(e.target.src)e.target.pause()})},{rootMargin:"300px 0px"});v.forEach(function(el){io.observe(el)})})();

/* Copertine Work: le scarico in anticipo appena la pagina è pronta, così al passaggio del mouse compaiono subito */
(function(){var r=document.querySelectorAll('.project-row[data-cover]');if(!r.length)return;function go(){r.forEach(function(e){var i=new Image();i.decoding='async';i.src=e.dataset.cover})}if(document.readyState==='complete')setTimeout(go,200);else addEventListener('load',function(){setTimeout(go,200)})})();

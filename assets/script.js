const menu=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

// Header state + scroll progress
const header=document.querySelector('.site-header');
function onScroll(){
  const y=window.scrollY||0;
  header?.classList.toggle('scrolled',y>35);
  const doc=document.documentElement;
  const max=doc.scrollHeight-window.innerHeight;
  doc.style.setProperty('--scroll',max>0?`${Math.min(100,(y/max)*100)}%`:'0%');
  const heroBg=document.querySelector('.hero-bg');
  if(heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){heroBg.style.transform=`translate3d(0,${Math.min(y*.08,45)}px,0) scale(1.03)`;}
}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Premium scroll reveal with staggered children
const revealTargets=[
  '.intro-grid > div','.principles > div','.section-head > *','.project-card',
  '.gallery-head > *','.filter-row','.gallery-item','.career-grid > *','.contact-grid > *','footer .footer-inner > *'
];
let revealIndex=0;
revealTargets.forEach(selector=>document.querySelectorAll(selector).forEach(el=>{
  el.classList.add('reveal-on-scroll');
  const n=(revealIndex++%8)+1; el.classList.add(`stagger-${n}`);
}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -45px 0px'});
document.querySelectorAll('.reveal-on-scroll').forEach(el=>observer.observe(el));

// Active navigation as sections enter viewport
const sections=[...document.querySelectorAll('main section[id]')];
const links=[...document.querySelectorAll('.nav a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===`#${entry.target.id}`))}
}),{rootMargin:'-35% 0px -55% 0px',threshold:0});
sections.forEach(s=>sectionObserver.observe(s));

// Gallery filters
const filters=document.querySelectorAll('.filter');
const items=[...document.querySelectorAll('.gallery-item')];
filters.forEach(btn=>btn.addEventListener('click',()=>{
  filters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');
  const f=btn.dataset.filter;
  items.forEach(item=>{
    const show=f==='all'||item.dataset.type===f;
    item.style.display=show?'block':'none';
    if(show){item.classList.remove('is-visible');requestAnimationFrame(()=>item.classList.add('is-visible'));}
  });
}));

// Lightbox
const lightbox=document.getElementById('lightbox'), lbImg=document.getElementById('lightboxImg'), lbCap=document.getElementById('lightboxCaption');
let visible=[],index=0;
function refreshVisible(){visible=items.filter(x=>x.style.display!=='none')}
function show(i){refreshVisible();if(!visible.length)return;index=(i+visible.length)%visible.length;const item=visible[index];lbImg.src=item.querySelector('img').src;lbImg.alt=item.querySelector('img').alt;lbCap.textContent=item.querySelector('figcaption')?.innerText||'';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
items.forEach(item=>item.addEventListener('click',()=>{refreshVisible();show(visible.indexOf(item))}));
function closeLb(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelector('.close').addEventListener('click',closeLb);document.querySelector('.prev').addEventListener('click',()=>show(index-1));document.querySelector('.next').addEventListener('click',()=>show(index+1));lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLb()});document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});

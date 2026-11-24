document.addEventListener('DOMContentLoaded', () => {

    /* 1. PRELOADER */
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('progress');
    const countEl = document.getElementById('count');
    let progress = 0;

    if (preloader) {
        document.body.style.overflow = 'hidden';

        const fakeLoading = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(fakeLoading);
                setTimeout(() => {
                    preloader.classList.add('is-done');
                    document.body.style.overflow = '';
                }, 400);
            }
            progressBar.style.width = progress + '%';
            countEl.textContent = Math.floor(progress);
        }, 120);
    }

    /* 2. ПРОГРЕСС СКРОЛЛА */
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = (scrollTop / docHeight) * 100;
        if (scrollProgress) scrollProgress.style.width = percent + '%';
    }, { passive: true });

    /* 3. ФОРМА (имитация отправки) */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const original = btn.innerHTML;
            btn.innerHTML = '<span>Отправлено ✓</span>';
            btn.style.background = '#27ae60';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
                btn.style.color = '';
                form.reset();
                window.location.hash = '';
            }, 2000);
        });
    }

    initFX();

});
/* ================= PRO-ЭФФЕКТЫ ================= */
function initFX(){
  const root=document.documentElement, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const ease='cubic-bezier(.16,1,.3,1)';

  /* --- Плавный скролл (свой мини-Lenis) --- */
  const go=y=>scrollTo({top:Math.max(0,y),behavior:reduce?'auto':'smooth'});
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]');if(!a)return;
    const id=a.getAttribute('href');if(id==='#'||id==='#contact-modal')return;
    const t=id==='#top'?null:$(id);if(id!=='#top'&&!t)return;
    e.preventDefault();go(t?t.getBoundingClientRect().top+scrollY:0);
  });

  /* --- Tilt + spotlight карточек --- */
  if(fine&&!reduce)$$('.tech-card').forEach(c=>{
    let r;
    c.addEventListener('pointerenter',()=>{r=c.getBoundingClientRect();c.classList.add('is-tilting')});
    c.addEventListener('pointermove',e=>{
      if(!r)return;const x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');
      c.style.transform=`perspective(900px) rotateX(${(y/r.height-.5)*-9}deg) rotateY(${(x/r.width-.5)*9}deg) scale(1.02)`;
    });
    c.addEventListener('pointerleave',()=>{c.classList.remove('is-tilting');c.style.transform=''});
  });

  /* --- Появление: fallback для .reveal, карточки по очереди, счётчики --- */
  const io=(sel,cb,th=.25)=>{const o=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){cb(en.target);o.unobserve(en.target)}}),{threshold:th});$$(sel).forEach(n=>o.observe(n))};
  io('.reveal',el=>el.classList.add('in'),.08);
  io('.tech-grid',g=>[...g.children].forEach((c,i)=>c.animate([{opacity:0,translate:'0 60px'},{opacity:1,translate:'0 0'}],{duration:900,delay:i*140,easing:ease,fill:'backwards'})),.2);
  $$('.slide').forEach(sl=>{
    const el=sl.querySelector('.s-num');if(!el)return;
    const m=el.textContent.trim().match(/^([\d.]+)(.*)$/);if(!m)return;
    const end=parseFloat(m[1]),dec=(m[1].split('.')[1]||'').length;let raf;
    sl.addEventListener('pointerenter',()=>{
      if(reduce)return;cancelAnimationFrame(raf);const t0=performance.now();
      const tick=t=>{const p=Math.min((t-t0)/1300,1);el.textContent=(end*(1-Math.pow(1-p,3))).toFixed(dec)+m[2];if(p<1)raf=requestAnimationFrame(tick)};
      raf=requestAnimationFrame(tick);
    });
  });

  /* --- Тема --- */
  $('#themeToggle').addEventListener('click',()=>{
    root.classList.add('theme-anim');const n=root.dataset.theme==='light'?'dark':'light';root.dataset.theme=n;
    try{localStorage.setItem('theme',n)}catch(e){}
    setTimeout(()=>root.classList.remove('theme-anim'),700);
  });

  /* --- Плавающее меню --- */
  const fab=$('#fabToggle'),menu=$('#fabMenu');
  const setFab=o=>{menu.classList.toggle('is-open',o);fab.setAttribute('aria-expanded',o)};
  fab.addEventListener('click',()=>setFab(!menu.classList.contains('is-open')));
  menu.addEventListener('click',e=>{if(e.target.closest('a'))setFab(false)});
  document.addEventListener('click',e=>{if(!e.target.closest('#fab'))setFab(false)});
  const secs=['top','cases','technologies'].map(id=>document.getElementById(id));
  new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)$$('.fab-item[data-sec]').forEach(a=>a.classList.toggle('is-current',a.dataset.sec===en.target.id))}),{threshold:.5}).observe&&secs.forEach(s=>s&&new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)$$('.fab-item[data-sec]').forEach(a=>a.classList.toggle('is-current',a.dataset.sec===en.target.id))}),{threshold:.45}).observe(s));

  /* --- «Ключи»: оверлей + загрузка + раскрытие деталей --- */
  const DATA={
    'tech-structure.html':{t:'Проектирую каркас продукта: от дизайн-системы и токенов до логики данных. Всё масштабируется и не ломается при росте.',s:[['Figma & Tokens',92],['UI-архитектура',88],['Python & Logic',70],['Структуры данных',64]]},
    'tech-speed.html':{t:'Лёгкая адаптивная вёрстка, живые CSS/JS-анимации и быстрые процессы без лишней бюрократии.',s:[['HTML5 / CSS3',95],['JavaScript',80],['Agile / Kanban',75],['Оптимизация',85]]},
    'tech-achievements.html':{t:'Арт-дирекшн + автоматизация рутины + современные нейросети = смелые концепты, которые замечают.',s:[['AI-воркфлоу',90],['Автоматизация',78],['Арт-дирекшн',86],['Кейсы и рост',72]]}
  };
  const ov=$('#pageTransition'),lab=$('#pageTransitionLabel'),desc=$('#pageTransitionDesc'),bar=$('#keyLoaderBar'),
        go$=$('#keyGoNowBtn'),cancel=$('#keyCancelBtn'),badge=$('.key-modal-badge'),loader=$('.key-modal-loader');
  let timer,cur$k,detail;
  const showDetail=()=>{
    clearTimeout(timer);if(!cur$k||detail)return;
    badge.textContent='⚿ ДОСТУП ОТКРЫТ';desc.style.display='none';loader.style.display='none';go$.style.display='none';cancel.textContent='Закрыть';
    detail=document.createElement('div');detail.className='key-detail';
    detail.innerHTML=cur$k.s.map(([n,v])=>`<div class="kd-row"><b><span>${n}</span><span>${v}%</span></b><div class="kd-bar"><em data-w="${v}"></em></div></div>`).join('');
    loader.after(detail);
    requestAnimationFrame(()=>requestAnimationFrame(()=>detail.querySelectorAll('em').forEach(e=>e.style.width=e.dataset.w+'%')));
  };
  const closeKey=()=>{clearTimeout(timer);ov.classList.remove('is-active');root.classList.remove('no-scroll');ov.setAttribute('aria-hidden','true')};
  $$('.tech-key-btn').forEach(b=>b.addEventListener('click',e=>{
    e.preventDefault();cur$k=DATA[b.getAttribute('href')];if(detail){detail.remove();detail=null}
    badge.textContent='⚿ КЛЮЧ АКТИВИРОВАН';lab.textContent=b.dataset.transitionLabel;desc.style.display='';desc.textContent='Загружаю навыки…';
    loader.style.display='';go$.style.display='';cancel.textContent='Остаться здесь';
    bar.style.transition='none';bar.style.width='0%';bar.offsetWidth;bar.style.transition='width 1.6s linear';bar.style.width='100%';
    ov.classList.add('is-active');ov.setAttribute('aria-hidden','false');root.classList.add('no-scroll');
    timer=setTimeout(showDetail,1700);
  }));
  go$.addEventListener('click',e=>{e.preventDefault();showDetail()});
  cancel.addEventListener('click',closeKey);
  ov.addEventListener('click',e=>{if(e.target===ov)closeKey()});
  addEventListener('keydown',e=>{if(e.key==='Escape'){closeKey();setFab(false);if(location.hash==='#contact-modal')location.hash=''}});

  /* --- Аврора на фоне 3-й секции --- */
  const cv=$('#aurora'),sec=$('#technologies');
  if(cv){
    const ctx=cv.getContext('2d'),dpr=.4;let w,h,mx=.5,my=.5,vis=true;
    const B=[{x:.18,y:.3,r:.5,s:1.0,p:0,c:'42,157,143'},{x:.78,y:.22,r:.46,s:1.25,p:2,c:'198,168,124'},{x:.5,y:.82,r:.58,s:.8,p:4,c:'58,85,200'},{x:.92,y:.8,r:.4,s:1.4,p:1,c:'130,90,210'}];
    const fit=()=>{w=cv.width=sec.clientWidth*dpr;h=cv.height=sec.clientHeight*dpr};fit();addEventListener('resize',fit);
    sec.addEventListener('pointermove',e=>{const r=sec.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height},{passive:true});
    new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(sec);
    const draw=t=>{
      if(vis||reduce){
        const light=root.dataset.theme==='light',k=light?.38:.62;
        ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,w,h);
        ctx.globalCompositeOperation=light?'source-over':'lighter';
        B.forEach(b=>{
          const a=t*.00018*b.s,x=(b.x+.2*Math.sin(a*3+b.p)+.07*(mx-.5))*w,y=(b.y+.17*Math.cos(a*2.4+b.p*1.3)+.07*(my-.5))*h,
                r=b.r*Math.max(w,h)*(.9+.12*Math.sin(a*4+b.p)),g=ctx.createRadialGradient(x,y,0,x,y,r);
          g.addColorStop(0,`rgba(${b.c},${k})`);g.addColorStop(.55,`rgba(${b.c},${k*.35})`);g.addColorStop(1,`rgba(${b.c},0)`);
          ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
        });
      }
      if(!reduce)requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }
}

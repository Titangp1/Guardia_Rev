/* Guardia_Rev · animations douces : en-tête qui se cache au défilement, apparition des blocs au premier affichage.
   Purement visuel : app.js reconstruit la page à chaque interaction, on n'anime donc que le premier rendu de chaque page. */
(function(){
  var html=document.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* En-tête : filet sous l'en-tête dès qu'on défile, masqué en descendant, réaffiché en remontant. */
  var lastY=0,ticking=false;
  function onScroll(){
    var y=window.scrollY||0;
    html.classList.toggle('gr-scrolled',y>8);
    html.classList.toggle('gr-hide',y>160&&y>lastY+2);
    if(y<lastY-2)html.classList.remove('gr-hide');
    lastY=y;ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});

  /* Apparition : une seule fois par chargement de page. */
  if(reduce||!('IntersectionObserver' in window))return;
  var done=false;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{rootMargin:'0px 0px -6% 0px',threshold:0});
  var SEL='.main > .card, .main > section, .main > .bento > *, .main > .grid > *, .main .g3 > *, .main .g2 > *, .main .fiche .sec, .credit';
  var TITLES='.hero h1, .head h1, .subj-head h1';
  function arm(){
    var main=document.getElementById('main');
    if(done||!main)return;
    done=true;
    var i=0;
    document.querySelectorAll(TITLES).forEach(function(t){t.classList.add('rv-title');requestAnimationFrame(function(){requestAnimationFrame(function(){t.classList.add('in')})})});
    document.querySelectorAll(SEL).forEach(function(el){
      if(el.classList.contains('rv'))return;
      el.classList.add('rv');
      el.style.transitionDelay=Math.min(i++,6)*70+'ms';
      io.observe(el);
    });
  }
  var root=document.getElementById('root');
  if(!root)return;
  new MutationObserver(function(){if(!done)arm()}).observe(root,{childList:true});
})();

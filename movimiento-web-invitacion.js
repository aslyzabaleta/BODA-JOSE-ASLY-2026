/* José & Asly · Efectos de entrada V2.
   Intersecciones ligeras: scroll natural, sin bloquear el dedo ni crear carruseles. */
(()=>{
  'use strict';
  const prefersLessMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersLessMotion || !('IntersectionObserver' in window))return;

  const sets=[
    {selector:'#historia .film-photo',effect:'motion-fade'},
    {selector:'#lugares .venue-duo-photo',effect:'motion-item'},
    {selector:'#vestuario .dress-native-figure',effect:'motion-item'},
    {selector:'#cuenta-regresiva .count-units > div',effect:'motion-item'},
    {selector:'#tonos-reservados .swatches > div',effect:'motion-item'},
    {selector:'#presentacion .intro-paper-card',effect:'motion-panel'},
    {selector:'#historia .story-memory-board',effect:'motion-panel'},
    {selector:'#solo-adultos .adults-paper',effect:'motion-panel'},
    {selector:'#lluvia .gift-envelope',effect:'motion-panel'},
    {selector:'#confirmacion .rsvp-form',effect:'motion-panel'},
    {selector:'#presentacion .intro-heading',effect:'motion-accent'},
    {selector:'#lugares .venue-duo-title',effect:'motion-accent'},
    {selector:'#vestuario .dress-native-title',effect:'motion-accent'},
    {selector:'#confirmacion .section-title',effect:'motion-accent'},
    {selector:'#cierre .hero-names',effect:'motion-accent'}
  ];

  const items=[];
  for(const group of sets){
    const elements=[...document.querySelectorAll(group.selector)];
    for(const [index,element] of elements.entries()){
      element.classList.add(group.effect);
      // Figuras, recuerdos y colores llegan en cascada, sin frenar el desplazamiento.
      if(group.effect==='motion-item' || group.effect==='motion-fade'){
        const delay=Math.min(index,4)*145;
        element.style.setProperty('--motion-delay',delay+'ms');
      }
      items.push(element);
    }
  }
  if(!items.length)return;

  const observer=new IntersectionObserver((entries,self)=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('motion-in');
      self.unobserve(entry.target);
    }
  }, {threshold:0.06,rootMargin:'0px 0px -3% 0px'});

  // Primera pintura oculta y segunda pintura visible:
  // evita que móvil suprima la transición por agrupar ambas clases en un solo frame.
  requestAnimationFrame(()=>{
    document.documentElement.classList.add('motion-ready');
    requestAnimationFrame(()=>{
      for(const item of items)observer.observe(item);
    });
  });
})();

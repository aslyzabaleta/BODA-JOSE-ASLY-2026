/* José & Asly: aparición progresiva de elementos durante el scroll normal.
   No intercepta gestos, no cambia fotos y funciona sin librerías. */
(()=>{
  'use strict';
  if(!('IntersectionObserver' in window) ||
     window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const selector=[
    '#historia .film-photo',
    '#lugares .venue-duo-photo',
    '#vestuario .dress-native-figure',
    '#cuenta-regresiva .count-units > div',
    '#tonos-reservados .swatches > div'
  ].join(',');
  const targets=[...document.querySelectorAll(selector)];
  if(!targets.length)return;
  const observer=new IntersectionObserver((entries,self)=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('motion-in');
      self.unobserve(entry.target);
    }
  }, {threshold:0.06, rootMargin:'0px 0px -2% 0px'});

  targets.forEach((element)=>{
    const photo=element.matches('#historia .film-photo');
    element.classList.add(photo?'motion-fade':'motion-item');
    const siblings=[...element.parentElement.children]
      .filter(child=>child.matches(photo?'.film-photo':'.motion-item'));
    const index=Math.max(0,siblings.indexOf(element));
    element.style.setProperty('--motion-delay',Math.min(index,4)*125+'ms');
    observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
})();

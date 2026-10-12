(()=>{
'use strict';
const cfg=window.BODA_CONFIG||{};
const $=id=>document.getElementById(id);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const content=$('invitationContent'),cover=$('portada'),audio=$('musicPlayer'),toggle=$('musicToggle');
let opened=false;
function putPhoto(id,path){
 if(!path||typeof path!=='string')return;
 const el=$(id);if(!el)return;
 const img=new Image();
 img.onload=()=>{el.style.backgroundImage=`url(${JSON.stringify(path)})`;el.classList.add('has-photo');};
 img.onerror=()=>console.warn('Fotografía pendiente de incorporar:',path);
 img.src=path;
}
if (!$('mainPhoto')?.querySelector('.portrait-photo-image')) putPhoto('mainPhoto',cfg.fotoPrincipal);
(cfg.fotosHistoria||[]).slice(0,2).forEach((path,i)=>putPhoto('storyPhoto'+(i+1),path));
function setMusicButton(){toggle.innerHTML=audio.paused?'<span aria-hidden="true">♫</span><span class="music-label">Reproducir música</span>':'<span aria-hidden="true">Ⅱ</span><span class="music-label">Pausar música</span>';}
const musicSource=typeof cfg.musica==='string'?cfg.musica.trim():'';
const musicStart=Math.max(0,Number(cfg.inicioMusica)||0);
function seekMusicStart(){
 if(!musicStart||audio.readyState<1)return;
 const target=Number.isFinite(audio.duration)?Math.min(musicStart,Math.max(0,audio.duration-.25)):musicStart;
 if(Math.abs(audio.currentTime-target)<.15)return;
 try{audio.currentTime=target;}catch(e){console.warn('No se pudo fijar el inicio de la música:',e);}
}
// Preparar los metadatos antes de abrir el sobre: el salto a 1:32 debe
// suceder ANTES de que se escuche la canción, no después de empezar en 0:00.
audio.addEventListener('loadedmetadata',seekMusicStart);
if(musicSource){
 audio.preload='metadata';
 audio.src=musicSource;
 audio.load();
}
function playMusicOnOpen(){
 if(!musicSource)return;
 toggle.hidden=false;
 seekMusicStart();
 audio.play().then(setMusicButton).catch(()=>{
  setMusicButton();
  console.warn('El navegador requiere pulsar Reproducir música para activar el audio.');
 });
}
toggle.addEventListener('click',()=>{
 if(audio.paused){
  if(audio.ended)seekMusicStart();
  audio.play().then(setMusicButton).catch(setMusicButton);
 }else{audio.pause();setMusicButton();}
});
audio.addEventListener('ended',()=>{
 seekMusicStart();
 audio.play().then(setMusicButton).catch(setMusicButton);
});
audio.addEventListener('error',()=>{setMusicButton();console.warn('No se pudo cargar el archivo de música.');});
$('openInvite').addEventListener('click',()=>{
 if(opened)return;opened=true;
 playMusicOnOpen(); // solo tras la acción del invitado
 cover.classList.add('is-opening');
 $('openInvite').setAttribute('aria-disabled','true');
 $('coverHint').textContent='Nuestra historia comienza…';
 const delay=reduced?250:2600;
 window.setTimeout(()=>{
  content.classList.add('active');content.inert=false;
  $('presentacion').classList.add('visible');
  $('presentacion').scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
 },delay);
});
const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
 entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('visible');revealObserver.unobserve(target);}});
},{threshold:.12,rootMargin:'0px 0px -8% 0px'}):null;
document.querySelectorAll('.animated-scene,.location-block,.reveal').forEach(el=>{if(revealObserver)revealObserver.observe(el);else el.classList.add('visible');});
function updateProgress(){const max=document.documentElement.scrollHeight-window.innerHeight;const frac=max>0?Math.max(0,Math.min(1,scrollY/max)):0;$('readingProgress').style.width=(frac*100)+'%';}
window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress);updateProgress();
function updateClock(){
 const eventDate=/^\d{4}-\d{2}-\d{2}$/.test(cfg.fecha||'')?cfg.fecha:'2026-12-26';
 const hasHour=/^([01]\d|2[0-3]):[0-5]\d$/.test(cfg.horaCeremonia||'');
 const target=new Date(`${eventDate}T${hasHour?cfg.horaCeremonia:'00:00'}:00-05:00`);
 const remaining=Math.max(0,target.getTime()-Date.now());
 const parts={days:Math.floor(remaining/86400000),hours:Math.floor((remaining%86400000)/3600000),minutes:Math.floor((remaining%3600000)/60000),seconds:Math.floor((remaining%60000)/1000)};
 Object.entries(parts).forEach(([id,n])=>$(id).textContent=id==='days'?String(n):String(n).padStart(2,'0'));
 $('countNote').textContent=hasHour?'Cuenta hasta la hora de la ceremonia confirmada.':'Cuenta hasta el comienzo del 26 de diciembre (hora de Colombia). La hora de la ceremonia está por confirmar.';
}
updateClock();window.setInterval(updateClock,1000);
const token=new URLSearchParams(location.search).get('invitado');
const invited=token&&cfg.invitados&&Object.prototype.hasOwnProperty.call(cfg.invitados,token)?cfg.invitados[token]:null;
if(invited){const n=Math.max(1,Math.floor(Number(invited.cupos)||1));$('guestName').value=invited.nombre||'';$('guestCount').max=n;$('quotaNote').textContent=`Invitación para ${invited.nombre||'invitado'}. Cupos asignados: ${n}.`}
const status=$('rsvpStatus');$('attendance').addEventListener('change',()=>{const declined=$('attendance').value==='No';$('guestCount').disabled=declined;$('companions').disabled=declined;if(declined)$('guestCount').value=1;});
$('rsvpForm').addEventListener('submit',e=>{
 e.preventDefault();const name=$('guestName').value.trim(),yes=$('attendance').value==='Sí',count=yes?Number($('guestCount').value):0,max=Number($('guestCount').max)||20;
 if(!name){status.textContent='Por favor, escribe tu nombre.';return}
 if(yes&&(!Number.isInteger(count)||count<1||count>max)){status.textContent=`El número de personas debe estar entre 1 y ${max}.`;return}
 const companions=yes?$('companions').value.trim():'No asistiré';
 const message=`Hola 💕 quiero confirmar mi asistencia a la boda de José y Asly.\n\nMi nombre es: ${name}\n\nAsistiré con: ${companions||'Sin acompañantes'}\n\nNúmero de personas: ${count}\n\n${yes?'¡Nos vemos para celebrar juntos este día tan especial! 💍🥂':'Muchas gracias por la invitación.'}`;
 const phone=String(cfg.whatsapp||'').replace(/\D/g,'');
 if(!/^\d{10,15}$/.test(phone)){
  status.textContent='El número de WhatsApp de confirmaciones está pendiente. Puedes copiar el mensaje para enviarlo al contacto que indiquen los novios.';
  $('copyMessage')?.remove();const btn=document.createElement('button');btn.id='copyMessage';btn.type='button';btn.className='cta';btn.textContent='COPIAR MENSAJE';
  btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message);status.textContent='Mensaje copiado. Aún no está configurado el WhatsApp de destino.'}catch{status.textContent='No se pudo copiar; vuelve a intentar desde un navegador seguro.'}});status.after(btn);return;
 }
 status.textContent='Se abrirá WhatsApp. Recuerda enviar el mensaje para confirmar; la página no registra confirmaciones automáticamente.';
 window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
});
})();

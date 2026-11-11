/* QSOcat · Propagació solar i condicions HF
   Feed de Map For HAM: ús personal/no comercial; actualitzar com a màxim cada 5 min.
   Dades d'origen NOAA SWPC. */
(function(){
 const API='https://www.mapforham.com/hf-propagation/data/solar.json';
 let data=null,updated=0,loading=false,error='',poll=null;
 const css='.prop-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.prop-stat{background:#10243a;border:1px solid #25435e;border-radius:12px;padding:12px;min-width:0}.prop-stat small{display:block;color:#8eabc4;font-size:.72rem}.prop-stat b{font-size:1.45rem;display:block;margin-top:4px}.prop-stat em{font-size:.72rem;color:#9ab1c8;font-style:normal}.prop-band{display:grid;grid-template-columns:1fr auto auto;gap:10px;align-items:center;padding:11px 0;border-bottom:1px solid #20374d}.prop-band:last-child{border:0}.prop-good{color:#53d88b}.prop-fair{color:#f4c66b}.prop-poor{color:#ff8888}.prop-pill{font-size:.75rem;font-weight:800;padding:5px 8px;border-radius:20px;background:#20374d}.prop-note{font-size:.78rem;color:var(--muted);line-height:1.5}.prop-refresh{display:flex;gap:8px;align-items:center;flex-wrap:wrap}';
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v).toFixed(d):'—';
 function quality(v){const s=String(v||'').toLowerCase();return s.includes('good')?'Bona':s.includes('fair')?'Regular':s.includes('poor')?'Dolenta':v||'—'}
 function qClass(v){const s=String(v||'').toLowerCase();return s.includes('good')?'prop-good':s.includes('fair')?'prop-fair':s.includes('poor')?'prop-poor':''}
 function age(){if(!data?.updated)return 'Sense dades';const d=new Date(data.updated);return isNaN(d)?String(data.updated):d.toLocaleString('ca-ES')}
 async function refresh(force=false){
  if(loading||(!force&&Date.now()-updated<300000))return;loading=true;error='';
  const status=document.querySelector('#propStatus');if(status)status.textContent='Actualitzant dades…';
  try{const r=await fetch(API,{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const v=await r.json();if(!v||typeof v!=='object'||!('solar_flux'in v))throw Error('Format de dades inesperat');data=v;updated=Date.now()}catch(e){error='No s’han pogut actualitzar les dades. Es mostrarà l’última lectura si n’hi ha.';console.warn('QSOcat propagació:',e)}
  loading=false;draw();
 }
 function draw(){
  if((location.hash||'').slice(1)!=='propagation')return;
  const root=document.querySelector('#propContent');if(!root)return;
  if(!data){root.innerHTML='<div class="panel empty">'+esc(error||'Carregant dades solars…')+'</div>';return}
  const bands=Array.isArray(data.bands)?data.bands:[];
  const kp=Number(data.kp??data.k_index),storm=String(data.geomagnetic_field||'').toUpperCase();
  const kpText=Number.isFinite(kp)?kp.toFixed(2):'—';
  const kpHint=Number.isFinite(kp)?(kp<3?'Geomagnèticament tranquil':kp<5?'Activitat moderada':'Tempesta geomagnètica possible'):'—';
  root.innerHTML='<div class="panel"><div class="prop-refresh"><span class="pill">DADES SOLARS / HF</span><button class="btn" onclick="propRefresh()">↻ Actualitzar</button></div><p id="propStatus" class="prop-note">'+(error?esc(error)+' · ':'')+'Lectura del feed: '+esc(age())+'</p><div class="prop-grid"><div class="prop-stat"><small>Flux solar F10.7</small><b>'+num(data.solar_flux)+'</b><em>sfu · més alt sovint afavoreix HF</em></div><div class="prop-stat"><small>Taques solars</small><b>'+num(data.sunspots)+'</b><em>nombre diari</em></div><div class="prop-stat"><small>Índex Kp</small><b>'+kpText+'</b><em>'+esc(kpHint)+'</em></div><div class="prop-stat"><small>Índex A</small><b>'+num(data.a_index)+'</b><em>activitat geomagnètica</em></div><div class="prop-stat"><small>Camp geomagnètic</small><b style="font-size:1.05rem">'+esc(storm||'—')+'</b><em>estat reportat</em></div><div class="prop-stat"><small>Raigs X</small><b>'+esc(data.xray_class||'—')+'</b><em>activitat solar</em></div></div></div><div class="panel"><h3>Condicions estimades per bandes HF</h3><p class="prop-note">Indicació general per dia i nit segons el feed. No substitueix una prova d’escolta ni una predicció per a la teva ruta concreta.</p>'+ (bands.length?bands.map(b=>'<div class="prop-band"><b>'+esc(b.name)+'</b><span class="prop-pill '+qClass(b.day)+'">☀ '+esc(quality(b.day))+'</span><span class="prop-pill '+qClass(b.night)+'">☾ '+esc(quality(b.night))+'</span></div>').join(''):'<p class="prop-note">El proveïdor no ha retornat condicions per bandes.</p>')+'<p class="prop-note">☀ Dia · ☾ Nit</p></div><div class="panel"><h3>Altres indicadors</h3><div class="row"><span>Velocitat del vent solar</span><b>'+num(data.solar_wind_speed,1)+' km/s</b></div><div class="row"><span>Bz interplanetari</span><b>'+num(data.bz,2)+' nT</b></div><div class="row"><span>Bt total</span><b>'+num(data.bt,2)+' nT</b></div><div class="row"><span>Índex K arrodonit</span><b>'+num(data.k_index)+'</b></div></div><div class="panel"><p class="prop-note">Font: Map For HAM, que agrega dades de NOAA SWPC. El feed s\'actualitza aproximadament cada 5 minuts; QSOcat respecta aquest interval. Els índexs solars i geomagnètics són indicadors, no una garantia de propagació ni de contacte.</p><p class="prop-note"><a href="https://www.spaceweather.gov/" target="_blank" rel="noopener">NOAA Space Weather Prediction Center</a> · <a href="https://www.mapforham.com/hf-propagation/" target="_blank" rel="noopener">Map For HAM – HF Propagation</a></p></div>';
 }
 window.propagationView=function(){
  if(poll)clearInterval(poll);
  screen.innerHTML=shell('Propagació HF','Activitat solar i condicions estimades de les bandes')+'<div id="propContent"><div class="panel empty">Connectant amb les dades solars…</div></div>';
  refresh(true);poll=setInterval(()=>{if((location.hash||'').slice(1)==='propagation')refresh(false);else{clearInterval(poll);poll=null}},300000);
 };
 window.propRefresh=()=>refresh(true);
 const oldRender=window.render;if(oldRender&&!oldRender.__propWrapped){const w=function(){oldRender();if((location.hash||'').slice(1)==='propagation')window.propagationView()};w.__propWrapped=true;window.render=w}
 const oldHome=window.home;if(oldHome&&!oldHome.__propWrapped){const h=function(){oldHome();const g=document.querySelector('#screen .grid');if(g&&!g.querySelector('[data-prop-card]')){const b=document.createElement('button');b.className='card';b.dataset.propCard='1';b.innerHTML='<div class="ico">☀️</div><b>Propagació HF</b><small>Flux solar, Kp i estat de les bandes</small>';b.onclick=()=>nav('propagation');g.appendChild(b)}};h.__propWrapped=true;window.home=h}
 window.addEventListener('hashchange',()=>{if((location.hash||'').slice(1)!=='propagation'&&poll){clearInterval(poll);poll=null}});
})();
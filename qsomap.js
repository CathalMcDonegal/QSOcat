/* QSOcat · Mapa dels contactes registrats */
function maidenheadToLatLon(locator){
 const s=String(locator||'').trim().toUpperCase();
 if(![4,6,8,10,12].includes(s.length)||! /^[A-R]{2}\d{2}([A-X]{2}(\d{2}([A-X]{2}(\d{2})?)?)?)?$/.test(s))return null;
 let lon=-180,lat=-90,lonStep=20,latStep=10;
 for(let i=0;i<s.length;i+=2){
  const a=s[i],b=s[i+1],letters=(i===0||i%4===0),x=letters?a.charCodeAt(0)-65:Number(a),y=letters?b.charCodeAt(0)-65:Number(b);
  const divisor=i===0?1:(letters?24:10);
  lonStep/=divisor;latStep/=divisor;lon+=x*lonStep;lat+=y*latStep;
 }
 return [lat+latStep/2,lon+lonStep/2];
}
function locatorFromQso(q){
 const direct=String(q.locator||'').trim().toUpperCase();
 if(maidenheadToLatLon(direct))return direct;
 const match=String(q.qth||'').toUpperCase().match(/\b[A-R]{2}\d{2}[A-X]{2}(?:\d{2}[A-X]{2})?\b/);
 return match&&maidenheadToLatLon(match[0])?match[0]: '';
}
function qsoDistanceBearing(from,to){
 const a=maidenheadToLatLon(from),b=maidenheadToLatLon(to);if(!a||!b)return null;
 const rad=Math.PI/180,p1=a[0]*rad,p2=b[0]*rad,dp=(b[0]-a[0])*rad,dl=(b[1]-a[1])*rad;
 const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
 const km=6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
 const y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);
 return {km,azimuth:(Math.atan2(y,x)/rad+360)%360};
}
function saveQsoMapLocator(){
 const el=document.querySelector('#qsoOwnLocator'),loc=(el?.value||'').trim().toUpperCase();
 if(loc&&!maidenheadToLatLon(loc)){toast('Locator no vàlid. Exemple: JN01AB');return}
 localStorage.setItem('qsocat-own-locator',loc);qsoMap();toast('Locator de la teva estació desat');
}
function qsoMap(){
 const records=loadLog().map((q,i)=>({q,i,locator:locatorFromQso(q)}));
 const own=localStorage.getItem('qsocat-own-locator')||'';
 const band=document.querySelector('#qsoMapBand')?.value||'ALL';
 const mode=document.querySelector('#qsoMapMode')?.value||'ALL';
 const valid=records.filter(x=>x.locator);
 const bands=[...new Set(valid.map(x=>x.q.band).filter(Boolean))].sort();
 const modes=[...new Set(valid.map(x=>x.q.mode).filter(Boolean))].sort();
 const shown=valid.filter(x=>(band==='ALL'||x.q.band===band)&&(mode==='ALL'||x.q.mode===mode));
 screen.innerHTML=shell('Mapa de contactes','Els teus QSO situats amb localitzadors Maidenhead')+
 '<div class="panel"><b>'+shown.length+' contactes visibles al mapa</b><small style="display:block;color:var(--muted);margin-top:4px">'+valid.length+' contactes amb locator · '+(records.length-valid.length)+' sense locator</small>'+
 '<div class="form" style="margin-top:12px"><label>El meu locator Maidenhead<input id="qsoOwnLocator" autocapitalize="characters" value="'+esc(own)+'" placeholder="JN01AB"></label><button class="btn" type="button" onclick="saveQsoMapLocator()">💾 Desar locator</button>'+
 '<label>Banda<select id="qsoMapBand" onchange="qsoMap()"><option value="ALL">Totes les bandes</option>'+bands.map(x=>'<option value="'+esc(x)+'" '+(band===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label>'+
 '<label>Mode<select id="qsoMapMode" onchange="qsoMap()"><option value="ALL">Tots els modes</option>'+modes.map(x=>'<option value="'+esc(x)+'" '+(mode===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label></div></div>'+
 '<div class="panel map-panel"><div id="qsoMapCanvas" class="rep-map"></div><p style="color:var(--muted);font-size:.8rem;margin-bottom:0">La precisió depèn del locator introduït (4, 6, 8, 10 o 12 caràcters). El mapa base necessita Internet.</p></div>'+
 (shown.length?'<div class="list">'+shown.slice().sort((a,b)=>String(b.q.date||'').localeCompare(String(a.q.date||''))).map(x=>{const d=own?qsoDistanceBearing(own,x.locator):null;return '<div class="row"><div><b>'+esc(x.q.call||'—')+'</b><small style="display:block;color:var(--muted)">'+esc(x.q.date||'—')+' · '+esc(x.q.band||'')+' · '+esc(x.q.mode||'')+'</small><small style="display:block;color:var(--muted)">📍 '+esc(x.locator)+(d?' · '+d.km.toFixed(1)+' km · azimut '+Math.round(d.azimuth)+'°':'')+'</small></div><span class="pill">'+esc(x.q.freq||'QSO')+'</span></div>'}).join('')+'</div>':'<div class="panel empty">Encara no hi ha contactes amb un locator vàlid. Quan registris un QSO, omple el camp Locator Maidenhead (per exemple JN01AB).</div>')+
 '<div class="panel"><small style="color:var(--muted)">Els contactes sense locator es conserven al LOG però no es poden situar al mapa. També pots importar i exportar locators mitjançant ADIF (GRIDSQUARE).</small></div>';
 if(!window.L){document.querySelector('#qsoMapCanvas').innerHTML='<div class="empty">No hi ha connexió al mapa base. La llista de contactes continua disponible.</div>';return}
 if(mapInstance){try{mapInstance.remove()}catch(e){}}
 mapInstance=L.map('qsoMapCanvas',{zoomControl:true}).setView([41.65,1.75],6);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapInstance);
 const bounds=[];
 if(own){const p=maidenheadToLatLon(own);if(p){bounds.push(p);L.circleMarker(p,{radius:9,color:'#fff',weight:3,fillColor:'#f59e0b',fillOpacity:1}).addTo(mapInstance).bindPopup('<b>La meva estació</b><br>'+esc(own))}}
 shown.forEach(x=>{
  const p=maidenheadToLatLon(x.locator);if(!p)return;bounds.push(p);
  const d=own?qsoDistanceBearing(own,x.locator):null;
  const details='<b>'+esc(x.q.call||'—')+'</b><br>'+esc(x.q.date||'')+'<br>'+esc(x.q.band||'')+' · '+esc(x.q.mode||'')+' · '+esc(x.q.freq||'')+' MHz<br>Locator: '+esc(x.locator)+(d?'<br>'+d.km.toFixed(1)+' km · azimut '+Math.round(d.azimuth)+'°':'');
  L.circleMarker(p,{radius:7,color:'#fff',weight:2,fillColor:'#1787ff',fillOpacity:.92}).addTo(mapInstance).bindPopup(details);
 });
 if(bounds.length)mapInstance.fitBounds(bounds,{padding:[24,24],maxZoom:9});
}

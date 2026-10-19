/* QSOcat · Mapa de repetidors
   Maidenhead + cercles de cobertura aproximada.
   L'abast és orientatiu: depèn d'altura, potència, antena,
   terreny i condicions de propagació.
*/
function locatorToLatLon(locator){
  const s=String(locator||'').trim().toUpperCase();
  if(s.length<4)return null;
  const A='ABCDEFGHIJKLMNOPQR';
  const fLon=A.indexOf(s[0]), fLat=A.indexOf(s[1]);
  const sqLon=Number(s[2]), sqLat=Number(s[3]);
  if(fLon<0||fLat<0||!Number.isFinite(sqLon)||!Number.isFinite(sqLat)||sqLon<0||sqLon>9||sqLat<0||sqLat>9)return null;
  const lon=-180+(fLon*20)+(sqLon*2)+1;
  const lat=-90+(fLat*10)+sqLat+0.5;
  return [lat,lon];
}

function repeaterCoverageKm(r){
  if(r.coverageKm)return Number(r.coverageKm);
  return r.band==='VHF'?55:32;
}

function repeaterHeight(r){
  const h=Number(r.heightM);
  return Number.isFinite(h)&&h>0?`${h.toLocaleString('ca-ES')} m`:'—';
}

function repeaterPopup(r,i){
  const color=r.band==='VHF'?'#1687ff':'#9b59ff';
  return `<div class="rep-popup"><div class="rep-popup-head" style="border-left-color:${color}"><b>${esc(r.call)}</b><span class="pill">${r.band}</span></div><strong>${esc(r.name)}</strong><div class="rep-popup-grid"><span>RX <b>${r.rx} MHz</b></span><span>TX <b>${r.tx} MHz</b></span><span>Mode <b>${esc(r.mode)}</b></span><span>CTCSS <b>${esc(r.tone)} Hz</b></span><span>Altitud <b>${repeaterHeight(r)}</b></span><span>Abast <b>≈ ${repeaterCoverageKm(r)} km</b></span></div><button onclick="openRepeaterFromMap(${i})">Obrir fitxa</button></div>`;
}

function repeater(){
  const r=repeaters[selectedRepeater]||repeaters[0];
  const color=r.band==='VHF'?'#1687ff':'#9b59ff';
  screen.innerHTML=`${shell(r.call,r.name)}<div class="panel repeater-detail"><div class="rep-detail-top"><div><div class="freq">${r.rx} MHz</div><div class="rep-subtitle">Freqüència de recepció · ${r.band}</div></div><span class="rep-band" style="background:${color}">${r.band}</span></div><div class="rep-detail-grid"><div><small>TX / entrada</small><b>${r.tx} MHz</b></div><div><small>Offset</small><b>${esc(r.offset)}</b></div><div><small>CTCSS</small><b>${esc(r.tone)} Hz</b></div><div><small>Mode</small><b>${esc(r.mode)}</b></div><div><small>Altitud</small><b>${repeaterHeight(r)}</b></div><div><small>Abast aproximat</small><b>≈ ${repeaterCoverageKm(r)} km</b></div><div><small>Zona</small><b>${esc(r.area)}</b></div><div><small>Locator</small><b>${esc(r.locator)}</b></div></div><div class="coverage-note">🗺️ <b>Cobertura orientativa</b><span>El cercle del mapa representa aproximadament aquest abast. No és una predicció de cobertura real.</span></div><div class="actions" style="margin-top:12px"><button class="btn" onclick="copyText('${esc(`QSOcat ${r.call}\nRX ${r.rx} MHz\nTX ${r.tx} MHz\nCTCSS ${r.tone} Hz\nMode ${r.mode}\nAbast aproximat ${repeaterCoverageKm(r)} km\n${r.area}`)}')">📋 Copiar</button><button class="btn" onclick="useRepeater(${selectedRepeater})">📻 Utilitzar aquest repetidor</button><button class="btn secondary" onclick="nav('qso')">📒 Registrar QSO</button></div></div><div class="panel"><p style="color:var(--muted)">Font: ${esc(r.source)}. Les dades de repetidors poden canviar; comprova-les abans de transmetre.</p></div>`;
}

function mapView(){
  screen.innerHTML=`${shell('Mapa de repetidors','Catalunya · freqüència, mode i cobertura aproximada')}<div class="panel map-panel"><div id="repMap" class="rep-map"></div><div class="coverage-legend"><span class="legend-dot"></span><b>Cercle = abast aproximat</b><small>El radi varia segons el repetidor. VHF en blau · UHF en violeta.</small></div><div class="map-info">📡 Toca un repetidor per veure la seva freqüència, mode, CTCSS, altitud i abast.</div></div><div class="list">${repeaters.map((r,i)=>`<button class="row" onclick="openRepeaterFromMap(${i})"><div><b>${esc(r.call)} · ${esc(r.name)}</b><small style="display:block;color:var(--muted)">${r.rx} MHz · ${esc(r.mode)} · ${repeaterHeight(r)} · abast ≈ ${repeaterCoverageKm(r)} km</small></div><span class="pill">${r.band}</span></button>`).join('')}</div>`;
  if(!window.L){document.querySelector('#repMap').innerHTML='<div class="empty">El mapa necessita connexió a Internet. La llista continua disponible.</div>';return}
  if(mapInstance){try{mapInstance.remove()}catch(e){}}
  mapInstance=L.map('repMap',{zoomControl:true}).setView([41.65,1.75],7.5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapInstance);
  const bounds=[];
  repeaters.forEach((r,i)=>{
    const p=locatorToLatLon(r.locator); if(!p)return;
    bounds.push(p);
    const radius=repeaterCoverageKm(r)*1000;
    const color=r.band==='VHF'?'#1687ff':'#9b59ff';
    L.circle(p,{radius,weight:2,opacity:.9,fillOpacity:.12,color}).addTo(mapInstance).bindPopup(repeaterPopup(r,i));
    L.circleMarker(p,{radius:7,weight:3,opacity:1,fillOpacity:.95,color:'#fff',fillColor:color}).addTo(mapInstance).bindPopup(repeaterPopup(r,i));
  });
  if(bounds.length)mapInstance.fitBounds(bounds,{padding:[20,20],maxZoom:8});
}
function openRepeaterFromMap(i){selectedRepeater=i;nav('repeater')}

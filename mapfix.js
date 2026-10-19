/* QSOcat · Mapa de repetidors
   Coordenades precises quan estan disponibles + selecció individual/múltiple.
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

const repeaterColorsVHF=['#00b4d8','#0077b6','#2a9d8f','#00a896','#577590','#219ebc','#48cae4','#118ab2','#06d6a0','#3a86ff','#4cc9f0','#43aa8b','#277da1','#00b4d8'];
const repeaterColorsUHF=['#9b5de5','#f15bb5','#8338ec','#c77dff','#ff4d6d','#e76f51','#ff9f1c','#b5179e','#7209b7','#d946ef','#fb7185','#a855f7','#ec4899','#f97316'];
function repeaterColor(r,i){
  const palette=r.band==='VHF'?repeaterColorsVHF:repeaterColorsUHF;
  return palette[i%palette.length];
}

function repeaterLatLon(r){
  const lat=Number(r.lat),lon=Number(r.lon);
  if(Number.isFinite(lat)&&Number.isFinite(lon))return [lat,lon];
  return locatorToLatLon(r.locator);
}

function getMapSelection(){
  try{
    const raw=sessionStorage.getItem('qsocat-map-selection');
    if(raw){const a=JSON.parse(raw);if(Array.isArray(a))return a.map(Number).filter(Number.isInteger)}
  }catch(e){}
  return repeaters.map((_,i)=>i);
}
function setMapSelection(arr){
  try{sessionStorage.setItem('qsocat-map-selection',JSON.stringify(arr))}catch(e){}
}
function toggleMapRepeater(i,checked){
  const s=new Set(getMapSelection());
  if(checked)s.add(i);else s.delete(i);
  setMapSelection([...s]);
  mapView();
}
function mapSelectAll(){setMapSelection(repeaters.map((_,i)=>i));mapView()}
function mapSelectNone(){setMapSelection([]);mapView()}
function mapSelectBand(band){setMapSelection(repeaters.map((r,i)=>r.band===band?i:null).filter(i=>i!==null));mapView()}
function mapFitVisible(){
  if(!window.mapInstance)return;
  const visible=getMapSelection();
  const points=visible.map(i=>repeaterLatLon(repeaters[i])).filter(Boolean);
  if(points.length)mapInstance.fitBounds(points,{padding:[30,30],maxZoom:11});
}

function repeaterPopup(r,i){
  const color=repeaterColor(r,i);
  return `<div class="rep-popup"><div class="rep-popup-head" style="border-left-color:${color}"><b>${esc(r.call)}</b><span class="pill" style="background:${color}">${r.band}</span></div><strong>${esc(r.name)}</strong>${r.approxLocation?'<div class="map-approx">⚠️ Posició aproximada</div>':''}<div class="rep-popup-grid"><span>RX <b>${r.rx} MHz</b></span><span>TX <b>${r.tx} MHz</b></span><span>Mode <b>${esc(r.mode)}</b></span><span>CTCSS <b>${esc(r.tone)} Hz</b></span><span>Altitud <b>${repeaterHeight(r)}</b></span><span>Abast <b>≈ ${repeaterCoverageKm(r)} km</b></span></div><button onclick="openRepeaterFromMap(${i})">Obrir fitxa</button></div>`;
}

function repeater(){
  const r=repeaters[selectedRepeater]||repeaters[0];
  const color=repeaterColor(r,selectedRepeater);
  screen.innerHTML=`${shell(r.call,r.name)}<div class="panel repeater-detail"><div class="rep-detail-top"><div><div class="freq">${r.rx} MHz</div><div class="rep-subtitle">Freqüència de recepció · ${r.band}</div></div><span class="rep-band" style="background:${color}">${r.band}</span></div><div class="rep-detail-grid"><div><small>TX / entrada</small><b>${r.tx} MHz</b></div><div><small>Offset</small><b>${esc(r.offset)}</b></div><div><small>CTCSS</small><b>${esc(r.tone)} Hz</b></div><div><small>Mode</small><b>${esc(r.mode)}</b></div><div><small>Altitud</small><b>${repeaterHeight(r)}</b></div><div><small>Abast aproximat</small><b>≈ ${repeaterCoverageKm(r)} km</b></div><div><small>Zona</small><b>${esc(r.area)}</b></div><div><small>Locator</small><b>${esc(r.locator)}</b></div></div><div class="coverage-note">🗺️ <b>Cobertura orientativa</b><span>El cercle del mapa representa aproximadament aquest abast. No és una predicció de cobertura real.</span></div><div class="actions" style="margin-top:12px"><button class="btn" onclick="copyText('${esc(`QSOcat ${r.call}\nRX ${r.rx} MHz\nTX ${r.tx} MHz\nCTCSS ${r.tone} Hz\nMode ${r.mode}\nAbast aproximat ${repeaterCoverageKm(r)} km\n${r.area}`)}')">📋 Copiar</button><button class="btn" onclick="useRepeater(${selectedRepeater})">📻 Utilitzar aquest repetidor</button><button class="btn secondary" onclick="nav('qso')">📒 Registrar QSO</button></div></div><div class="panel"><p style="color:var(--muted)">Font: ${esc(r.source)}. Les dades de repetidors poden canviar; comprova-les abans de transmetre.</p></div>`;
}

function mapView(){
  const selected=getMapSelection();
  const selectedSet=new Set(selected);
  const visibleCount=selected.length;
  screen.innerHTML=`${shell('Mapa de repetidors','Selecciona un o diversos repetidors · la resta no es mostren')}<div class="panel map-filter-panel"><div class="map-filter-head"><div><b>📡 Repetidors visibles</b><small>${visibleCount} de ${repeaters.length} seleccionats</small></div><div class="map-filter-actions"><button class="mini-btn" onclick="mapSelectAll()">Tots</button><button class="mini-btn" onclick="mapSelectNone()">Cap</button><button class="mini-btn" onclick="mapSelectBand('VHF')">Només VHF</button><button class="mini-btn" onclick="mapSelectBand('UHF')">Només UHF</button></div></div><div class="rep-selector">${repeaters.map((r,i)=>{const c=repeaterColor(r,i);return `<label class="rep-check"><input type="checkbox" ${selectedSet.has(i)?'checked':''} onchange="toggleMapRepeater(${i},this.checked)"><span class="rep-color" style="background:${c}"></span><span class="rep-check-main"><b>${esc(r.call)}</b><small>${esc(r.name)} · ${r.rx} MHz</small></span><em>${r.band}</em></label>`}).join('')}</div></div><div class="panel map-panel"><div id="repMap" class="rep-map"></div><div class="coverage-legend"><span class="legend-dot"></span><b>Punt = repetidor</b><span class="legend-line"></span><b>Cercle = abast aproximat</b><small>VHF en tons blaus/turquesa · UHF en tons violeta/magenta. Cada repetidor té el seu color.</small></div><div class="map-info">💡 Selecciona només els repetidors que vols comparar. Pots seleccionar-ne un, diversos o cap.</div></div>`;
  if(!window.L){document.querySelector('#repMap').innerHTML='<div class="empty">El mapa necessita connexió a Internet. La selecció de repetidors continua disponible.</div>';return}
  if(mapInstance){try{mapInstance.remove()}catch(e){}}
  mapInstance=L.map('repMap',{zoomControl:true}).setView([41.65,1.75],7.5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapInstance);
  const bounds=[];
  selected.forEach(i=>{
    const r=repeaters[i];
    const p=repeaterLatLon(r); if(!p)return;
    bounds.push(p);
    const color=repeaterColor(r,i);
    const radius=repeaterCoverageKm(r)*1000;
    L.circle(p,{radius,weight:2.5,opacity:.8,fillOpacity:.10,color,fillColor:color}).addTo(mapInstance).bindPopup(repeaterPopup(r,i));
    L.circleMarker(p,{radius:8,weight:3,opacity:1,fillOpacity:1,color:'#fff',fillColor:color}).addTo(mapInstance).bindPopup(repeaterPopup(r,i));
  });
  if(bounds.length)mapInstance.fitBounds(bounds,{padding:[25,25],maxZoom:10});
}
function openRepeaterFromMap(i){selectedRepeater=i;nav('repeater')}

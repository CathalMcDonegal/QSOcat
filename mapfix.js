/* QSOcat · Mapa de repetidors
   Maidenhead + cercles de cobertura aproximada.
   El radi de cobertura és orientatiu: depèn d'altura, potència,
   antena, terreny i condicions de propagació.
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

function mapView(){
  screen.innerHTML=`${shell('Mapa de repetidors','Catalunya · cobertura aproximada')}<div class="panel map-panel"><div id="repMap" class="rep-map"></div><div class="coverage-legend"><span class="legend-dot"></span><b>Cercle = abast aproximat</b><small>VHF ≈ 55 km · UHF ≈ 32 km. No és una predicció de cobertura real.</small></div></div><div class="list">${repeaters.map((r,i)=>`<button class="row" onclick="openRepeaterFromMap(${i})"><div><b>${esc(r.call)} · ${esc(r.name)}</b><small style="display:block;color:var(--muted)">${r.rx} MHz · ${esc(r.area)} · abast ≈ ${repeaterCoverageKm(r)} km</small></div><span class="pill">${r.band}</span></button>`).join('')}</div>`;
  if(!window.L){document.querySelector('#repMap').innerHTML='<div class="empty">El mapa necessita connexió a Internet. La llista continua disponible.</div>';return}
  if(mapInstance){try{mapInstance.remove()}catch(e){}}
  mapInstance=L.map('repMap',{zoomControl:true}).setView([41.65,1.75],7.5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapInstance);
  const bounds=[];
  repeaters.forEach((r,i)=>{
    const p=locatorToLatLon(r.locator); if(!p)return;
    bounds.push(p);
    const radius=repeaterCoverageKm(r)*1000;
    L.circle(p,{radius,weight:2,opacity:.9,fillOpacity:.12,color:r.band==='VHF'?'#1687ff':'#9b59ff'}).addTo(mapInstance)
      .bindPopup(`<b>${esc(r.call)}</b><br>${esc(r.name)}<br>${r.rx} MHz · ${r.band}<br>Abast orientatiu: ≈ ${repeaterCoverageKm(r)} km<br><button onclick="openRepeaterFromMap(${i})">Obrir fitxa</button>`);
    L.circleMarker(p,{radius:7,weight:3,opacity:1,fillOpacity:.95,color:'#fff',fillColor:r.band==='VHF'?'#1687ff':'#9b59ff'}).addTo(mapInstance)
      .bindPopup(`<b>${esc(r.call)}</b><br>${esc(r.name)}<br>Abast orientatiu ≈ ${repeaterCoverageKm(r)} km`);
  });
  if(bounds.length)mapInstance.fitBounds(bounds,{padding:[20,20],maxZoom:8});
}
function openRepeaterFromMap(i){selectedRepeater=i;nav('repeater')}

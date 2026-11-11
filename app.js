const KEY='qsocat-qso-log';
let installPrompt=null;
const screen=document.querySelector('#screen');
const toastEl=document.querySelector('#toast');
const installBtn=document.querySelector('#installBtn');
const backBtn=document.querySelector('#backBtn');
let route=location.hash.replace('#','')||'home';
let historyStack=[];
let selectedRepeater=0;
let mapInstance=null;

const bands=[['160 m','1.8 MHz'],['80 m','3.5 MHz'],['40 m','7 MHz'],['30 m','10.1 MHz'],['20 m','14 MHz'],['17 m','18.1 MHz'],['15 m','21 MHz'],['12 m','24.9 MHz'],['10 m','28 MHz']];

function loadLog(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
function saveLog(x){localStorage.setItem(KEY,JSON.stringify(x))}
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),2200)}
function esc(s=''){return String(s).replace(/[&<>\'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function nav(r,push=true){if(push&&route!==r)historyStack.push(route);route=r;location.hash=r;render()}
function shell(title,sub=''){return `<div class="section-title"><div><h2>${title}</h2><span>${sub}</span></div></div>`}
function card(i,t,s,r){return `<button class="card" onclick="nav('${r}')"><div class="ico">${i}</div><b>${t}</b><small>${s}</small></button>`}

function render(){
 document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===route));
 backBtn.style.visibility=historyStack.length?'visible':'hidden';
 const views={home,vhf,hf,log,tools,manual,settings,qso,calculator,repeater,mapView};
 (views[route]||home)();
 window.scrollTo({top:0,behavior:'instant'});
}

function home(){
 const count=loadLog().length;
 screen.innerHTML=`<section class="hero"><div class="eyebrow">RADIOAFICIÓ · VHF · UHF · HF</div><h1>QSOcat</h1><p>La teva caixa d'eines per preparar, operar i registrar els teus QSO.</p><div class="meter"><i></i></div><div class="actions"><button class="btn" onclick="nav('qso')">＋ Nou QSO</button><button class="btn secondary" onclick="nav('manual')">📖 Manual</button></div></section>
${shell('Accés ràpid','Tot a mà')}<div class="grid">
${card('📡','VHF / UHF',`${repeaters.length} repetidors carregats`,'vhf')}
${card('🗺️','Mapa de repetidors','Veure els repetidors de Catalunya','mapView')}
${card('〰','HF','Bandes, modes i guia ràpida','hf')}
${card('📒','QSO / LOG',`${count} contactes guardats`,'log')}
${card('🧮','Eines','Calculadores per a antenes i RF','tools')}
${card('📖','Manual','Funcionament i conceptes de ràdio','manual')}
${card('⚙️','Configuració','Indicatiu i preferències','settings')}</div>`;
}

function vhf(){
 const q=(document.querySelector('#repSearch')?.value||'').toLowerCase();
 const band=document.querySelector('#repBand')?.value||'ALL';
 const list=repeaters.filter(r=>(band==='ALL'||r.band===band)&&(!q||`${r.call} ${r.name} ${r.area} ${r.locator}`.toLowerCase().includes(q)));
 screen.innerHTML=`${shell('VHF / UHF',`${repeaters.length} repetidors de referència`)}
<div class="actions"><button class="btn" onclick="nav('mapView')">🗺️ Veure mapa</button></div>
<div class="panel"><h3>Configurador ràpid</h3><div class="form"><label>RX (MHz)<input id="rx" inputmode="decimal" value="145.650"></label><label>TX (MHz)<input id="tx" inputmode="decimal" value="145.050"></label><label>CTCSS (Hz)<select id="tone"><option>—</option><option>67.0</option><option>71.9</option><option>77.0</option><option>79.7</option><option>82.5</option><option>88.5</option><option>94.8</option><option>107.2</option><option>110.9</option><option>114.8</option><option>118.8</option><option>123.0</option><option>1750</option></select></label></div><div class="actions" style="margin-top:10px"><button class="btn" onclick="copyConfig()">📋 Copiar configuració</button></div></div>
${shell('Repetidors de Catalunya','Busca per indicatiu, zona o locator')}<div class="panel"><div class="form"><label>Cerca<input id="repSearch" value="${esc(q)}" oninput="vhf()" placeholder="Ex. Tibidabo, ED3YAB, JN01"></label><label>Banda<select id="repBand" onchange="vhf()"><option value="ALL" ${band==='ALL'?'selected':''}>Tots</option><option value="VHF" ${band==='VHF'?'selected':''}>VHF</option><option value="UHF" ${band==='UHF'?'selected':''}>UHF</option></select></div><p style="color:var(--muted);font-size:.82rem">Font principal: URE / URCAT / FCR. Les dades són de referència i poden canviar.</p></div>
<div class="list">${list.map(r=>{const realIndex=repeaters.indexOf(r);return `<button class="row" onclick="openRepeater(${realIndex})"><div><b>${esc(r.call)} · ${esc(r.name)}</b><small style="display:block;color:var(--muted)">RX ${r.rx} · TX ${r.tx} · CTCSS ${r.tone} · ${esc(r.area)}</small></div><span class="pill">${r.band}</span></button>`}).join('')||'<div class="empty">No s’han trobat repetidors.</div>'}</div>`;
}
function copyConfig(){const rx=document.querySelector('#rx').value,tx=document.querySelector('#tx').value,t=document.querySelector('#tone').value;navigator.clipboard?.writeText(`QSOcat\nRX: ${rx} MHz\nTX: ${tx} MHz\nCTCSS: ${t} Hz`);toast('Configuració copiada')}
function openRepeater(i){selectedRepeater=i;nav('repeater')}

function repeater(){
 const r=repeaters[selectedRepeater]||repeaters[0];
 screen.innerHTML=`${shell(r.call,r.name)}<div class="panel"><div class="freq">${r.rx} MHz</div><p style="color:var(--muted)">Freqüència de recepció / sortida del repetidor</p><div class="row"><b>TX / entrada</b><strong>${r.tx} MHz</strong></div><div class="row"><b>Offset</b><strong>${r.offset}</strong></div><div class="row"><b>CTCSS</b><strong>${r.tone} Hz</strong></div><div class="row"><b>Mode</b><strong>${esc(r.mode)}</strong></div><div class="row"><b>Zona</b><strong>${esc(r.area)}</strong></div><div class="row"><b>Locator</b><strong>${esc(r.locator)}</strong></div><div class="row"><b>Font</b><strong>${esc(r.source)}</strong></div><div class="actions" style="margin-top:12px"><button class="btn" onclick="copyText('${esc(`QSOcat ${r.call}\nRX ${r.rx} MHz\nTX ${r.tx} MHz\nCTCSS ${r.tone} Hz\n${r.area}`)}')">📋 Copiar</button><button class="btn" onclick="useRepeater(${selectedRepeater})">📻 Utilitzar aquest repetidor</button><button class="btn secondary" onclick="nav('qso')">📒 Registrar QSO</button></div></div><div class="panel"><p style="color:var(--muted)">⚠️ Comprova sempre l’estat i les dades del repetidor abans de transmetre.</p></div>`;
}
function useRepeater(i){const r=repeaters[i];sessionStorage.setItem('qsocat-active-repeater',JSON.stringify(r));nav('qso')}
function copyText(t){navigator.clipboard?.writeText(t);toast('Copiat')}

function locatorToLatLon(locator){
 const s=String(locator||'').toUpperCase();
 if(s.length<4)return null;
 const A='ABCDEFGHIJKLMNOPQR';
 const lon=-180+(A.indexOf(s[0])*20)+(A.indexOf(s[2])*2);
 const lat=-90+(A.indexOf(s[1])*10)+(A.indexOf(s[3]));
 return [lat+0.5,lon+1];
}
function mapView(){
 screen.innerHTML=`${shell('Mapa de repetidors','Catalunya · posició aproximada segons locator')}<div class="panel map-panel"><div id="repMap" class="rep-map"></div><p style="color:var(--muted);font-size:.8rem;margin-bottom:0">Les posicions són aproximades i es calculen a partir del locator Maidenhead. La ubicació real de l’antena pot variar.</p></div><div class="list">${repeaters.map((r,i)=>`<button class="row" onclick="openRepeaterFromMap(${i})"><div><b>${esc(r.call)} · ${esc(r.name)}</b><small style="display:block;color:var(--muted)">${r.rx} MHz · ${esc(r.area)}</small></div><span class="pill">${r.band}</span></button>`).join('')}</div>`;
 if(window.L){
   mapInstance=L.map('repMap',{zoomControl:true}).setView([41.65,1.75],7.5);
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap'}).addTo(mapInstance);
   const bounds=[];
   repeaters.forEach((r,i)=>{const p=locatorToLatLon(r.locator);if(!p)return;bounds.push(p);const marker=L.marker(p).addTo(mapInstance);marker.bindPopup(`<b>${esc(r.call)}</b><br>${esc(r.name)}<br>${r.rx} MHz · ${r.band}<br><button onclick="openRepeaterFromMap(${i})">Obrir fitxa</button>`)});
   if(bounds.length)mapInstance.fitBounds(bounds,{padding:[20,20],maxZoom:8});
 }else{document.querySelector('#repMap').innerHTML='<div class="empty">El mapa necessita connexió a Internet per carregar el mapa base. La llista de repetidors continua disponible.</div>'}
}
function openRepeaterFromMap(i){selectedRepeater=i;nav('repeater')}

function hf(){screen.innerHTML=`${shell('HF','Bandes de radioafició')}<div class="panel"><h3>Guia ràpida</h3><p style="color:var(--muted)">Les freqüències concretes d’ús depenen del pla de banda i de la normativa aplicable. Aquesta pantalla és una referència educativa.</p></div><div class="list">${bands.map(b=>`<div class="row"><div><b>${b[0]}</b><small style="display:block;color:var(--muted)">Zona aproximada ${b[1]}</small></div><span class="pill">HF</span></div>`).join('')}</div>${shell('Modes','Conceptes bàsics')}<div class="grid">${card('🎙️','SSB','Veu en banda lateral','manual')} ${card('〰️','CW','Morse','manual')} ${card('💻','FT8','Mode digital','manual')}</div>`}

function log(){
 const data=loadLog();
 const q=(document.querySelector('#logSearch')?.value||'').trim().toUpperCase();
 const band=document.querySelector('#logBand')?.value||'ALL';
 const mode=document.querySelector('#logMode')?.value||'ALL';
 const filtered=data.filter(x=>[x.call,x.qth,x.ownCall,x.repeater,x.notes,x.freq,x.date].join(' ').toUpperCase().includes(q)&&(band==='ALL'||x.band===band)&&(mode==='ALL'||x.mode===mode));
 const bands=[...new Set(data.map(x=>x.band).filter(Boolean))].sort(),modes=[...new Set(data.map(x=>x.mode).filter(Boolean))].sort();
 screen.innerHTML=shell('QSO / LOG',data.length+' contactes guardats · '+filtered.length+' visibles')+
 '<div class="actions"><button class="btn" onclick="nav(\\'qso\\')">＋ Nou QSO</button><button class="btn secondary" onclick="exportADIF()">⇩ Exportar ADIF</button><button class="btn secondary" onclick="document.querySelector(\\'#adifFile\\').click()">⇧ Importar ADIF</button><button class="btn secondary" onclick="exportLog()">Còpia JSON</button>'+(data.length?'<button class="btn danger" onclick="clearLog()">🗑 Esborrar</button>':'')+'</div>'+
 '<input id="adifFile" type="file" accept=".adi,.adif,text/plain" hidden onchange="importADIF(this)">'+
 '<div class="panel log-filters"><div class="form"><label>Cerca per indicatiu, QTH o text<input id="logSearch" value="'+esc(q)+'" oninput="log()" placeholder="EA3..., Barcelona..."></label><label>Banda<select id="logBand" onchange="log()"><option value="ALL">Totes les bandes</option>'+bands.map(x=>'<option value="'+esc(x)+'" '+(band===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label><label>Mode<select id="logMode" onchange="log()"><option value="ALL">Tots els modes</option>'+modes.map(x=>'<option value="'+esc(x)+'" '+(mode===x?'selected':'')+'>'+esc(x)+'</option>').join('')+'</select></label></div></div>'+
 '<div class="panel" style="margin-top:14px">'+(filtered.length?'<div class="list">'+filtered.map(x=>{const i=data.indexOf(x);return '<div class="row log-row"><div><b>'+esc(x.call||'—')+'</b><small style="display:block;color:var(--muted)">'+esc(x.date||'—')+' · '+esc(x.freq||'—')+' MHz · '+esc(x.band||'—')+' · '+esc(x.mode||'—')+'</small><small style="display:block;color:var(--muted)">QTH: '+esc(x.qth||'—')+' · RST: '+esc(x.rst||'—')+'</small>'+(x.notes?'<small style="display:block;color:var(--muted)">'+esc(x.notes)+'</small>':'')+'</div><button class="mini-btn" onclick="deleteQso('+i+')" aria-label="Eliminar QSO">✕</button></div>'}).join('')+'</div>':'<div class="empty">No hi ha contactes que coincideixin amb els filtres.</div>')+'</div>'+
 '<div class="panel"><small style="color:var(--muted)">El LOG es desa en aquest dispositiu. Exporta periòdicament ADIF o JSON per conservar una còpia i transferir contactes a altres programes.</small></div>';
}
function deleteQso(i){const d=loadLog();if(!d[i])return;if(confirm('Vols eliminar el QSO amb '+(d[i].call||'aquesta estació')+'?')){d.splice(i,1);saveLog(d);log();toast('QSO eliminat')}}
function adifField(n,v){v=String(v??'');return v?'<'+n+':'+v.length+'>'+v:''}
function adifBand(q){const f=Number(String(q.freq||'').replace(',','.'));if(f>=144&&f<148)return '2m';if(f>=430&&f<450)return '70cm';return String(q.band||'').replace(/\\s*m$/i,'')+'m'}
function exportADIF(){
 const rows=loadLog();let out='ADIF Export from QSOcat\r\n<ADIF_VER:5>3.1.4<PROGRAMID:6>QSOcat<EOH>\r\n';
 rows.forEach(q=>{const dt=String(q.date||'').replace(/[-:T]/g,''),date=dt.length>=8?dt.slice(0,8):'',time=dt.length>=12?dt.slice(8,12):'';
 const fields=[adifField('CALL',q.call),adifField('QSO_DATE',date),adifField('TIME_ON',time),adifField('FREQ',q.freq),adifField('BAND',adifBand(q)),adifField('MODE',q.mode),adifField('RST_RCVD',q.rst),adifField('QTH',q.qth),adifField('STATION_CALLSIGN',q.ownCall),adifField('COMMENT',[q.repeater,q.notes].filter(Boolean).join(' · '))].filter(Boolean);
 out+=fields.join('')+'<EOR>\r\n'});
 const blob=new Blob([out],{type:'application/octet-stream'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='QSOcat-log.adi';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast(rows.length+' QSO exportats en ADIF');
}
function parseADIF(txt){
 const body=txt.replace(/<EOH[^>]*>/i,'<EOH>').split(/<EOH>/i).slice(1).join('<EOH>')||txt,records=[];let current={},re=/<EOR>|<([^:>]+):(\d+)(?::[^>]*)?>/gi,m;
 while((m=re.exec(body))){
  if(m[0].toUpperCase()==='<EOR>'){if(current.CALL)records.push(current);current={};continue}
  const name=m[1].toUpperCase(),len=Number(m[2]),value=body.substr(re.lastIndex,len);re.lastIndex+=len;current[name]=value;
 }
 if(current.CALL)records.push(current);
 return records.map(x=>{const d=x.QSO_DATE||'',t=(x.TIME_ON||'0000').padEnd(4,'0'),rawBand=(x.BAND||'').toLowerCase(),b=rawBand==='2m'?'VHF':rawBand==='70cm'?'UHF':rawBand?(rawBand.endsWith('m')?rawBand.replace('m',' m'):rawBand+' m'):'';
 return {call:x.CALL||'',date:d.length===8?d.slice(0,4)+'-'+d.slice(4,6)+'-'+d.slice(6,8)+'T'+t.slice(0,2)+':'+t.slice(2,4):'',freq:x.FREQ||'',band:b,mode:x.SUBMODE||x.MODE||'',rst:x.RST_RCVD||x.RST_SENT||'',qth:x.QTH||'',ownCall:x.STATION_CALLSIGN||x.MY_CALL||'',repeater:'',notes:x.COMMENT||''}});
}
async function importADIF(input){
 const file=input.files?.[0];if(!file)return;
 try{const parsed=parseADIF(await file.text());if(!parsed.length){toast('No s’han trobat QSO vàlids');return}
 const existing=loadLog(),keys=new Set(existing.map(q=>[q.call,q.date,q.freq,q.mode].join('|').toUpperCase())),fresh=parsed.filter(q=>!keys.has([q.call,q.date,q.freq,q.mode].join('|').toUpperCase()));
 if(!fresh.length){toast('Tots els QSO ja consten al LOG');return}
 if(!confirm('S’han trobat '+parsed.length+' QSO, dels quals '+fresh.length+' són nous. Vols importar-los?'))return;
 saveLog([...fresh,...existing]);log();toast(fresh.length+' QSO importats');
 }catch(e){console.error(e);toast('No s’ha pogut llegir el fitxer ADIF')}finally{input.value=''}
}
function qso(){const now=new Date(),d=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);const my=localStorage.getItem('qsocat-call')||'';const active=JSON.parse(sessionStorage.getItem('qsocat-active-repeater')||'null');const preset=active?`<div class="panel"><b>📻 Repetidor seleccionat:</b> ${esc(active.call)} · RX ${active.rx} · TX ${active.tx} · CTCSS ${active.tone}</div>`:'';screen.innerHTML=`${shell('Nou QSO','Registra el contacte')}${preset}<div class="panel"><form class="form" onsubmit="saveQso(event)"><label>Indicatiu *<input name="call" required autocapitalize="characters" placeholder="EA3XXXX"></label><label>Data i hora<input name="date" type="datetime-local" value="${d}"></label><label>Freqüència (MHz)<input name="freq" inputmode="decimal" value="${active?.rx||''}" placeholder="145.650"></label><label>Banda<select name="band"><option>VHF</option><option>UHF</option>${bands.map(b=>`<option>${b[0]}</option>`).join('')}</select></label><label>Mode<select name="mode"><option>FM</option><option>SSB</option><option>CW</option><option>FT8</option><option>FT4</option><option>AM</option><option>D-STAR</option><option>C4FM</option><option>DMR</option></select></label><label>RST<input name="rst" value="59"></label><label>QTH<input name="qth" placeholder="Localitat / locator"></label><label>Indicatiu propi<input name="ownCall" value="${esc(my)}" placeholder="EA3XXXX"></label><label>Repetidor<input name="repeater" value="${esc(active?.call||'')}" placeholder="Opcional"></label><label>Observacions<textarea name="notes" placeholder="Antena, potència, comentaris..."></textarea></label><div class="actions"><button class="btn" type="submit">💾 Desar QSO</button><button class="btn secondary" type="button" onclick="nav('log')">Cancel·lar</button></div></form></div>`}
function saveQso(e){e.preventDefault();const o=Object.fromEntries(new FormData(e.target).entries());o.call=o.call.trim().toUpperCase();o.ownCall=(o.ownCall||'').trim().toUpperCase();const data=loadLog(),key=[o.call,o.date,o.freq,o.mode].join('|').toUpperCase();if(data.some(x=>[x.call,x.date,x.freq,x.mode].join('|').toUpperCase()===key)&&!confirm('Aquest QSO sembla duplicat (mateix indicatiu, data, freqüència i mode). Vols desar-lo igualment?'))return;data.unshift(o);saveLog(data);if(o.ownCall)localStorage.setItem('qsocat-call',o.ownCall);sessionStorage.removeItem('qsocat-active-repeater');toast('QSO desat');nav('log',false)}
function clearLog(){if(confirm('Vols esborrar tot el LOG?')){saveLog([]);render()}}
function exportLog(){const rows=loadLog();const blob=new Blob([JSON.stringify(rows,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='QSOcat-log.json';a.click();URL.revokeObjectURL(a.href);toast('LOG exportat')}

function tools(){screen.innerHTML=`${shell('Eines','Calculadores RF')}<div class="grid">${card('📏','Longitud d’ona','Calcula λ a partir de MHz','calculator')}${card('〰','Dipol','Longitud aproximada d’un dipol de mitja ona','calculator')}${card('📡','¼ d’ona','Longitud aproximada','calculator')}${card('⚡','ROE / SWR','Conceptes i càlcul bàsic','manual')}</div><div class="panel"><h3>Conversió ràpida</h3><div class="form"><label>Freqüència (MHz)<input id="mhz" type="number" step="0.001" value="145.650" oninput="quickCalc()"></label><div id="quickResult" class="freq">2.06 m</div></div></div>`;quickCalc()}
function calculator(){screen.innerHTML=`${shell('Calculadora','Antena i longitud d’ona')}<div class="panel"><div class="form"><label>Freqüència (MHz)<input id="calcMhz" type="number" step="0.001" value="145.650"></label><label>Tipus<select id="calcType"><option value="lambda">Longitud d’ona</option><option value="dipol">Dipol ½ ona</option><option value="quarter">¼ d’ona</option></select></label><button class="btn" onclick="calculate()">Calcular</button></div><div id="calcOut" class="freq" style="margin-top:18px">—</div><p style="color:var(--muted)">Resultat teòric aproximat. Una antena real requereix ajustament i mesura.</p></div>`}
function result(mhz,type){const lambda=299.792458/mhz;if(type==='dipol')return `${(lambda*.95).toFixed(2)} m`;if(type==='quarter')return `${(lambda/4*.95).toFixed(2)} m`;return `${lambda.toFixed(2)} m`}
function quickCalc(){const e=document.querySelector('#mhz'),o=document.querySelector('#quickResult');if(e&&o)o.textContent=result(Number(e.value)||145.65,'lambda')}
function calculate(){const m=Number(document.querySelector('#calcMhz').value),t=document.querySelector('#calcType').value;document.querySelector('#calcOut').textContent=result(m,t)}

function manual(){screen.innerHTML=`${shell('Manual de funcionament','Guia ràpida de QSOcat')}<div class="panel manual"><h3>1. Com començar</h3><p>Configura el teu indicatiu a <b>Configuració</b>. Les dades del LOG es guarden localment al dispositiu.</p><h3>2. VHF / UHF i repetidors</h3><p><b>RX</b> és la freqüència que escoltes i <b>TX</b> la freqüència a la qual transmets. L’<b>offset</b> és la diferència entre les dues. Alguns repetidors requereixen CTCSS, DCS o un sistema digital concret.</p><h3>3. Utilitzar el mapa</h3><p>Obre <b>Mapa de repetidors</b> per veure les ubicacions aproximades dels repetidors. Toca un marcador per obrir la fitxa i, si vols, utilitza el repetidor per omplir automàticament el formulari de QSO.</p><h3>4. Fer un QSO</h3><ol><li>Escolta abans de transmetre.</li><li>Comprova freqüència, mode, offset i subto.</li><li>Utilitza el teu indicatiu correctament.</li><li>Anota indicatiu, hora, freqüència, banda, mode i RST.</li></ol><h3>5. HF</h3><p>La propagació canvia segons banda, hora, activitat solar, antena i ubicació. Consulta sempre el pla de banda i la normativa aplicable.</p><h3>6. Antenes i ROE / SWR</h3><p>La longitud d’ona aproximada és <b>λ = 299,792 / MHz</b>. Les calculadores donen valors inicials; una antena real s’ha d’ajustar i verificar.</p><h3>7. Seguretat</h3><p>No manipulis equips sota tensió ni instal·lacions d’antena de manera insegura. Mantén antenes i cables allunyats de línies elèctriques.</p><h3>Glossari</h3><p><b>QSO</b>: contacte entre estacions. <b>QTH</b>: ubicació. <b>RST</b>: report de recepció. <b>CTCSS</b>: to subaudible.</p></div>`}
function settings(){const call=localStorage.getItem('qsocat-call')||'';screen.innerHTML=`${shell('Configuració','Preferències locals')}<div class="panel"><div class="form"><label>El meu indicatiu<input id="myCall" value="${esc(call)}" placeholder="EA3XXXX"></label><button class="btn" onclick="saveSettings()">💾 Desar</button></div></div><div class="panel"><h3>Sobre QSOcat</h3><p style="color:var(--muted)">Versió 1.2 · Eina educativa i de suport per a radioaficionats.</p></div>`}
function saveSettings(){localStorage.setItem('qsocat-call',document.querySelector('#myCall').value.trim().toUpperCase());toast('Configuració desada')}

window.addEventListener('hashchange',()=>{route=location.hash.replace('#','')||'home';render()});
backBtn.addEventListener('click',()=>{if(historyStack.length)nav(historyStack.pop(),false);else nav('home',false)});
document.querySelectorAll('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.route)));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;installBtn.hidden=false});
installBtn.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;installBtn.hidden=true});
window.addEventListener('appinstalled',()=>{installPrompt=null;installBtn.hidden=true;toast('QSOcat instal·lat')});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
const KEY='qsocat-qso-log';
let installPrompt=null;
const screen=document.querySelector('#screen');
const toastEl=document.querySelector('#toast');
const installBtn=document.querySelector('#installBtn');
const backBtn=document.querySelector('#backBtn');
let route=location.hash.replace('#','')||'home';
let historyStack=[];

const repeaters=[
 {id:'R1',name:'Repetidor VHF — exemple',rx:'145.650',tx:'145.050',tone:'123.0',band:'VHF',offset:'-0.600 MHz'},
 {id:'R2',name:'Repetidor UHF — exemple',rx:'438.800',tx:'431.200',tone:'88.5',band:'UHF',offset:'-7.600 MHz'},
 {id:'R3',name:'Canal simplex VHF',rx:'145.500',tx:'145.500',tone:'—',band:'VHF',offset:'Simplex'}
];
const bands=[['160 m','1.8 MHz'],['80 m','3.5 MHz'],['40 m','7 MHz'],['30 m','10.1 MHz'],['20 m','14 MHz'],['17 m','18.1 MHz'],['15 m','21 MHz'],['12 m','24.9 MHz'],['10 m','28 MHz']];

function loadLog(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}}
function saveLog(x){localStorage.setItem(KEY,JSON.stringify(x))}
function toast(t){toastEl.textContent=t;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),2200)}
function nav(r,push=true){if(push&&route!==r)historyStack.push(route);route=r;location.hash=r;render()}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function shell(title,sub=''){return `<div class="section-title"><div><h2>${title}</h2><span>${sub}</span></div></div>`}

function render(){
 document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===route));
 backBtn.style.visibility=historyStack.length?'visible':'hidden';
 const views={home, vhf, hf, log, tools, manual, settings, qso, calculator, repeater};
 (views[route]||home)();
 window.scrollTo({top:0,behavior:'instant'});
}
function home(){screen.innerHTML=`
<section class="hero"><div class="eyebrow">RADIOAFICIÓ · VHF · UHF · HF</div><h1>QSOcat</h1><p>La teva caixa d'eines per preparar, operar i registrar els teus QSO.</p><div class="meter"><i></i></div><div class="actions"><button class="btn" onclick="nav('qso')">＋ Nou QSO</button><button class="btn secondary" onclick="nav('manual')">📖 Manual</button></div></section>
${shell('Accés ràpid','Tot a mà')}
<div class="grid">
 ${card('📡','VHF / UHF','Freqüències, repetidors, CTCSS i offset','vhf')}
 ${card('〰','HF','Bandes, modes i guia ràpida','hf')}
 ${card('📒','QSO / LOG','Registra i consulta contactes','log')}
 ${card('🧮','Eines','Calculadores per a antenes i RF','tools')}
 ${card('📖','Manual','Aprèn a utilitzar QSOcat i conceptes de ràdio','manual')}
 ${card('⚙️','Configuració','Indicatiu i preferències','settings')}
</div>`}
function card(i,t,s,r){return `<button class="card" onclick="nav('${r}')"><div class="ico">${i}</div><b>${t}</b><small>${s}</small></button>`}

function vhf(){screen.innerHTML=`${shell('VHF / UHF','Configuració ràpida')}
<div class="panel"><h3>Configurador de freqüència</h3><div class="form"><label>RX (MHz)<input id="rx" inputmode="decimal" value="145.650"></label><label>TX (MHz)<input id="tx" inputmode="decimal" value="145.050"></label><label>CTCSS (Hz)<select id="tone"><option>—</option><option>67.0</option><option>88.5</option><option>123.0</option><option>1750</option></select></label></div><div class="actions" style="margin-top:10px"><button class="btn" onclick="copyConfig()">📋 Copiar configuració</button></div></div>
${shell('Repetidors','Dades d’exemple editables')}
<div class="list">${repeaters.map((r,i)=>`<button class="row" onclick="nav('repeater');openRepeater(${i})"><div><b>${r.name}</b><small style="display:block;color:var(--muted)">RX ${r.rx} · TX ${r.tx} · CTCSS ${r.tone}</small></div><span class="pill">${r.band}</span></button>`).join('')}</div>`}
function copyConfig(){const rx=document.querySelector('#rx').value,tx=document.querySelector('#tx').value,t=document.querySelector('#tone').value; navigator.clipboard?.writeText(`QSOcat\nRX: ${rx} MHz\nTX: ${tx} MHz\nCTCSS: ${t} Hz`);toast('Configuració copiada')}
function openRepeater(i){sessionStorage.setItem('qso-repeater',i);render()}
function repeater(){const r=repeaters[Number(sessionStorage.getItem('qso-repeater')||0)];screen.innerHTML=`${shell(r.name,r.band)}<div class="panel"><div class="freq">${r.rx} MHz</div><p style="color:var(--muted)">Recepció (RX)</p><div class="row"><b>TX</b><strong>${r.tx} MHz</strong></div><div class="row"><b>Offset</b><strong>${r.offset}</strong></div><div class="row"><b>CTCSS</b><strong>${r.tone} Hz</strong></div><div class="actions" style="margin-top:12px"><button class="btn" onclick="copyText('${esc(`RX ${r.rx} MHz · TX ${r.tx} MHz · CTCSS ${r.tone} Hz`)}')">📋 Copiar</button><button class="btn secondary" onclick="nav('qso')">📒 Registrar QSO</button></div></div>`}
function copyText(t){navigator.clipboard?.writeText(t);toast('Copiat')}

function hf(){screen.innerHTML=`${shell('HF','Bandes de radioafició')}
<div class="panel"><h3>Guia ràpida</h3><p style="color:var(--muted)">La freqüència exacta i les freqüències d’ús depenen del pla de banda i de la normativa aplicable. Utilitza aquesta pantalla com a referència educativa.</p></div>
<div class="list">${bands.map(b=>`<div class="row"><div><b>${b[0]}</b><small style="display:block;color:var(--muted)">Zona aproximada ${b[1]}</small></div><span class="pill">HF</span></div>`).join('')}</div>
${shell('Modes','Conceptes bàsics')}<div class="grid">${card('🎙️','SSB','Veu en banda lateral','manual')} ${card('〰️','CW','Morse','manual')} ${card('💻','FT8','Mode digital','manual')}</div>`}

function log(){const data=loadLog();screen.innerHTML=`${shell('QSO / LOG',`${data.length} contactes guardats`)}<div class="actions"><button class="btn" onclick="nav('qso')">＋ Nou QSO</button><button class="btn secondary" onclick="exportLog()">⇩ Exportar</button>${data.length?'<button class="btn danger" onclick="clearLog()">🗑 Esborrar</button>':''}</div><div class="panel" style="margin-top:14px">${data.length?`<div class="list">${data.map((q,i)=>`<div class="row"><div><b>${esc(q.call)}</b><small style="display:block;color:var(--muted)">${esc(q.date)} · ${esc(q.freq||'—')} MHz · ${esc(q.mode||'—')}</small></div><span class="pill">RST ${esc(q.rst||'—')}</span></div>`).join('')}</div>`:'<div class="empty">Encara no tens QSO registrats.<br>Prem «Nou QSO» per començar.</div>'}</div>`}
function qso(){const now=new Date(),d=now.toISOString().slice(0,16);screen.innerHTML=`${shell('Nou QSO','Registra el contacte')}
<div class="panel"><form class="form" onsubmit="saveQso(event)"><label>Indicatiu *<input name="call" required autocapitalize="characters" placeholder="EA3XXXX"></label><label>Data i hora<input name="date" type="datetime-local" value="${d}"></label><label>Freqüència (MHz)<input name="freq" inputmode="decimal" placeholder="145.650"></label><label>Banda<select name="band"><option>VHF</option><option>UHF</option><option>160 m</option><option>80 m</option><option>40 m</option><option>30 m</option><option>20 m</option><option>17 m</option><option>15 m</option><option>12 m</option><option>10 m</option></select></label><label>Mode<select name="mode"><option>FM</option><option>SSB</option><option>CW</option><option>FT8</option><option>FT4</option><option>AM</option></select></label><label>RST<input name="rst" value="59"></label><label>QTH<input name="qth" placeholder="Localitat / locator"></label><label>Observacions<textarea name="notes" placeholder="Antena, potència, comentaris..."></textarea></label><div class="actions"><button class="btn" type="submit">💾 Desar QSO</button><button class="btn secondary" type="button" onclick="nav('log')">Cancel·lar</button></div></form></div>`}
function saveQso(e){e.preventDefault();const o=Object.fromEntries(new FormData(e.target).entries());const data=loadLog();data.unshift(o);saveLog(data);toast('QSO desat');nav('log',false)}
function clearLog(){if(confirm('Vols esborrar tot el LOG?')){saveLog([]);render();}}
function exportLog(){const rows=loadLog();const blob=new Blob([JSON.stringify(rows,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='QSOcat-log.json';a.click();URL.revokeObjectURL(a.href);toast('LOG exportat')}

function tools(){screen.innerHTML=`${shell('Eines','Calculadores RF')}
<div class="grid">${card('📏','Longitud d’ona','Calcula λ a partir de MHz','calculator')}${card('〰','Dipol','Longitud aproximada d’un dipol de mitja ona','calculator')}${card('📡','¼ d’ona','Longitud aproximada','calculator')}${card('⚡','ROE / SWR','Conceptes i càlcul bàsic','manual')}</div>
<div class="panel"><h3>Conversió ràpida</h3><div class="form"><label>Freqüència (MHz)<input id="mhz" type="number" step="0.001" value="145.650" oninput="quickCalc()"></label><div id="quickResult" class="freq">2.06 m</div></div></div>`;quickCalc()}
function calculator(){screen.innerHTML=`${shell('Calculadora','Antena i longitud d’ona')}<div class="panel"><div class="form"><label>Freqüència (MHz)<input id="calcMhz" type="number" step="0.001" value="145.650"></label><label>Tipus<select id="calcType"><option value="lambda">Longitud d’ona</option><option value="dipol">Dipol ½ ona</option><option value="quarter">¼ d’ona</option></select></label><button class="btn" onclick="calculate()">Calcular</button></div><div id="calcOut" class="freq" style="margin-top:18px">—</div><p style="color:var(--muted)">Resultat teòric aproximat. La construcció real d’una antena requereix ajustament i mesura.</p></div>`}
function result(mhz,type){const lambda=299.792458/mhz;if(type==='dipol')return `${(lambda*.95).toFixed(2)} m`;if(type==='quarter')return `${(lambda/4*.95).toFixed(2)} m`;return `${lambda.toFixed(2)} m`}
function quickCalc(){const e=document.querySelector('#mhz'),o=document.querySelector('#quickResult');if(e&&o)o.textContent=result(Number(e.value)||145.65,'lambda')}
function calculate(){const m=Number(document.querySelector('#calcMhz').value),t=document.querySelector('#calcType').value;document.querySelector('#calcOut').textContent=result(m,t)}

function manual(){screen.innerHTML=`${shell('Manual de funcionament','Guia ràpida de QSOcat')}<div class="panel manual"><h3>1. Com començar</h3><p>Configura el teu indicatiu a <b>Configuració</b>. Les dades del LOG es guarden localment al dispositiu.</p><h3>2. VHF / UHF</h3><p>En un repetidor, <b>RX</b> és la freqüència que escoltes i <b>TX</b> la freqüència a la qual transmets. L’<b>offset</b> és la diferència entre les dues. Alguns repetidors requereixen un to CTCSS o DCS.</p><h3>3. HF</h3><p>Les bandes HF permeten comunicacions a distàncies molt grans. La propagació canvia segons banda, hora, activitat solar, antena i ubicació.</p><h3>4. Fer un QSO</h3><ol><li>Escolta abans de transmetre.</li><li>Comprova freqüència i mode.</li><li>Utilitza el teu indicatiu correctament.</li><li>Anota indicatiu, hora, freqüència, banda, mode i RST.</li></ol><h3>5. Antenes</h3><p>La longitud d’ona aproximada és <b>λ = 299,792 / MHz</b>. Les calculadores de QSOcat donen valors inicials; una antena real s’ha d’ajustar i verificar.</p><h3>6. ROE / SWR</h3><p>La ROE indica la desadaptació entre transmissor, línia i antena. Una ROE elevada pot provocar pèrdues i problemes en la transmissió. Segueix sempre les especificacions del teu equip.</p><h3>7. Seguretat</h3><p>No manipulis equips sota tensió ni instal·lacions d’antena de manera insegura. Mantén les antenes i cables allunyats de línies elèctriques i respecta la normativa aplicable.</p><h3>Glossari</h3><p><b>QSO</b>: contacte entre estacions. <b>QTH</b>: ubicació. <b>RST</b>: report de recepció. <b>CTCSS</b>: to subaudible utilitzat en molts repetidors.</p></div>`}
function settings(){const call=localStorage.getItem('qsocat-call')||'';screen.innerHTML=`${shell('Configuració','Preferències locals')}<div class="panel"><div class="form"><label>El meu indicatiu<input id="myCall" value="${esc(call)}" placeholder="EA3XXXX"></label><button class="btn" onclick="saveSettings()">💾 Desar</button></div></div><div class="panel"><h3>Sobre QSOcat</h3><p style="color:var(--muted)">Versió 1.0 · Eina educativa i de suport per a radioaficionats.</p></div>`}
function saveSettings(){localStorage.setItem('qsocat-call',document.querySelector('#myCall').value.trim().toUpperCase());toast('Configuració desada')}

window.addEventListener('hashchange',()=>{route=location.hash.replace('#','')||'home';render()});
backBtn.addEventListener('click',()=>{if(historyStack.length)nav(historyStack.pop(),false);else nav('home',false)});
document.querySelectorAll('.bottom-nav button').forEach(b=>b.addEventListener('click',()=>nav(b.dataset.route)));
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;installBtn.hidden=false});
installBtn.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;installBtn.hidden=true});
window.addEventListener('appinstalled',()=>{installPrompt=null;installBtn.hidden=true;toast('QSOcat instal·lat')});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();

/* QSOcat · Guia específica de HF, SSB, CW i FT8 */

function hfModeShell(title,sub,icon){
  return `${shell(title,sub)}<div class="mode-hero"><div class="mode-icon">${icon}</div><div><h3>${title}</h3><p>Guia pràctica per saber què és, quan utilitzar-lo i com començar.</p></div></div>`;
}

function modeCard(icon,title,desc,route){
  return `<button class="mode-card" onclick="nav('${route}')"><span class="mode-card-icon">${icon}</span><span><b>${title}</b><small>${desc}</small></span><strong>›</strong></button>`;
}

function hf(){
  screen.innerHTML=`${shell('HF','La guia de radioafició per a distàncies llargues')}
  <div class="panel hf-intro"><h3>🌍 Què és HF?</h3><p>HF cobreix aproximadament de 1,8 a 30 MHz. És la zona de l’espectre on pots fer comunicacions que van molt més enllà de l’àmbit local, aprofitant la propagació ionosfèrica.</p><p><b>Quin mode trio?</b> SSB si vols parlar amb veu, CW si vols Morse i FT8 si vols treballar senyals digitals molt febles i fer DX amb intercanvis curts.</p></div>
  ${shell('Modes','Entra a cada guia específica')}
  <div class="mode-list">
    ${modeCard('🎙️','SSB','Veu · conversa · DX','ssb')}
    ${modeCard('〰️','CW','Morse · senyals estrets · DX','cw')}
    ${modeCard('💻','FT8','Digital · senyal feble · DX','ft8')}
  </div>
  ${shell('Bandes HF','Per començar')}
  <div class="list">${bands.map(b=>`<div class="row"><div><b>${b[0]}</b><small style="display:block;color:var(--muted)">${b[1]} · consulta el pla de bandes abans de transmetre</small></div><span class="pill">HF</span></div>`).join('')}</div>`;
}

function ssb(){
  screen.innerHTML=`${hfModeShell('SSB','Single Side Band · veu en HF','🎙️')}
  <div class="panel"><h3>🗣️ Què és SSB?</h3><p>SSB és un mode de veu molt utilitzat en HF. Permet mantenir converses amb una amplada de banda relativament reduïda i és especialment útil per a comunicacions de llarga distància.</p></div>
  <div class="panel"><h3>🎯 Quan l’hauria d’utilitzar?</h3><ul><li>Quan vols parlar amb altres radioaficionats per veu.</li><li>Quan vols fer DX amb altres països.</li><li>Quan la propagació permet contactar estacions llunyanes.</li><li>En concursos i activitats de ràdio on SSB sigui el mode indicat.</li></ul></div>
  <div class="panel"><h3>⚙️ Com començar</h3><ol><li>Selecciona la banda adequada.</li><li>Selecciona <b>USB o LSB</b> segons el segment i el pla de bandes.</li><li>Escolta abans de transmetre.</li><li>Fes una crida breu: <b>«CQ CQ, aquí EA3XXX»</b>.</li><li>Quan responguin, intercanvia indicatius, RST i la informació necessària.</li><li>Registra el QSO al LOG.</li></ol></div>
  <div class="panel"><h3>📻 Bandes habituals</h3><div class="list"><div class="row"><b>80 m</b><span class="pill">3,5 MHz</span></div><div class="row"><b>40 m</b><span class="pill">7 MHz</span></div><div class="row"><b>20 m</b><span class="pill">14 MHz</span></div><div class="row"><b>15 m</b><span class="pill">21 MHz</span></div><div class="row"><b>10 m</b><span class="pill">28 MHz</span></div></div><p class="mode-note">Les freqüències concretes de veu depenen del pla de bandes i poden variar segons la regió i l’activitat. No transmetis només perquè una freqüència aparegui en una guia.</p></div>
  <div class="actions"><button class="btn secondary" onclick="nav('hf')">← Tornar a HF</button><button class="btn" onclick="nav('qso')">📒 Registrar QSO</button></div>`;
}

function cw(){
  screen.innerHTML=`${hfModeShell('CW','Continuous Wave · Morse','〰️')}
  <div class="panel"><h3>🔑 Què és CW?</h3><p>CW és la transmissió de Morse. És un mode extremadament estret i eficient, molt apreciat per a DX i comunicacions amb senyals febles.</p></div>
  <div class="panel"><h3>🎯 Quan l’hauria d’utilitzar?</h3><ul><li>Si coneixes el codi Morse i vols fer QSO amb molta eficiència espectral.</li><li>Per DX quan els senyals són febles.</li><li>Per concursos de CW.</li><li>Per practicar recepció i transmissió de Morse.</li></ul></div>
  <div class="panel"><h3>⚙️ Com fer un QSO CW</h3><ol><li>Busca una freqüència del segment CW del pla de bandes.</li><li>Escolta i comprova que està lliure.</li><li>Fes una crida CQ amb el teu indicatiu.</li><li>Rep l’indicatiu de l’altra estació i respon.</li><li>Intercanvia normalment RST i, si vols, QTH, nom o informació del contacte.</li><li>Utilitza <b>K</b> per indicar que l’altra estació pot respondre i <b>SK</b> per finalitzar el QSO.</li></ol></div>
  <div class="panel"><h3>📐 Per què és tan eficient?</h3><p>El senyal CW ocupa molt poc espectre comparat amb la veu, cosa que facilita la recepció de senyals febles i permet treballar amb menys potència quan les condicions són bones.</p><p class="mode-note">El pla IARU Region 1 reserva segments estrets per a CW i defineix centres d’activitat QRP i QRS. Consulta sempre el pla vigent.</p></div>
  <div class="actions"><button class="btn secondary" onclick="nav('hf')">← Tornar a HF</button><button class="btn" onclick="nav('qso')">📒 Registrar QSO</button></div>`;
}

function ft8(){
  screen.innerHTML=`${hfModeShell('FT8','Mode digital per a senyals febles','💻')}
  <div class="panel"><h3>💡 Què és FT8?</h3><p>FT8 és un mode digital dissenyat per comunicar amb senyals febles. L’ordinador i el programa de control s’encarreguen de codificar i descodificar missatges molt curts.</p></div>
  <div class="panel"><h3>🎯 Quan l’hauria d’utilitzar?</h3><ul><li>Per buscar DX quan la propagació és complicada.</li><li>Quan vols saber fins on arriba el teu senyal.</li><li>Per fer molts contactes curts de manera molt eficient.</li><li>Per experimentar amb propagació i comunicacions digitals.</li></ul></div>
  <div class="panel"><h3>🖥️ Què necessito?</h3><ol><li>Un transceptor compatible amb interfície d’àudio/dades.</li><li>Un ordinador o dispositiu compatible amb <b>WSJT-X</b> o programari equivalent.</li><li>Hora del sistema molt ben sincronitzada.</li><li>Antena i connexió d’àudio configurades correctament.</li><li>Seleccionar la banda i freqüència FT8 corresponents.</li></ol></div>
  <div class="panel"><h3>📡 Freqüències FT8 de referència</h3><div class="list"><div class="row"><div><b>80 m</b><small style="display:block;color:var(--muted)">3.573 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>40 m</b><small style="display:block;color:var(--muted)">7.074 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>30 m</b><small style="display:block;color:var(--muted)">10.136 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>20 m</b><small style="display:block;color:var(--muted)">14.074 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>17 m</b><small style="display:block;color:var(--muted)">18.100 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>15 m</b><small style="display:block;color:var(--muted)">21.074 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>12 m</b><small style="display:block;color:var(--muted)">24.915 MHz</small></div><span class="pill">FT8</span></div><div class="row"><div><b>10 m</b><small style="display:block;color:var(--muted)">28.074 MHz</small></div><span class="pill">FT8</span></div></div><p class="mode-note">Són freqüències convencionals de referència; les convencions poden canviar. Consulta el pla de bandes vigent i les dades del teu programa.</p></div>
  <div class="panel"><h3>🔄 Com funciona un QSO?</h3><p>FT8 treballa en seqüències temporitzades. Normalment el programa detecta una estació, intercanvia indicatius i informes i confirma el contacte. No és un mode de conversa llarga com SSB.</p></div>
  <div class="actions"><button class="btn secondary" onclick="nav('hf')">← Tornar a HF</button><button class="btn" onclick="nav('qso')">📒 Registrar QSO</button></div>`;
}

function applyHFModeRoutes(){
  const oldRender=render;
  window.render=function(){
    document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===route));
    backBtn.style.visibility=historyStack.length?'visible':'hidden';
    const views={home,vhf,hf,log,tools,manual,settings,qso,calculator,repeater,mapView,ssb,cw,ft8};
    (views[route]||home)();
    window.scrollTo({top:0,behavior:'instant'});
  };
  if(['ssb','cw','ft8'].includes(route))render();
}
applyHFModeRoutes();

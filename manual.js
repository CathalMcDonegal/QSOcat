/* QSOcat · Manual complet d'ús i ràdioafició */
function manual(){
  const section=(icon,title,html)=>`<details open class="panel manual-section"><summary style="cursor:pointer;font-weight:900;font-size:1.05rem">${icon} ${title}</summary><div style="margin-top:12px;color:#b8c9d9;line-height:1.6">${html}</div></details>`;
  screen.innerHTML=`${shell('Manual QSOcat','Aprèn a utilitzar l’app i a operar VHF, UHF i HF')}
  <div class="panel"><b>📡 Objectiu</b><p style="color:var(--muted);margin-bottom:0">Aquest manual està pensat perquè puguis començar des de zero: preparar la ràdio, trobar una freqüència o repetidor, fer un QSO correctament i guardar-lo al LOG.</p></div>
  ${section('🚀','1. Com utilitzar QSOcat',`
    <ol><li><b>Inici:</b> accedeix ràpidament a VHF/UHF, HF, QSO/LOG, Eines i Manual.</li><li><b>VHF/UHF:</b> cerca un repetidor per indicatiu, zona o locator, obre la fitxa i comprova RX, TX, offset, CTCSS i mode.</li><li><b>Mapa:</b> visualitza els repetidors i el seu abast aproximat. Toca un repetidor per obrir-ne la fitxa.</li><li><b>Utilitzar aquest repetidor:</b> envia les dades al formulari de Nou QSO perquè no les hagis d’escriure.</li><li><b>Nou QSO:</b> introdueix l’indicatiu contactat, freqüència, banda, mode, RST, QTH i observacions.</li><li><b>LOG:</b> desa els contactes i exporta’ls en JSON quan vulguis fer una còpia.</li><li><b>Eines:</b> utilitza les calculadores d’antenes i RF per preparar l’operació.</li><li><b>Instal·lació:</b> si el navegador ho permet, utilitza el botó ⇩ per instal·lar QSOcat com una aplicació.</li></ol>`)}
  ${section('📻','2. Abans de transmetre',`
    <ul><li>Assegura’t que tens l’autorització/llicència necessària i que treballes dins de les bandes que tens autoritzades.</li><li>Comprova que la freqüència està lliure: escolta abans de parlar.</li><li>Utilitza la potència mínima necessària per mantenir una comunicació fiable.</li><li>Identifica’t amb el teu indicatiu segons la normativa aplicable.</li><li>En un repetidor, comprova sempre la freqüència d’entrada/sortida i el CTCSS o sistema digital requerit.</li><li>No assumeixis que una freqüència està «reservada» només perquè aparegui com a freqüència de crida: les freqüències de crida són punts de trobada i després és habitual desplaçar-se a una freqüència adequada.</li></ul>`)}
  ${section('🔵','3. VHF — 2 metres (144–146 MHz)',`
    <p><b>Per a què serveix?</b> VHF ofereix molt bon rendiment per a comunicacions locals i regionals, especialment des de punts elevats. És una banda molt habitual per FM, repetidors, comunicacions directes i també altres modes.</p>
    <p><b>Quan escollir-la?</b> Quan vols parlar amb altres radioaficionats de la zona, utilitzar un repetidor o aprofitar una bona ubicació/altura. En condicions normals, el relleu i l’alçada de l’antena tenen molta importància.</p>
    <p><b>QSO directe (simplex):</b> una freqüència de referència molt coneguda és <b>145.500 MHz FM</b> per a crida en VHF a la Regió 1. Escolta abans, fes una crida breu i, si estableixes contacte, desplaça’t a una freqüència adequada per continuar.</p>
    <p><b>Repetidors:</b> la banda utilitza canals amb separació habitual de 600 kHz entre entrada i sortida en el pla de repetidors analògics espanyol. QSOcat mostra els valors de cada repetidor a la seva fitxa.</p>`)}
  ${section('🟣','4. UHF — 70 cm (430–440 MHz)',`
    <p><b>Per a què serveix?</b> UHF és especialment útil per a comunicacions locals, repetidors i sistemes de veu digitals. Les antenes poden ser compactes i és molt pràctica amb equips portàtils.</p>
    <p><b>Quan escollir-la?</b> Quan busques comunicacions locals amb una antena petita, vols accedir a un repetidor UHF o vols treballar sistemes digitals com DMR, D-STAR o C4FM quan el repetidor/estació ho admet.</p>
    <p><b>QSO directe (simplex):</b> <b>433.500 MHz FM</b> és una freqüència de crida molt utilitzada a la Regió 1. Com sempre, escolta primer i desplaça't després si cal.</p>
    <p><b>Repetidors:</b> en la planificació espanyola tradicional, els canals analògics utilitzen una separació Tx/Rx de 7,6 MHz. No configuris un offset «a ull»: utilitza les dades del repetidor.</p>`)}
  ${section('🌍','5. HF — 160, 80, 40, 30, 20, 17, 15, 12 i 10 metres',`
    <p><b>Per a què serveix?</b> HF és la banda ideal per anar molt més enllà de l’àmbit local. La ionosfera permet comunicacions que poden arribar a altres regions, països i continents, depenent de la banda, hora, antena i propagació.</p>
    <p><b>Quan escollir-la?</b> Quan vols fer DX, contactar amb altres països, participar en concursos, fer comunicacions regionals de llarga distància o experimentar amb la propagació.</p>
    <p><b>40 m (7 MHz):</b> molt versàtil per a comunicacions regionals i DX.</p>
    <p><b>20 m (14 MHz):</b> una de les bandes més utilitzades per a DX durant el dia.</p>
    <p><b>15 m (21 MHz) i 10 m (28 MHz):</b> poden oferir distàncies enormes quan la propagació acompanya, especialment en períodes d’activitat solar favorable.</p>
    <p><b>80 m (3,5 MHz):</b> molt interessant per a comunicacions regionals i nacionals, especialment a la nit.</p>
    <p><b>Modes:</b> SSB és el mode de veu més habitual en HF. CW és Morse. FT8/FT4 són modes digitals molt eficients per a senyals febles i DX, però el seu funcionament és diferent d’un QSO de veu.</p>`)}
  ${section('📻','6. Freqüències de referència per començar',`
    <div class="list">
      <div class="row"><div><b>145.500 MHz</b><small style="display:block;color:var(--muted)">VHF · FM · freqüència de crida</small></div><span class="pill">2 m</span></div>
      <div class="row"><div><b>433.500 MHz</b><small style="display:block;color:var(--muted)">UHF · FM · freqüència de crida</small></div><span class="pill">70 cm</span></div>
      <div class="row"><div><b>7.110 MHz</b><small style="display:block;color:var(--muted)">40 m · centre d’activitat d’emergències IARU R1</small></div><span class="pill">HF</span></div>
      <div class="row"><div><b>14.300 MHz</b><small style="display:block;color:var(--muted)">20 m · centre d’activitat d’emergències IARU R1</small></div><span class="pill">HF</span></div>
      <div class="row"><div><b>18.160 MHz</b><small style="display:block;color:var(--muted)">17 m · centre d’activitat d’emergències IARU R1</small></div><span class="pill">HF</span></div>
      <div class="row"><div><b>21.360 MHz</b><small style="display:block;color:var(--muted)">15 m · centre d’activitat d’emergències IARU R1</small></div><span class="pill">HF</span></div>
    </div>
    <p style="font-size:.8rem;color:#718ba4">Important: els centres d’activitat no són freqüències exclusives ni «canals obligatoris». En HF cal consultar el pla de bandes vigent i escoltar el segment abans de transmetre.</p>`)}
  ${section('🎙️','7. Com fer un QSO de veu',`
    <ol><li><b>Escolta:</b> comprova que la freqüència està lliure.</li><li><b>Crida:</b> «CQ, CQ, aquí [el teu indicatiu]» en HF, o una crida breu indicant el teu indicatiu en FM.</li><li><b>Resposta:</b> anota l’indicatiu de l’altra estació.</li><li><b>Intercanvi:</b> indica RST, nom si vols, QTH/locator, equip o antena si és rellevant.</li><li><b>Confirma:</b> repeteix l’indicatiu de l’altra estació per evitar errors.</li><li><b>Finalitza:</b> acomiada’t i deixa lliure la freqüència.</li><li><b>Registra:</b> desa el QSO a QSOcat.</li></ol>
    <p><b>Exemple FM:</b> «EA3ABC, aquí EA3XYZ, 59 a Barcelona, em reps?»</p>`)}
  ${section('🔁','8. Com fer un QSO a través d’un repetidor',`
    <ol><li>Selecciona el repetidor a QSOcat.</li><li>Programa RX, TX, offset i CTCSS exactament com indica la fitxa.</li><li>Escolta uns segons abans de transmetre.</li><li>Fes una crida curta: «EA3XYZ, escoltant» o «EA3XYZ, algú disponible?».</li><li>Quan algú respongui, confirma l’indicatiu i mantén converses breus, especialment si el repetidor està ocupat.</li><li>No mantinguis premut el PTT mentre no parles i deixa una petita pausa entre intervencions perquè altres estacions puguin entrar.</li></ol>`)}
  ${section('📡','9. Diferència ràpida: VHF vs UHF vs HF',`
    <div class="list"><div class="row"><div><b>VHF</b><small style="display:block;color:var(--muted)">Local/regional · 2 m · molt habitual en FM i repetidors · bona opció per començar.</small></div><span class="pill">144–146</span></div><div class="row"><div><b>UHF</b><small style="display:block;color:var(--muted)">Local · 70 cm · repetidors i veu digital · equips/antenes compactes.</small></div><span class="pill">430–440</span></div><div class="row"><div><b>HF</b><small style="display:block;color:var(--muted)">Llarga distància · DX · SSB/CW/digital · depèn molt de propagació i antena.</small></div><span class="pill">1,8–30 MHz</span></div></div>`)}
  ${section('⚠️','10. Seguretat i bones pràctiques',`<ul><li>No transmetis fora de les bandes o condicions que tens autoritzades.</li><li>Evita interferències i respecta els altres usuaris de l’espectre.</li><li>No utilitzis potència elevada si no és necessària.</li><li>Vigila sobretot les antenes, connectors i cables durant transmissions de potència elevada.</li><li>En una instal·lació fixa, comprova l’ROE/SWR abans d’utilitzar potència elevada.</li><li>La informació de QSOcat és educativa i les freqüències poden canviar: consulta sempre el pla de bandes i la normativa vigents.</li></ul>`)}
  <div class="panel"><b>📚 Fonts i referències</b><p style="color:var(--muted);margin-bottom:0">QSOcat pren com a referència els plans de bandes de la IARU Regió 1 i la normativa espanyola aplicable. Els plans de banda són recomanacions d’ús de l’espectre i la normativa nacional determina les condicions d’autorització.</p></div>`;
}

/* Re-render després de carregar aquest fitxer: substitueix el manual anterior sense tocar la resta de l'app. */
if(typeof render==='function')render();

/* QSOcat · Repetidors analògics de Catalunya
   Fonts de referència: FCR i URE.
   L'alçada i l'abast són orientatius: l'abast real depèn d'antena,
   potència, sensibilitat, terreny, obstacles i propagació.
   Les dades de repetidors poden canviar; comprova-les abans de transmetre.
   lat/lon: coordenades de referència per millorar la posició al mapa.
*/
const repeaters = [
  {id:'ED3YAJ',call:'ED3YAJ',name:'R0 Turó de l’Home / Montseny',band:'VHF',rx:'145.600',tx:'145.000',tone:'—',offset:'-0.600 MHz',mode:'FM',area:'Montseny',locator:'JN11ES',heightM:1712,coverageKm:80,lat:41.777833,lon:2.436000,source:'FCR/URE'},
  {id:'ED3YAK',call:'ED3YAK',name:'R2 Montjuïc / Barcelona',band:'VHF',rx:'145.650',tx:'145.050',tone:'—',offset:'-0.600 MHz',mode:'D-STAR / C4FM',area:'Barcelona',locator:'JN11BI',heightM:250,coverageKm:55,lat:41.365333,lon:2.159667,source:'FCR/URE'},
  {id:'ED3YAB',call:'ED3YAB',name:'R4 Sant Jeroni / Montserrat',band:'VHF',rx:'145.700',tx:'145.100',tone:'88.5',offset:'-0.600 MHz',mode:'FM',area:'Bages · Montserrat',locator:'JN01VO',heightM:1236,coverageKm:90,lat:41.605667,lon:1.818833,source:'FCR/URE'},
  {id:'ED3YAL',call:'ED3YAL',name:'R5 Turó dels Cellers / Castellnou de Bages',band:'VHF',rx:'145.725',tx:'145.125',tone:'—',offset:'-0.600 MHz',mode:'FM',area:'Bages',locator:'JN01WU',heightM:602,coverageKm:65,lat:41.846000,lon:1.835833,source:'FCR/URE'},
  {id:'ED3YAP',call:'ED3YAP',name:'R4 Castell de Sant Ferran / Figueres',band:'VHF',rx:'145.700',tx:'145.100',tone:'—',offset:'-0.600 MHz',mode:'FM',area:'Alt Empordà',locator:'JN12LG',heightM:550,coverageKm:65,lat:42.271167,lon:2.950500,source:'FCR/URE'},
  {id:'ED3YAQ',call:'ED3YAQ',name:'R5,5 Collsuspina / Osona',band:'VHF',rx:'145.7375',tx:'145.1375',tone:'—',offset:'-0.600 MHz',mode:'DMR / C4FM',area:'Osona',locator:'JN01CT',heightM:980,coverageKm:75,lat:41.803833,lon:2.189167,source:'FCR/URE'},
  {id:'ED3YAG',call:'ED3YAG',name:'R6 Pinós / Solsonès',band:'VHF',rx:'145.750',tx:'145.150',tone:'123.0',offset:'-0.600 MHz',mode:'FM',area:'Solsonès',locator:'JN01SU',heightM:930,coverageKm:80,lat:41.836667,lon:1.533333,source:'FCR/URE'},
  {id:'ED3YAW',call:'ED3YAW',name:'R7 Sant Alís / Montsec d’Ares',band:'VHF',rx:'145.775',tx:'145.175',tone:'123.0',offset:'-0.600 MHz',mode:'FM',area:'Pallars Jussà · Lleida',locator:'JN02JA',heightM:1639,coverageKm:105,lat:42.039667,lon:0.787167,source:'FCR/URE'},
  {id:'ED3YAF',call:'ED3YAF',name:'R7 El Catllar / Ripoll',band:'VHF',rx:'145.775',tx:'145.175',tone:'77.0',offset:'-0.600 MHz',mode:'FM',area:'Ripollès',locator:'JN12CE',heightM:1118,coverageKm:85,lat:42.189000,lon:2.178333,source:'FCR/URE'},
  {id:'ED3YAZ',call:'EA3YAZ',name:'R3 Santuari del Far / Girona',band:'VHF',rx:'145.675',tx:'145.075',tone:'107.2',offset:'-0.600 MHz',mode:'FM',area:'Gironès',locator:'JN12GA',heightM:1123,coverageKm:85,lat:42.020000,lon:2.535333,source:'FCR/URE'},
  {id:'ED3YBB',call:'ED3YBB',name:'R6 Romanyà de la Selva',band:'VHF',rx:'145.750',tx:'145.150',tone:'94.8',offset:'-0.600 MHz',mode:'FM',area:'Baix Empordà',locator:'JN11MT',heightM:359,coverageKm:55,lat:41.995833,lon:3.041333,source:'FCR/URE'},
  {id:'ED3YAU',call:'ED3YAU',name:'R3 Cap de Vaquèira / Naut Aran',band:'VHF',rx:'145.675',tx:'145.075',tone:'77.0',offset:'-0.600 MHz',mode:'FM',area:'Val d’Aran',locator:'JN02IP',heightM:2600,coverageKm:120,lat:42.692167,lon:0.974667,source:'FCR/URE'},
  {id:'ED3YAH',call:'ED3YAH',name:'R3 Mont Caro',band:'VHF',rx:'145.675',tx:'145.075',tone:'88.5',offset:'-0.600 MHz',mode:'FM',area:'Baix Ebre',locator:'JN00ET',heightM:1447,coverageKm:100,lat:40.808000,lon:0.317000,source:'FCR/URE'},
  {id:'ED3YAE',call:'ED3YAE',name:'R71 Pinós / Solsonès',band:'UHF',rx:'438.675',tx:'431.075',tone:'—',offset:'-7.600 MHz',mode:'FM',area:'Solsonès',locator:'JN01SU',heightM:930,coverageKm:55,lat:41.836667,lon:1.540000,source:'FCR/URE'},
  {id:'ED3YBC',call:'ED3YBC',name:'R72 Romanyà de la Selva',band:'UHF',rx:'438.700',tx:'431.100',tone:'—',offset:'-7.600 MHz',mode:'FM',area:'Baix Empordà',locator:'JN11MU',heightM:359,coverageKm:38,lat:41.834167,lon:3.041333,source:'FCR/URE'},
  {id:'ED3YAV',call:'ED3YAV',name:'R74 Sant Alís / Montsec d’Ares',band:'UHF',rx:'438.750',tx:'431.150',tone:'123.0',offset:'-7.600 MHz',mode:'FM',area:'Lleida',locator:'JN02JA',heightM:1639,coverageKm:75,lat:42.039667,lon:0.787167,source:'FCR/URE'},
  {id:'ED3YAM',call:'ED3YAM',name:'R75 Tosa d’Alp',band:'UHF',rx:'438.775',tx:'431.175',tone:'—',offset:'-7.600 MHz',mode:'DMR / C4FM',area:'Cerdanya',locator:'JN02WH',heightM:2536,coverageKm:95,lat:42.319333,lon:1.889000,source:'FCR/URE'},
  {id:'ED3YAC',call:'ED3YAC',name:'R76 Puig de la Creu',band:'UHF',rx:'438.800',tx:'431.200',tone:'110.9',offset:'-7.600 MHz',mode:'FM',area:'Vallès Oriental',locator:'JN11AQ',heightM:671,coverageKm:48,lat:41.669167,lon:2.504667,source:'FCR/URE'},
  {id:'ED3YAO',call:'ED3YAO',name:'R79 Montjuïc / Barcelona',band:'UHF',rx:'438.875',tx:'431.275',tone:'123.0',offset:'-7.600 MHz',mode:'FM',area:'Barcelona',locator:'JN11BI',heightM:250,coverageKm:32,lat:41.365333,lon:2.159667,source:'FCR/URE'},
  {id:'ED3YAP-U',call:'ED3YAP',name:'R80 Figueres / Alt Empordà',band:'UHF',rx:'438.900',tx:'431.300',tone:'107.2',offset:'-7.600 MHz',mode:'FM',area:'Alt Empordà',locator:'JN12LG',heightM:550,coverageKm:45,lat:42.271167,lon:2.950500,source:'FCR/URE'},
  {id:'ED3YAT',call:'ED3YAT',name:'R81 Badalona',band:'UHF',rx:'438.925',tx:'431.325',tone:'79.7',offset:'-7.600 MHz',mode:'FM',area:'Badalona · Barcelonès',locator:'JN11CK',heightM:0,coverageKm:32,lat:41.450000,lon:2.247000,source:'FCR/URE'},
  {id:'ED3YAB-U',call:'ED3YAB',name:'R94 Barcelona / Baix Llobregat',band:'UHF',rx:'439.250',tx:'431.650',tone:'88.5',offset:'-7.600 MHz',mode:'FM',area:'Barcelona · Baix Llobregat · Garraf',locator:'JN01',heightM:570,coverageKm:45,lat:41.420000,lon:1.980000,approxLocation:true,source:'FCR/URE'},
  {id:'ED3YBD',call:'ED3YBD',name:'R98 Pallejà',band:'UHF',rx:'439.350',tx:'431.750',tone:'71.9',offset:'-7.600 MHz',mode:'FM',area:'Baix Llobregat',locator:'JN01XK',heightM:241,coverageKm:32,lat:41.419333,lon:1.986833,source:'FCR/URE'},
  {id:'ED3YAI',call:'ED3YAI',name:'R99 Tosa d’Alp',band:'UHF',rx:'439.375',tx:'431.775',tone:'88.5',offset:'-7.600 MHz',mode:'FM',area:'Cerdanya',locator:'JN02WH',heightM:2536,coverageKm:95,lat:42.319333,lon:1.889000,source:'FCR/URE'}
];

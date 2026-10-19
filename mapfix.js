/* QSOcat · Correcció de Maidenhead per al mapa
   Els 3r i 4t caràcters d'un locator de 4 caràcters són dígits (0-9),
   no lletres. Aquesta funció calcula el centre aproximat del quadrat.
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

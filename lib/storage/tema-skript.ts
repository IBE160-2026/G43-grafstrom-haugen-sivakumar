import { innstillingerSkjema, nyttDokument } from "@/kjerne/skjema";
import { LAGRINGSNØKKEL } from "@/lib/storage";

const TEMAER = innstillingerSkjema.shape.tema.options;
const MODUSER = innstillingerSkjema.shape.modus.options;
const { tema: STANDARD_TEMA, modus: STANDARD_MODUS } = nyttDokument().innstillinger;

/**
 * Frittstående skript til `<head>`. Leser `innstillinger.tema`/`modus` fra
 * lageret og setter `data-tema`/`data-modus` på `<html>` før første tegning.
 * Lagrede verdier brukes bare når både tema og modus er kjente; ellers, og ved
 * ødelagt JSON og blokkert lager, gis begge standardverdiene.
 * Kaster aldri. Kan ikke bruke zod eller `migrer`, så verdiene hvitelistes her.
 */
export const TEMA_SKRIPT = `(function(){var t=${JSON.stringify(STANDARD_TEMA)},m=${JSON.stringify(STANDARD_MODUS)};try{var r=localStorage.getItem(${JSON.stringify(LAGRINGSNØKKEL)});var i=r?JSON.parse(r).innstillinger:null;if(i&&${JSON.stringify(TEMAER)}.indexOf(i.tema)>=0&&${JSON.stringify(MODUSER)}.indexOf(i.modus)>=0){t=i.tema;m=i.modus}}catch(e){}try{var d=document.documentElement;d.setAttribute("data-tema",t);d.setAttribute("data-modus",m)}catch(e){}})()`;

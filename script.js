// ══════════════════════════════════════════════════════════════
// Nova Runas v2.0 — Script Principal
// ══════════════════════════════════════════════════════════════

// ── Firebase Config ──────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyD00Hg_wAMADTnCZTxn94fNoRynvhpMLBU",
  authDomain: "runes-90d8b.firebaseapp.com",
  projectId: "runes-90d8b",
  storageBucket: "runes-90d8b.firebasestorage.app",
  messagingSenderId: "137879650199",
  appId: "1:137879650199:web:1f2cda616e71f8475c4ed2"
};

// Init Firebase (compat mode)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ── Runas Data (enriquecida con correspondencias) ────────────
const RUNAS = [
  { id:"fehu", nombre:"Fehu", simbolo:"ᚠ", aett:1, significado:"Riqueza, prosperidad, nuevos comienzos materiales", significado_detallado:"Fehu representa el ganado — la medida ancestral de riqueza. Es la energía de la abundancia ganada con esfuerzo, los bienes muebles y la circulación de riqueza. No es riqueza estática, sino energía en movimiento.", significado_invertido:"Pérdida financiera, avaricia, estancamiento material, pobreza de espíritu.", consejo:"La verdadera riqueza incluye creatividad, relaciones y riqueza espiritual. La riqueza debe circular para crecer.", elemento:"Fuego", dios:"Freyr/Freya", simetrica:false, invertible:true },
  { id:"uruz", nombre:"Uruz", simbolo:"ᚢ", aett:1, significado:"Fuerza, resistencia, potencial salvaje", significado_detallado:"El uro — un herbívoro masivo y extinto que simboliza fuerza bruta, vitalidad y poder indomado. Representa la salud física, la determinación y el coraje para enfrentar desafíos.", significado_invertido:"Debilidad, enfermedad, falta de motivación, oportunidad perdida, fuerza mal dirigida.", consejo:"La verdadera fuerza viene de adentro. Encontrá tu poder interior y usalo con sabiduría.", elemento:"Tierra", dios:"Thor", simetrica:false, invertible:true },
  { id:"thurisaz", nombre:"Thurisaz", simbolo:"ᚦ", aett:1, significado:"Protección, conflicto, catalizador de cambio", significado_detallado:"El gigante (Thurs) del mito nórdico — fuerzas de caos que amenazan pero también catalizan el crecimiento. Asociado al martillo de Thor y al espin protector. Fuerza reactiva, defensa y conflicto necesario.", significado_invertido:"Vulnerabilidad, peligro, patrones destructivos, agresión descontrolada.", consejo:"No todo conflicto es negativo. Enfrentar los obstáculos es la puerta a la transformación.", elemento:"Fuego/Tierra", dios:"Thor", simetrica:false, invertible:true },
  { id:"ansuz", nombre:"Ansuz", simbolo:"ᚨ", aett:1, significado:"Comunicación divina, sabiduría, inspiración", significado_detallado:"La runa del propio Odín — comunicación divina, sabiduría, inspiración y la palabra hablada. Gobierna toda forma de comunicación: habla, escritura, canción, enseñanza. Conecta la mente humana con la percepción divina.", significado_invertido:"Malentendidos, engaño, manipulación, vanidad, aburrimiento.", consejo:"Las palabras tienen poder. Comunicación consciente y la responsabilidad sagrada de hablar la verdad.", elemento:"Aire", dios:"Odín", simetrica:false, invertible:true },
  { id:"raidho", nombre:"Raidho", simbolo:"ᚱ", aett:1, significado:"Viaje, ritmo, orden correcto, movimiento", significado_detallado:"El carro o viaje — tanto el desplazamiento físico como el viaje interior del crecimiento personal. Movimiento, ritmo, el orden correcto y la progresión natural de la vida.", significado_invertido:"Estancamiento, demoras, dirección equivocada, planes rotos, crisis de propósito.", consejo:"La vida es un camino, no un destino. El camino mismo tiene sentido. Mantenete en movimiento físico, mental y espiritual.", elemento:"Aire", dios:"—", simetrica:false, invertible:true },
  { id:"kenaz", nombre:"Kenaz", simbolo:"ᚲ", aett:1, significado:"Antorcha, conocimiento, transformación creativa", significado_detallado:"La antorcha — luz en la oscuridad, conocimiento que ilumina la ignorancia y el fuego creativo que transforma materia prima en arte. Iluminación, aprendizaje y transformación creativa.", significado_invertido:"Oscuridad, confusión, ignorancia, bloqueo creativo, falsa esperanza.", consejo:"El conocimiento no es acumulación pasiva de hechos sino iluminación activa. Entenderte transforma desde adentro.", elemento:"Fuego", dios:"—", simetrica:false, invertible:true },
  { id:"gebo", nombre:"Gebo", simbolo:"ᚷ", aett:1, significado:"Regalo, intercambio sagrado, generosidad", significado_detallado:"El intercambio sagrado de regalos — el principio de generosidad, equilibrio y reciprocidad que une las relaciones. No tiene posición invertida porque el verdadero regalo siempre es equilibrado.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"Cada relación es un intercambio de dones. Dar y recibir deben estar en equilibrio.", elemento:"Aire", dios:"—", simetrica:true, invertible:false },
  { id:"wunjo", nombre:"Wunjo", simbolo:"ᚹ", aett:1, significado:"Alegría, armonía, plenitud, realización", significado_detallado:"La alegría — cuando las cosas están en su lugar correcto. Felicidad, satisfacción y bienestar que surge de la alineación con tu verdadera naturaleza.", significado_invertido:"Tristeza, conflicto, alienación, decepción, idealismo posesivo.", consejo:"La verdadera alegría viene de la alineación — cuando tu mundo interior y exterior están en armonía. La felicidad no es destino, es estado de ser.", elemento:"Tierra", dios:"—", simetrica:false, invertible:true },
  { id:"hagalaz", nombre:"Hagalaz", simbolo:"ᚺ", aett:2, significado:"Disrupción, granizo, destrucción creativa", significado_detallado:"El granizo — fuerza destructiva de la naturaleza que daña cultivos pero también provee el agua que nutre el crecimiento nuevo. Disrupción, cambio radical y destrucción creativa.", significado_invertido:"(No tiene reversa — fuerzas fuera de control)", consejo:"A veces la destrucción es necesaria. El universo a veces derriba lo que ya no sirve para tu crecimiento.", elemento:"Agua/Aire", dios:"—", simetrica:false, invertible:true },
  { id:"nauthiz", nombre:"Nauthiz", simbolo:"ᚾ", aett:2, significado:"Necesidad, escasez, resiliencia, fricción creativa", significado_detallado:"La necesidad — la escasez y las dificultades que enseñan resiliencia, paciencia y la sabiduría que solo viene de soportar la prueba del fuego. Es la runa de la resistencia, la disciplina y el autocontrol. La necesidad forja el carácter.", significado_invertido:"Pobreza de voluntad, rendirse fácilmente, sufrimiento innecesario, fracaso al aprender de la dificultad.", consejo:"Identificá tu necesidad real detrás de la urgencia. La dificultad forja el carácter.", elemento:"Fuego", dios:"—", simetrica:false, invertible:true },
  { id:"isa", nombre:"Isa", simbolo:"ᛁ", aett:2, significado:"Hielo, quietud, estancamiento, espera", significado_detallado:"El hielo — fuerza de quietud, contracción y potencial congelado. Standstill, paciencia y la pausa necesaria antes de nueva acción.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"No toda pausa es problema. A veces la acción más sabia es no actuar — esperar, observar y reunir fuerza para el momento correcto.", elemento:"Agua", dios:"—", simetrica:true, invertible:false },
  { id:"jera", nombre:"Jera", simbolo:"ᛃ", aett:2, significado:"Cosecha, ciclo, recompensa, timing natural", significado_detallado:"El año — el ciclo de la cosecha, la recompensa que viene después del esfuerzo paciente. Ciclos, estaciones, timing natural y la garantía de que la inversión eventualmente dará frutos.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"Todo tiene su temporada. Hay un tiempo para sembrar y un tiempo para cosechar. La paciencia no es pasiva sino confianza activa en el proceso.", elemento:"Tierra", dios:"—", simetrica:true, invertible:false },
  { id:"eihwaz", nombre:"Eihwaz", simbolo:"ᛇ", aett:2, significado:"Tejo, Yggdrasil, endurance, conexión entre mundos", significado_detallado:"El tejo — el árbol Yggdrasil, antiguo, eterno, asociado tanto con la muerte como con la vida eterna. Endurance, protección y conexión entre mundos.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"Sos parte de algo más grande. Conectá con las raíces y las ramas de tu existencia.", elemento:"Tierra", dios:"Odín", simetrica:true, invertible:false },
  { id:"perthro", nombre:"Perthro", simbolo:"ᛈ", aett:2, significado:"Misterio, destino, azar, secretos revelados", significado_detallado:"El cubo de dados — el misterio del destino, lo desconocido y el azar en la vida humana. Asociada al acto mismo de tirar runas. Secretos que se revelan, misterios femeninos, buena suerte.", significado_invertido:"Estancamiento, soledad, malestar, adicción, secretos guardados.", consejo:"Prestá atención a las coincidencias. El destino te habla a través de lo inesperado.", elemento:"Agua", dios:"—", simetrica:false, invertible:true },
  { id:"algiz", nombre:"Algiz", simbolo:"ᛉ", aett:2, significado:"Protección, instinto, conexión divina, santuario", significado_detallado:"Las astas del alce — símbolo de defensa e instinto protector. Una de las runas de protección más poderosas del Elder Futhark.", significado_invertido:"Peligro oculto, vulnerabilidad, perder la conexión, falta de protección.", consejo:"Estás protegido. Escuchá tu instinto — él te guía hacia la seguridad espiritual.", elemento:"Aire", dios:"Heimdall", simetrica:true, invertible:false },
  { id:"sowilo", nombre:"Sowilo", simbolo:"ᛋ", aett:2, significado:"Sol, victoria, fuerza vital, iluminación", significado_detallado:"El sol — la fuente definitiva de luz, vida y energía. Éxito, vitalidad, plenitud y el poder de la voluntad individual.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"Mostrate al mundo con confianza. Tu luz es necesaria. El sol no se esconde.", elemento:"Fuego", dios:"—", simetrica:true, invertible:false },
  { id:"tiwaz", nombre:"Tiwaz", simbolo:"ᛏ", aett:3, significado:"Justicia, honor, sacrificio, liderazgo", significado_detallado:"El dios Tyr — que sacrificó su mano para encadenar al lobo Fenrir. Justicia, honor, autosacrificio por el bien mayor y liderazgo por ejemplo.", significado_invertido:"Injusticia, desequilibrio, derrota, fracaso de liderazgo, sacrificio excesivo.", consejo:"Actuá con integridad. La justicia y el coraje te acompañan, aunque sea difícil.", elemento:"Aire", dios:"Tyr", simetrica:false, invertible:true },
  { id:"berkano", nombre:"Berkano", simbolo:"ᛒ", aett:3, significado:"Abedul, nacimiento, fertilidad, renovación", significado_detallado:"El abedul — el primer árbol que brota después del invierno, simbolizando nuevos comienzos, nacimiento y el principio femenino nutricio.", significado_invertido:"Problemas familiares, ansiedad por nuevos comienzos, descuido, pérdida de control.", consejo:"Algo nuevo está naciendo. Cuidalo con ternura. Es momento de nutrir ideas nuevas.", elemento:"Tierra", dios:"Freya", simetrica:false, invertible:true },
  { id:"ehwaz", nombre:"Ehwaz", simbolo:"ᛖ", aett:3, significado:"Caballo, confianza, movimiento conjunto", significado_detallado:"El caballo — el compañero de confianza que te lleva en tu viaje. Asociación, confianza, trabajo en equipo y movimiento armonioso.", significado_invertido:"Desconfianza, traición, inquietud, prisa imprudente.", consejo:"No estás solo. El trabajo en equipo y la confianza te llevarán lejos.", elemento:"Tierra", dios:"—", simetrica:false, invertible:true },
  { id:"mannaz", nombre:"Mannaz", simbolo:"ᛗ", aett:3, significado:"Humanidad, yo, inteligencia, comunidad", significado_detallado:"El ser humano — el yo en comunidad, inteligencia, cultura y la chispa divina dentro de cada persona. Autoconocimiento y relaciones.", significado_invertido:"Aislamiento, egoísmo, manipulación, depresión, engaño.", consejo:"Mirá hacia adentro. El conocimiento de vos mismo es tu mejor herramienta.", elemento:"Aire", dios:"—", simetrica:false, invertible:true },
  { id:"laguz", nombre:"Laguz", simbolo:"ᛚ", aett:3, significado:"Agua, intuición, flujo, inconsciente", significado_detallado:"El agua — el elemento primordial de flujo, intuición, el subconsciente y lo profundo desconocido. Sueños, emociones y el misterio femenino.", significado_invertido:"Miedo, confusión, mal juicio, decisiones erróneas, falta de creatividad.", consejo:"Dejate llevar por la corriente. La intuición es tu guía más sabia. El corazón sabe más que la mente.", elemento:"Agua", dios:"—", simetrica:false, invertible:true },
  { id:"ingwaz", nombre:"Ingwaz", simbolo:"ᛝ", aett:3, significado:"Fertilidad, completado, potencial latente", significado_detallado:"El dios Ing (Freyr) — fertilidad, completado y el potencial pacífico de nueva vida gestándose. Crecimiento interno, sentido común, paz y hogar.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"Confiá en el proceso aunque no veas resultados. Está sucediendo en silencio.", elemento:"Tierra", dios:"Freyr", simetrica:true, invertible:false },
  { id:"dagaz", nombre:"Dagaz", simbolo:"ᛞ", aett:3, significado:"Día, amanecer, breakthrough, transformación", significado_detallado:"El amanecer — el momento en que la oscuridad cede ante la luz. Transformación, despertar y claridad radical.", significado_invertido:"(No tiene reversa — siempre se lee igual)", consejo:"Un nuevo día amanece. Grandes cambios y revelaciones están por llegar. Preparate.", elemento:"Fuego/Aire", dios:"—", simetrica:true, invertible:false },
  { id:"othala", nombre:"Othala", simbolo:"ᛟ", aett:3, significado:"Herencia, patria ancestral, tradición", significado_detallado:"La patria ancestral — la tierra heredada, la propiedad duradera y la sabiduría acumulada de tu linaje. Herencia, tradición y valores transmitidos por generaciones.", significado_invertido:"Sin hogar, desarraigo, abandono de tradiciones, conflicto familiar, mala herencia.", consejo:"Conectá con tu familia o tus raíces. Honrar el pasado fortalece el futuro.", elemento:"Tierra", dios:"—", simetrica:false, invertible:true }
];

// ── Spread Layouts (tipos de tirada) ─────────────────────────
const SPREADS = {
  1: {
    nombre: "Runa Guía",
    descripcion: "Una runa para tu camino hoy",
    posiciones: ["Guía del día"]
  },
  3: {
    nombre: "Pasado / Presente / Futuro",
    descripcion: "La línea del tiempo de tu situación",
    posiciones: ["Pasado", "Presente", "Futuro"],
    interpretar: (runas) => {
      const pasado = runas[0];
      const presente = runas[1];
      const futuro = runas[2];
      let texto = `Tu pasado está marcado por ${pasado.nombre}, lo que indica `;
      if (pasado.invertida) texto += `bloqueos o lecciones pendientes de esa energía. `;
      else texto += `una influencia fuerte de ${pasado.significado.split(',')[0].toLowerCase()}. `;
      texto += `En el presente, ${presente.nombre} `;
      if (presente.invertida) texto += `sugiere desafíos actuales relacionados con ${presente.significado.split(',')[0].toLowerCase()}. `;
      else texto += `indica que la energía de ${presente.significado.split(',')[0].toLowerCase()} está activa. `;
      texto += `Mirando al futuro, ${futuro.nombre} `;
      if (futuro.invertida) texto += `advierte sobre posibles obstáculos en ${futuro.significado.split(',')[0].toLowerCase()}. `;
      else texto += `promete ${futuro.significado.split(',')[0].toLowerCase()} en tu camino. `;
      texto += `Observá cómo estas tres runas cuentan una historia: de donde venís, dónde estás y hacia dónde vas.`;
      return texto;
    }
  },
  5: {
    nombre: "Cruz Nórdica",
    descripcion: "Un análisis profundo de tu situación",
    posiciones: ["Situación actual", "Desafío", "Pasado reciente", "Futuro cercano", "Resultado probable"],
    interpretar: (runas) => {
      let texto = `La runa central (${runas[0].nombre}) representa tu situación actual. `;
      if (runas[0].invertida) texto += `Está invertida, lo que sugiere energía bloqueada. `;
      texto += `El desafío que enfrentás es ${runas[1].nombre}${runas[1].invertida ? ' (invertida)' : ''}. `;
      texto += `El pasado reciente está marcado por ${runas[2].nombre}. `;
      texto += `El futuro cercano trae la energía de ${runas[3].nombre}. `;
      texto += `Si todo sigue este camino, el resultado será ${runas[4].nombre}${runas[4].invertida ? ', pero con advertencias' : ' — una influencia positiva'}. `;
      texto += `Las runas centrales (situación y desafío) son las más importantes para tu interpretación.`;
      return texto;
    }
  }
};

// ── Lecciones Data ───────────────────────────────────────────
const LECCIONES = [
  { id:"l1-1", titulo:"Primeros Pasos", descripcion:"Conocé las primeras runas", aett:1, runas_ids:["fehu","uruz","thurisaz","ansuz"], premium:false, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"fehu", opciones:["Fehu","Uruz","Ansuz","Kenaz"], correcta:0 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"uruz", opciones:["Thurisaz","Uruz","Fehu","Raidho"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Fehu?", runa_id:"fehu", opciones:["Fuerza y resistencia","Riqueza y prosperidad","Comunicación y sabiduría","Protección y conflicto"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué representa Thurisaz?", runa_id:"thurisaz", opciones:["Viaje y movimiento","Antorcha y creatividad","Protección y conflicto","Alegría y armonía"], correcta:2 },
    { tipo:"asociar-simbolo", instruccion:"Asociá cada runa con su símbolo", pares:[{runa_id:"fehu",simbolo:"ᚠ"},{runa_id:"uruz",simbolo:"ᚢ"},{runa_id:"thurisaz",simbolo:"ᚦ"},{runa_id:"ansuz",simbolo:"ᚨ"}] },
    { tipo:"completar-frase", instruccion:"Completá: Fehu representa ___ y prosperidad", respuesta_correcta:"riqueza", pista:"Empieza con 'r'" }
  ]},
  { id:"l1-2", titulo:"Segundo Grupo", descripcion:"Más runas de la Aett de Freyr", aett:1, runas_ids:["raidho","kenaz","gebo","wunjo"], premium:false, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"kenaz", opciones:["Raidho","Kenaz","Gebo","Wunjo"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"gebo", opciones:["Gebo","Ansuz","Fehu","Raidho"], correcta:0 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Gebo?", runa_id:"gebo", opciones:["Alegría y éxito","Regalo y generosidad","Viaje y movimiento","Antorcha y creatividad"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué representa Wunjo?", runa_id:"wunjo", opciones:["Fuerza y resistencia","Comunicación y sabiduría","Alegría y armonía","Protección y conflicto"], correcta:2 },
    { tipo:"clase-runa", instruccion:"¿De qué aett es esta runa?", runa_id:"kenaz", opciones:["Aett de Freyr (1)","Aett de Heimdall (2)","Aett de Tyr (3)"], correcta:0 },
    { tipo:"verdadero-falso", instruccion:"Gebo es una runa simétrica", respuesta_correcta:true, explicacion:"Correcto: Gebo (ᚷ) es simétrica y siempre se lee igual" }
  ]},
  { id:"l1-3", titulo:"Aett de Freyr Completa", descripcion:"Repasá todas las runas de la primera aett", aett:1, runas_ids:["fehu","uruz","thurisaz","ansuz","raidho","kenaz","gebo","wunjo"], premium:false, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"raidho", opciones:["Ansuz","Raidho","Kenaz","Thurisaz"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"wunjo", opciones:["Gebo","Wunjo","Kenaz","Fehu"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Ansuz?", runa_id:"ansuz", opciones:["Fuerza y resistencia","Viaje y movimiento","Comunicación y sabiduría","Alegría y armonía"], correcta:2 },
    { tipo:"multiple-choice", instruccion:"¿Cuáles de estas runas son simétricas?", opciones:["Solo Gebo","Gebo y Kenaz","Solo Wunjo","Ninguna"], correcta:0, explicacion:"Solo Gebo (ᚷ) es simétrica en esta aett" },
    { tipo:"ordenar", instruccion:"Ordená estas runas según su posición", elementos:["Fehu","Uruz","Thurisaz","Ansuz"], orden_correcto:["Fehu","Uruz","Thurisaz","Ansuz"] },
    { tipo:"completar-frase", instruccion:"La Aett de Freyr contiene ___ runas", respuesta_correcta:"ocho", pista:"Número del 1 al 10" }
  ]},
  { id:"l2-1", titulo:"Aett de Heimdall I", descripcion:"Primeras runas de la segunda aett", aett:2, runas_ids:["hagalaz","nauthiz","isa","jera"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"hagalaz", opciones:["Hagalaz","Nauthiz","Isa","Jera"], correcta:0 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"isa", opciones:["Nauthiz","Isa","Hagalaz","Perthro"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Hagalaz?", runa_id:"hagalaz", opciones:["Hielo y quietud","Disrupción y crisis","Cosecha y ciclo","Necesidad y limitación"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué representa Jera?", runa_id:"jera", opciones:["Misterio y destino","Transición y transformación","Cosecha y ciclo","Protección espiritual"], correcta:2 },
    { tipo:"verdadero-falso", instruccion:"Isa es una runa simétrica", respuesta_correcta:true, explicacion:"Correcto: Isa (ᛁ) es simétrica" }
  ]},
  { id:"l2-2", titulo:"Aett de Heimdall II", descripcion:"Segundo grupo de la segunda aett", aett:2, runas_ids:["eihwaz","perthro","algiz","sowilo"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"perthro", opciones:["Eihwaz","Perthro","Algiz","Sowilo"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"algiz", opciones:["Sowilo","Perthro","Algiz","Eihwaz"], correcta:2 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Algiz?", runa_id:"algiz", opciones:["Transición y transformación","Misterio y destino","Protección espiritual","Sol y éxito"], correcta:2 },
    { tipo:"multiple-choice", instruccion:"¿Cuáles son simétricas?", opciones:["Eihwaz y Perthro","Algiz y Sowilo","Solo Perthro","Todas"], correcta:1, explicacion:"Algiz (ᛉ) y Sowilo (ᛋ) son simétricas" },
    { tipo:"verdadero-falso", instruccion:"Perthro es simétrica", respuesta_correcta:false, explicacion:"Perthro (ᛈ) NO es simétrica" }
  ]},
  { id:"l2-3", titulo:"Aett de Heimdall Completa", descripcion:"Repasá la segunda aett", aett:2, runas_ids:["hagalaz","nauthiz","isa","jera","eihwaz","perthro","algiz","sowilo"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"nauthiz", opciones:["Hagalaz","Nauthiz","Isa","Eihwaz"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"eihwaz", opciones:["Perthro","Sowilo","Eihwaz","Algiz"], correcta:2 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Nauthiz?", runa_id:"nauthiz", opciones:["Disrupción y crisis","Necesidad y limitación","Hielo y quietud","Protección espiritual"], correcta:1 },
    { tipo:"multiple-choice", instruccion:"¿Cuántas runas simétricas tiene Heimdall?", opciones:["2","3","4","5"], correcta:4, explicacion:"Isa, Jera, Eihwaz, Algiz y Sowilo = 5" },
    { tipo:"ordenar", instruccion:"Ordená estas runas", elementos:["Hagalaz","Nauthiz","Isa","Jera"], orden_correcto:["Hagalaz","Nauthiz","Isa","Jera"] }
  ]},
  { id:"l3-1", titulo:"Aett de Tyr I", descripcion:"Primeras runas de la tercera aett", aett:3, runas_ids:["tiwaz","berkano","ehwaz","mannaz"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"tiwaz", opciones:["Tiwaz","Berkano","Ehwaz","Mannaz"], correcta:0 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"berkano", opciones:["Mannaz","Berkano","Tiwaz","Laguz"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Tiwaz?", runa_id:"tiwaz", opciones:["Nacimiento y fertilidad","Sacrificio y honor","Trabajo en equipo","Humanidad y ser"], correcta:1 },
    { tipo:"significado-runa", instruccion:"¿Qué representa Mannaz?", runa_id:"mannaz", opciones:["Caballo y movimiento","Abedul y nacimiento","Humanidad y ser","Agua e intuición"], correcta:2 },
    { tipo:"verdadero-falso", instruccion:"Berkano es simétrica", respuesta_correcta:false, explicacion:"Berkano (ᛒ) NO es simétrica" }
  ]},
  { id:"l3-2", titulo:"Aett de Tyr II", descripcion:"Segundo grupo de la tercera aett", aett:3, runas_ids:["laguz","ingwaz","dagaz","othala"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"laguz", opciones:["Mannaz","Laguz","Ingwaz","Dagaz"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"dagaz", opciones:["Ingwaz","Othala","Dagaz","Laguz"], correcta:2 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Laguz?", runa_id:"laguz", opciones:["Semilla y gestación","Día y amanecer","Agua e intuición","Herencia y hogar"], correcta:2 },
    { tipo:"multiple-choice", instruccion:"¿Cuáles son simétricas?", opciones:["Laguz y Ingwaz","Ingwaz y Dagaz","Solo Dagaz","Todas"], correcta:1, explicacion:"Ingwaz (ᛝ) y Dagaz (ᛞ) son simétricas" },
    { tipo:"verdadero-falso", instruccion:"Laguz es simétrica", respuesta_correcta:false, explicacion:"Laguz (ᛚ) NO es simétrica" }
  ]},
  { id:"l3-3", titulo:"Aett de Tyr Completa", descripcion:"Repasá la tercera aett", aett:3, runas_ids:["tiwaz","berkano","ehwaz","mannaz","laguz","ingwaz","dagaz","othala"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"ehwaz", opciones:["Berkano","Ehwaz","Mannaz","Tiwaz"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"ingwaz", opciones:["Laguz","Dagaz","Ingwaz","Othala"], correcta:2 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Ehwaz?", runa_id:"ehwaz", opciones:["Sacrificio y honor","Abedul y nacimiento","Caballo y movimiento","Humanidad y ser"], correcta:2 },
    { tipo:"multiple-choice", instruccion:"¿Cuántas runas simétricas tiene Tyr?", opciones:["1","2","3","4"], correcta:1, explicacion:"Ingwaz y Dagaz = 2" },
    { tipo:"ordenar", instruccion:"Ordená estas runas", elementos:["Tiwaz","Berkano","Ehwaz","Mannaz"], orden_correcto:["Tiwaz","Berkano","Ehwaz","Mannaz"] }
  ]},
  { id:"l-master", titulo:"Maestro de Runas", descripcion:"El desafío final: las 24 runas", aett:0, runas_ids:["fehu","uruz","thurisaz","ansuz","raidho","kenaz","gebo","wunjo","hagalaz","nauthiz","isa","jera","eihwaz","perthro","algiz","sowilo","tiwaz","berkano","ehwaz","mannaz","laguz","ingwaz","dagaz","othala"], premium:true, ejercicios:[
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"kenaz", opciones:["Raidho","Kenaz","Gebo","Wunjo"], correcta:1 },
    { tipo:"identificar-runa", instruccion:"¿Qué runa es esta?", runa_id:"algiz", opciones:["Sowilo","Perthro","Algiz","Eihwaz"], correcta:2 },
    { tipo:"significado-runa", instruccion:"¿Qué significa Perthro?", runa_id:"perthro", opciones:["Cosecha y ciclo","Transición y transformación","Misterio y destino","Sol y éxito"], correcta:2 },
    { tipo:"multiple-choice", instruccion:"¿Cuántas runas simétricas hay en total?", opciones:["5","6","7","8"], correcta:3, explicacion:"Gebo, Isa, Jera, Eihwaz, Algiz, Sowilo, Ingwaz, Dagaz = 8" },
    { tipo:"multiple-choice", instruccion:"¿Cuántas aettir tiene el Elder Futhark?", opciones:["2","3","4","5"], correcta:1, explicacion:"3 aettir de 8 runas cada una" },
    { tipo:"ordenar", instruccion:"Ordená las aettir", elementos:["Aett de Tyr","Aett de Freyr","Aett de Heimdall"], orden_correcto:["Aett de Freyr","Aett de Heimdall","Aett de Tyr"] }
  ]}
];

// ── Medallas ────────────────────────────────────────────────
const MEDALLAS = [
  { id:"primera", nombre:"Primera Runa", icono:"ᚠ", desc:"Completá tu primera lección", req:(p)=>p.leccionesCompletadas.length>=1 },
  { id:"tres-lec", nombre:"Discípulo", icono:"ᚦ", desc:"3 lecciones completas", req:(p)=>p.leccionesCompletadas.length>=3 },
  { id:"seis-lec", nombre:"Bardagi", icono:"ᚨ", desc:"6 lecciones completas", req:(p)=>p.leccionesCompletadas.length>=6 },
  { id:"todas-lec", nombre:"Allsherjargoði", icono:"ᛟ", desc:"Todas las lecciones", req:(p)=>p.leccionesCompletadas.length>=LECCIONES.length },
  { id:"streak-3", nombre:"Firmbolti", icono:"ᛋ", desc:"3 días seguidos", req:(p)=>p.streak>=3 },
  { id:"streak-7", nombre:"Óðins Vakt", icono:"ᛉ", desc:"7 días seguidos", req:(p)=>p.streak>=7 },
  { id:"xp-100", nombre:"Gagnraddir", icono:"ᛃ", desc:"100 XP", req:(p)=>p.xp>=100 },
  { id:"xp-500", nombre:"Hersir", icono:"ᛏ", desc:"500 XP", req:(p)=>p.xp>=500 },
  { id:"perfect", nombre:"Sigrún", icono:"ᛝ", desc:"Lección sin errores", req:(p)=>p.perfectRuns>0 },
  { id:"aett-1", nombre:"Kyn Freys", icono:"ᚹ", desc:"Dominá la Aett I", req:(p)=>p.aettCompletada?.[1] },
  { id:"aett-2", nombre:"Heimdallsvörðr", icono:"ᚺ", desc:"Dominá la Aett II", req:(p)=>p.aettCompletada?.[2] },
  { id:"aett-3", nombre:"Týs Úlfheðinn", icono:"ᛒ", desc:"Dominá la Aett III", req:(p)=>p.aettCompletada?.[3] }
];

// ── Audio Manager ────────────────────────────────────────────
const AudioManager = {
  bgMusic: null,
  _sfxCtx: null,
  musicEnabled: true,
  sfxEnabled: true,
  volume: 0.3,

  init() {
    try {
      this.bgMusic = new Audio();
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.volume;
      this.bgMusic.src = 'audio/ambient-norse.mp3';
      this.musicEnabled = localStorage.getItem('nova_music') !== 'false';
      this.sfxEnabled = localStorage.getItem('nova_sfx') !== 'false';
      this.bgMusic.addEventListener('error', () => {
        console.log('Audio no disponible');
      });
    } catch(e) {
      console.log('AudioManager init failed:', e);
    }
  },

  playMusic() {
    if (!this.musicEnabled || !this.bgMusic) return;
    this.bgMusic.play().catch(() => {});
  },

  pauseMusic() {
    if (this.bgMusic) this.bgMusic.pause();
  },

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('nova_music', this.musicEnabled);
    if (this.musicEnabled) this.playMusic();
    else this.pauseMusic();
    return this.musicEnabled;
  },

  _getSfxCtx() {
    if (!this._sfxCtx) {
      try {
        this._sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    if (this._sfxCtx.state === 'suspended') {
      this._sfxCtx.resume().catch(() => {});
    }
    return this._sfxCtx;
  },

  playSfx(type) {
    if (!this.sfxEnabled) return;
    const ctx = this._getSfxCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch(type) {
      case 'correct':
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
        break;
      case 'incorrect':
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'levelup':
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.2);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
        break;
      case 'complete':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, ctx.currentTime);
        osc.frequency.setValueAtTime(523, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
        break;
    }
  },

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('nova_sfx', this.sfxEnabled);
    return this.sfxEnabled;
  }
};

// ── App State ────────────────────────────────────────────────
let currentUser = null;
let progreso = defaultProgreso();
let leccionActual = null;
let ejercicioActual = 0;
let xpGanados = 0;
let respuestasCorrectas = 0;
let totalEjercicios = 0;
let selectedRune = null;
let onboardingRune = null;

// ── Helpers ──────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleOpciones(ej) {
  if (!ej.opciones) return { opciones: [], correcta: 0 };
  const indexed = ej.opciones.map((o, i) => ({ texto: o, esCorrecta: i === ej.correcta }));
  const shuffled = shuffleArray(indexed);
  const newCorrecta = shuffled.findIndex(o => o.esCorrecta);
  return { opciones: shuffled.map(o => o.texto), correcta: newCorrecta };
}

// ── Floating Runes ───────────────────────────────────────────
function createFloatingRunes(containerId, count = 15) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const runeChars = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛝᛞᛟ';
  const sizes = ['1.2rem','1.8rem','2.2rem','2.8rem','3.5rem'];
  const glows = [
    '0 0 8px rgba(201,168,76,0.25), 0 0 20px rgba(201,168,76,0.1)',
    '0 0 12px rgba(201,168,76,0.35), 0 0 30px rgba(201,168,76,0.15)',
    '0 0 16px rgba(201,168,76,0.4), 0 0 40px rgba(201,168,76,0.2)',
    '0 0 20px rgba(201,168,76,0.5), 0 0 50px rgba(201,168,76,0.25)',
  ];
  for (let i = 0; i < count; i++) {
    const rune = document.createElement('span');
    rune.className = 'floating-rune';
    rune.textContent = runeChars[Math.floor(Math.random() * runeChars.length)];
    rune.style.left = Math.random() * 100 + '%';
    rune.style.animationDelay = Math.random() * 20 + 's';
    rune.style.animationDuration = (15 + Math.random() * 20) + 's';
    rune.style.fontSize = sizes[Math.floor(Math.random() * sizes.length)];
    rune.style.textShadow = glows[Math.floor(Math.random() * glows.length)];
    container.appendChild(rune);
  }
}

// ── Toast Notifications ──────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Progreso ─────────────────────────────────────────────────
function defaultProgreso() {
  return {
    xp: 0, streak: 0, ultimoDiaPracticado: null,
    leccionesCompletadas: [], runasAprendidas: [],
    medallas: [], perfectRuns: 0,
    aettCompletada: { 1:false, 2:false, 3:false },
    isPremium: false, nombre: 'Guerrero', runaEspiritu: 'ᛟ',
    desafioDiario: null
  };
}

function saveProgreso() {
  if (currentUser) {
    db.collection('users').doc(currentUser.uid).set(progreso, { merge: true }).catch(()=>{});
  }
  localStorage.setItem('nova_progreso', JSON.stringify(progreso));
}

function loadProgreso() {
  const local = localStorage.getItem('nova_progreso');
  return local ? JSON.parse(local) : defaultProgreso();
}

// ── Firebase Auth ────────────────────────────────────────────
function initAuth() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      currentUser = user;
      // Load from Firestore
      try {
        const doc = await db.collection('users').doc(user.uid).get();
        if (doc.exists) {
          progreso = { ...defaultProgreso(), ...doc.data() };
        } else {
          progreso = defaultProgreso();
          progreso.nombre = user.displayName || 'Guerrero';
        }
      } catch(e) {
        progreso = loadProgreso();
      }
      localStorage.setItem('nova_progreso', JSON.stringify(progreso));
      afterLogin();
      loadDiarioFromFirestore();
    } else {
      currentUser = null;
      progreso = loadProgreso();
      showScreen('login');
    }
  });
}

async function loginWithEmail(email, password) {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    showToast('¡Bienvenido de vuelta!', 'success');
  } catch(e) {
    showToast(getAuthError(e.code), 'error');
  }
}

async function registerWithEmail(name, email, password) {
  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    progreso = defaultProgreso();
    progreso.nombre = name;
    await db.collection('users').doc(cred.user.uid).set(progreso);
    showToast('¡Cuenta creada!', 'success');
  } catch(e) {
    showToast(getAuthError(e.code), 'error');
  }
}

async function loginWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(provider);
  } catch(e) {
    showToast(getAuthError(e.code), 'error');
  }
}

// Handle redirect result on page load
async function handleRedirectResult() {
  try {
    const result = await auth.getRedirectResult();
    if (result.user) {
      showToast('¡Conectado con Google!', 'success');
    }
  } catch(e) {
    if (e.code !== 'auth/no-redirect-retrieval') {
      showToast(getAuthError(e.code), 'error');
    }
  }
}

async function logout() {
  await auth.signOut();
  currentUser = null;
  progreso = defaultProgreso();
  showScreen('login');
}

function getAuthError(code) {
  const errors = {
    'auth/user-not-found': 'No existe una cuenta con este correo',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/email-already-in-use': 'Este correo ya está registrado',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'Correo inválido',
    'auth/too-many-requests': 'Demasiados intentos. Esperá un momento',
  };
  return errors[code] || 'Error al autenticar';
}

function afterLogin() {
  // Check streak
  const hoy = new Date().toDateString();
  if (progreso.ultimoDiaPracticado) {
    const ultimo = new Date(progreso.ultimoDiaPracticado).toDateString();
    const ayer = new Date(Date.now() - 86400000).toDateString();
    if (ultimo !== hoy && ultimo !== ayer) {
      progreso.streak = 0;
    }
  }

  if (!progreso.nombre || progreso.nombre === 'Guerrero') {
    showScreen('onboarding');
  } else {
    showScreen('inicio');
  }

  AudioManager.init();
  scheduleDailyRune();

  // Start music after first user interaction (browser policy)
  const startMusicOnInteraction = () => {
    if (AudioManager.musicEnabled) {
      AudioManager.playMusic();
    }
    document.removeEventListener('click', startMusicOnInteraction);
    document.removeEventListener('touchstart', startMusicOnInteraction);
  };
  document.addEventListener('click', startMusicOnInteraction, { once: true });
  document.addEventListener('touchstart', startMusicOnInteraction, { once: true });
}

// ── Onboarding ───────────────────────────────────────────────
function initOnboarding() {
  const grid = document.getElementById('onboarding-runes-grid');
  if (!grid) return;
  grid.innerHTML = RUNAS.map(r =>
    `<div class="onboarding-runa" data-id="${r.id}" onclick="selectOnboardingRune('${r.id}')">${r.simbolo}</div>`
  ).join('');
}

function selectOnboardingRune(id) {
  document.querySelectorAll('.onboarding-runa').forEach(el => el.classList.remove('selected'));
  document.querySelector(`.onboarding-runa[data-id="${id}"]`)?.classList.add('selected');
  onboardingRune = id;
  document.getElementById('btn-onboarding-finalizar').disabled = false;
}

// ── Screen Navigation ────────────────────────────────────────
function showScreen(name) {
  document.querySelectorAll('.pantalla').forEach(p => p.classList.remove('activa'));
  const screen = document.getElementById(`pantalla-${name}`);
  if (screen) screen.classList.add('activa');

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('activa', btn.dataset.pantalla === name);
  });

  if (name === 'inicio') renderInicio();
  if (name === 'referencia') renderReferencia();
  if (name === 'diario') renderDiario();
  if (name === 'perfil') renderPerfil();
  if (name === 'onboarding') initOnboarding();
}

// ── Inicio ───────────────────────────────────────────────────
function renderInicio() {
  if (!progreso) progreso = defaultProgreso();
  document.getElementById('user-name').textContent = progreso.nombre || 'Guerrero';
  const runaEsp = RUNAS.find(r => r.id === progreso.runaEspiritu);
  document.getElementById('user-avatar').textContent = runaEsp ? runaEsp.simbolo : 'ᛟ';
  document.getElementById('streak-display').textContent = progreso.streak;
  document.getElementById('xp-display').textContent = progreso.xp;
  document.getElementById('nivel-display').textContent = Math.floor(progreso.xp / 100) + 1;

  const mapa = document.getElementById('mapa-lecciones');
  let html = '';
  LECCIONES.forEach((l, i) => {
    const completada = progreso.leccionesCompletadas.includes(l.id);
    const desbloqueada = i === 0 || progreso.leccionesCompletadas.includes(LECCIONES[i-1].id);
    const aettN = l.aett===1?'Freyr':l.aett===2?'Heimdall':l.aett===3?'Tyr':'Final';
    const premiumBadge = l.premium && !progreso.isPremium ? '<span class="leccion-premium-badge">PRO</span>' : '';

    html += `<div class="leccion-card ${completada?'completada':''} ${desbloqueada?'desbloqueada':'bloqueada'}"
      ${desbloqueada?`onclick="iniciarLeccion('${l.id}')"`:''}>
      <div class="leccion-numero">${completada?'✓':i+1}</div>
      <div class="leccion-info">
        <span class="leccion-aett">Aett ${aettN} ${premiumBadge}</span>
        <h3 class="leccion-titulo">${l.titulo}</h3>
        <p class="leccion-desc">${l.descripcion}</p>
      </div>
      <div class="leccion-estado">
        ${completada?`<span class="leccion-repasar" onclick="event.stopPropagation();iniciarLeccion('${l.id}',true)" title="Repasar">🔄</span>`:desbloqueada?'<span class="leccion-play">▶</span>':'<span class="leccion-lock">🔒</span>'}
      </div>
    </div>`;
  });
  mapa.innerHTML = html;
  renderDesafioDiario();
}

// ── Referencia ───────────────────────────────────────────────
function renderReferencia(filtro = 0) {
  const runas = filtro === 0 ? RUNAS : RUNAS.filter(r => r.aett === filtro);
  const grid = document.getElementById('grid-referencia');
  grid.innerHTML = runas.map(r => `
    <div class="runa-ref" onclick="showRunaDetail('${r.id}')">
      <span class="runa-ref-simbolo">${r.simbolo}</span>
      <span class="runa-ref-nombre">${r.nombre}</span>
      <span class="runa-ref-aett">Aett ${r.aett}</span>
    </div>
  `).join('');
}

function showRunaDetail(id) {
  const r = RUNAS.find(x => x.id === id);
  if (!r) return;
  const aettN = r.aett===1?'Freyr':r.aett===2?'Heimdall':'Tyr';
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-runa-detalle">
      <span class="modal-runa-simbolo">${r.simbolo}</span>
      <h2 class="modal-runa-nombre">${r.nombre}</h2>
      <span class="modal-runa-aett">Aett de ${aettN}</span>
      <p class="modal-runa-significado"><strong>Significado:</strong> ${r.significado}</p>
      <p class="modal-runa-detalle-texto">${r.significado_detallado}</p>
      <div class="modal-runa-consejo"><h4>💡 Consejo</h4><p>${r.consejo}</p></div>
      <div class="modal-runa-info">
        <span class="${r.simetrica?'badge-simetrica':'badge-invertible'}">
          ${r.simetrica?'⚖️ Simétrica — siempre se lee igual':'🔄 Invertible — puede caer merkstave'}
        </span>
      </div>
      <button class="btn-tirada-rapida" onclick="tiradaRapida('${r.id}')">🔮 Tirada rápida</button>
    </div>
  `;
  document.getElementById('modal-runa').classList.remove('hidden');
}

// ── Tirada Rápida ────────────────────────────────────────────
function tiradaRapida(runaId) {
  const r = RUNAS.find(x => x.id === runaId);
  if (!r) return;
  const invertida = !r.simetrica && Math.random() < 0.3;
  document.getElementById('modal-runa').classList.add('hidden');

  const container = document.getElementById('tirada-resultado-container');
  let html = `
    <div class="tirada-resultado-card">
      <span class="tirada-resultado-simbolo">${r.simbolo}</span>
      <h3 class="tirada-resultado-nombre">${r.nombre}${invertida?' (Invertida)':''}</h3>
  `;

  if (invertida) {
    html += `
      <div class="tirada-bloque-lectura">
        <span class="tirada-lectura-tag upright">lectura upright</span>
        <p class="tirada-lectura-texto">${r.significado}</p>
      </div>
      <div class="tirada-bloque-lectura merkstave">
        <span class="tirada-lectura-tag reversed">lectura merkstave (invertida)</span>
        <p class="tirada-lectura-texto">${r.significado_invertido && !r.significado_invertido.includes('(No tiene reversa') ? r.significado_invertido : 'Esta runa no cambia significado al invertirse.'}</p>
      </div>
      <div class="tirada-merkstave-info">
        <strong>¿Qué es Merkstave?</strong> Cuando una runa cae invertida en la tirada, se llama <em>merkstave</em> (del nórdico antiguo: "oscuridad"). Su energía se manifiesta de forma bloqueada, debilitada o distorsionada.
      </div>
    `;
  } else {
    html += `
      <p class="tirada-resultado-significado">${r.significado}</p>
    `;
  }

  html += `
    <div class="tirada-resultado-interp">
      <h4>🔮 Interpretación</h4>
      <p>${r.significado_detallado}</p>
    </div>
    <div class="tirada-resultado-consejo">
      <h4>💡 Consejo</h4>
      <p>${r.consejo}</p>
    </div>
    <button class="btn-primary btn-full" onclick="guardarTirada('${r.id}',${invertida})">💾 Guardar en diario</button>
  </div>`;

  container.innerHTML = html;
  AudioManager.playSfx('correct');
}

function guardarTirada(runaId, invertida) {
  const r = RUNAS.find(x => x.id === runaId);
  if (!r) return;
  const diario = getDiario();
  diario.unshift({ id:Date.now(), fecha:new Date().toLocaleString(), tipo:'Tirada rápida',
    runas:[{nombre:r.nombre, invertida, simbolo:r.simbolo}] });
  setDiario(diario);
  showToast('Lectura guardada en tu diario', 'success');
}

// ── Tirada Screen ────────────────────────────────────────────
let tiradaTipo = 1;

function hacerTirada() {
  if (!progreso.isPremium) {
    const diario = JSON.parse(localStorage.getItem('nova_diario') || '[]');
    const hoy = new Date().toDateString();
    const tiradasHoy = diario.filter(e => new Date(e.fecha).toDateString() === hoy).length;
    if (tiradasHoy >= 1) {
      document.getElementById('modal-premium').classList.remove('hidden');
      return;
    }
  }

  const bolsa = document.getElementById('tirada-bolsa');
  bolsa.classList.add('animating');
  AudioManager.playSfx('levelup');

  setTimeout(() => {
    bolsa.classList.remove('animating');
    const runas = [];
    const usadas = [];
    for (let i = 0; i < tiradaTipo; i++) {
      let idx;
      do { idx = Math.floor(Math.random() * RUNAS.length); } while (usadas.includes(idx));
      usadas.push(idx);
      const r = RUNAS[idx];
      const invertida = !r.simetrica && Math.random() < 0.3;
      runas.push({ ...r, invertida });
    }
    mostrarTiradaResultado(runas);
  }, 600);
}

function mostrarTiradaResultado(runas) {
  const container = document.getElementById('tirada-resultado-container');
  const spread = SPREADS[tiradaTipo] || SPREADS[1];
  const posiciones = spread.posiciones;

  let html = '<div class="tirada-resultado-card">';
  runas.forEach((r, i) => {
    const pos = posiciones[i] || `Runa ${i+1}`;
    html += `
      <div class="tirada-runa-bloque" style="${i<runas.length-1?'border-bottom:1px solid var(--border);padding-bottom:1rem;':''}">
        <span class="tirada-runa-pos">${pos}</span>
        <span class="tirada-resultado-simbolo" style="font-size:3rem;">${r.simbolo}</span>
        <h3 class="tirada-resultado-nombre">${r.nombre}${r.invertida?' (Invertida)':''}</h3>
    `;

    if (r.invertida) {
      html += `
        <div class="tirada-bloque-lectura">
          <span class="tirada-lectura-tag upright">lectura upright</span>
          <p class="tirada-lectura-texto">${r.significado}</p>
        </div>
        <div class="tirada-bloque-lectura merkstave">
          <span class="tirada-lectura-tag reversed">lectura merkstave (invertida)</span>
          <p class="tirada-lectura-texto">${r.significado_invertido && !r.significado_invertido.includes('(No tiene reversa') ? r.significado_invertido : 'Esta runa no cambia significado al invertirse.'}</p>
        </div>
      `;
    } else {
      html += `<p class="tirada-resultado-significado">${r.significado}</p>`;
    }

    html += `
        <div class="tirada-runa-meta">
          ${r.elemento?'<span>Elemento: '+r.elemento+'</span>':''}
          ${r.dios&&r.dios!=='—'?'<span>Dios: '+r.dios+'</span>':''}
          <span>${r.simetrica?'⚖️ Simétrica':'🔄 Invertible'}</span>
        </div>
      </div>
    `;
  });

  // Mostrar info de Merkstave si hay runas invertidas
  const tieneInvertidas = runas.some(r => r.invertida);
  if (tieneInvertidas) {
    html += `
      <div class="tirada-merkstave-info">
        <strong>¿Qué es Merkstave?</strong> Cuando una runa cae invertida en la tirada, se llama <em>merkstave</em> (del nórdico antiguo: "oscuridad"). Su energía se manifiesta de forma bloqueada, debilitada o distorsionada. No es algo "malo" — es una señal de que esa área necesita atención o que hay resistencia interna.
      </div>
    `;
  }

  if (runas.length >= 2 && spread.interpretar) {
    html += `<div class="tirada-resultado-interp">
      <h4>📖 Interpretación del Oráculo</h4>
      <p>${spread.interpretar(runas)}</p>
    </div>`;
  } else if (runas.length === 1) {
    html += `<div class="tirada-resultado-interp">
      <h4>🔮 Consejo</h4>
      <p>${runas[0].consejo}</p>
    </div>`;
  }

  html += `<button class="btn-primary btn-full" onclick="guardarTiradaMultiple()" style="margin-top:1rem;">💾 Guardar en diario</button></div>`;
  container.innerHTML = html;
  document.getElementById('tirada-acciones').innerHTML = '<button class="btn-primary btn-full" onclick="hacerTirada()">🔮 Otra tirada</button>';

  window._ultimaTirada = runas;
}

function guardarTiradaMultiple() {
  const runas = window._ultimaTirada;
  if (!runas) return;
  const diario = getDiario();
  diario.unshift({ id:Date.now(), fecha:new Date().toLocaleString(), tipo:`Tirada ${runas.length} runas`,
    runas: runas.map(r => ({nombre:r.nombre, invertida:r.invertida, simbolo:r.simbolo})) });
  setDiario(diario);
  showToast('Tirada guardada', 'success');
}

// ── Diario ───────────────────────────────────────────────────
function getDiario() {
  return JSON.parse(localStorage.getItem('nova_diario') || '[]');
}

function setDiario(data) {
  localStorage.setItem('nova_diario', JSON.stringify(data));
  if (currentUser) {
    db.collection('diarios').doc(currentUser.uid).set({ entries: data }, { merge: true }).catch(() => {});
  }
}

function renderDiario() {
  const container = document.getElementById('diario-contenido');
  const diario = getDiario();
  if (!diario.length) {
    container.innerHTML = '<p class="diario-vacio">Todavía no guardaste ninguna lectura.<br><span style="font-size:0.8rem;">Hacé una tirada y guardala acá.</span></p>';
    return;
  }
  container.innerHTML = diario.map(e => `
    <div class="diario-entry">
      <div class="diario-header">
        <span class="diario-fecha">${e.fecha}</span>
        <span class="diario-tipo">${e.tipo}</span>
      </div>
      <div class="diario-runas">
        ${e.runas.map(r=>`<span class="diario-runa ${r.invertida?'invertida':''}">${r.simbolo} ${r.nombre}${r.invertida?' (inv)':''}</span>`).join(' ')}
      </div>
      <button class="diario-eliminar" onclick="eliminarDiarioEntry(${e.id})">🗑️</button>
    </div>
  `).join('');
}

function eliminarDiarioEntry(id) {
  const diario = getDiario().filter(e => e.id !== id);
  setDiario(diario);
  renderDiario();
}

async function loadDiarioFromFirestore() {
  if (!currentUser) return;
  try {
    const doc = await db.collection('diarios').doc(currentUser.uid).get();
    if (doc.exists && doc.data().entries) {
      const local = getDiario();
      const remote = doc.data().entries;
      const merged = [...remote, ...local.filter(l => !remote.find(r => r.id === l.id))];
      merged.sort((a, b) => b.id - a.id);
      setDiario(merged);
    }
  } catch(e) {}
}

// ── Perfil ───────────────────────────────────────────────────
function renderPerfil() {
  if (!progreso) progreso = defaultProgreso();
  document.getElementById('perfil-nombre').textContent = progreso.nombre || 'Guerrero';
  const runaEsp = RUNAS.find(r => r.id === progreso.runaEspiritu);
  document.getElementById('perfil-avatar-runa').textContent = runaEsp ? runaEsp.simbolo : 'ᛟ';

  const nivel = Math.floor(progreso.xp / 100) + 1;
  const titulos = ['Ulfhednar','Skald','Völva','Seidr','Goði','Hersir','Jarl','Konungr','Allsherjargoði','Ragnarök'];
  document.getElementById('perfil-titulo').textContent = titulos[Math.min(nivel-1, titulos.length-1)] + (progreso.isPremium?' ✦ Pro':'');

  document.getElementById('perfil-xp').textContent = progreso.xp;
  document.getElementById('perfil-streak').textContent = progreso.streak;
  document.getElementById('perfil-lecciones').textContent = progreso.leccionesCompletadas.length;
  document.getElementById('perfil-runas').textContent = progreso.runasAprendidas.length;

  // Medallas
  document.getElementById('medallas-grid').innerHTML = MEDALLAS.map(m =>
    `<div class="medalla ${progreso.medallas.includes(m.id)?'obtenida':''}" title="${m.desc}">
      <span class="medalla-icono">${m.icono}</span>
      <span class="medalla-nombre">${m.nombre}</span>
    </div>`
  ).join('');

  // Progreso Aett
  const aetts = [
    {id:1,nombre:'Aett de Freyr',runas:RUNAS.filter(r=>r.aett===1)},
    {id:2,nombre:'Aett de Heimdall',runas:RUNAS.filter(r=>r.aett===2)},
    {id:3,nombre:'Aett de Tyr',runas:RUNAS.filter(r=>r.aett===3)}
  ];
  document.getElementById('progreso-aett').innerHTML = aetts.map(a => {
    const aprendidas = a.runas.filter(r => progreso.runasAprendidas.includes(r.id)).length;
    const pct = Math.round((aprendidas / a.runas.length) * 100);
    return `<div class="aett-progreso">
      <div class="aett-progreso-header">
        <span class="aett-progreso-nombre">${a.nombre}</span>
        <span class="aett-progreso-porcentaje">${pct}%</span>
      </div>
      <div class="aett-barra"><div class="aett-fill" style="width:${pct}%"></div></div>
      <span class="aett-info">${aprendidas}/${a.runas.length} runas</span>
    </div>`;
  }).join('');
}

// ── Ejercicios ───────────────────────────────────────────────
function iniciarLeccion(id, practicando = false) {
  const leccion = LECCIONES.find(l => l.id === id);
  if (!leccion) return;

  if (leccion.premium && !progreso.isPremium) {
    document.getElementById('modal-premium').classList.remove('hidden');
    return;
  }

  leccionActual = { ...leccion, practicando };
  ejercicioActual = 0;
  xpGanados = 0;
  respuestasCorrectas = 0;
  totalEjercicios = leccion.ejercicios.length;

  document.getElementById('ejercicio-xp-actual').textContent = practicando ? 'Repaso' : '+0 XP';
  document.getElementById('progreso-ejercicio').style.width = '0%';
  showScreen('ejercicio');
  mostrarEjercicio();
}

function mostrarEjercicio() {
  if (!leccionActual || ejercicioActual >= leccionActual.ejercicios.length) {
    mostrarResultados();
    return;
  }

  const ej = leccionActual.ejercicios[ejercicioActual];
  const container = document.getElementById('ejercicio-contenido');
  document.getElementById('feedback-container').innerHTML = '';
  document.getElementById('btn-siguiente').disabled = true;
  document.getElementById('progreso-ejercicio').style.width = `${(ejercicioActual/totalEjercicios)*100}%`;

  switch(ej.tipo) {
    case 'identificar-runa': {
      const r = RUNAS.find(x=>x.id===ej.runa_id);
      const { opciones, correcta } = shuffleOpciones(ej);
      container.innerHTML = `
        <div class="ejercicio-tipo">Identificar runa</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <div class="runa-grande">${r.simbolo}</div>
        <div class="opciones-grid">
          ${opciones.map((o,i)=>`<button class="opcion-btn-ejercicio" onclick="checkOpcion(this,${i},${correcta})">${o}</button>`).join('')}
        </div>`;
      break;
    }
    case 'significado-runa': {
      const r = RUNAS.find(x=>x.id===ej.runa_id);
      const { opciones, correcta } = shuffleOpciones(ej);
      container.innerHTML = `
        <div class="ejercicio-tipo">Significado</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <div class="runa-grande">${r.simbolo}</div>
        <div class="runa-nombre-grande">${r.nombre}</div>
        <div class="opciones-grid">
          ${opciones.map((o,i)=>`<button class="opcion-btn-ejercicio" onclick="checkOpcion(this,${i},${correcta})">${o}</button>`).join('')}
        </div>`;
      break;
    }
    case 'clase-runa': {
      const r = RUNAS.find(x=>x.id===ej.runa_id);
      const { opciones, correcta } = shuffleOpciones(ej);
      container.innerHTML = `
        <div class="ejercicio-tipo">Clasificación</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <div class="runa-grande">${r.simbolo}</div>
        <div class="runa-nombre-grande">${r.nombre}</div>
        <div class="opciones-grid">
          ${opciones.map((o,i)=>`<button class="opcion-btn-ejercicio" onclick="checkOpcion(this,${i},${correcta})">${o}</button>`).join('')}
        </div>`;
      break;
    }
    case 'verdadero-falso': {
      container.innerHTML = `
        <div class="ejercicio-tipo">Verdadero o Falso</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <div class="vf-container">
          <button class="vf-btn" onclick="checkVF(this,true,${ej.respuesta_correcta})">✅ Verdadero</button>
          <button class="vf-btn" onclick="checkVF(this,false,${ej.respuesta_correcta})">❌ Falso</button>
        </div>`;
      break;
    }
    case 'multiple-choice': {
      const { opciones, correcta } = shuffleOpciones(ej);
      container.innerHTML = `
        <div class="ejercicio-tipo">Multiple Choice</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <div class="opciones-grid">
          ${opciones.map((o,i)=>`<button class="opcion-btn-ejercicio" onclick="checkOpcion(this,${i},${correcta})">${o}</button>`).join('')}
        </div>`;
      break;
    }
    case 'completar-frase': {
      container.innerHTML = `
        <div class="ejercicio-tipo">Completar</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <div class="completar-input-container">
          <input type="text" id="completar-input" class="completar-input" placeholder="Escribí tu respuesta..." autocomplete="off">
          <span class="completar-pista">💡 ${ej.pista}</span>
        </div>`;
      const input = document.getElementById('completar-input');
      input.addEventListener('input', () => {
        document.getElementById('btn-siguiente').disabled = input.value.trim() === '';
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) checkCompletar(ej);
      });
      input.focus();
      break;
    }
    case 'asociar-simbolo': {
      const mezclados = [...ej.pares].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="ejercicio-tipo">Asociar</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <p class="ejercicio-hint">Tocá un nombre, luego tocá su símbolo</p>
        <div class="asociar-container">
          <div class="asociar-runas">
            ${ej.pares.map(p=>{const r=RUNAS.find(x=>x.id===p.runa_id);return`<div class="asociar-runa" data-runaid="${p.runa_id}" onclick="selectAsociarRuna(this)">${r.nombre}</div>`;}).join('')}
          </div>
          <div class="asociar-simbolos">
            ${mezclados.map(p=>`<div class="asociar-simbolo" data-runaid="${p.runa_id}" onclick="asociarSimbolo(this)">${p.simbolo}</div>`).join('')}
          </div>
        </div>`;
      window._asociacionRuna = null;
      break;
    }
    case 'ordenar': {
      const mezclados = [...ej.elementos].sort(() => Math.random() - 0.5);
      container.innerHTML = `
        <div class="ejercicio-tipo">Ordenar</div>
        <h2 class="ejercicio-instruccion">${ej.instruccion}</h2>
        <p class="ejercicio-hint">Tocá un elemento y luego tocar otro para intercambiar posiciones</p>
        <div class="ordenar-container" id="ordenar-container">
          ${mezclados.map((e,i)=>`<div class="ordenar-item" data-valor="${e}" data-idx="${i}" onclick="tapOrdenar(this)"><span class="ordenar-num">${i+1}</span><span class="ordenar-texto">${e}</span><span class="ordenar-swap">⇅</span></div>`).join('')}
        </div>
        <button class="btn-verificar-orden" onclick="verificarOrden()">Verificar orden</button>`;
      window._ordenCorrecto = ej.orden_correcto;
      window._ordenSelected = null;
      break;
    }
  }
}

function checkOpcion(btn, index, correcta) {
  const grid = btn.closest('.opciones-grid');
  grid.querySelectorAll('.opcion-btn-ejercicio').forEach(b => { b.disabled = true; b.classList.remove('seleccionada'); });
  btn.classList.add('seleccionada');

  if (index === correcta) {
    btn.classList.add('correcta');
    showFeedback(true, '¡Correcto! 🎉');
    respuestasCorrectas++;
    xpGanados += 10;
    AudioManager.playSfx('correct');
  } else {
    btn.classList.add('incorrecta');
    grid.children[correcta]?.classList.add('correcta');
    showFeedback(false, 'Incorrecto 😔');
    AudioManager.playSfx('incorrect');
  }
  document.getElementById('ejercicio-xp-actual').textContent = `+${xpGanados} XP`;
  document.getElementById('btn-siguiente').disabled = false;
}

function checkVF(btn, valor, correcto) {
  const container = btn.closest('.vf-container');
  container.querySelectorAll('.vf-btn').forEach(b => { b.disabled = true; });
  btn.classList.add('seleccionada');

  if (valor === correcto) {
    btn.classList.add('correcta');
    showFeedback(true, '¡Correcto! 🎉');
    respuestasCorrectas++;
    xpGanados += 10;
    AudioManager.playSfx('correct');
  } else {
    btn.classList.add('incorrecta');
    showFeedback(false, 'Incorrecto 😔');
    AudioManager.playSfx('incorrect');
  }
  document.getElementById('ejercicio-xp-actual').textContent = `+${xpGanados} XP`;
  document.getElementById('btn-siguiente').disabled = false;
}

function selectAsociarRuna(el) {
  // Deselect all names first
  document.querySelectorAll('.asociar-runa').forEach(r => r.classList.remove('seleccionado'));
  el.classList.add('seleccionado');
  window._asociacionRuna = el.dataset.runaid;
}

function asociarSimbolo(el) {
  if (!window._asociacionRuna) {
    showFeedback(false, 'Primero tocá un nombre de runa');
    return;
  }

  const runaid = el.dataset.runaid;
  const correcto = window._asociacionRuna === runaid;
  const container = document.getElementById('ejercicio-contenido');

  if (correcto) {
    el.classList.add('correcta');
    container.querySelector(`.asociar-runa[data-runaid="${window._asociacionRuna}"]`)?.classList.add('correcta');
    container.querySelector(`.asociar-runa[data-runaid="${window._asociacionRuna}"]`)?.classList.remove('seleccionado');
    respuestasCorrectas++;
    xpGanados += 10;
    AudioManager.playSfx('correct');
  } else {
    el.classList.add('incorrecta');
    container.querySelector(`.asociar-runa[data-runaid="${window._asociacionRuna}"]`)?.classList.add('incorrecta');
    container.querySelector(`.asociar-runa[data-runaid="${window._asociacionRuna}"]`)?.classList.remove('seleccionado');
    AudioManager.playSfx('incorrect');
  }

  window._asociacionRuna = null;
  document.getElementById('ejercicio-xp-actual').textContent = `+${xpGanados} XP`;
  document.getElementById('btn-siguiente').disabled = false;
}

function checkCompletar(ej) {
  const input = document.getElementById('completar-input');
  if (!input) return;
  const respuesta = input.value.trim().toLowerCase();
  input.disabled = true;

  if (respuesta === ej.respuesta_correcta.toLowerCase()) {
    input.classList.add('correcta');
    showFeedback(true, '¡Correcto! 🎉');
    respuestasCorrectas++;
    xpGanados += 10;
    AudioManager.playSfx('correct');
  } else {
    input.classList.add('incorrecta');
    showFeedback(false, `Respuesta: ${ej.respuesta_correcta}`);
    AudioManager.playSfx('incorrect');
  }
  document.getElementById('ejercicio-xp-actual').textContent = `+${xpGanados} XP`;
  document.getElementById('btn-siguiente').disabled = false;
}

function verificarOrden() {
  const container = document.getElementById('ordenar-container');
  const items = [...container.querySelectorAll('.ordenar-item')];
  const orden = items.map(i => i.dataset.valor);
  items.forEach(i => i.draggable = false);

  if (JSON.stringify(orden) === JSON.stringify(window._ordenCorrecto)) {
    showFeedback(true, '¡Orden correcto! 🎉');
    respuestasCorrectas++;
    xpGanados += 10;
    AudioManager.playSfx('correct');
  } else {
    showFeedback(false, `Orden: ${window._ordenCorrecto.join(' → ')}`);
    AudioManager.playSfx('incorrect');
  }
  document.getElementById('ejercicio-xp-actual').textContent = `+${xpGanados} XP`;
  document.getElementById('btn-siguiente').disabled = false;
}

// ── Tap to Swap (ordenar) ──────────────────────────────────
function tapOrdenar(el) {
  const container = document.getElementById('ordenar-container');
  if (!container) return;

  if (window._ordenSelected === null) {
    // Primer tap: seleccionar
    window._ordenSelected = el;
    el.classList.add('seleccionado');
    AudioManager.playSfx('correct');
  } else if (window._ordenSelected === el) {
    // Tap en el mismo: deseleccionar
    el.classList.remove('seleccionado');
    window._ordenSelected = null;
  } else {
    // Segundo tap: intercambiar
    const allItems = [...container.children];
    const idxA = allItems.indexOf(window._ordenSelected);
    const idxB = allItems.indexOf(el);

    if (idxA < idxB) {
      container.insertBefore(el, window._ordenSelected);
      container.insertBefore(window._ordenSelected, allItems[idxB + 1] || null);
    } else {
      container.insertBefore(el, allItems[idxA + 1] || null);
      container.insertBefore(window._ordenSelected, el.nextSibling);
    }

    window._ordenSelected.classList.remove('seleccionado');
    window._ordenSelected = null;

    // Actualizar números
    [...container.children].forEach((item, i) => {
      item.querySelector('.ordenar-num').textContent = i + 1;
      item.dataset.idx = i;
    });

    AudioManager.playSfx('levelup');
  }
}

function showFeedback(correcta, msg) {
  document.getElementById('feedback-container').innerHTML =
    `<div class="feedback ${correcta?'correcto':'incorrecto'}">${correcta?'✅':'❌'} ${msg}</div>`;
}

function siguienteEjercicio() {
  ejercicioActual++;
  mostrarEjercicio();
}

// ── Desafío Diario ──────────────────────────────────────────
function getHoyStr() {
  return new Date().toISOString().split('T')[0];
}

function desafioCompletadoHoy() {
  return progreso.desafioDiario && progreso.desafioDiario.fecha === getHoyStr();
}

function generarEjerciciosDiarios() {
  const runasMezcladas = shuffleArray(RUNAS).slice(0, 5);
  const tipos = ['identificar-runa', 'significado-runa', 'identificar-runa', 'significado-runa', 'multiple-choice'];
  const ejercicios = [];

  runasMezcladas.forEach((r, i) => {
    const tipo = tipos[i];
    if (tipo === 'identificar-runa') {
      const incorrectas = shuffleArray(RUNAS.filter(x => x.id !== r.id)).slice(0, 3).map(x => x.nombre);
      const opciones = shuffleArray([r.nombre, ...incorrectas]);
      ejercicios.push({
        tipo: 'identificar-runa',
        instruccion: '¿Qué runa es esta?',
        runa_id: r.id,
        opciones,
        correcta: opciones.indexOf(r.nombre)
      });
    } else if (tipo === 'significado-runa') {
      const incorrectas = shuffleArray(RUNAS.filter(x => x.id !== r.id)).slice(0, 3).map(x => x.significado.split(',')[0]);
      const opciones = shuffleArray([r.significado.split(',')[0], ...incorrectas]);
      ejercicios.push({
        tipo: 'significado-runa',
        instruccion: `¿Qué significa ${r.nombre}?`,
        runa_id: r.id,
        opciones,
        correcta: opciones.indexOf(r.significado.split(',')[0])
      });
    } else {
      const opciones = ['Simétrica — siempre se lee igual', 'Invertible — puede caer merkstave'];
      ejercicios.push({
        tipo: 'multiple-choice',
        instruccion: `¿${r.nombre} es simétrica o invertible?`,
        opciones,
        correcta: r.simetrica ? 0 : 1
      });
    }
  });

  return ejercicios;
}

function iniciarDesafioDiario() {
  if (desafioCompletadoHoy()) return;

  leccionActual = {
    id: 'desafio-' + getHoyStr(),
    titulo: 'Desafío Diario',
    ejercicios: generarEjerciciosDiarios(),
    runas_ids: [],
    esDesafio: true
  };
  ejercicioActual = 0;
  xpGanados = 0;
  respuestasCorrectas = 0;
  totalEjercicios = leccionActual.ejercicios.length;

  document.getElementById('ejercicio-xp-actual').textContent = '+0 XP';
  document.getElementById('progreso-ejercicio').style.width = '0%';
  showScreen('ejercicio');
  mostrarEjercicio();
}

function renderDesafioDiario() {
  const btn = document.getElementById('btn-desafio-diario');
  const estado = document.getElementById('desafio-estado');
  if (!btn) return;

  if (desafioCompletadoHoy()) {
    btn.classList.add('completado');
    estado.textContent = '✓';
    btn.onclick = null;
  } else {
    btn.classList.remove('completado');
    estado.textContent = '▶';
    btn.onclick = iniciarDesafioDiario;
  }
}

// ── Resultados ───────────────────────────────────────────────
function mostrarResultados() {
  const precision = totalEjercicios > 0 ? Math.round((respuestasCorrectas/totalEjercicios)*100) : 0;

  document.getElementById('resultado-xp').textContent = xpGanados;
  document.getElementById('resultado-precision').textContent = `${precision}%`;
  document.getElementById('resultado-correctas').textContent = `${respuestasCorrectas}/${totalEjercicios}`;

  if (precision === 100) {
    document.getElementById('resultado-icono').textContent = '🏆';
    document.getElementById('resultado-titulo').textContent = '¡Perfecto! ¡Maestro de Runas!';
    progreso.perfectRuns++;
  } else if (precision >= 80) {
    document.getElementById('resultado-icono').textContent = '🎉';
    document.getElementById('resultado-titulo').textContent = '¡Excelente trabajo!';
  } else if (precision >= 60) {
    document.getElementById('resultado-icono').textContent = '👍';
    document.getElementById('resultado-titulo').textContent = '¡Buen intento!';
  } else {
    document.getElementById('resultado-icono').textContent = '💪';
    document.getElementById('resultado-titulo').textContent = '¡Seguí practicando!';
  }

  // Update progreso (skip in practice mode)
  if (!leccionActual.practicando) {
    progreso.xp += xpGanados;
  }

  // Handle daily challenge
  if (leccionActual.esDesafio) {
    progreso.desafioDiario = { fecha: getHoyStr(), completado: true, precision };
    if (precision === 100) {
      progreso.xp += 50; // bonus XP for perfect daily
    }
  } else if (!leccionActual.practicando) {
    if (!progreso.leccionesCompletadas.includes(leccionActual.id)) {
      progreso.leccionesCompletadas.push(leccionActual.id);
    }
    leccionActual.runas_ids.forEach(id => {
      if (!progreso.runasAprendidas.includes(id)) progreso.runasAprendidas.push(id);
    });
  }

  // Check aetts
  [1,2,3].forEach(a => {
    const runasAett = RUNAS.filter(r => r.aett === a).map(r => r.id);
    progreso.aettCompletada[a] = runasAett.every(id => progreso.runasAprendidas.includes(id));
  });

  // Streak
  const hoy = new Date().toDateString();
  if (progreso.ultimoDiaPracticado !== hoy) {
    progreso.streak++;
    progreso.ultimoDiaPracticado = hoy;
  }

  // Check medallas
  const nuevas = [];
  MEDALLAS.forEach(m => {
    if (!progreso.medallas.includes(m.id) && m.req(progreso)) {
      progreso.medallas.push(m.id);
      nuevas.push(m);
    }
  });

  if (nuevas.length) {
    document.getElementById('resultado-medallas').innerHTML = nuevas.map(m =>
      `<div class="medalla-nueva">${m.icono} ¡Nueva medalla: ${m.nombre}!</div>`
    ).join('');
  } else {
    document.getElementById('resultado-medallas').innerHTML = '';
  }

  saveProgreso();
  AudioManager.playSfx('complete');
  showScreen('resultado');
}

// ── Settings ─────────────────────────────────────────────────
function initSettings() {
  document.getElementById('setting-sfx').checked = AudioManager.sfxEnabled;
  document.getElementById('setting-music').checked = AudioManager.musicEnabled;

  document.getElementById('setting-sfx').addEventListener('change', () => AudioManager.toggleSfx());
  document.getElementById('setting-music').addEventListener('change', () => {
    AudioManager.toggleMusic();
    if (AudioManager.musicEnabled) AudioManager.playMusic();
  });

  // Notificación diaria
  const notifSetting = document.getElementById('setting-notifications');
  if (notifSetting) {
    notifSetting.checked = localStorage.getItem('nova_notif') === 'true';
    notifSetting.addEventListener('change', () => {
      if (notifSetting.checked) {
        requestNotificationPermission();
      } else {
        localStorage.setItem('nova_notif', 'false');
      }
    });
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showToast('Las notificaciones no son soportadas en este navegador', 'info');
    return;
  }
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      localStorage.setItem('nova_notif', 'true');
      showToast('Notificaciones activadas 🔔', 'success');
      scheduleDailyRune();
    } else {
      localStorage.setItem('nova_notif', 'false');
      document.getElementById('setting-notifications').checked = false;
      showToast('Permiso de notificaciones denegado', 'info');
    }
  });
}

function scheduleDailyRune() {
  if (localStorage.getItem('nova_notif') !== 'true') return;
  const now = new Date();
  const target = new Date();
  target.setHours(9, 0, 0, 0); // 9:00 AM
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target - now;
  setTimeout(() => {
    sendDailyRuneNotification();
    scheduleDailyRune(); // reprogram for next day
  }, delay);
}

function sendDailyRuneNotification() {
  if (Notification.permission !== 'granted') return;
  const rune = RUNAS[Math.floor(Math.random() * RUNAS.length)];
  new Notification('Nova Runas — Tu runa del día', {
    body: `${rune.simbolo} ${rune.nombre}: ${rune.significado}`,
    icon: 'img/icon.svg',
    tag: 'nova-daily-rune',
    renotify: true
  });
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  createFloatingRunes('floating-runes', 20);
  createFloatingRunes('floating-runes-home', 12);

  // Loading screen
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
  }, 800);

  // Auth
  handleRedirectResult();
  initAuth();
  initSettings();

  // Event listeners
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.pantalla));
  });

  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activa'));
      btn.classList.add('activa');
      renderReferencia(parseInt(btn.dataset.aett));
    });
  });

  // Login events
  document.getElementById('btn-login-email')?.addEventListener('click', () => {
    loginWithEmail(document.getElementById('login-email').value, document.getElementById('login-password').value);
  });
  document.getElementById('btn-register-email')?.addEventListener('click', () => {
    registerWithEmail(
      document.getElementById('register-name').value,
      document.getElementById('register-email').value,
      document.getElementById('register-password').value
    );
  });
  document.getElementById('btn-login-google')?.addEventListener('click', loginWithGoogle);
  document.getElementById('btn-saltar-login')?.addEventListener('click', () => {
    progreso = loadProgreso();
    if (!progreso.nombre || progreso.nombre === 'Guerrero') showScreen('onboarding');
    else { showScreen('inicio'); AudioManager.init(); }
  });
  document.getElementById('btn-show-register')?.addEventListener('click', () => {
    document.getElementById('login-email-section').classList.add('hidden');
    document.getElementById('register-section').classList.remove('hidden');
  });
  document.getElementById('btn-show-login')?.addEventListener('click', () => {
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('login-email-section').classList.remove('hidden');
  });

  // Onboarding
  document.getElementById('btn-onboarding-next')?.addEventListener('click', () => {
    const nombre = document.getElementById('onboarding-nombre').value.trim();
    if (nombre) {
      progreso.nombre = nombre;
      document.getElementById('onboarding-step-1').classList.add('hidden');
      document.getElementById('onboarding-step-2').classList.remove('hidden');
    }
  });
  document.getElementById('btn-onboarding-finalizar')?.addEventListener('click', () => {
    if (onboardingRune) progreso.runaEspiritu = onboardingRune;
    saveProgreso();
    showScreen('inicio');
    AudioManager.init();
  });

  // Modal closes
  document.getElementById('modal-cerrar')?.addEventListener('click', () => document.getElementById('modal-runa').classList.add('hidden'));
  document.getElementById('modal-premium-cerrar')?.addEventListener('click', () => document.getElementById('modal-premium').classList.add('hidden'));
  document.getElementById('modal-settings-cerrar')?.addEventListener('click', () => document.getElementById('modal-settings').classList.add('hidden'));
  document.getElementById('modal-runa')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) e.target.classList.add('hidden'); });
  document.getElementById('modal-premium')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) e.target.classList.add('hidden'); });
  document.getElementById('modal-settings')?.addEventListener('click', (e) => { if (e.target === e.currentTarget) e.target.classList.add('hidden'); });

  // Exercise navigation
  document.getElementById('btn-volver-leccion')?.addEventListener('click', () => {
    if (confirm('¿Salir de la lección? Perderás el progreso.')) showScreen('inicio');
  });
  document.getElementById('btn-siguiente')?.addEventListener('click', siguienteEjercicio);
  document.getElementById('btn-continuar')?.addEventListener('click', () => showScreen('inicio'));

  // Tirada
  document.getElementById('btn-tirada-diaria')?.addEventListener('click', () => showScreen('tirada'));
  document.getElementById('btn-hacer-tirada')?.addEventListener('click', hacerTirada);
  document.querySelectorAll('.tirada-tipo').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tirada-tipo').forEach(b => b.classList.remove('activa'));
      btn.classList.add('activa');
      tiradaTipo = parseInt(btn.dataset.tipo);
    });
  });

  // Music toggle
  document.getElementById('btn-music-toggle')?.addEventListener('click', () => {
    const on = AudioManager.toggleMusic();
    document.getElementById('btn-music-toggle').textContent = on ? '🔊' : '🔇';
  });

  // Settings
  document.getElementById('btn-settings')?.addEventListener('click', () => {
    document.getElementById('modal-settings').classList.remove('hidden');
  });

  // Profile
  document.getElementById('btn-credits')?.addEventListener('click', () => showScreen('credits'));
  document.getElementById('btn-credits-back')?.addEventListener('click', () => showScreen('perfil'));
  document.getElementById('btn-logout')?.addEventListener('click', logout);
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    if (confirm('¿Resetear todo el progreso?')) {
      progreso = defaultProgreso();
      saveProgreso();
      renderPerfil();
      showToast('Progreso reseteado', 'info');
    }
  });

  // Premium
  document.getElementById('btn-gumroad')?.addEventListener('click', () => {
    window.open('https://exekiel2.gumroad.com/l/RUNES', '_blank');
  });

  // Enter key on login
  document.getElementById('login-password')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('btn-login-email').click();
  });
});

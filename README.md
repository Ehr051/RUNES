# Nova Runas v2.0 — Aprendé Runas Vikingas

App educativa tipo Duolingo para aprender las 24 runas del Elder Futhark. Estilo nórdico con personalidad propia.

## Características

### Aprendizaje
- **10 lecciones progresivas**: desde primeros pasos hasta maestro de runas
- **7 tipos de ejercicios**: identificar runas, significados, asociar símbolos, completar frases, clasificar, verdadero/falso, ordenar
- **24 runas del Elder Futhark** con significados detallados, interpretaciones invertidas, elementos y deidades asociadas
- **Referencia completa**: consulta cualquier runa con filtro por aett
- **3 tipos de tirada**: Runa Guía (1), Pasado/Presente/Futuro (3), Cruz Nórdica (5)
- **Interpretaciones automáticas**: el oráculo genera texto según las runas tiradas
- **Lectura dual en tiradas**: cuando una runa cae invertida (merkstave), muestra AMBAS interpretaciones (upright + merkstave) para que el usuario aprenda

### Gamificación
- **Sistema de XP**: ganá experiencia con cada ejercicio (+10 XP por correcta)
- **Rachas diarias**: mantené tu racha de práctica
- **12 medallas**: desbloqueá logros especiales
- **Progreso por aett**: seguí tu avance en cada grupo de runas

### Personalidad Nórdica
- Fondo con runas flotantes animadas (24 caracteres rúnicos)
- Efectos de sonido generados con Web Audio API (correct/incorrect/levelup/complete)
- Tema visual oscuro (#0f1119) con detalles dorados (#c9a84c)
- Animaciones: runeGlow, runeReveal, bolsaShake, bounceIn, slideUp
- Loading screen con runa animada y barra de progreso
- Fondo con patrón sutil de grilla nórdica

### Sistema de Usuarios
- **Firebase Auth**: login con Google o email/password
- **Sincronización en la nube**: progreso guardado en Firestore
- **Onboarding**: elegir nombre de guerrero/a y runa espíritu
- **Perfil con estadísticas y medallas**
- **Modo offline**: funciona con localStorage como fallback

### Monetización (Freemium)
- **Gratis**: 3 primeras lecciones + 1 tirada diaria
- **Pro ($3.99 USD lifetime)**: todas las lecciones, tiradas ilimitadas, sin anuncios
- **Gumroad/LemonSqueezy**: links de pago externos

## Estructura

```
nova_runas_vikingas/
├── index.html          # Interfaz principal (~468 líneas)
│   ├── 10 pantallas: login, onboarding, inicio, referencia, tirada, diario, perfil, ejercicio, resultado, credits
│   ├── 4 modales: runa detail, premium, settings, toast
│   └── Scripts: Firebase 10.12.0 (compat)
├── styles.css          # Estilos con personalidad nórdica (~2500 líneas)
│   ├── Variables CSS (colores, spacing, shadows)
│   ├── Responsive: mobile, tablet (768px), desktop (1024px), large desktop (1400px)
│   └── Animaciones: runeGlow, floatRune, bolsaShake, slideUp, etc.
├── script.js           # Lógica completa (~1204 líneas)
│   ├── Firebase Auth + Firestore
│   ├── 24 RUNAS (con significado_detallado, significado_invertido, elemento, dios)
│   ├── 10 LECCIONES (con ejercicios tipados)
│   ├── 3 SPREADS (tiradas con interpretar())
│   ├── 12 MEDALLAS
│   ├── AudioManager (Web Audio API)
│   └── Gamificación (XP, streak, medallas)
├── runas.json          # Datos de las 24 runas (referencia)
├── lecciones.json      # Definición de lecciones (referencia)
├── audio/
│   └── ambient-norse.mp3  # Placeholder (0 bytes — reemplazar)
└── README.md
```

## Configuración — PENDIENTES DE COMPLETAR

### 1. Firebase (REQUERIDO)
Reemplazar la config placeholder en `script.js` línea 6-13:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",           // ← Reemplazar
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

Pasos:
1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication → Email/Password + Google
3. Habilitar Firestore Database
4. En Authentication → Settings → Authorized domains, agregar tu dominio

### 2. Gumroad / Monetización (REQUERIDO)
Reemplazar el link placeholder en `script.js` línea 1197:

```javascript
window.open('TU_LINK_GUMROAD', '_blank');
```

Pasos:
1. Crear cuenta en [Gumroad](https://gumroad.com) o [LemonSqueezy](https://lemonsqueezy.com)
2. Crear producto: "Nova Runas Pro — $3.99 USD"
3. Copiar el link de venta
4. Pegarlo en script.js donde dice `YOUR_GUMROAD_LINK`

### 3. Audio (RECOMENDADO)
El archivo `audio/ambient-norse.mp3` está vacío (0 bytes). Opciones:
- **Opción A**: Descargar una pista ambient nórdica de [Freesound.org](https://freesound.org) (Creative Commons)
- **Opción B**: Generar con IA (Suno, Udio)
- **Opción C**: Dejar sin música (los SFX de Web Audio API funcionan igual)

### 4. Dominio y Hosting
Opciones para deploy:
- **GitHub Pages**: Gratis, `username.github.io/nova-runas`
- **Netlify**: Gratis, deploy automático desde git
- **Vercel**: Gratis para proyectos personales
- **Firebase Hosting**: Gratis con proyecto Firebase

## Modelo de Monetización — Cómo Hacer Plata

### Opción 1: Freemium con Gumroad (RECOMENDADA — más simple)

**Cómo funciona:**
- Los usuarios usan la app gratis (3 lecciones + 1 tirada/día)
- Cuando quieren desbloquear todo, hacen clic en "Desbloquear Pro"
- Se abre Gumroad en nueva pestaña
- Pagan $3.99 USD con tarjeta o PayPal
- Gumroad te envía el link de activación
- El usuario activa su cuenta Pro

**Para que esto funcione necesitás:**
1. Crear producto en Gumroad ($3.99)
2. Usar **Gumroad Memberships** o **License Keys** para generar códigos
3. Cuando alguien paga, Gumroad le da un código
4. Agregar una pantalla en la app para ingresar el código
5. Guardar `isPremium: true` en Firestore cuando el código sea válido

**Alternativa más simple:** Vender acceso directo sin código — el usuario te manda el comprobante de pago y vos le activás la cuenta manualmente (funciona al principio cuando hay pocos usuarios).

**Gumroad se queda:** ~10% + fees de procesamiento. En $3.99, te quedan ~$3.40.

### Opción 2: Ads (Google AdSense)

**Cómo funciona:**
- Mostrar banners o interstitials entre lecciones
- Cobrar por impresiones (CPM) o clics (CPC)

**Pros:**
- No necesitás que el usuario pague
- Funciona con tráfico

**Contras:**
- Necesitás mucho tráfico para ganar plata ($1-5 CPM = $1-5 por cada 1000 vistas)
- Rompe la experiencia del usuario
- No es ideal para apps educativas

**Cuándo usarlo:** Cuando tengas +10,000 usuarios activos/mes.

### Opción 3: Donaciones (Buy Me a Coffee / Ko-fi)

**Cómo funciona:**
- Agregar un botón "Inviciname un café" en la app
- Los usuarios que quieran, tedonan $3-5

**Pros:**
- Sin fricción
- El usuario decide si paga

**Contras:**
- Muy poca conversión (~0.1-1%)
- Ingresos impredecibles

### Opción 4: Contenido Premium Avanzado

**Cómo funciona:**
- Versión gratis: Elder Futhark (24 runas)
- Versión paga: Añadir Futhark Nuevo, Runas de la Bruja, interpretaciones avanzadas, lecturas personalizadas con IA

**Precio:** $4.99-9.99 USD
**Pros:** Más valor = más disposición a pagar

### Opción 5: Merch y Products Físicos

**Cómo funciona:**
- Vender stickers de runas, posters, frascos con runas, etc.
- Usar Printful/Printify + Shopify o Gumroad

**Pros:** Margen bueno, el producto es el diseño
**Contras:** Logística, devoluciones

### Recomendación para empezar:

1. **Mes 1-2**: Lanzar con Gumroad ($3.99), sin ads
2. **Mes 3-4**: Agregar botón de donación
3. **Mes 5+**: Si tenés +5000 usuarios, considerar ads sutiles
4. **Mes 6+**: Agregar contenido premium (más runas, IA)

**Meta realista:**
- 100 usuarios Pro = $340 USD (neto)
- 500 usuarios Pro = $1,700 USD
- 1000 usuarios Pro = $3,400 USD

## Bugs Corregidos (v2.0.1)

- [x] Texto garbled en Nauthiz (`significado_detallado`)
- [x] Clase CSS `leccion-premium-badge` faltante
- [x] `AudioManager.playSfx()` creaba un AudioContext nuevo por cada llamada — ahora reutiliza
- [x] `progreso` podía ser null al inicio — ahora inicializa con `defaultProgreso()`
- [x] `renderInicio()` y `renderPerfil()` sin null-safety
- [x] SPREADS.interpretar() no se usaba en tiradas — ahora integrado
- [x] `significado_invertido` no se mostraba en tiradas — ahora visible
- [x] Modal settings no se cerraba al hacer click afuera
- [x] Selector de tipo de tirada no actualizaba `tiradaTipo`
- [x] Merkstave solo mostraba "⚠️ Merkstave" sin explicar — ahora muestra lectura upright + merkstave + explicación educativa

## Pendientes / TODO

### Bugs Pendientes
- [ ] Firebase config es placeholder — necesita proyecto real
- [ ] Gumroad link es placeholder
- [ ] Audio `ambient-norse.mp3` está vacío (0 bytes)
- [ ] Drag & Drop no funciona en mobile (necesita touch events)
- [ ] Diario solo se guarda en localStorage (no sincroniza a Firestore)

### Optimizaciones
- [ ] Agregar Service Worker para offline
- [ ] Agregar PWA manifest para instalación
- [ ] Lazy loading de pantallas no usadas
- [ ] Minificar CSS/JS para producción
- [ ] Usar Map en vez de Array.find() para RUNAS (performance)
- [ ] Agregar meta tags Open Graph para compartir

### Features Nuevas
- [ ] Exportar diario a JSON/PDF
- [ ] Compartir tirada en redes sociales
- [ ] Notificación push diaria ("Sacá tu runa del día")
- [ ] Tema claro/oscuro toggle
- [ ] Búsqueda en referencia de runas
- [ ] Runa del día automática
- [ ] Lecciones de interpretación avanzada
- [ ] Integración con IA para interpretaciones personalizadas
- [ ] Sistema de códigos de activación Pro (para Gumroad)
- [ ] Tutorial interactivo para nuevos usuarios
- [ ] Sonido de ambiente (viento, fuego, etc.)
- [ ] Vibración en respuestas correctas/incorrectas
- [ ] Logros compartibles (share buttons)
- [ ] Ranking/leaderboard (con Firebase)
- [ ] Modo oscuro/claro

## Tecnologías

- HTML5, CSS3, JavaScript ES6+ (vanilla — sin frameworks)
- Firebase Auth + Firestore (compat mode)
- Web Audio API (efectos de sonido)
- Google Fonts: Cinzel Decorative + Inter
- Diseño responsive (mobile-first, breakpoints: 380/768/1024/1400px)
- localStorage (fallback offline)

## Licencia

MIT License © 2026

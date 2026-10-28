# Pablo Gómez | Sitio web oficial — Frontend Portfolio Project

**ES:** Sitio web multipágina para la presencia digital de un artista musical, construido con HTML5, SCSS, JavaScript modular y Vite. Incluye biografía, eventos, galería y componentes interactivos.

**EN:** Multi-page website for a music artist's digital presence, built with semantic HTML, modular SCSS, vanilla JavaScript and Vite. Includes biography, events, gallery and interactive components.

**Estado / Status:** Prototipo frontend en desarrollo; no publicado. Los eventos, métricas sociales y las reservas son demostraciones. / Frontend prototype in development, not deployed. Events, social metrics and booking are demo-only.

**Tecnologías / Stack:** `HTML5` · `SCSS` · `JavaScript (ES Modules)` · `Vite` · `LocalStorage`

**[Código fuente / Source code](https://github.com/PabloGomezCr/pablogomezweboficial)**

## Inicio rápido / Quick start

```bash
git clone https://github.com/PabloGomezCr/pablogomezweboficial.git
cd pablogomezweboficial
npm install
npm run dev
```

El servidor de desarrollo mostrará una dirección local (normalmente `http://localhost:5173`). Para generar una versión de compilación local: `npm run build`.

## Descripción detallada

Sitio web estático multipágina para la presencia digital oficial de **Pablo Gómez**. La propuesta combina una estética editorial premium en negro, blanco y dorado con una experiencia moderna, responsive y accesible.

El proyecto utiliza únicamente cuatro páginas HTML:

- `index.html`
- `biografia.html`
- `eventos.html`
- `galeria.html`

## Objetivo

Crear una base profesional para un artista musical que pueda crecer posteriormente con contenido real, fotografías, videos, eventos, enlaces sociales, analítica, backend y servicios oficiales.

El proyecto actual es un **prototipo frontend listo para personalizar**.

## Tecnologías

- HTML5 semántico.
- SCSS modular.
- CSS compilado por Vite mediante Dart Sass.
- JavaScript vanilla con ES Modules.
- LocalStorage.
- Git.
- Markdown.

No utiliza React, Vue, Angular, jQuery, Bootstrap ni Tailwind.

## Páginas

### Inicio

`index.html`

Incluye:

- Navbar flotante tipo isla dinámica.
- Buscador global.
- Hero con video local de placeholder.
- Métricas sociales con fallback.
- Carrusel de videos en vivo.
- Modal de video con transición inspirada en un efecto Genie.
- Footer global.

### Biografía

`biografia.html`

Contiene tres bloques editables:

1. **EL INICIO**
2. **EL PROCESO**
3. **PABLO GÓMEZ**

Cada bloque utiliza una imagen vertical 9:16 y texto placeholder para reemplazar desde Visual Studio Code.

### Eventos

`eventos.html`

Incluye:

- Eventos de demostración.
- Estados automáticos según fecha.
- Filtros: Hoy, Esta semana, Este mes, Próximos, Pasados y Todos.
- Destaque automático del evento más próximo.
- Formulario de booking.
- Validación de fechas pasadas y ocupadas.
- Persistencia demo mediante LocalStorage.

### Galería

`galeria.html`

Incluye:

- Tres cards por fila en escritorio.
- Dos cards en tablet.
- Una card en móvil.
- Imagen vertical 9:16.
- Descripción.
- Fotógrafo.
- Lugar.
- Hover con destello de 0.3 segundos.
- Modal individual de fotografía.

## Estructura

```text
pablo-gomez-oficial/
├── index.html
├── biografia.html
├── eventos.html
├── galeria.html
├── css/
│   └── styles.css
├── scss/
│   ├── main.scss
│   ├── abstracts/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   └── _functions.scss
│   ├── base/
│   │   ├── _reset.scss
│   │   ├── _typography.scss
│   │   └── _global.scss
│   ├── components/
│   │   ├── _navbar.scss
│   │   ├── _buttons.scss
│   │   ├── _cards.scss
│   │   ├── _modal.scss
│   │   ├── _search.scss
│   │   ├── _carousel.scss
│   │   └── _footer.scss
│   ├── layout/
│   │   ├── _header.scss
│   │   ├── _hero.scss
│   │   ├── _grid.scss
│   │   └── _sections.scss
│   └── pages/
│       ├── _home.scss
│       ├── _biografia.scss
│       ├── _eventos.scss
│       └── _galeria.scss
├── js/
│   ├── app.js
│   ├── modules/
│   │   ├── navbar.js
│   │   ├── search.js
│   │   ├── carousel.js
│   │   ├── modal.js
│   │   ├── events.js
│   │   ├── gallery.js
│   │   └── storage.js
│   └── services/
│       └── social-api.js
├── assets/
│   ├── images/
│   │   ├── hero/
│   │   ├── biography/
│   │   ├── gallery/
│   │   ├── events/
│   │   └── placeholders/
│   ├── videos/
│   │   ├── hero/
│   │   └── live/
│   ├── icons/
│   └── fonts/
├── robots.txt
├── sitemap.xml
├── README.md
└── .gitignore
```

## Instalación

Para desarrollo y compilación de producción se utiliza Vite.

1. Descarga o clona el proyecto.
2. Ejecuta `npm install` para instalar las dependencias en `node_modules`.
3. Ejecuta `npm run dev` para iniciar el servidor local con actualización en caliente.

Los cambios en HTML, JavaScript y los archivos dentro de `scss/` se reflejan
automáticamente en el navegador. Para desarrollar, abre siempre la dirección que
muestra Vite (normalmente `http://localhost:5173`) y no los archivos de `build/`.

Se recomienda utilizar servidor local porque JavaScript está organizado con **ES Modules**.

## Ejecución

Desde la carpeta del proyecto:

```bash
npm run dev
```

Abre la URL que muestra la terminal (normalmente):

```text
http://localhost:5173
```

Mantén ese proceso activo mientras editas. Vite vigila los cambios y actualiza
los estilos automáticamente. Los HTML fuente enlazan SCSS, por lo que abrirlos
directamente o servirlos con Live Server o Python no compila sus estilos.

## Build de producción

Genera la versión optimizada del sitio con:

```bash
npm run build
```

El resultado listo para publicar queda en `build/`. Para revisarlo localmente:

```bash
npm run preview
```

## Compilación de SCSS

Vite compila `scss/main.scss` con la dependencia `sass` tanto en desarrollo
como al crear el build. Se utiliza este compilador para evitar el bloqueo
reproducido con `sass-embedded` en esta instalación.

Edita los archivos de `scss/`: `main.scss` importa los módulos de componentes,
layouts y páginas. `npm run dev` incorpora el watch y la actualización en
caliente; no hace falta ejecutar otro watch ni configurar pipes de Gulp.

`css/styles.css` es una copia antigua que los HTML actuales no cargan.
Modificarla no cambia el sitio. En producción, Vite genera y enlaza el CSS
optimizado dentro de `build/assets/`.

`npm run preview` sirve el último build y no recompila cambios: ejecuta
`npm run build` otra vez para actualizarlo. Después de cambiar dependencias,
detén el servidor anterior con `Ctrl+C` y vuelve a ejecutar `npm run dev`.

## Recursos multimedia

El proyecto incluye recursos locales de demostración generados específicamente como placeholders:

- Hero poster.
- Video placeholder para Hero.
- Tres videos placeholder para Live Performances.
- Tres imágenes verticales para Biografía.
- Seis imágenes verticales para Galería.
- Imagen placeholder para Eventos.
- Iconos SVG locales.

Reemplaza estos archivos conservando los mismos nombres o actualizando sus rutas en HTML/JavaScript.

### Recomendaciones

- Fotografías: WebP o AVIF.
- Hero poster: 1600×900 o superior.
- Biografía/Galería: relación 9:16.
- Video Hero: MP4/WebM optimizado.
- Videos en vivo: comprimir antes de producción.

## LocalStorage

Se utiliza únicamente donde aporta valor al prototipo.

Claves generadas:

```text
pg_booking_requests
pg_social_cache
pg_search_history
pg_event_preferences
```

### Importante

El booking actual guarda información en el navegador del visitante.

**No debe utilizarse así en producción para solicitudes reales.**

Para producción debe conectarse a un backend seguro o servicio especializado.

## API de redes sociales

El archivo:

```text
js/services/social-api.js
```

está preparado para recibir datos desde un endpoint seguro.

El HTML incluye:

```html
<meta name="social-api-endpoint" content="">
```

Mientras ese campo esté vacío, el sistema utiliza datos demo o caché local.

### Formato esperado del endpoint

```json
{
  "instagram": {
    "followers": 10000
  },
  "tiktok": {
    "followers": 20000
  },
  "updatedAt": "2026-08-13T12:00:00Z"
}
```

## Seguridad de credenciales

Nunca coloques tokens privados de Instagram, TikTok u otros servicios directamente en:

```javascript
const token = "TOKEN_PRIVADO";
```

El navegador expone el JavaScript al visitante.

Si una API requiere:

- Client secret.
- Access token privado.
- API secret.

utiliza:

- Backend.
- Serverless Function.
- Proxy seguro.

El frontend debe consultar únicamente un endpoint público controlado por tu propia aplicación.

## Responsive

La interfaz está preparada para:

- 320 px.
- 375 px.
- 430 px.
- 768 px.
- 1024 px.
- 1440 px.
- Pantallas superiores.

Incluye:

- Navbar adaptable.
- Grid responsive.
- Carrusel horizontal.
- Filtros de eventos desplazables en móvil.
- Galería 3/2/1.
- Footer apilado.
- Formularios responsive.

## Accesibilidad

Se incorporan:

- HTML semántico.
- Un H1 por página.
- `lang="es"`.
- Estados `focus-visible`.
- Navegación mediante teclado.
- Escape para cerrar modales y buscador.
- Alt text.
- Labels de formularios.
- Contraste elevado.
- `prefers-reduced-motion`.

## SEO

Cada página incluye:

- Title único.
- Meta description específica.
- Canonical placeholder.
- Open Graph.
- Twitter Card.
- Jerarquía de encabezados.
- Enlazado interno.
- Imágenes con dimensiones y alt text.
- JSON-LD básico verificable.
- `robots.txt`.
- `sitemap.xml`.

### Datos estructurados

Inicio incluye:

- `Person`
- `WebSite`

Las páginas secundarias incluyen:

- `BreadcrumbList`

No se generó `Event` estructurado para eventos demo porque no deben publicarse como eventos reales.

## SEO antes de producción

- [ ] Configurar el dominio definitivo.
- [ ] Reemplazar todos los valores `TU-DOMINIO.com`.
- [ ] Actualizar canonical de cada página.
- [ ] Actualizar Open Graph con URLs reales.
- [ ] Generar sitemap definitivo.
- [ ] Registrar el sitio en Google Search Console.
- [ ] Enviar el sitemap.
- [ ] Verificar indexación.
- [ ] Sustituir todos los placeholders por contenido original.
- [ ] Optimizar imágenes a WebP/AVIF.
- [ ] Comprimir videos.
- [ ] Revisar Core Web Vitals.
- [ ] Validar datos estructurados.
- [ ] Añadir eventos reales y verificables.
- [ ] Mantener agenda y biografía actualizadas.
- [ ] Crear contenido original útil para búsquedas relacionadas con Pablo Gómez.
- [ ] Obtener menciones y backlinks legítimos de medios, venues y organizaciones relevantes.
- [ ] Evitar keyword stuffing.
- [ ] Revisar accesibilidad antes de publicar.

Ninguna implementación puede garantizar el primer lugar en Google. El posicionamiento depende también de contenido, autoridad, competencia, comportamiento de búsqueda y mantenimiento.

## Performance

La estructura está pensada para reducir problemas de:

- Largest Contentful Paint.
- Interaction to Next Paint.
- Cumulative Layout Shift.

Antes de producción:

- Reduce el peso del video Hero.
- Declara dimensiones de imágenes.
- Evita cargar multimedia innecesaria.
- Mantén JavaScript ligero.
- Utiliza caché del servidor/CDN.
- Mide con Lighthouse y PageSpeed Insights.

## Personalización

### Biografía

Edita directamente:

```text
biografia.html
```

Busca:

```text
[AGREGAR AQUÍ ...]
```

### Eventos

Edita:

```text
js/modules/events.js
```

Reemplaza los eventos demo por datos reales.

### Galería

Edita:

```text
js/modules/gallery.js
```

Actualiza:

- `src`
- `alt`
- `description`
- `photographer`
- `location`

También puedes usar `admin.html` para agregar, editar y eliminar fotografías localmente. La clave demostrativa inicial es `PG2026`. Los cambios se guardan en el navegador y las imágenes deben pesar menos de 1.5 MB.

> El panel local sirve para prototipado, pero no sustituye autenticación ni almacenamiento seguros. Para producción, conecta el CRUD a un backend con usuarios, sesiones y permisos administrados en el servidor.

### Redes sociales

Revisá las referencias a WhatsApp en las páginas HTML y configurá únicamente el contacto público que desees mostrar. No incluyas números privados en archivos del repositorio.

### Buscador

Edita el índice dentro de:

```text
js/modules/search.js
```

## Git

Inicio recomendado:

```bash
git init
git add .
git commit -m "chore: crear estructura inicial del sitio oficial"
```

Ejemplos de ramas:

```text
feat-home
feat-biografia
feat-eventos
feat-galeria
feat-seo
```

Ejemplos de Conventional Commits:

```text
feat(home): agregar hero y carrusel de videos
feat(eventos): implementar filtros y booking
feat(galeria): agregar modal de fotografías
docs: documentar configuración SEO
fix(navbar): corregir navegación móvil
```

## Limitaciones actuales

- Las métricas sociales son demo hasta configurar un endpoint seguro.
- El booking utiliza LocalStorage y no envía solicitudes reales.
- Las fotografías, biografía, redes y datos de eventos son placeholders.
- Canonical, Open Graph, sitemap y dominio deben actualizarse antes de producción.
- Los eventos de demostración no deben publicarse como datos reales.
- No existe backend.

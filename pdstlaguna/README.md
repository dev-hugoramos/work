# PDST Laguna — Sitio Web

Sitio de marketing para **PDST Laguna S.A.S. de C.V.**, empresa de servicios/reventa de TI en Gómez
Palacio, Durango, México. Cubre venta de equipo de cómputo, videovigilancia CCTV, cableado estructurado,
redes empresariales, soporte técnico, impresión y distribución de Microsip.

Sitio estático, sin backend y sin build step — se sirve directamente con XAMPP/Apache desde esta carpeta.

## Ver el sitio

Requiere Apache (XAMPP) corriendo. **No abrir con `file://`** — el `fetch()` y algunas rutas relativas
esperan un origen HTTP.

```
http://localhost/psdtlaguna/
```

## Páginas

| Archivo | Descripción |
|---|---|
| `index.html` | Home de una sola página con secciones ancladas: `#inicio`, `#nosotros`, `#servicios-integrales`, `#valores`, `#servicios`, `#seminuevo`, `#contacto`, `#mision-vision-proposito`; scroll suave y menú con scroll-spy. |
| `microsip.html` | Página dedicada a Microsip: beneficios, módulos del sistema (`#modulos`) y formulario de cotización (`#cotizar`). |
| `privacidad.html` | Aviso de privacidad. |

Son páginas reales, no rutas de SPA — pero `@view-transition { navigation: auto; }` en `style.css` da
transiciones nativas entre documentos en navegadores basados en Chromium, así que navegar entre ellas se
siente continuo sin usar un router en JS.

## Estructura

```
pdstlaguna/
├── index.html
├── microsip.html
├── privacidad.html
└── assets/
    ├── css/
    │   └── style.css     # design system completo (única hoja de estilos)
    ├── js/
    │   └── main.js       # único IIFE con jQuery para orquestación del DOM
    └── img/
        ├── logo/         # logos PDST y logo de Microsip (microsip.webp)
        └── fondos/       # fotografía real (ej. fondo_oficina.png)
```

No hay bundler ni CSS/JS por página: todo lo compartido vive en `assets/css/style.css` y
`assets/js/main.js`.

## Sistema de diseño

Tokens de marca definidos como custom properties en `:root` (`assets/css/style.css`):

| Token | Hex | Uso |
|---|---|---|
| `--navy` | `#07213E` | superficie oscura primaria / texto |
| `--blue` | `#0354A0` | acento primario |
| `--blue-light` | `#1E7FE0` | acento secundario, glows, hovers |
| `--gray` / `--gray-light` | `#5A5A5A` / `#E5E5E5` | texto atenuado / superficies alternas |
| `--off-white` | `#F7F9FC` | fondo alterno (`--bg-alt`) |

Además existen tokens específicos para las secciones de distribución **Microsip** (marca de terceros,
paleta propia — no usar fuera de esas secciones):

| Token | Hex | Uso |
|---|---|---|
| `--ms-orange` | `#FF8623` | acentos, botones y textos destacados Microsip |
| `--ms-dark` | `#2E3437` | fondos oscuros de las secciones Microsip |

Tipografías: **Montserrat** (encabezados, 500–800) + **Raleway** (cuerpo, 300–600), vía Google Fonts.

## Notas técnicas

- **Animaciones en capas**: los scroll reveals usan `animation-timeline: view()` nativo (clase `.reveal`)
  con fallback vía `IntersectionObserver` (agregado por `main.js`) para navegadores sin soporte. El
  parallax y el canvas de "conexiones" del hero (`#hero-network`) son hechos a mano con
  `requestAnimationFrame`. El fondo decorativo (`.circuit-flow`) anima `transform`, no
  `background-position`, para evitar jank — mantener esa convención en animaciones decorativas nuevas.
- **Canvas del hero**: pausa su propio loop de `requestAnimationFrame` vía `IntersectionObserver` cuando
  sale de vista. Si se toca este código, conservar esa protección o quema CPU en segundo plano
  indefinidamente.
- **Preloader**: fuerza un tiempo mínimo visible con una barra de progreso real ligada a `window.load`,
  no un `setTimeout` fijo.
- **Menú / drawer móvil**: el nav de escritorio (`.nav-links`) solo se muestra desde ~1300px de ancho —
  con 8 items más el logo y el botón "Cotizar ahora" no cabían antes en el breakpoint estándar de
  Bootstrap sin partirse en varias líneas. Por debajo de eso se usa el drawer lateral, con su propio botón
  de cierre + backdrop dedicados (el botón hamburguesa no puede cerrarlo porque queda visualmente detrás
  del drawer abierto).
- **Scroll-spy**: `main.js` observa todo `section[id]` con `IntersectionObserver` y resalta el link del
  nav correspondiente — cualquier `<section>` con `id` nuevo se integra automáticamente, sin tocar JS.
- **Bootstrap** solo se usa para grid/componentes base (navbar, accordion, forms) — sus clases utilitarias
  están activas en todo el sitio. **Nunca nombrar una clase de layout propia `.row`**: `.row > *` de
  Bootstrap 5 fuerza `width:100%` en los hijos directos y rompe layouts flex/grid propios.
- **Contacto vía WhatsApp**: no hay backend de formularios. Tanto `#contact-form` (índice) como
  `#microsip-quote-form` (Microsip) arman un deep link `wa.me` con los valores del formulario y lo abren
  (ver `WHATSAPP_NUMBER` en `main.js`). Mantenerlo así salvo que el cliente pida explícitamente un backend
  real.
- **`.ph`**: bloques placeholder (caja con gradiente, borde punteado y caption con el tamaño requerido)
  para fotografía real pendiente. Las fotos reales ya provistas viven en `assets/img/fondos/`.
- **Logos**: `assets/img/logo/pdst-icon.png` y `pdst-logo-white.png` son los logos PDST en uso;
  `assets/img/logo/microsip.webp` es el logo oficial de Microsip usado en el teaser de `index.html`. El
  resto de archivos en esa carpeta (`*-t.png`, `*-solid-bak.png`, `pdst-logo-navy.png`,
  `pdst-logo-dark-panel.png`, `brand-reference.jpeg`) son respaldos de trabajo, no assets en uso.

## Pendientes conocidos

Marcados en el HTML con la clase `.todo-flag` donde aplica:

- Horario de atención (`index.html`, sección Contacto) — nunca fue proporcionado por el cliente.
- Logos de marcas socias en el marquee de `index.html` (Syscom, Kocom, Commax, Mirage, etc.) — siguen
  siendo solo texto; falta conseguir los archivos de logo reales (Microsip ya tiene logo real, pero no
  está aplicado dentro del marquee, solo en la sección de distribución autorizada).

# PDST Laguna — Sitio Web

Sitio de marketing para **PDST Laguna S.A.S. de C.V.** (Productos Digitales Services and Tech), empresa
de servicios/reventa de TI en Gómez Palacio, Durango, México: cómputo, CCTV, redes/cableado estructurado,
impresión, soporte técnico, licenciamiento y distribución Microsip.

Sitio estático, sin backend, sin build step — se sirve directamente con XAMPP/Apache desde esta carpeta.

## Ver el sitio

Requiere Apache (XAMPP) corriendo, **no abrir con `file://`** — el `fetch()` y algunas rutas relativas
esperan un origen HTTP.

## Páginas

| Archivo | Descripción |
|---|---|
| `index.html` | Home de una sola página con secciones ancladas (`#nosotros`, `#valores`, `#servicios`, `#seminuevo`, `#contacto`) y scroll suave. |
| `microsip.html` | Página dedicada a Microsip (SEO propio + tabla de precios que se actualiza manualmente desde microsip.com). |
| `privacidad.html` | Aviso de privacidad. |

Son páginas reales, no rutas de SPA — pero `@view-transition { navigation: auto; }` en `style.css` da
transiciones nativas entre documentos en Chromium/Edge, así que navegar entre ellas se siente continuo
sin usar un router en JS.

## Estructura

```
psdtlaguna/
├── index.html
├── microsip.html
├── privacidad.html
├── pdst-laguna-contenido.md   # copy/contenido fuente de verdad
├── Para PAgina Wrb.docx       # documento original del cliente
├── 1.jpeg – 4.jpeg             # hojas de referencia de marca (logo, paleta, iconos)
└── assets/
    ├── css/
    │   └── style.css          # design system completo (única hoja de estilos)
    ├── js/
    │   └── main.js            # único IIFE con jQuery para orquestación del DOM
    └── img/
        ├── hero/ nosotros/ servicios/ seminuevo/ marcas/ og/
        └── logo/
```

No hay bundler ni CSS/JS por página: todo lo compartido vive en `assets/css/style.css` y
`assets/js/main.js`.

## Sistema de marca

No improvisar colores o fuentes nuevas — son valores fijos, extraídos por pixel-picking del swatch
oficial en `3.jpeg`.

| Token | Hex | Uso |
|---|---|---|
| `--navy` | `#07213E` | superficie oscura primaria / texto |
| `--blue` | `#0354A0` | acento primario |
| `--blue-light` | `#1E7FE0` | acento secundario, glows, hovers |
| `--gray` / `--gray-light` | `#5A5A5A` / `#E5E5E5` | texto atenuado / superficies alternas |

Tipografías: **Montserrat** (encabezados, 500–800) + **Raleway** (cuerpo, 300–600), vía Google Fonts.

## Notas técnicas

- **Animaciones en capas**: los scroll reveals usan `animation-timeline: view()` nativo (clase `.reveal`)
  con fallback vía `IntersectionObserver` (agregado por `main.js`) para navegadores sin soporte. El
  parallax y el canvas de "conexiones" del hero son hechos a mano con `requestAnimationFrame`. El fondo
  decorativo (`.circuit-flow`) anima `transform`, no `background-position`, para no generar jank —
  mantener esa convención en animaciones decorativas nuevas.
- **Canvas del hero** (`#hero-network`): pausa su propio loop de `requestAnimationFrame` vía
  `IntersectionObserver` cuando sale de vista. Si se toca este código, conservar esa protección o quema
  CPU en segundo plano indefinidamente.
- **Preloader**: fuerza un tiempo mínimo visible (`MIN_MS`) con una barra de progreso real ligada a
  `window.load`, no un `setTimeout` fijo.
- **Drawer móvil**: tiene su propio botón de cierre + backdrop dedicados; el botón hamburguesa no puede
  cerrarlo porque queda visualmente detrás del drawer abierto (stacking contexts separados).
- **Bootstrap** solo se usa para grid/componentes base (navbar, accordion, forms) — sus clases utilitarias
  están activas en todo el sitio. **Nunca nombrar una clase de layout propia `.row`**: `.row > *` de
  Bootstrap 5 fuerza `width:100%` en los hijos directos y rompe layouts flex/grid propios (ya pasó una
  vez con los íconos de contacto, renombrado a `.info-row`).
- **Contacto vía WhatsApp**: no hay backend de formularios; `#contact-form` arma un deep link `wa.me` con
  los valores del formulario y lo abre (ver `WHATSAPP_NUMBER` en `main.js`). Mantenerlo así salvo que el
  cliente pida explícitamente un backend real.
- **`.ph`**: bloques placeholder (caja con gradiente navy/blue, borde punteado y caption con el tamaño
  requerido) para fotografía real pendiente. Las imágenes reales van en
  `assets/img/{hero,servicios,nosotros,seminuevo,marcas,og}/`.
- **Logos**: solo `assets/img/logo/pdst-icon.png` y `pdst-logo-white.png` están referenciados en las
  páginas. El resto de archivos en esa carpeta (`*-t.png`, `*-solid-bak.png`, `pdst-logo-navy.png`,
  `pdst-logo-dark-panel.png`, `brand-reference.jpeg`) son respaldos de trabajo del proceso de
  recorte/chroma-key, no assets en uso.

## Pendientes conocidos

Marcados en el HTML con la clase `.todo-flag` donde aplica:

- Tabla de precios del módulo Microsip (`microsip.html`) — falta copiar cifras reales de microsip.com.
- Horario de atención — nunca fue proporcionado por el cliente.
- Logos de marcas socias (Microsip, Syscom, Kocom, Commax, Mirage) — actualmente solo texto en el
  marquee, faltan los archivos de logo reales.

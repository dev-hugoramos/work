# Skill Machin Studio - Sitio Web

Sitio web profesional para **Skill Machin Studio**, un estudio de tatuajes dedicado a crear arte permanente de alta calidad.

## Descripcion

Este es un sitio web moderno y responsivo diseñado para mostrar el trabajo y servicios de un estudio de tatuajes profesional. El diseño utiliza una paleta de colores audaz con verde lima (#caf619) y negro (#000000), creando una estetica impactante y profesional que refleja la esencia del arte del tatuaje.

## Caracteristicas

### Diseño y UX
- **Mobile First**: Diseño totalmente responsivo optimizado primero para dispositivos moviles
- **Animaciones Suaves**: Implementadas con AOS (Animate On Scroll) y GSAP
- **Cursor Personalizado**: Cursor interactivo para escritorio
- **Preloader Animado**: Pantalla de carga con animacion de marca
- **Efecto Parallax**: En la seccion hero con imagen de fondo
- **Efecto Glitch**: En el titulo principal

### Secciones
1. **Hero/Inicio**: Presentacion impactante con imagen de fondo y efecto viñeta
2. **Sobre Mi**: Informacion del artista con estadisticas animadas
3. **Video**: Seccion "Conoceme un poco mas" con reproductor de video
4. **Galeria**: Portfolio de trabajos con filtros y lightbox
5. **Servicios**: Tarjetas interactivas de servicios ofrecidos
6. **Proceso**: Timeline del proceso de trabajo
7. **Contacto**: Informacion de contacto, redes sociales y Google Maps
8. **Footer**: Enlaces rapidos y redes sociales

### Funcionalidades
- **Galeria con Lazy Loading**: Las imagenes cargan progresivamente con animacion
- **GLightbox**: Visualizador de imagenes tipo lightbox profesional
- **Filtros de Galeria**: Filtrar por categoria (Blackwork, Realismo, Tradicional, Geometrico)
- **Galeria Colapsable en Movil**: El usuario decide si expandir la vista
- **Boton Flotante de WhatsApp**: Acceso rapido para contacto
- **Boton Volver Arriba**: Navegacion rapida
- **Navegacion Fija**: Header con efecto de scroll
- **Contador Animado**: Estadisticas que se animan al hacer scroll

## Tecnologias Utilizadas

- **HTML5**: Estructura semantica
- **CSS3**: Estilos avanzados con variables CSS, gradientes y animaciones
- **JavaScript ES6+**: Funcionalidad modular y moderna
- **AOS**: Animaciones al hacer scroll
- **GSAP + ScrollTrigger**: Animaciones avanzadas y parallax
- **GLightbox**: Galeria lightbox
- **Font Awesome**: Iconos
- **Google Fonts**: Tipografias (Bebas Neue, Montserrat, Permanent Marker)

## Estructura del Proyecto

```
skillmachin/
├── index.html          # Pagina principal
├── README.md           # Este archivo
├── css/
│   └── styles.css      # Estilos principales
├── js/
│   └── main.js         # JavaScript principal
└── img/
    ├── logo_dos.jpg    # Logo del estudio
    ├── me.jpg          # Imagen del artista
    ├── dago.mp4        # Video de presentacion
    └── img0.jpg        # Imagenes de galeria (img0, img1, img2...)
```

## Como Agregar Imagenes a la Galeria

1. Coloca tus imagenes en la carpeta `img/`
2. Nombra las imagenes consecutivamente: `img0.jpg`, `img1.jpg`, `img2.jpg`, etc.
3. Abre `js/main.js` y busca el array `Gallery.images`
4. Modifica el array con tus imagenes:

```javascript
images: [
    { src: 'img/img0.jpg', category: 'blackwork', title: 'Mi Trabajo 1' },
    { src: 'img/img1.jpg', category: 'realismo', title: 'Mi Trabajo 2' },
    { src: 'img/img2.jpg', category: 'tradicional', title: 'Mi Trabajo 3' },
    { src: 'img/img3.jpg', category: 'geometrico', title: 'Mi Trabajo 4' },
    // Agregar mas segun sea necesario...
]
```

### Metodo Rapido
Descomenta y usa la funcion helper al final de `main.js`:
```javascript
Gallery.images = addLocalImagesToGallery(20); // Para 20 imagenes
```

## Configuracion

### Numero de WhatsApp
Busca y reemplaza `521XXXXXXXXXX` en `index.html` con tu numero real (incluir codigo de pais sin +).

### Ubicacion en Google Maps
En `index.html`, reemplaza el iframe de Google Maps con tu ubicacion real.

### Redes Sociales
Los enlaces de Instagram y Facebook ya estan configurados. Si necesitas cambiarlos, busca las URLs en `index.html`.

### Informacion de Contacto
Actualiza la direccion, horarios y datos de contacto en la seccion de contacto.

## Instalacion

1. Clona o descarga este repositorio
2. Coloca los archivos en tu servidor web (XAMPP, etc.)
3. Agrega tus imagenes a la carpeta `img/`
4. Actualiza la informacion de contacto
5. Accede desde tu navegador

## Compatibilidad

- Chrome (recomendado)
- Firefox
- Safari
- Edge
- Dispositivos moviles iOS y Android

## Open Graph / Redes Sociales

El sitio incluye meta tags para compartir en redes sociales. La imagen `logo_dos.jpg` se usa como preview al compartir enlaces.

## Creditos

- Desarrollador Hugo Ramos
- Diseño y desarrollo para Skill Machin Studio
- Iconos: Font Awesome
- Fuentes: Google Fonts
- Librerias: AOS, GSAP, GLightbox

## Licencia

Todos los derechos reservados - Hugo Ramos

---

**Nota**: Recuerda actualizar los numeros de telefono, direccion y enlaces de redes sociales antes de publicar el sitio.

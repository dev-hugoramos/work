/* =========================================================
   PDST LAGUNA — main.js
   jQuery se usa solo para orquestación de interacción (nav, tabs,
   accordion, formulario). Las animaciones de scroll/estilo viven
   en CSS nativo (scroll-driven animations, view-transitions).
   ========================================================= */
(function ($) {
  "use strict";

  var isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader (tiempo mínimo visible + contador real) ---------- */
  (function () {
    var MIN_MS = 1500;
    var start = performance.now();
    var $bar = $("#preloader .bar-fill");
    var $pct = $("#preloader .pct");
    var pageLoaded = false;
    var loopId;

    function tick() {
      var elapsed = performance.now() - start;
      var progress = Math.min(elapsed / MIN_MS, pageLoaded ? 1 : 0.92);
      var pct = Math.round(progress * 100);
      $bar.css("width", pct + "%");
      $pct.text(pct + "%");
      if (progress >= 1 && pageLoaded) {
        $("#preloader").addClass("is-done");
        return;
      }
      loopId = requestAnimationFrame(tick);
    }
    loopId = requestAnimationFrame(tick);

    $(window).on("load", function () {
      pageLoaded = true;
      var remaining = MIN_MS - (performance.now() - start);
      if (remaining > 0) return; // el loop de tick() se encarga de cerrar al llegar a MIN_MS
      cancelAnimationFrame(loopId);
      $bar.css("width", "100%"); $pct.text("100%");
      setTimeout(function () { $("#preloader").addClass("is-done"); }, 150);
    });
  })();

  /* ---------- Cursor custom (solo desktop) ---------- */
  if (!isTouch) {
    $("html").addClass("has-custom-cursor");
    var $dot = $("#cursor-dot");
    var $ring = $("#cursor-ring");
    var $aura = $("#cursor-aura");
    var ringX = 0, ringY = 0, auraX = 0, auraY = 0, mx = 0, my = 0;

    $(document).on("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      $dot.css({ left: mx, top: my });
    });

    (function loop() {
      ringX += (mx - ringX) * 0.18;
      ringY += (my - ringY) * 0.18;
      auraX += (mx - auraX) * 0.08;
      auraY += (my - auraY) * 0.08;
      $ring.css({ left: ringX, top: ringY });
      $aura.css({ left: auraX, top: auraY });
      requestAnimationFrame(loop);
    })();

    $(document).on("mouseenter", "a, button, .bento-card, .grade-tabs button, .faq-q, input, textarea, select", function () {
      $ring.addClass("is-active");
      $dot.addClass("is-active");
    }).on("mouseleave", "a, button, .bento-card, .grade-tabs button, .faq-q, input, textarea, select", function () {
      $ring.removeClass("is-active");
      $dot.removeClass("is-active");
    });

    $(document).on("mouseleave", function () {
      $dot.addClass("is-hidden"); $ring.addClass("is-hidden"); $aura.addClass("is-hidden");
    }).on("mouseenter", function () {
      $dot.removeClass("is-hidden"); $ring.removeClass("is-hidden"); $aura.removeClass("is-hidden");
    });
  }

  /* ---------- Barra de progreso de scroll ---------- */
  var $progress = $("#scroll-progress");
  /* ---------- Spotlight en bento cards ---------- */
  if (!isTouch) {
    $(document).on("mousemove", ".bento-card", function (e) {
      var rect = this.getBoundingClientRect();
      this.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      this.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  }

  /* ---------- Scroll: progreso + navbar sólido (un solo listener, throttled con rAF) ---------- */
  var $nav = $(".pdst-nav");
  var scrollTicking = false;
  function onScrollFrame() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    $progress.css("width", pct + "%");
    $nav.toggleClass("is-solid", h.scrollTop > 40);
    scrollTicking = false;
  }
  onScrollFrame();
  window.addEventListener("scroll", function () {
    if (!scrollTicking) { requestAnimationFrame(onScrollFrame); scrollTicking = true; }
  }, { passive: true });

  var sections = $("section[id]");
  var navLinks = $(".pdst-nav .nav-links a");
  if (sections.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.removeClass("is-active");
          navLinks.filter('[href="#' + id + '"]').addClass("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    sections.each(function () { obs.observe(this); });
  }

  /* ---------- Menú móvil ---------- */
  function openDrawer() {
    $(".nav-toggle").addClass("is-open");
    $(".mobile-drawer, .drawer-backdrop").addClass("is-open");
    $("body").addClass("no-scroll");
  }
  function closeDrawer() {
    $(".nav-toggle").removeClass("is-open");
    $(".mobile-drawer, .drawer-backdrop").removeClass("is-open");
    $("body").removeClass("no-scroll");
  }
  $(".nav-toggle").on("click", function () {
    $(".mobile-drawer").hasClass("is-open") ? closeDrawer() : openDrawer();
  });
  $(".drawer-close, .drawer-backdrop").on("click", closeDrawer);
  $(".mobile-drawer a").on("click", closeDrawer);
  $(document).on("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ---------- Parallax hero (rAF, capas a distinta velocidad; se detiene fuera del hero) ---------- */
  if (!reduceMotion) {
    var heroEl = document.querySelector(".hero");
    var layers = Array.prototype.map.call(document.querySelectorAll(".hero-layer"), function (el) {
      return { el: el, speed: parseFloat(el.dataset.speed) || 0.2 };
    });
    var heroInView = true;
    var ticking = false;
    function parallaxTick() {
      var y = window.scrollY || window.pageYOffset;
      for (var i = 0; i < layers.length; i++) {
        layers[i].el.style.transform = "translate3d(0," + (y * layers[i].speed).toFixed(1) + "px,0)";
      }
      ticking = false;
    }
    if (heroEl) {
      window.addEventListener("scroll", function () {
        if (!heroInView || ticking) return;
        ticking = true; requestAnimationFrame(parallaxTick);
      }, { passive: true });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          heroInView = entries[0].isIntersecting;
        }, { threshold: 0 }).observe(heroEl);
      }
    }
  }

  /* ---------- Reveal fallback para navegadores sin animation-timeline ---------- */
  var supportsScrollTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  if (!supportsScrollTimeline && "IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- Tabs: Nosotros (Misión/Visión/Propósito) ---------- */
  $(".pillar-tabs button").on("click", function () {
    var target = $(this).data("target");
    $(".pillar-tabs button").removeClass("is-active");
    $(this).addClass("is-active");
    $(".pillar-panel").removeClass("is-active");
    $(target).addClass("is-active");
  });

  /* ---------- Tabs: Equipo seminuevo (Grados A/B/C) ---------- */
  $(".grade-tabs button").on("click", function () {
    var target = $(this).data("target");
    $(".grade-tabs button").removeClass("is-active");
    $(this).addClass("is-active");
    $(".grade-panel").removeClass("is-active");
    $(target).addClass("is-active");
  });

  /* ---------- FAQ accordion ---------- */
  $(".faq-q").on("click", function () {
    var $item = $(this).closest(".faq-item");
    var wasOpen = $item.hasClass("is-open");
    $(".faq-item").removeClass("is-open").find(".faq-a").css("max-height", 0);
    if (!wasOpen) {
      $item.addClass("is-open");
      var $a = $item.find(".faq-a");
      $a.css("max-height", $a[0].scrollHeight + "px");
    }
  });

  /* ---------- Marquee: clonar track para loop infinito perfecto ---------- */
  $(".marquee .track").each(function () {
    $(this).append($(this).html());
  });

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  var WHATSAPP_NUMBER = "528718455304"; // WP: 8718455304 (MX +52)
  $("#contact-form").on("submit", function (e) {
    e.preventDefault();
    var $f = $(this);
    var nombre = $f.find("[name=nombre]").val().trim();
    var telefono = $f.find("[name=telefono]").val().trim();
    var servicio = $f.find("[name=servicio]").val();
    var mensaje = $f.find("[name=mensaje]").val().trim();

    if (!nombre || !telefono || !mensaje) {
      $f.find(".form-feedback").text("Por favor completa nombre, teléfono y mensaje.").addClass("is-error");
      return;
    }

    var text = "Hola PDST Laguna, soy " + nombre + " (tel. " + telefono + "). " +
      "Me interesa: " + (servicio || "información general") + ". " + mensaje;
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
    $f.find(".form-feedback").text("Te estamos redirigiendo a WhatsApp…").removeClass("is-error");
  });

  /* ---------- Equipos empresariales seminuevos: datos, grid, modal y lightbox ---------- */
  var EQUIPOS = [
    {
      id: "dell-precision-t5810", marca: "Dell", logo: "assets/img/marcas/logos/dell.png",
      titulo: "Workstation Dell Precision T5810 Torre",
      foto: "assets/img/seminuevo/equipos/dell-precision-t5810.jpeg",
      grado: "A",
      specs: [
        ["🏷️", "Marca y modelo", "Dell Precision T5810 Torre"],
        ["🧠", "Procesador", "Intel Xeon E5-1650 V3 · 3.5 GHz (Turbo hasta 3.8 GHz) · 6 núcleos / 12 hilos · 15 MB Smart Cache"],
        ["🎮", "Gráficos", "NVIDIA Quadro 8 GB GDDR5 dedicada, certificada ISV (modelo puede variar según existencias)"],
        ["🚀", "Memoria RAM", "32 GB DDR4 ECC RDIMM 2133 MHz — expandible hasta 256 GB (8 ranuras DIMM)"],
        ["💾", "Almacenamiento", "480 GB SSD (unidad nueva) + 1 TB HDD SATA (expandible)"],
        ["🖥️", "Factor de forma", "Torre, sin pantalla integrada · soporta hasta 3 monitores vía GPU"],
        ["🔌", "Puertos", "Frontales: 1× USB 3.0 · 3× USB 2.0 · mic · audífonos — Traseros: 3× USB 3.0 · 3× USB 2.0 · 2× PS/2 · serial · RJ45 Gigabit · audio + GPU"],
        ["⚙️", "Sistema operativo", "Windows 10 / 11 Pro original"],
        ["✨", "Estado", "Reacondicionado Grado A (estética 9/10 – 10/10)"],
        ["🛡️", "Garantía", "12 meses"]
      ],
      nota: null
    },
    {
      id: "dell-optiplex-7480-aio", marca: "Dell", logo: "assets/img/marcas/logos/dell.png",
      titulo: "All in One Dell OptiPlex 7480 AIO",
      foto: "assets/img/seminuevo/equipos/dell-optiplex-7480-aio.jpeg",
      grado: "A",
      specs: [
        ["🏷️", "Marca y modelo", "Dell OptiPlex 7480 All-in-One (AIO)"],
        ["🧠", "Procesador", "Intel Core i7-10700 (10.ª gen) · 2.9 GHz base (Turbo hasta 4.8 GHz) · 8 núcleos / 16 hilos"],
        ["🎮", "Gráficos", "Intel UHD Graphics 630 (integrada)"],
        ["🚀", "Memoria RAM", "16 GB DDR4 2933 MHz — expandible hasta 64 GB"],
        ["💾", "Almacenamiento", "240 GB SSD (unidad nueva, expandible)"],
        ["💻", "Pantalla", "23.8 pulgadas Full HD (1920 × 1080)"],
        ["📷", "Webcam", "Full HD 1080p a 30 fps, con función pop-up de privacidad"],
        ["🔌", "Puertos", "USB-C 3.2 Gen2 · USB 3.2 Gen1 Tipo-A (PowerShare) · 4× USB 3.2 Gen2 Tipo-A · RJ-45 Gigabit · DisplayPort++ 1.4 · HDMI-in/out · lector SD 4.0 · audio universal · Wi-Fi 6 y Bluetooth"],
        ["⚙️", "Sistema operativo", "Windows 11 Pro original"],
        ["✨", "Estado", "Reacondicionado Grado A (estética 9/10 – 10/10)"],
        ["🛡️", "Garantía", "12 meses"]
      ],
      nota: null
    },
    {
      id: "dell-precision-3460-sff", marca: "Dell", logo: "assets/img/marcas/logos/dell.png",
      titulo: "Workstation Dell Precision 3460 SFF",
      foto: "assets/img/seminuevo/equipos/dell-precision-3460-sff.webp",
      grado: "A",
      specs: [
        ["🏷️", "Marca y modelo", "Dell Precision 3460 SFF"],
        ["🧠", "Procesador", "Intel Core i5-12500 · 3.00 GHz base (Turbo hasta 4.60 GHz) · 6 núcleos / 12 hilos"],
        ["🎮", "Gráficos", "Intel UHD Graphics 770 (integrada)"],
        ["🚀", "Memoria RAM", "8 GB DDR5 4800 MHz — expandible hasta 64 GB"],
        ["💾", "Almacenamiento", "240 GB SSD M.2 NVMe (unidad nueva, expandible)"],
        ["💻", "Factor de forma", "Small Form Factor (SFF) — compacto y silencioso"],
        ["🔌", "Puertos", "Frontales: USB 3.2 Gen2×2 Tipo-C (20 Gbps) · USB 3.2 Gen2 Tipo-A · 2× USB 2.0 · audio — Traseros: 3× DisplayPort 1.4a · RJ-45 · USB 3.2 Gen2 · 3× USB 3.2 Gen1 · 2× USB 2.0 · line in/out"],
        ["⚙️", "Sistema operativo", "Windows 10 / 11 Pro original"],
        ["✨", "Estado", "Reacondicionado Grado A (estética 9/10 – 10/10)"],
        ["🛡️", "Garantía", "12 meses"]
      ],
      nota: null
    },
    {
      id: "dell-optiplex-3040-5040-7040", marca: "Dell", logo: "assets/img/marcas/logos/dell.png",
      titulo: "PC de Escritorio Dell OptiPlex 3040 / 5040 / 7040 SFF",
      foto: "assets/img/seminuevo/equipos/dell-optiplex-3040-5040-7040.webp",
      grado: "B",
      specs: [
        ["🏷️", "Marca y modelo", "Dell OptiPlex 3040 / 5040 / 7040 SFF (modelo sujeto a disponibilidad de inventario)"],
        ["🧠", "Procesador", "Intel Core i5-6500 · 3.2 GHz base (Turbo hasta 3.6 GHz) · 4 núcleos / 4 hilos"],
        ["🎮", "Gráficos", "Intel HD Graphics 530 (integrada)"],
        ["🚀", "Memoria RAM", "8 GB DDR4 / DDR3L 2133 MHz — expandible hasta 64 GB en modelos 5040/7040"],
        ["💾", "Almacenamiento", "240 GB SSD (unidad nueva, expandible)"],
        ["🔌", "Puertos", "6× USB 3.0 · 4× USB 2.0 · DisplayPort 1.2 · HDMI 1.4 · serial · RJ-45 · audio combo"],
        ["⚙️", "Sistema operativo", "Windows 10 Pro original"],
        ["✨", "Estado", "Reacondicionado Grado B"],
        ["🛡️", "Garantía", "6 meses"]
      ],
      nota: "Este equipo se envía como Dell OptiPlex 3040, 5040 o 7040 SFF según disponibilidad de almacén al momento de tu compra. Los tres modelos comparten plataforma de procesador y conectividad equivalentes; el 3040 utiliza DDR3L (expandible hasta 16 GB) y los modelos 5040/7040 utilizan DDR4 (expandible hasta 64 GB)."
    },
    {
      id: "hp-prodesk-elitedesk-g2", marca: "HP", logo: "assets/img/marcas/logos/hp.png",
      titulo: "PC de Escritorio HP ProDesk 600 G2 / EliteDesk 800 G2 SFF",
      foto: "assets/img/seminuevo/equipos/hp-prodesk-elitedesk-g2.webp",
      grado: "B",
      specs: [
        ["🏷️", "Marca y modelo", "HP ProDesk 600 G2 SFF / EliteDesk 800 G2 SFF (modelo sujeto a disponibilidad de inventario)"],
        ["🧠", "Procesador", "Intel Core i5-6500 · 3.2 GHz base (Turbo hasta 3.6 GHz) · 4 núcleos / 4 hilos"],
        ["🎮", "Gráficos", "Intel HD Graphics 530 (integrada)"],
        ["🚀", "Memoria RAM", "16 GB DDR4 2133 MHz — expandible hasta 64 GB"],
        ["💾", "Almacenamiento", "240 GB SSD (unidad nueva, expandible)"],
        ["🔌", "Puertos", "6× USB 3.0 · 4× USB 2.0 · 2× DisplayPort · VGA · serial · RJ-45 · audio combo"],
        ["⚙️", "Sistema operativo", "Windows 10 Pro original"],
        ["✨", "Estado", "Reacondicionado Grado B"],
        ["🛡️", "Garantía", "6 meses"]
      ],
      nota: "Este equipo se envía como HP ProDesk 600 G2 SFF o HP EliteDesk 800 G2 SFF según disponibilidad de almacén al momento de tu compra. Ambos modelos comparten chasis, plataforma de procesador y conectividad equivalentes, por lo que el rendimiento y la experiencia de uso son los mismos."
    },
    {
      id: "dell-optiplex-3020", marca: "Dell", logo: "assets/img/marcas/logos/dell.png",
      titulo: "Dell OptiPlex 3020 SFF",
      foto: "assets/img/seminuevo/equipos/dell-optiplex-3020.webp",
      grado: "B",
      specs: [
        ["🏷️", "Marca y modelo", "Dell OptiPlex 3020 SFF"],
        ["🧠", "Procesador", "Intel Core i7-4770 · 3.4 GHz (Turbo hasta 3.9 GHz) · 4 núcleos / 8 hilos"],
        ["🎮", "Gráficos", "Intel HD Graphics 4600 (integrada)"],
        ["🚀", "Memoria RAM", "8 GB DDR3 1600 MHz — expandible hasta 16 GB"],
        ["💾", "Almacenamiento", "240 GB SSD (unidad nueva, expandible)"],
        ["💻", "Factor de forma", "Desktop SFF (Small Form Factor), diseño compacto"],
        ["🔌", "Puertos", "2× USB 3.0 y 4× USB 2.0 traseros · 2× USB 2.0 frontales · DisplayPort · VGA · RJ-45 · mic/audífonos frontal · line in/out trasero"],
        ["📶", "Conectividad", "Gigabit Ethernet"],
        ["⚙️", "Sistema operativo", "Windows 10 / 11 Pro original"],
        ["✨", "Estado", "Reacondicionado Grado B"],
        ["🛡️", "Garantía", "6 meses"]
      ],
      nota: null
    },
    {
      id: "lenovo-thinkcentre-m72s", marca: "Lenovo", logo: "assets/img/marcas/logos/lenovo.png",
      titulo: "PC de Escritorio Lenovo ThinkCentre M72S SFF + Monitor 22 Pulgadas",
      foto: "assets/img/seminuevo/equipos/lenovo-thinkcentre-m72s.webp",
      grado: "B",
      specs: [
        ["🏷️", "Marca y modelo", "Lenovo ThinkCentre M72S SFF"],
        ["🧠", "Procesador", "Intel Core i5 de 7.ª generación @ 3.00 GHz"],
        ["🚀", "Memoria RAM", "16 GB DDR4 (expandible)"],
        ["💾", "Almacenamiento", "240 GB SSD (unidad nueva, expandible)"],
        ["🖥️", "Monitor", "22 pulgadas incluido"],
        ["⚙️", "Sistema operativo", "Windows 11 Pro + Microsoft Office"],
        ["✨", "Estado", "Reacondicionado Grado B"],
        ["🛡️", "Garantía", "6 meses"],
        ["🎁", "Incluye", "Teclado, mouse alámbricos y cables"]
      ],
      nota: null
    }
  ];

  function equipoCardHtml(eq) {
    return (
      '<article class="equipo-card">' +
        '<button class="equipo-photo" type="button" data-id="' + eq.id + '" aria-label="Ampliar imagen de ' + eq.titulo + '">' +
          '<img src="' + eq.foto + '" alt="' + eq.titulo + '" loading="lazy">' +
          '<span class="zoom-hint"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></span>' +
        '</button>' +
        '<div class="equipo-body">' +
          '<img class="equipo-brand" src="' + eq.logo + '" alt="' + eq.marca + '">' +
          '<h3>' + eq.titulo + '</h3>' +
          '<span class="equipo-grade grade-' + eq.grado.toLowerCase() + '">Grado ' + eq.grado + '</span>' +
          '<button class="btn-pdst btn-pdst-outline-navy equipo-open-specs" type="button" data-id="' + eq.id + '">Leer características</button>' +
        '</div>' +
      '</article>'
    );
  }

  var $equipoGrid = $("#equipo-grid");
  if ($equipoGrid.length) {
    $equipoGrid.html(EQUIPOS.map(equipoCardHtml).join(""));
  }

  function equipoById(id) {
    for (var i = 0; i < EQUIPOS.length; i++) { if (EQUIPOS[i].id === id) return EQUIPOS[i]; }
    return null;
  }

  var $equipoModal = $("#equipo-modal");
  var $equipoModalBackdrop = $("#equipo-modal-backdrop");

  function openEquipoModal(id) {
    var eq = equipoById(id);
    if (!eq) return;
    $equipoModal.find(".equipo-modal-img").attr({ src: eq.foto, alt: eq.titulo });
    $equipoModal.find(".equipo-modal-brand").attr({ src: eq.logo, alt: eq.marca });
    $equipoModal.find(".equipo-modal-grade").attr("class", "equipo-modal-grade equipo-grade grade-" + eq.grado.toLowerCase()).text("Grado " + eq.grado);
    $equipoModal.find(".equipo-modal-title").text(eq.titulo);
    $equipoModal.find(".equipo-modal-specs").html(eq.specs.map(function (s) {
      return '<li><span class="ic">' + s[0] + '</span><span><b>' + s[1] + '</b><span class="val">' + s[2] + '</span></span></li>';
    }).join(""));
    var $note = $equipoModal.find(".equipo-modal-note");
    if (eq.nota) { $note.text(eq.nota).show(); } else { $note.hide(); }
    var waText = 'Me interesa el artículo "' + eq.titulo + '", ¿existe disponibilidad?';
    $equipoModal.find(".equipo-modal-wa").attr("href", "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(waText));
    $equipoModal.add($equipoModalBackdrop).addClass("is-open");
    $("body").addClass("no-scroll");
  }
  function closeEquipoModal() {
    $equipoModal.add($equipoModalBackdrop).removeClass("is-open");
    $("body").removeClass("no-scroll");
  }
  $(document).on("click", ".equipo-open-specs", function () { openEquipoModal($(this).data("id")); });
  $(".equipo-modal-close, #equipo-modal-backdrop").on("click", closeEquipoModal);

  var $lightbox = $("#lightbox");
  var $lightboxBackdrop = $("#lightbox-backdrop");
  function openLightbox(src, alt) {
    $lightbox.find(".lightbox-img").attr({ src: src, alt: alt || "" });
    $lightbox.add($lightboxBackdrop).addClass("is-open");
    $("body").addClass("no-scroll");
  }
  function closeLightbox() {
    $lightbox.add($lightboxBackdrop).removeClass("is-open");
    $("body").removeClass("no-scroll");
  }
  $(document).on("click", ".equipo-photo", function () {
    var eq = equipoById($(this).data("id"));
    if (eq) openLightbox(eq.foto, eq.titulo);
  });
  $(".lightbox-close, #lightbox-backdrop").on("click", closeLightbox);

  $(document).on("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeLightbox();
    closeEquipoModal();
  });

  /* ---------- Formulario de cotización Microsip → WhatsApp ---------- */
  $("#microsip-quote-form").on("submit", function (e) {
    e.preventDefault();
    var $f = $(this);
    var nombre = $f.find("[name=nombre]").val().trim();
    var telefono = $f.find("[name=telefono]").val().trim();
    var modulo = $f.find("[name=modulo]").val();
    var mensaje = $f.find("[name=mensaje]").val().trim();

    if (!nombre || !telefono || !mensaje) {
      $f.find(".form-feedback").text("Por favor completa nombre, teléfono y mensaje.").addClass("is-error");
      return;
    }

    var text = "Hola PDST Laguna, soy " + nombre + " (tel. " + telefono + "). " +
      "Quiero cotizar Microsip — " + (modulo || "aún no sé qué módulo necesito") + ". " + mensaje;
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    window.open(url, "_blank");
    $f.find(".form-feedback").text("Te estamos redirigiendo a WhatsApp…").removeClass("is-error");
  });

  /* ---------- Año dinámico en footer ---------- */
  $(".current-year").text(new Date().getFullYear());

  /* ---------- Red de conexiones animada (canvas) — hero ---------- */
  var netCanvas = document.getElementById("hero-network");
  if (netCanvas && !reduceMotion) {
    var ctx = netCanvas.getContext("2d");
    var W, H, points, netRAF;
    var POINT_COUNT = window.innerWidth < 768 ? 34 : 70;
    var LINK_DIST = 150;

    function resizeNet() {
      W = netCanvas.width = netCanvas.offsetWidth * devicePixelRatio;
      H = netCanvas.height = netCanvas.offsetHeight * devicePixelRatio;
    }
    function makePoints() {
      points = [];
      for (var i = 0; i < POINT_COUNT; i++) {
        points.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
          vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio
        });
      }
    }
    function drawNet() {
      ctx.clearRect(0, 0, W, H);
      var linkDist = LINK_DIST * devicePixelRatio;

      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
          var a = points[i], b = points[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            ctx.strokeStyle = "rgba(30,127,224," + (1 - dist / linkDist) * 0.45 + ")";
            ctx.lineWidth = 1 * devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (var i = 0; i < points.length; i++) {
        ctx.fillStyle = "rgba(126,182,255,.85)";
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1.6 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      }
      if (netVisible) { netRAF = requestAnimationFrame(drawNet); } else { netRAF = null; }
    }

    var netVisible = true;
    resizeNet(); makePoints(); drawNet();
    $(window).on("resize", function () {
      cancelAnimationFrame(netRAF);
      resizeNet(); makePoints();
      if (netVisible) drawNet();
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        netVisible = entries[0].isIntersecting;
        if (netVisible && !netRAF) drawNet();
      }, { threshold: 0.05 }).observe(netCanvas);
    }
  }

})(jQuery);

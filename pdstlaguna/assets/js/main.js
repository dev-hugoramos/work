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

/**
 * Funciones front-end ligeras para la landing de Mariella.
 * Requiere jQuery (incluida en index.html).
 */

$(document).ready(function () {
  // Actualiza el año automáticamente
  $("#year").text(new Date().getFullYear());

  // Suaviza el desplazamiento de los enlaces internos
  $("a[href^='#']").on("click", function (event) {
    const targetId = $(this).attr("href");
    const target = $(targetId);
    if (target.length) {
      event.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 80,
        },
        600
      );
    }
  });

  // Galería dinámica basada en convención gallery-X.ext
  const galleryContainer = $("#gallery-grid");
  const galleryEmptyState = galleryContainer.find(".gallery-empty");
  const galleryLoader = $("#gallery-loader");
  const lightboxImage = $("#lightbox-image");
  const lightboxElement = document.getElementById("lightboxModal");
  const prevButton = $("#lightbox-prev");
  const nextButton = $("#lightbox-next");
  const galleryToggle = $("#gallery-toggle");
  const mobileGalleryPreview = $("#gallery-mobile-preview");
  const galleryCloseButton = $("#gallery-close");
  const gallerySection = $("#galeria");
  let galleryImages = [];
  let currentImageIndex = 0;
  const supportedExtensions = ["jpg", "jpeg", "png", "webp"];
  const maxImages = 30;

  const loaderHideDelay = 1200; // mantiene el loader visible un instante

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });

  const findImages = async () => {
    const found = [];
    for (let i = 1; i <= maxImages; i++) {
      let matched = false;
      for (const ext of supportedExtensions) {
        try {
          const path = `img/gallery-${i}.${ext}`;
          await loadImage(path);
          found.push(path);
          matched = true;
          break;
        } catch (error) {
          // Continúa buscando con la siguiente extensión
        }
      }
      if (!matched) {
        continue;
      }
    }
    return found;
  };

  let loaderTimeoutId = null;
  const hideGalleryLoader = () => {
    if (!galleryLoader.length || loaderTimeoutId) {
      return;
    }
    loaderTimeoutId = setTimeout(() => {
      galleryLoader.addClass("d-none");
    }, loaderHideDelay);
  };

  const renderGallery = (images) => {
    if (!galleryContainer.length) {
      return;
    }

    hideGalleryLoader();

    if (!images.length) {
      galleryEmptyState.removeClass("d-none");
      return;
    }

    galleryImages = images;
    galleryContainer.empty();
    images.forEach((src, index) => {
      const item = $(`
        <button class="gallery-item" type="button" data-index="${index}" aria-label="Abrir arreglo ${index + 1}">
          <img src="${src}" loading="lazy" alt="Arreglo floral ${index + 1}" />
        </button>
      `);
      galleryContainer.append(item);
    });
  };

  findImages()
    .then(renderGallery)
    .catch(() => {
      hideGalleryLoader();
      galleryEmptyState.removeClass("d-none");
    });

  const isMobileView = () => window.matchMedia("(max-width: 575px)").matches;
  const scrollToGallery = (element) => {
    $("html, body").animate(
      {
        scrollTop: element.offset().top - 70,
      },
      500
    );
  };

  const shouldShowFab = () =>
    isMobileView() && galleryContainer.hasClass("is-expanded");

  const updateGalleryFab = () => {
    if (!galleryCloseButton.length) return;
    if (!shouldShowFab() || !gallerySection.length) {
      galleryCloseButton.removeClass("is-visible");
      return;
    }
    const rect = gallerySection[0].getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const isInView = rect.top < viewportHeight && rect.bottom > 0;
    galleryCloseButton.toggleClass("is-visible", isInView);
  };

  const openMobileGallery = () => {
    if (!galleryContainer.length) return;
    galleryContainer.addClass("is-expanded");
    if (isMobileView()) {
      mobileGalleryPreview.addClass("d-none");
      galleryCloseButton.removeClass("d-none");
      updateGalleryFab();
      setTimeout(() => {
        scrollToGallery(galleryContainer);
        updateGalleryFab();
      }, 120);
    }
  };

  const closeMobileGallery = () => {
    if (!galleryContainer.length || !isMobileView()) return;
    galleryContainer.removeClass("is-expanded");
    mobileGalleryPreview.removeClass("d-none");
    galleryCloseButton.addClass("d-none").removeClass("is-visible");
    setTimeout(() => scrollToGallery(mobileGalleryPreview), 100);
  };

  if (galleryToggle.length) {
    galleryToggle.on("click", openMobileGallery);
  }

  if (galleryCloseButton.length) {
    galleryCloseButton.on("click", closeMobileGallery);
  }

  const showImage = (index) => {
    if (!galleryImages.length || !lightboxImage.length) {
      return;
    }
    const normalized =
      (index + galleryImages.length) % galleryImages.length;
    currentImageIndex = normalized;
    lightboxImage.attr("src", galleryImages[normalized]);
  };

  const goToPrevImage = () => showImage(currentImageIndex - 1);
  const goToNextImage = () => showImage(currentImageIndex + 1);

  if (galleryContainer.length && lightboxElement) {
    galleryContainer.on("click", ".gallery-item", function () {
      const imageIndex = Number($(this).data("index"));
      if (Number.isNaN(imageIndex)) return;
      showImage(imageIndex);
      const modalInstance = bootstrap.Modal.getOrCreateInstance(lightboxElement);
      modalInstance.show();
    });

    if (prevButton.length) {
      prevButton.on("click", goToPrevImage);
    }
    if (nextButton.length) {
      nextButton.on("click", goToNextImage);
    }

    const handleKeydown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevImage();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextImage();
      }
    };

    lightboxElement.addEventListener("shown.bs.modal", () => {
      $(document).on("keydown", handleKeydown);
    });

    lightboxElement.addEventListener("hidden.bs.modal", () => {
      $(document).off("keydown", handleKeydown);
    });
  }

  // Animaciones de entrada
  const revealOnScroll = () => {
    const windowBottom = $(window).scrollTop() + $(window).height() - 80;
    $(".reveal").each(function () {
      const elementTop = $(this).offset().top;
      if (elementTop < windowBottom) {
        $(this).addClass("is-visible");
      }
    });
  };

  $(window).on("scroll resize", () => {
    revealOnScroll();
    updateGalleryFab();
  });
  revealOnScroll();
  updateGalleryFab();
});



/* =====================================================
   SKILL MACHIN STUDIO - MAIN JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    CustomCursor.init();
    Hero.init();
    About.init();
    VideoSection.init();
    Gallery.init();
    ScrollEffects.init();
    BackToTop.init();
    Footer.init();
});

/* =====================================================
   PRELOADER
   ===================================================== */
const Preloader = {
    init() {
        const preloader = document.getElementById('preloader');

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.classList.remove('no-scroll');
            }, 1500);
        });

        // Fallback - hide after 5 seconds max
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 5000);
    }
};

/* =====================================================
   NAVIGATION
   ===================================================== */
const Navigation = {
    init() {
        this.header = document.getElementById('header');
        this.menuToggle = document.getElementById('mobile-menu');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.bindEvents();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Scroll event
        window.addEventListener('scroll', () => this.handleScroll());

        // Active link on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    },

    toggleMenu() {
        this.menuToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    },

    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    },

    handleScroll() {
        if (window.scrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
    },

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
const CustomCursor = {
    init() {
        if (window.innerWidth < 1024) return;

        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');

        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';

            setTimeout(() => {
                this.follower.style.left = e.clientX + 'px';
                this.follower.style.top = e.clientY + 'px';
            }, 100);
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .gallery-item');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.follower.classList.add('active');
            });

            el.addEventListener('mouseleave', () => {
                this.follower.classList.remove('active');
            });
        });
    }
};

/* =====================================================
   HERO SECTION
   ===================================================== */
const Hero = {
    init() {
        this.createParticles();
    },

    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.2;

            container.appendChild(particle);
        }
    }
};

/* =====================================================
   ABOUT SECTION - COUNTER ANIMATION
   ===================================================== */
const About = {
    init() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;

        this.observeCounters();
    },

    observeCounters() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateCounters();
                }
            });
        }, { threshold: 0.5 });

        const aboutSection = document.querySelector('.about-stats');
        if (aboutSection) {
            observer.observe(aboutSection);
        }
    },

    animateCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
};

/* =====================================================
   VIDEO SECTION
   ===================================================== */
const VideoSection = {
    init() {
        this.video = document.getElementById('main-video');
        this.playBtn = document.getElementById('video-play-btn');
        this.videoSection = document.getElementById('video-section');

        if (!this.video || !this.playBtn) return;

        this.bindEvents();
        this.observeSection();
    },

    bindEvents() {
        this.playBtn.addEventListener('click', () => {
            this.video.play();
            this.playBtn.classList.add('hidden');
        });

        this.video.addEventListener('pause', () => {
            this.playBtn.classList.remove('hidden');
        });

        this.video.addEventListener('ended', () => {
            this.playBtn.classList.remove('hidden');
        });
    },

    // Pausar video cuando el usuario sale de la sección
    observeSection() {
        if (!this.videoSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Si la sección ya no es visible y el video está reproduciéndose
                if (!entry.isIntersecting && !this.video.paused) {
                    this.video.pause();
                    this.playBtn.classList.remove('hidden');
                }
            });
        }, {
            threshold: 0.2 // Se activa cuando menos del 20% del video es visible
        });

        observer.observe(this.videoSection);
    }
};

/* =====================================================
   GALLERY SECTION
   ===================================================== */
const Gallery = {
    // Configuración de imágenes - AGREGAR IMÁGENES AQUÍ
    // Nombres: img0, img1, img2, etc. en la carpeta img
    images: [
        // URLs de ejemplo - Reemplazar con imágenes locales: 'img/img0.jpg'
        { src: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=600', category: 'blackwork', title: 'Blackwork Art' },
        { src: 'https://images.unsplash.com/photo-1590246814883-57764eba3a52?w=600', category: 'realismo', title: 'Realismo' },
        { src: 'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=600', category: 'tradicional', title: 'Tradicional' },
        { src: 'https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=600', category: 'geometrico', title: 'Geométrico' },
        { src: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=600', category: 'blackwork', title: 'Dark Art' },
        { src: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?w=600', category: 'realismo', title: 'Portrait' },
        { src: 'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=600', category: 'tradicional', title: 'Old School' },
        { src: 'https://images.unsplash.com/photo-1614174486186-3eefa95e95d8?w=600', category: 'geometrico', title: 'Mandala' }
    ],

    // Para agregar imágenes locales, usa este formato:
    // Coloca las imágenes en la carpeta img con nombres: img0.jpg, img1.jpg, etc.
    /*
    localImages: [
        { src: 'img/img0.jpg', category: 'blackwork', title: 'Mi Trabajo 1' },
        { src: 'img/img1.jpg', category: 'realismo', title: 'Mi Trabajo 2' },
        { src: 'img/img2.jpg', category: 'tradicional', title: 'Mi Trabajo 3' },
        // Agregar más según sea necesario...
    ],
    */

    currentFilter: 'all',
    itemsPerLoad: 8,
    loadedItems: 0,
    isCollapsed: true,

    init() {
        this.grid = document.getElementById('gallery-grid');
        this.loader = document.getElementById('gallery-loader');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.toggleBtn = document.getElementById('toggle-gallery-btn');

        if (!this.grid) return;

        this.bindEvents();
        this.loadImages();
    },

    bindEvents() {
        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.filterGallery();
            });
        });

        // Load more
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        // Mobile toggle
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleGallery());
        }

        // Check if mobile on resize
        window.addEventListener('resize', () => this.checkMobileState());
        this.checkMobileState();
    },

    checkMobileState() {
        if (window.innerWidth < 768) {
            if (this.isCollapsed) {
                this.grid.classList.add('collapsed');
            }
        } else {
            this.grid.classList.remove('collapsed');
        }
    },

    toggleGallery() {
        this.isCollapsed = !this.isCollapsed;
        this.grid.classList.toggle('collapsed');

        const btnText = this.toggleBtn.querySelector('span');
        const btnIcon = this.toggleBtn.querySelector('i');

        if (this.isCollapsed) {
            btnText.textContent = 'Expandir Galería';
            btnIcon.className = 'fas fa-th';
        } else {
            btnText.textContent = 'Colapsar Galería';
            btnIcon.className = 'fas fa-minus';
        }

        this.toggleBtn.classList.toggle('active');
    },

    loadImages() {
        // Show loader
        this.loader.classList.remove('hidden');

        // Simulate loading delay for effect
        setTimeout(() => {
            this.loader.classList.add('hidden');
            this.renderImages();
            this.initLightbox();
        }, 1500);
    },

    renderImages() {
        const imagesToRender = this.images.slice(0, this.itemsPerLoad);
        this.loadedItems = imagesToRender.length;

        imagesToRender.forEach((img, index) => {
            this.createGalleryItem(img, index);
        });

        this.updateLoadMoreVisibility();
    },

    createGalleryItem(imgData, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', imgData.category);
        item.style.animationDelay = `${index * 0.1}s`;

        item.innerHTML = `
            <a href="${imgData.src}" class="glightbox" data-gallery="tattoos" data-glightbox="title: ${imgData.title}">
                <img src="${imgData.src}" alt="${imgData.title}" loading="lazy">
                <div class="gallery-item-overlay">
                    <span class="gallery-item-category">${imgData.category}</span>
                    <h3 class="gallery-item-title">${imgData.title}</h3>
                </div>
                <div class="gallery-item-icon">
                    <i class="fas fa-search-plus"></i>
                </div>
            </a>
        `;

        // Add skeleton loading
        const imgEl = item.querySelector('img');
        item.classList.add('skeleton');

        imgEl.addEventListener('load', () => {
            item.classList.remove('skeleton');
        });

        imgEl.addEventListener('error', () => {
            item.classList.remove('skeleton');
            imgEl.src = 'https://via.placeholder.com/600x600/1a1a1a/caf619?text=Imagen+no+disponible';
        });

        this.grid.appendChild(item);
    },

    filterGallery() {
        const items = this.grid.querySelectorAll('.gallery-item');

        items.forEach(item => {
            const category = item.getAttribute('data-category');

            if (this.currentFilter === 'all' || category === this.currentFilter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    },

    loadMore() {
        const remainingImages = this.images.slice(this.loadedItems);
        const nextBatch = remainingImages.slice(0, this.itemsPerLoad);

        nextBatch.forEach((img, index) => {
            this.createGalleryItem(img, index);
        });

        this.loadedItems += nextBatch.length;
        this.updateLoadMoreVisibility();

        // Reinitialize lightbox for new items
        this.initLightbox();
    },

    updateLoadMoreVisibility() {
        if (this.loadMoreBtn) {
            if (this.loadedItems >= this.images.length) {
                this.loadMoreBtn.style.display = 'none';
            } else {
                this.loadMoreBtn.style.display = 'inline-flex';
            }
        }
    },

    initLightbox() {
        // Initialize GLightbox
        if (typeof GLightbox !== 'undefined') {
            GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                autoplayVideos: true,
                closeOnOutsideClick: true,
                openEffect: 'zoom',
                closeEffect: 'fade',
                cssEfects: {
                    fade: { in: 'fadeIn', out: 'fadeOut' },
                    zoom: { in: 'zoomIn', out: 'zoomOut' }
                }
            });
        }
    }
};

/* =====================================================
   SCROLL EFFECTS - AOS & GSAP
   ===================================================== */
const ScrollEffects = {
    init() {
        this.initAOS();
        this.initGSAP();
    },

    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 100
            });
        }
    },

    initGSAP() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        // Parallax effect on hero image
        gsap.to('.hero-bg-image', {
            yPercent: 30,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Section titles animation
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Service cards stagger animation
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power3.out'
            });
        });

        // Timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            const direction = index % 2 === 0 ? -50 : 50;

            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: direction,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }
};

/* =====================================================
   BACK TO TOP BUTTON
   ===================================================== */
const BackToTop = {
    init() {
        this.button = document.getElementById('back-to-top');
        if (!this.button) return;

        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

/* =====================================================
   FOOTER
   ===================================================== */
const Footer = {
    init() {
        this.setCurrentYear();
    },

    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
};

/* =====================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* =====================================================
   LAZY LOADING FOR IMAGES
   ===================================================== */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* =====================================================
   HELPER FUNCTION - Add local images easily
   ===================================================== */
function addLocalImagesToGallery(count, categoryPattern = ['blackwork', 'realismo', 'tradicional', 'geometrico']) {
    /**
     * Uso: addLocalImagesToGallery(10)
     * Esto creará entradas para img0.jpg hasta img9.jpg
     *
     * Pasos:
     * 1. Coloca tus imágenes en la carpeta 'img' con nombres: img0.jpg, img1.jpg, img2.jpg, etc.
     * 2. Llama esta función con el número total de imágenes
     * 3. Las categorías se asignarán de forma rotativa
     */
    const images = [];
    for (let i = 0; i < count; i++) {
        images.push({
            src: `img/img${i}.jpg`,
            category: categoryPattern[i % categoryPattern.length],
            title: `Tatuaje ${i + 1}`
        });
    }
    return images;
}

// Ejemplo de uso (descomenta para usar imágenes locales):
// Gallery.images = addLocalImagesToGallery(20);

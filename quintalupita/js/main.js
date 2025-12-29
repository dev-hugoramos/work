/* ========================================
   QUINTA LUPITA - JavaScript Principal
======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initSeasonalMessage();
    initNavbar();
    initParticles();
    initCustomCursor();
    initGalleryLightbox();
    initBackToTop();
    initSmoothScroll();
    initAOS();
    setCurrentYear();
});

/* ========================================
   PRELOADER
======================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';

            // Show seasonal message after preloader
            setTimeout(checkSeasonalMessage, 500);
        }, 2500);
    });
}

/* ========================================
   SEASONAL MESSAGE (Christmas & New Year)
======================================== */
function initSeasonalMessage() {
    // This will be triggered after preloader
}

function checkSeasonalMessage() {
    const today = new Date();
    const month = today.getMonth(); // 0-11 (January = 0, December = 11)
    const day = today.getDate();
    const year = today.getFullYear();

    const seasonalContainer = document.getElementById('seasonal-message');
    const seasonalText = document.getElementById('seasonal-text');

    // Check if user already closed the message today
    const lastClosed = localStorage.getItem('seasonalMessageClosed');
    const todayString = `${year}-${month}-${day}`;

    if (lastClosed === todayString) {
        return; // Don't show if already closed today
    }

    let message = '';
    let shouldShow = false;

    // December 24-31: Christmas message
    if (month === 11 && day >= 24 && day <= 31) {
        message = 'Gracias por su preferencia, les deseamos felices fiestas a todos nuestros queridos clientes. Los esperamos el siguiente año con los brazos abiertos para seguir siendo parte de sus celebraciones especiales.';
        shouldShow = true;
    }
    // January 1-7: New Year message (extended a few days for visibility)
    else if (month === 0 && day >= 1 && day <= 7) {
        message = `¡Feliz ${year}! Quinta Lupita les desea un año lleno de bendiciones, alegría y momentos inolvidables. Los esperamos para hacer de sus celebraciones algo extraordinario.`;
        shouldShow = true;
    }

    if (shouldShow && seasonalContainer && seasonalText) {
        seasonalText.textContent = message;
        seasonalContainer.classList.remove('hidden');

        // Add show class with small delay for animation
        setTimeout(function() {
            seasonalContainer.classList.add('show');
        }, 100);

        // Auto-close after 8 seconds
        setTimeout(function() {
            closeSeasonalMessage();
        }, 8000);
    }
}

function closeSeasonalMessage() {
    const seasonalContainer = document.getElementById('seasonal-message');
    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    // Save to localStorage so it doesn't show again today
    localStorage.setItem('seasonalMessageClosed', todayString);

    seasonalContainer.classList.remove('show');

    setTimeout(function() {
        seasonalContainer.classList.add('hidden');
    }, 500);
}

// Función para mostrar el mensaje manualmente (para pruebas)
function showSeasonalMessage() {
    const seasonalContainer = document.getElementById('seasonal-message');
    const seasonalText = document.getElementById('seasonal-text');

    // Limpiar localStorage para permitir mostrar el mensaje
    localStorage.removeItem('seasonalMessageClosed');

    // Mensaje de agradecimiento
    const message = 'Gracias por su preferencia, les deseamos felices fiestas a todos nuestros queridos clientes. Los esperamos el siguiente año con los brazos abiertos para seguir siendo parte de sus celebraciones especiales.';

    if (seasonalContainer && seasonalText) {
        seasonalText.textContent = message;
        seasonalContainer.classList.remove('hidden');

        setTimeout(function() {
            seasonalContainer.classList.add('show');
        }, 100);

        // Auto-close after 8 seconds
        setTimeout(function() {
            closeSeasonalMessage();
        }, 8000);
    }
}

// Make functions available globally
window.closeSeasonalMessage = closeSeasonalMessage;
window.showSeasonalMessage = showSeasonalMessage;

/* ========================================
   NAVBAR
======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(function(section) {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

/* ========================================
   PARTICLES
======================================== */
function initParticles() {
    const particlesContainer = document.getElementById('particles');

    if (!particlesContainer) return;

    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random properties
    const size = Math.random() * 15 + 5;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;

    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
    `;

    container.appendChild(particle);
}

/* ========================================
   CUSTOM CURSOR
======================================== */
function initCustomCursor() {
    // Only on desktop with mouse
    if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (!cursor || !cursorFollower) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        // Cursor follows mouse directly
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;

        // Follower has more delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .amenity-card, .feature-card, .pricing-card');

    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });

        el.addEventListener('mouseleave', function() {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

/* ========================================
   GALLERY LIGHTBOX
======================================== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentIndex = 0;
    const images = [];

    // Collect all gallery images
    galleryItems.forEach(function(item, index) {
        const img = item.querySelector('img');
        images.push(img.src);

        item.addEventListener('click', function() {
            currentIndex = index;
            openLightbox(images[currentIndex]);
        });
    });

    function openLightbox(src) {
        lightboxImage.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImage.src = images[currentIndex];
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Close on overlay click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }
}

/* ========================================
   BACK TO TOP BUTTON
======================================== */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   SMOOTH SCROLL
======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   AOS INITIALIZATION
======================================== */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
}

/* ========================================
   SET CURRENT YEAR
======================================== */
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ========================================
   INTERSECTION OBSERVER FOR ANIMATIONS
======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(function(el) {
        observer.observe(el);
    });
}

/* ========================================
   COUNTER ANIMATION
======================================== */
function animateCounter(element, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(function() {
        current += increment;

        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

/* ========================================
   FORM VALIDATION (if needed in future)
======================================== */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(function(input) {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('error');
            }
        }
    });

    return isValid;
}

/* ========================================
   LAZY LOADING IMAGES
======================================== */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}

/* ========================================
   PARALLAX EFFECT
======================================== */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (!parallaxElements.length) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(function(el) {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* ========================================
   DEBOUNCE UTILITY
======================================== */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ========================================
   THROTTLE UTILITY
======================================== */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}
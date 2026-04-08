/**
 * PromoBeer - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initHeader();
    initTestimonialsSlider();
    initBackToTop();
    initSmoothScroll();
    initAnimations();
    initSmartDownload();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    
    if (toggle && navMobile) {
        toggle.addEventListener('click', function() {
            toggle.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close menu when any nav link is clicked (single page – scroll to section)
    const mobileLinks = document.querySelectorAll('.nav-mobile a[href^="#"]');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (toggle && navMobile) {
                toggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    if (!header) return;
    
    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', throttle(updateHeader, 100));
    updateHeader();
}

/**
 * Testimonials Slider
 */
function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    const dotsContainer = document.querySelector('.testimonials-dots');
    
    if (!track) return;
    
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let cardStepPx = 0;
    let colGap = 0;
    
    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const totalDots = Math.ceil(cards.length / cardsPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update dots
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === Math.floor(currentIndex / cardsPerView));
        });
    }
    
    // Get cards per view based on screen size
    function getCardsPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    function recalcStep() {
        cardsPerView = getCardsPerView();
        const cs = getComputedStyle(track);
        const gapVal = parseFloat(cs.columnGap || cs.gap || '0');
        colGap = isNaN(gapVal) ? 0 : gapVal;
        cardStepPx = Math.round((track.clientWidth / cardsPerView)) + colGap;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        const newIndex = index * cardsPerView;
        currentIndex = Math.min(newIndex, cards.length - cardsPerView);
        requestAnimationFrame(() => {
            scrollToCard();
            updateDots();
        });
    }
    
    // Scroll to current card
    function scrollToCard() {
        if (cards.length === 0) return;
        const left = Math.max(0, currentIndex * cardStepPx);
        track.scrollTo({ left, behavior: 'smooth' });
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = Math.min(currentIndex + 1, cards.length - cardsPerView);
        requestAnimationFrame(() => {
            scrollToCard();
            updateDots();
        });
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = Math.max(currentIndex - 1, 0);
        requestAnimationFrame(() => {
            scrollToCard();
            updateDots();
        });
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Handle resize
    window.addEventListener('resize', throttle(function() {
        recalcStep();
        createDots();
        currentIndex = 0;
        scrollToCard();
    }, 200));
    
    // Initialize
    recalcStep();
    createDots();
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (!backToTop) return;
    
    function toggleButton() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', throttle(toggleButton, 100));
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll Animations
 */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animateElements = document.querySelectorAll(
        '.program-card, .testimonial-card, .quem-somos-stat'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${(index % 6) * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Smart Download Button
 */
function initSmartDownload() {
    const GOOGLE_PLAY = 'https://play.google.com/store/apps/details?id=com.promobeerapp.promobeer';
    const APP_STORE   = 'https://apps.apple.com/br/app/promobeer/id1033253442';

    const btn = document.getElementById('btn-download-app');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const ua = navigator.userAgent;
        const isIOS = /iPhone|iPad|iPod/i.test(ua);
        const isMac = /Macintosh|MacIntel/i.test(ua);
        const url = (isIOS || isMac) ? APP_STORE : GOOGLE_PLAY;
        window.open(url, '_blank');
    });
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

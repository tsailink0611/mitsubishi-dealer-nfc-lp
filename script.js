/**
 * 三菱自動車ディーラー NFC名刺LP - script.js
 * Premium Redesign – subtle, elegant interactions
 */

// CAMPAIGN CAROUSEL
(function initCarousel() {
    const carousel = document.getElementById('campaign-carousel');
    const dots     = document.querySelectorAll('.carousel-dot');
    if (!carousel || !dots.length) return;

    let currentIndex  = 0;
    let autoPlayTimer = null;

    function updateDots(index) {
        dots.forEach((dot, i) => { dot.classList.toggle('active', i === index); });
        currentIndex = index;
    }

    function scrollToCard(index) {
        const cards  = carousel.querySelectorAll('.campaign-card');
        const card   = cards[index];
        if (!card) return;
        const padding = parseInt(getComputedStyle(carousel).paddingLeft) || 0;
        carousel.scrollTo({ left: card.offsetLeft - padding, behavior: 'smooth' });
        updateDots(index);
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(() => {
            const total = carousel.querySelectorAll('.campaign-card').length;
            scrollToCard((currentIndex + 1) % total);
        }, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            scrollToCard(parseInt(dot.dataset.index));
            stopAutoPlay();
            startAutoPlay();
        });
    });

    let scrollTimer;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const cards    = carousel.querySelectorAll('.campaign-card');
            const scrollPos = carousel.scrollLeft + carousel.offsetWidth / 2;
            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                if (Math.abs(scrollPos - cardCenter) < card.offsetWidth / 2 + 16) updateDots(i);
            });
        }, 60);
    });

    carousel.addEventListener('touchstart', stopAutoPlay, { passive: true });
    carousel.addEventListener('touchend', () => {
        stopAutoPlay();
        startAutoPlay();
    }, { passive: true });
    startAutoPlay();
})();


// SCROLL ANIMATIONS
(function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.animate-fade-up').forEach(el => observer.observe(el));
})();


// VIDEO MODAL
(function initVideoModal() {
    const placeholder = document.getElementById('video-placeholder');
    const modal       = document.getElementById('video-modal');
    const closeBtn    = document.getElementById('video-modal-close');
    const iframe      = document.getElementById('video-iframe');
    if (!modal) return;

    function openModal() {
        if (iframe && iframe.dataset.src) iframe.src = iframe.dataset.src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (iframe) setTimeout(() => { iframe.src = ''; }, 400);
    }

    if (placeholder) {
        placeholder.addEventListener('click', openModal);
        placeholder.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); }
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
})();


// STICKY CTA
(function initStickyCTA() {
    const stickyCTA = document.getElementById('sticky-line-cta');
    const hero      = document.getElementById('hero');
    if (!stickyCTA || !hero) return;
    stickyCTA.classList.add('hidden');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            stickyCTA.classList.toggle('hidden', entry.isIntersecting);
        });
    }, { threshold: 0.08 });
    observer.observe(hero);
})();


// LINE CLICK TRACKING (GA4 optional)
(function initLineTracking() {
    document.querySelectorAll('[href*="line.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'line_add_friend', { event_category: 'CTA', event_label: btn.id || 'line_btn' });
            }
        });
    });
})();


// SMOOTH SCROLL
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
})();

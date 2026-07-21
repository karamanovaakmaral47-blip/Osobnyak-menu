(function() {
    'use strict';

    // =============================================
    // 1. ФОН НА ВСЮ СТРАНИЦУ
    //    ПК: фото растянуты на всю страницу
    //    ТЕЛЕФОН: полосы по реальным пропорциям фото (без зума)
    // =============================================
    const bgContainer = document.getElementById('particles-container');

    if (bgContainer) {
        const PHOTOS = [
            'hero-masquerade.jpeg',
            'aperitif-champagne.jpeg',
            'bar-tower.jpeg',
            'garden-fountain.jpeg',
            'IMG_1495.JPG.jpeg',
            'IMG_1496.JPG.jpeg',
            'IMG_1497.JPG.jpeg',
            'IMG_1498.JPG.jpeg',
            'IMG_1499.JPG.jpeg',
            'IMG_1500.JPG.jpeg',
            'IMG_1501.JPG.jpeg',
            'IMG_1502.JPG.jpeg',
            'IMG_1503.JPG.jpeg',
            'IMG_1504.JPG.jpeg',
            'IMG_1505.JPG.jpeg',
            'IMG_1506.JPG.jpeg',
            'IMG_1507.JPG.jpeg'
        ];

        const OVERLAP = 0.12;
        const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

        let bands = [];
        let photoAspect = null; // naturalHeight / naturalWidth
        let aspectLoaded = false;

        function loadAspectRatio(callback) {
            if (aspectLoaded) { callback(); return; }
            const img = new Image();
            img.onload = function() {
                photoAspect = img.naturalHeight / img.naturalWidth;
                aspectLoaded = true;
                callback();
            };
            img.onerror = function() {
                photoAspect = 2560 / 1440; // запасное значение по вашим фото
                aspectLoaded = true;
                callback();
            };
            img.src = 'images/' + PHOTOS[0];
        }

        function applyMaskTo(band) {
            const maskGradient = 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)';
            band.style.maskImage = maskGradient;
            band.style.webkitMaskImage = maskGradient;
            band.style.maskMode = 'alpha';
            band.style.webkitMaskMode = 'alpha';
        }

        function makeBand(file) {
            const band = document.createElement('div');
            band.className = 'bg-band';
            band.style.backgroundImage =
                "linear-gradient(180deg, rgba(18,8,6,0.30) 0%, rgba(18,8,6,0.50) 50%, rgba(18,8,6,0.30) 100%), url('images/" + file + "')";
            applyMaskTo(band);
            return band;
        }

        // ===== ПК: полосы растянуты на всю страницу =====
        function layoutDesktop() {
            bgContainer.innerHTML = '';
            bands = PHOTOS.map(makeBand);
            bands.forEach(b => bgContainer.appendChild(b));

            const total = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight
            );
            const baseBandHeight = total / PHOTOS.length;
            const bandHeight = baseBandHeight * (1 + OVERLAP * 2);

            bgContainer.style.height = total + 'px';
            bands.forEach(function(band, i) {
                const topOffset = (baseBandHeight * i) - (bandHeight * OVERLAP / 2);
                band.style.height = bandHeight + 'px';
                band.style.top = Math.max(0, topOffset) + 'px';
            });
        }

        // ===== ТЕЛЕФОН: высота полосы = реальные пропорции фото,
        //       фото идут по порядку и повторяются по циклу до конца страницы =====
        function layoutMobile() {
            const viewportWidth = window.innerWidth;
            const total = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight
            );

            const naturalBandHeight = viewportWidth * photoAspect;
            const bandHeight = naturalBandHeight * (1 + OVERLAP * 2);
            const step = naturalBandHeight;

            const bandsNeeded = Math.max(PHOTOS.length, Math.ceil(total / step) + 1);

            bgContainer.innerHTML = '';
            bands = [];
            for (let i = 0; i < bandsNeeded; i++) {
                const file = PHOTOS[i % PHOTOS.length];
                const band = makeBand(file);
                bgContainer.appendChild(band);
                bands.push(band);
            }

            bgContainer.style.height = total + 'px';
            bands.forEach(function(band, i) {
                const topOffset = (step * i) - (bandHeight * OVERLAP / 2);
                band.style.height = bandHeight + 'px';
                band.style.top = Math.max(0, topOffset) + 'px';
            });
        }

        function layoutBackground() {
            if (isMobile()) {
                loadAspectRatio(layoutMobile);
            } else {
                layoutDesktop();
            }
        }

        layoutBackground();

        window.addEventListener('load', function() {
            layoutBackground();
            setTimeout(layoutBackground, 500);
        });
        setTimeout(layoutBackground, 1000);
        setTimeout(layoutBackground, 2000);

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(layoutBackground, 150);
        });
        window.addEventListener('orientationchange', function() {
            setTimeout(layoutBackground, 300);
        });

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(layoutBackground);
        }
    }

    // =============================================
    // 2. ДЛИННЫЕ СПИСКИ В БАРЕ (2 колонки)
    // =============================================
    document.querySelectorAll('.bar-grid').forEach(function(grid) {
        grid.querySelectorAll('.bar-category').forEach(function(cat) {
            if (cat.querySelectorAll('.bar-item').length >= 15) {
                cat.classList.add('bar-category--wide');
                grid.appendChild(cat);
            }
        });
    });

    // =============================================
    // 3. УПРАВЛЕНИЕ ЯЗЫКАМИ
    // =============================================
    const langBtns = document.querySelectorAll('.lang-btn');
    const langContents = document.querySelectorAll('.lang-content');

    function setLanguage(lang) {
        langBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
        langContents.forEach(el => el.classList.toggle('active', el.dataset.lang === lang));
        localStorage.setItem('mansion-lang', lang);
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setLanguage(this.dataset.lang);
        });
    });

    const savedLang = localStorage.getItem('mansion-lang') || 'ru';
    setLanguage(savedLang);

    // =============================================
    // 4. ХЕДЕР ПРИ СКРОЛЛЕ
    // =============================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.pageYOffset > 60);
    });

    // =============================================
    // 5. АНИМАЦИЯ ПОЯВЛЕНИЯ
    // =============================================
    const fadeElements = document.querySelectorAll('.fade-up');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // =============================================
    // 6. КНОПКА "НАВЕРХ"
    // =============================================
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('show', window.pageYOffset > 400);
    });
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =============================================
    // 7. ГОД В ФУТЕРЕ
    // =============================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // =============================================
    // 8. ПЛАВНЫЙ СКРОЛЛ К МЕНЮ
    // =============================================
    document.querySelector('.hero-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#cheese')?.scrollIntoView({ behavior: 'smooth' });
    });

    // =============================================
    // 9. ФОРМА ОБРАТНОЙ СВЯЗИ → WHATSAPP
    // =============================================
    const WHATSAPP_NUMBER = '77020666766';

    const GREETINGS = {
        ru: 'Здравствуйте! Меня зовут',
        kk: 'Сәлеметсіз бе! Менің атым',
        en: 'Hello! My name is'
    };
    const FORM_LABELS = {
        ru: { phone: 'Телефон', message: 'Сообщение' },
        kk: { phone: 'Телефон', message: 'Хабарлама' },
        en: { phone: 'Phone', message: 'Message' }
    };

    document.querySelectorAll('.contact-form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const lang = form.dataset.langForm || 'ru';
            const name = (form.querySelector('[name="name"]') || {}).value?.trim() || '';
            const phone = (form.querySelector('[name="phone"]') || {}).value?.trim() || '';
            const message = (form.querySelector('[name="message"]') || {}).value?.trim() || '';

            const greeting = GREETINGS[lang] || GREETINGS.ru;
            const labels = FORM_LABELS[lang] || FORM_LABELS.ru;

            let text = greeting + ' ' + name + '.\n' + labels.phone + ': ' + phone;
            if (message) text += '\n' + labels.message + ': ' + message;

            const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
            window.open(url, '_blank', 'noopener');
            form.reset();
        });
    });

    console.log('🖤 Особняк · Mansion · Зәулім үй');
})();
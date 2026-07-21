(function() {
    'use strict';

    // =============================================
    // 1. ФОН НА ВСЮ СТРАНИЦУ — 4 ФОТО ПО ПОРЯДКУ,
    //    БЕЗ ПРОПУСКОВ, СВЕРХУ ВНИЗ:
    //    hero-masquerade → aperitif-champagne → bar-tower → garden-fountain
    // =============================================
    const bgContainer = document.getElementById('particles-container');

    if (bgContainer) {
        const PHOTOS = [
            'hero-masquerade.jpg.jpeg',
            'aperitif-champagne.webp.webp',
            'bar-tower.jpg.jpeg',
            'garden-fountain.jpg.jpeg'
        ];

        let bands = [];

        function buildBands(count) {
            bgContainer.innerHTML = '';
            bands = [];
            for (let i = 0; i < count; i++) {
                const file = PHOTOS[i % PHOTOS.length];
                const band = document.createElement('div');
                band.className = 'bg-band';
                band.style.backgroundImage =
                    "linear-gradient(180deg, rgba(18,8,6,0.35) 0%, rgba(18,8,6,0.55) 50%, rgba(18,8,6,0.35) 100%), url('images/" + file + "')";
                bgContainer.appendChild(band);
                bands.push(band);
            }
        }

        function layoutBackground() {
            const total = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight
            );
            // Полоса не должна быть намного выше экрана — иначе фото
            // приходится растягивать сильнее, чем позволяет его качество.
            const maxBandHeight = Math.max(window.innerHeight * 1.3, 650);
            let neededBands = Math.max(PHOTOS.length, Math.ceil(total / maxBandHeight));
            // округляем вверх до кратного 4, чтобы цикл из 4 фото завершался ровно
            neededBands = Math.ceil(neededBands / PHOTOS.length) * PHOTOS.length;

            if (bands.length !== neededBands) {
                buildBands(neededBands);
            }

            const bandHeight = total / bands.length;
            bgContainer.style.height = total + 'px';
            bands.forEach(function(band, i) {
                band.style.height = bandHeight + 'px';
                band.style.top = (bandHeight * i) + 'px';
            });
        }

        layoutBackground();
        // Пересчитываем после полной загрузки (шрифты/картинки меняют высоту страницы)
        window.addEventListener('load', layoutBackground);
        setTimeout(layoutBackground, 500);
        setTimeout(layoutBackground, 1500);

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(layoutBackground, 150);
        });
        window.addEventListener('orientationchange', function() {
            setTimeout(layoutBackground, 300);
        });

        // На случай подгрузки шрифтов, влияющих на высоту текста
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(layoutBackground);
        }
    }

    // =============================================
    // 1b. ДЛИННЫЕ СПИСКИ В БАРЕ (напр. виски) —
    //     делаем их компактнее: в 2 внутренние колонки
    //     на всю ширину раздела, вместо длинного хвоста
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
    // 2. УПРАВЛЕНИЕ ЯЗЫКАМИ
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
            if (bgContainer) setTimeout(layoutBackgroundSafe, 350);
        });
    });

    function layoutBackgroundSafe() {
        const evt = new Event('resize');
        window.dispatchEvent(evt);
    }

    const savedLang = localStorage.getItem('mansion-lang') || 'ru';
    setLanguage(savedLang);

    // =============================================
    // 3. ХЕДЕР ПРИ СКРОЛЛЕ
    // =============================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.pageYOffset > 60);
    });

    // =============================================
    // 4. АНИМАЦИЯ ПОЯВЛЕНИЯ
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
    // 5. КНОПКА "НАВЕРХ"
    // =============================================
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('show', window.pageYOffset > 400);
    });
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // =============================================
    // 6. ГОД В ФУТЕРЕ
    // =============================================
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // =============================================
    // 7. ПЛАВНЫЙ СКРОЛЛ К МЕНЮ
    // =============================================
    document.querySelector('.hero-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector('#cheese')?.scrollIntoView({ behavior: 'smooth' });
    });

    console.log('🖤 Особняк · Mansion · Зәулім үй');
})();
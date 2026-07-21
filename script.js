(function() {
    'use strict';

    // =============================================
    // 1. ФОН НА ВСЮ СТРАНИЦУ — 4 ФОТО С ПЛАВНЫМ ПЕРЕХОДОМ
    //    hero-masquerade.webp → aperitif-champagne.webp → bar-tower.jpeg → garden-fountain.jpeg
    //    БЕЗ ПОВТОРЕНИЙ, С ПЕРЕКРЫТИЕМ И МАСКОЙ
    // =============================================
    const bgContainer = document.getElementById('particles-container');

    if (bgContainer) {
        // Правильные имена файлов (как в папке images)
        const PHOTOS = [
            'hero-masquerade.webp',
            'aperitif-champagne.webp',
            'bar-tower.jpeg',
            'garden-fountain.jpeg'
        ];

        // Коэффициент перекрытия (высота полосы = 1/4 + 12% для мягкого перехода)
        const OVERLAP = 0.12; 
        let bands = [];

        function buildBands() {
            bgContainer.innerHTML = '';
            bands = [];
            PHOTOS.forEach(function(file) {
                const band = document.createElement('div');
                band.className = 'bg-band';
                band.style.backgroundImage =
                    "linear-gradient(180deg, rgba(18,8,6,0.30) 0%, rgba(18,8,6,0.50) 50%, rgba(18,8,6,0.30) 100%), url('images/" + file + "')";
                bgContainer.appendChild(band);
                bands.push(band);
            });
            // Применяем маску для плавного перехода
            applyMask();
        }

        function applyMask() {
            // Для каждой полосы – маска с прозрачностью на краях
            bands.forEach(function(band) {
                const maskGradient = 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)';
                band.style.maskImage = maskGradient;
                band.style.webkitMaskImage = maskGradient;
                // Чтобы маска работала в Safari
                band.style.maskMode = 'alpha';
                band.style.webkitMaskMode = 'alpha';
            });
        }

        function layoutBackground() {
            const total = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight
            );
            // Высота каждой полосы с учётом перекрытия
            const baseBandHeight = total / PHOTOS.length;
            const bandHeight = baseBandHeight * (1 + OVERLAP * 2); // перекрытие сверху и снизу

            // Пересоздаём, если количество полос изменилось
            if (bands.length !== PHOTOS.length) {
                buildBands();
            }

            bgContainer.style.height = total + 'px';
            bands.forEach(function(band, i) {
                // Смещение: каждая полоса начинается чуть раньше, чтобы перекрыть соседнюю
                const topOffset = (baseBandHeight * i) - (bandHeight * OVERLAP / 2);
                band.style.height = bandHeight + 'px';
                band.style.top = Math.max(0, topOffset) + 'px'; // первая полоса не уходит в минус
                // Чтобы фон не обрезался, используем cover на всех устройствах
                band.style.backgroundSize = 'cover';
                band.style.backgroundPosition = 'center center';
            });
        }

        // Первоначальная сборка
        buildBands();
        layoutBackground();

        // Обновление при изменениях
        window.addEventListener('load', function() {
            layoutBackground();
            // Вторая проверка для мобильных
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
    // 1b. ДЛИННЫЕ СПИСКИ В БАРЕ (2 колонки)
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
        });
    });

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
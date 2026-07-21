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
            'hero-masquerade.webp.webp',
            'aperitif-champagne.webp.webp',
            'bar-tower.jpg.jpeg',
            'garden-fountain.jpg.jpeg'
        ];

        const bands = PHOTOS.map(file => {
            const band = document.createElement('div');
            band.className = 'bg-band';
            band.style.backgroundImage =
                "linear-gradient(180deg, rgba(18,8,6,0.35) 0%, rgba(18,8,6,0.55) 50%, rgba(18,8,6,0.35) 100%), url('images/" + file + "')";
            bgContainer.appendChild(band);
            return band;
        });

        function layoutBackground() {
            const total = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
                window.innerHeight
            );
            const bandHeight = total / bands.length;
            // Зона плавного перехода между соседними фото —
            // чем больше, тем незаметнее шов (ограничиваем разумным пределом)
            const overlap = Math.min(280, bandHeight * 0.35);

            bgContainer.style.height = total + 'px';

            bands.forEach((band, i) => {
                const isFirst = i === 0;
                const isLast = i === bands.length - 1;

                const topExtra = isFirst ? 0 : overlap;
                const bottomExtra = isLast ? 0 : overlap;

                const top = (bandHeight * i) - topExtra;
                const height = bandHeight + topExtra + bottomExtra;

                band.style.top = top + 'px';
                band.style.height = height + 'px';

                // Плавное появление/исчезновение полосы на её собственных
                // краях — соседние полосы, наложенные друг на друга,
                // за счёт этого сшиваются в бесшовный градиент вместо
                // резкой полосы
                let mask;
                if (topExtra && bottomExtra) {
                    mask = `linear-gradient(to bottom, transparent 0, black ${topExtra}px, black calc(100% - ${bottomExtra}px), transparent 100%)`;
                } else if (topExtra) {
                    mask = `linear-gradient(to bottom, transparent 0, black ${topExtra}px, black 100%)`;
                } else if (bottomExtra) {
                    mask = `linear-gradient(to bottom, black 0, black calc(100% - ${bottomExtra}px), transparent 100%)`;
                } else {
                    mask = 'none';
                }
                band.style.maskImage = mask;
                band.style.webkitMaskImage = mask;
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

    // =============================================
    // 8. ФОРМА ОБРАТНОЙ СВЯЗИ → WHATSAPP
    // =============================================
    // TODO: замените на реальный номер WhatsApp ресторана
    // (в международном формате, без "+", пробелов и скобок)
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

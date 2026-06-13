    // ========== 1. PAGE LOADER ==========
    window.addEventListener('load', () => {
        const loader = document.getElementById('page-loader');
        gsap.to(loader, { opacity: 0, duration: 0.8, onComplete: () => loader.style.display = 'none' });
    });

    // ========== 2. STICKY NAVBAR ==========
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // ========== 3. MAGNETIC BUTTONS ==========
    document.querySelectorAll('.liquid-btn, .btn-outline').forEach(btn => {
        btn.classList.add('magnetic-btn');
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
        });
    });

    // ========== 4. MOUSE GLOW ==========
    const glow = document.getElementById('mouseGlow');
    window.addEventListener('mousemove', (e) => {
        gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.8, ease: "power2.out" });
    });

    // ========== 5. CARD SPOTLIGHT ==========
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.borderImage = `radial-gradient(circle at ${x}px ${y}px, rgba(245,176,66,0.5) 0%, transparent 60%) 1`;
        });
        card.addEventListener('mouseleave', () => { card.style.borderImage = 'none'; });
    });

    // ========== 6. MOBILE MENU ==========
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');
    function closeMenu() {
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
    }
    if(menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
        menuOverlay.addEventListener('click', closeMenu);
        document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
    }

    // ========== 7. GSAP ANIMATIONS ==========
    gsap.registerPlugin(ScrollTrigger);
    gsap.timeline()
        .from(".hero-content .hero-badge", { duration: 1, opacity: 0, y: -30 })
        .from(".hero-content h1", { duration: 1, opacity: 0, y: 40 }, "-=0.6")
        .from(".hero-content p, .catchphrase", { duration: 1, opacity: 0, y: 20, stagger: 0.2 }, "-=0.6")
        .from(".btn-group", { duration: 1, opacity: 0, scale: 0.9 }, "-=0.4");
    gsap.from(".service-card", { scrollTrigger: { trigger: ".services-grid", start: "top 80%" }, opacity: 0, y: 40, stagger: 0.2, duration: 0.8 });
    gsap.from(".testimonial-card", { scrollTrigger: { trigger: ".testimonial-grid", start: "top 80%" }, opacity: 0, y: 40, stagger: 0.2, duration: 0.8 });
    gsap.utils.toArray('.reveal').forEach(elem => {
        gsap.fromTo(elem, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: elem, start: "top 85%" } });
    });

    // ========== 8. FAQ ACCORDION ==========
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            document.querySelectorAll('.faq-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    gsap.to(openItem.querySelector('.faq-answer'), { maxHeight: 0, duration: 0.4 });
                }
            });
            item.classList.toggle('active');
            if (item.classList.contains('active')) gsap.to(answer, { maxHeight: answer.scrollHeight + 20, duration: 0.4 });
            else gsap.to(answer, { maxHeight: 0, duration: 0.4 });
        });
    });

    // ========== 9. WHATSAPP FORM ==========
    const form = document.getElementById('realContactForm');
    const feedbackDiv = document.getElementById('formFeedback');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const message = document.getElementById('formMsg').value.trim();
        if (!name || !email || !message) {
            feedbackDiv.innerHTML = '⚠️ Please fill all fields.';
            return;
        }
        const text = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
        window.open(`https://wa.me/254715817822?text=${text}`, '_blank');
        feedbackDiv.innerHTML = '✅ Opening WhatsApp – tap Send to notify Victor.';
        form.reset();
        setTimeout(() => feedbackDiv.innerHTML = '', 5000);
    });

    // ========== 10. PROJECTS DATA (with categories) ==========
    const projectsData = [
        { title: "Complete House Rewiring", img: "images/rewiring.png", link: "projects/project-rewiring.html", desc: "Modern panel upgrade", category: "wiring" },
        { title: "Solar Security Lights Install", img: "images/solar.png", link: "projects/project-solar.html", desc: "Motion sensor lighting", category: "solar" },
        { title: "TV Mount + Hidden Cables", img: "images/tvmount.png", link: "projects/project-tvmount.html", desc: "Perfect living room setup", category: "tvmount" },
        { title: "Fault Finding & Repair", img: "images/fault.png", link: "projects/project-fault.html", desc: "Emergency fix", category: "repair" }
    ];

    // ========== 11. SWIPER GALLERY WITH FILTERING ==========
    let swiperInstance = null;
    let currentFilter = 'all';
    const gallery = document.getElementById('fullscreenGallery');
    const closeGalleryBtn = document.getElementById('closeGallery');
    const swiperWrapper = document.getElementById('swiper-wrapper');
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    function buildSwiperGallery() {
        swiperWrapper.innerHTML = '';
        const filtered = currentFilter === 'all' ? projectsData : projectsData.filter(p => p.category === currentFilter);
        filtered.forEach(proj => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; background: rgba(0,0,0,0.5); border-radius: 2rem; padding: 1rem;';
            slide.innerHTML = `<img src="${proj.img}" alt="${proj.title}" style="width: 100%; max-height: 60vh; object-fit: cover; border-radius: 1.5rem;"><h3 style="margin: 1rem 0 0.5rem; color: #f5b042;">${proj.title}</h3><p>${proj.desc}</p>`;
            slide.addEventListener('click', () => window.open(proj.link, '_blank'));
            swiperWrapper.appendChild(slide);
        });
        if (swiperInstance) swiperInstance.destroy(true, true);
        swiperInstance = new Swiper('.mySwiper', { loop: true, pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }, speed: 600 });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            buildSwiperGallery();
        });
    });

    openGalleryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        buildSwiperGallery();
        gallery.style.visibility = 'visible';
        gallery.style.opacity = '1';
        document.body.style.overflow = 'hidden';
    });
    closeGalleryBtn.addEventListener('click', () => {
        gallery.style.visibility = 'hidden';
        gallery.style.opacity = '0';
        document.body.style.overflow = '';
    });
    gallery.addEventListener('click', (e) => { if (e.target === gallery) closeGalleryBtn.click(); });

    // ========== 12. FLOATING ACTION BUTTON ==========
    const fabMain = document.getElementById('fabMainBtn');
    const fabActions = document.querySelector('.fab-actions');
    fabMain.addEventListener('click', () => fabActions.classList.toggle('active'));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.fab-container') && fabActions.classList.contains('active')) fabActions.classList.remove('active');
    });

    // ========== 13. DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('light-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // ========== 14. INTERACTIVE MAP (Leaflet) ==========
    var map = L.map('serviceMap').setView([-0.1022, 34.7617], 7);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CartoDB', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
    L.marker([-0.1022, 34.7617]).addTo(map).bindPopup('VIQ Electrical HQ<br>Kisumu, Kenya').openPopup();
    L.circle([-0.1022, 34.7617], { radius: 300000, color: '#f5b042', fillColor: '#f5b042', fillOpacity: 0.1 }).addTo(map);

    // ========== 15. TYPED.JS ANIMATION ==========
    new Typed('#typed-words', {
        strings: ['Electrical Installation', 'Fault Finding', 'TV Mounting', 'Solar & Security Lights'],
        typeSpeed: 60, backSpeed: 40, backDelay: 1500, loop: true, cursorChar: '⚡'
    });

    // ========== 16. SMOOTH SCROLL & PAGE TRANSITIONS ==========
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if(id && id !== '#' && id !== '#openGalleryBtn') {
                e.preventDefault();
                const target = document.querySelector(id);
                if(target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('tel:') && !href.startsWith('https://wa.me') && !href.startsWith('javascript:')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.body.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => { window.location.href = href; }, 300);
            });
        }
    });
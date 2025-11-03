document.addEventListener('DOMContentLoaded', () => {
    // --- GLightbox Initialization ---
    // Initialize after the DOM is fully loaded.
    if (typeof GLightbox === 'function') {
        GLightbox({
            selector: '.glightbox',
            loop: true
        });
    }

    // --- Hero Slideshow (Homepage Only) ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        // Lazy load slide backgrounds that are not active
        const lazyLoadSlides = () => {
            slides.forEach((slide, index) => {
                // Skip the first slide as it's preloaded via inline style
                if (index > 0 && slide.dataset.bg) {
                    slide.style.backgroundImage = `url('${slide.dataset.bg}')`;
                }
            });
        };

        const heroSection = document.getElementById('hero'); // Get the hero section for touch events
        const prevBtn = document.getElementById('slide-prev');
        const nextBtn = document.getElementById('slide-next');
        let currentSlide = 0;
        const slideInterval = 5000; // Time per slide in milliseconds (5 seconds)
        let autoSlideInterval;
        // Swipe variables
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50; // Minimum pixels to register a swipe

        const goToSlide = (slideIndex) => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (slideIndex + slides.length) % slides.length; // Wrap around for negative numbers
            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextSlide, slideInterval);
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });

            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        // Add touch event listeners for swipe
        if (heroSection) {
            heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true }); // Use passive listener for better scroll performance

            heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                if (swipeDistance > minSwipeDistance) {
                    prevSlide(); // Swiped right (previous slide)
                    resetAutoSlide();
                } else if (swipeDistance < -minSwipeDistance) {
                    nextSlide(); // Swiped left (next slide)
                    resetAutoSlide();
                }
            }, { passive: true });
        }

        // Start the automatic slideshow
        startAutoSlide();

        // After the page is fully loaded, lazy load the other slides
        window.addEventListener('load', () => setTimeout(lazyLoadSlides, 500));
    }

    // --- Contact Form AJAX Submission ---
    const contactForm = document.getElementById('contact-form');
    // Only run this code if the contact form exists on the page
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission
            const form = this;
            const formData = new FormData(form);
            const statusMessage = document.getElementById('form-status-message');

            // Show a "sending" message
            if (statusMessage) statusMessage.innerHTML = 'Sending...';
            if (statusMessage) statusMessage.style.display = 'block';

            fetch(form.action, {
                method: 'POST',
                // Pass the FormData object directly. The browser will set the
                // correct 'Content-Type: multipart/form-data' header.
                body: formData,
                headers: {
                    'Accept': 'application/json' // Important for FormSubmit.co to send a JSON response
                }
            }); // The form data is sent in the background.

            // Immediately redirect to the thank you page as requested.
            // The form submission will continue to process in the background.
            window.location.href = 'thank-you.html';
        });
    }

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            // Remove the preloader from the DOM after the transition ends
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
            });
        });
    }

    // --- Staggered Animation for Service Page Cards ---
    const servicePageCards = document.querySelectorAll('.service-page-card');
    if (servicePageCards.length > 0) {
        servicePageCards.forEach((card, index) => {
            // Add the fade-in class to the parent column div
            if (card.parentElement) {
                card.parentElement.classList.add('fade-in-section');
                // Set a staggered delay for the animation
                card.parentElement.style.transitionDelay = `${index * 0.1}s`;
            }
        });
    }

    // --- Fade-in Section on Scroll (Intersection Observer) ---
    const sectionsToFade = document.querySelectorAll('.fade-in-section');
    if (sectionsToFade.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px' // Start animation when section is 100px into view
        });

        sectionsToFade.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // --- Testimonials Slider (Swiper.js) ---
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    // Only run this code if the slider exists on the page.
    if (testimonialsSlider) {
        // Swiper is assumed to be loaded globally
        new Swiper('.testimonials-slider', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    // --- Side Navigation (Hamburger Menu) ---
    const menuTrigger = document.getElementById('menu-trigger');
    const sideNav = document.getElementById('side-nav');
    const sideNavOverlay = document.getElementById('side-nav-overlay');

    if (menuTrigger && sideNav && sideNavOverlay) {
        const toggleMenu = () => {
            menuTrigger.classList.toggle('active');
            sideNav.classList.toggle('visible');
            sideNavOverlay.classList.toggle('visible');
            document.body.classList.toggle('no-scroll'); // Optional: prevent body scroll when menu is open
        };

        menuTrigger.addEventListener('click', toggleMenu);
        sideNavOverlay.addEventListener('click', toggleMenu);

        // Close menu if a link inside it is clicked
        sideNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu();
            }
        });
    }

    // --- Scroll-to-Top Button (FIXED) ---
    const scrollTopBtn = document.querySelector('.scroll-to-top');
    if (scrollTopBtn) {
        const handleScroll = () => {
            // Scroll-to-top button visibility
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScroll);

        // **FIX:** Add click handler to actually scroll to the top
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Footer Visibility on Scroll to Bottom ---
    const footer = document.querySelector('footer');
    if (footer) {
        const handleFooterVisibility = () => {
            // Get the position of the footer relative to the viewport
            const footerRect = footer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Show the footer if its top edge is inside the viewport OR if the user has scrolled down a bit.
            // This works for both short pages (where the footer is always in view) and long pages.
            if (footerRect.top < viewportHeight || window.scrollY > 100) {
                footer.classList.add('visible');
            } else {
                footer.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleFooterVisibility);
        handleFooterVisibility(); // Call once on load to set initial state
    }

    // --- Hide Header on Scroll (Mobile) ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollTop = 0;
        const headerHeight = navbar.offsetHeight;

        window.addEventListener('scroll', () => {
            // Only apply this behavior on mobile/tablet
            if (window.innerWidth <= 992) {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
                    // Scrolling Down
                    navbar.classList.add('navbar-hidden');
                } else {
                    // Scrolling Up
                    navbar.classList.remove('navbar-hidden');
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            }
        }, { passive: true });
    }

    // --- WhatsApp Widget ---
    const whatsappTrigger = document.getElementById('whatsapp-trigger');
    const whatsappWidget = document.getElementById('whatsapp-widget');
    const whatsappCloseBtn = document.getElementById('whatsapp-widget-close');

    if (whatsappTrigger && whatsappWidget && whatsappCloseBtn) {
        whatsappTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            whatsappWidget.classList.toggle('visible');
        });

        whatsappCloseBtn.addEventListener('click', () => {
            whatsappWidget.classList.remove('visible');
        });
    }
});
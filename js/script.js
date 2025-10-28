document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor (Desktop Only) ---
    const cursorDot = document.querySelector('.cursor-dot');
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (cursorDot && !isTouchDevice) {
        // If it's a desktop, make the cursor follow the mouse
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
        });
    } else if (cursorDot) {
        // If it's a touch device, hide the custom cursor completely
        cursorDot.style.display = 'none';
    }

    // --- Hero Slideshow (Homepage Only) ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000; // Time per slide in milliseconds (5 seconds)

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        setInterval(nextSlide, slideInterval);
    }

    // --- Contact Form AJAX Submission ---
    const contactForm = document.getElementById('contact-form');
    // Only run this code if the contact form exists on the page
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent the default form submission

            const formData = new FormData(this);
            const action = this.getAttribute('action');

            // Send the form data in the background. We don't wait for a response.
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).catch(error => {
                // Log any errors in the console for debugging, but don't bother the user.
                console.error('Background form submission error:', error);
            });

            // --- The "Super Fast" Part ---
            // Redirect the user immediately without waiting for the fetch to complete.
            window.location.href = 'thank-you.html';
        });
    }

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => preloader.remove());
        });
    }

    // --- Fade-in Section on Scroll ---
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

    // --- GLightbox Initialization ---
    // Only initialize GLightbox if the function is available (meaning the script loaded)
    if (typeof GLightbox === 'function') {
        GLightbox({
            selector: '.glightbox'
        });
    }

    // --- Staggered Animation for Service Page Cards ---
    const servicePageCards = document.querySelectorAll('.service-page-card');
    if (servicePageCards.length > 0) {
        servicePageCards.forEach((card, index) => {
            card.parentElement.classList.add('fade-in-section');
            card.parentElement.style.animationDelay = `${(index * 0.1) + 0.1}s`;
        });
    }

    // --- Testimonials Slider (Swiper.js) ---
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    // Only run this code if the slider exists on the page.
    // This prevents errors on pages without the slider, like services.html.
    if (testimonialsSlider) {
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

    // --- Scroll-to-Top Button ---
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
    }

    // --- Footer Visibility on Scroll to Bottom ---
    const footer = document.querySelector('footer');
    if (footer) {
        const handleFooterVisibility = () => {
            // Check if user has scrolled to the bottom of the page
            // A small buffer (e.g., 5px) helps on some devices
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5) {
                footer.classList.add('visible');
            } else {
                footer.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleFooterVisibility);
        handleFooterVisibility(); // Run on page load in case the page is not scrollable

        // Also run after all images have loaded to get the correct page height
        window.addEventListener('load', handleFooterVisibility);
    }


});
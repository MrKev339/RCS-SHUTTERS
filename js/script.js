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
    // Use DOMContentLoaded to hide the preloader as soon as the page is interactive,
    // instead of waiting for all images to load ('load' event).
    if (preloader) {
        // The preloader was blocking clicks. Hide it directly and immediately.
        // The 'transitionend' event was not firing because no transition was defined in the CSS.
        preloader.style.display = 'none';
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
            const isMobileView = window.innerWidth <= 768; // Define mobile breakpoint

            if (isMobileView) {
                // Mobile-specific sticky footer logic: show after scrolling down a bit
                if (window.scrollY > 100) { // Lower threshold for mobile
                    footer.classList.add('visible');
                } else {
                    footer.classList.remove('visible');
                }
            } else {
                // Desktop-specific scroll-reveal footer logic
                // Show when the footer enters the viewport or after significant scroll
                const footerRect = footer.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                if (footerRect.top < viewportHeight - 50 || window.scrollY > 500) { // Adjust 500px threshold as needed
                    footer.classList.add('visible');
                } else {
                    footer.classList.remove('visible');
                }
            }
        };

        window.addEventListener('scroll', handleFooterVisibility);
        handleFooterVisibility(); // Call once on load to set initial state
    }
});
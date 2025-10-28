document.addEventListener('DOMContentLoaded', () => {
    // --- Custom Cursor (Desktop Only) ---
    const cursorDot = document.querySelector('.cursor-dot');
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (cursorDot) {
        if (!isTouchDevice) {
            // If it's a desktop, make the cursor follow the mouse
            window.addEventListener('mousemove', (e) => {
                // Using transform for better performance than left/top
                cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        } else {
            // If it's a touch device, hide the custom cursor completely
            cursorDot.style.display = 'none';
        }
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
        // The slideshow should start after the initial page content is loaded
        setTimeout(() => {
            setInterval(nextSlide, slideInterval);
        }, slideInterval); // Wait for the first slide to show for the interval duration
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

    // --- GLightbox Initialization ---
    // Only initialize GLightbox if the function is available (meaning the script loaded)
    if (typeof GLightbox === 'function') {
        GLightbox({
            selector: '.glightbox'
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
            // Check if user has scrolled near the bottom of the page
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
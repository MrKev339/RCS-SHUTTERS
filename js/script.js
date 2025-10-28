document.addEventListener('DOMContentLoaded', () => {
    // --- Hero Slideshow ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        const slideInterval = 5000; // Time per slide in milliseconds (5 seconds)

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };
        1
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

            fetch(action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Important for FormSubmit
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Redirect to a thank-you page on successful submission
                        window.location.href = 'thank-you.html';
                    } else {
                        // Handle errors if the submission fails
                        alert('There was a problem with your submission. Please try again.');
                    }
                })
                .catch(error => console.error('Error submitting form:', error));
        });
    }

    // --- Scroll-to-Top Button ---
    const scrollTopBtn = document.querySelector('.scroll-to-top');

    const handleScroll = () => {
        // Scroll-to-top button visibility
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll);

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

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        document.body.classList.add('loading');
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
                document.body.classList.remove('loading');
            });
        });
    }

    // --- GLightbox Initialization ---
    const lightbox = GLightbox({
        selector: '.glightbox'
    });

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
    // Only run this code if the slider exists on the page
    if (testimonialsSlider) {
        const swiper = new Swiper('.testimonials-slider', {
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

    // Note: The logic for the bottom nav active state has been removed as the bottom nav is no longer used.

});
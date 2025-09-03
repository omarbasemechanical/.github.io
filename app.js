// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                const offsetTop = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    // Navbar scroll effect
    function handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(252, 252, 249, 0.95)';
                navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)';
            } else {
                navbar.style.background = 'var(--color-surface)';
                navbar.style.boxShadow = 'none';
            }
        }
    }

    // Skills animation
    function animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        const skillsSection = document.getElementById('skills');
        
        if (skillsSection) {
            const skillsSectionTop = skillsSection.offsetTop;
            const skillsSectionHeight = skillsSection.offsetHeight;
            const scrollPos = window.scrollY + window.innerHeight;

            if (scrollPos >= skillsSectionTop && scrollPos <= skillsSectionTop + skillsSectionHeight) {
                skillItems.forEach(item => {
                    if (!item.classList.contains('animated')) {
                        const progressBar = item.querySelector('.skill-progress');
                        const targetWidth = progressBar.getAttribute('data-width');
                        
                        setTimeout(() => {
                            progressBar.style.width = targetWidth + '%';
                            item.classList.add('animated');
                        }, Math.random() * 500); // Stagger animations
                    }
                });
            }
        }
    }

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory === filterValue) {
                        card.style.display = 'block';
                        card.classList.remove('hidden');
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // Back to top button - FIXED
    const backToTopBtn = document.getElementById('backToTop');

    function toggleBackToTopBtn() {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact form handling - FIXED
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Create mailto link
            const mailtoSubject = encodeURIComponent(subject);
            const mailtoBody = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
            const mailtoLink = `mailto:omarbasemm1@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
            
            try {
                // Open email client
                window.open(mailtoLink, '_self');
                
                // Show success message
                showNotification('Opening email client... Thank you for your message!', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    this.reset();
                }, 1000);
            } catch (error) {
                showNotification('Error opening email client. Please contact directly at omarbasemm1@gmail.com', 'error');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--space-16);
            gap: var(--space-12);
        `;

        const notificationMessage = notification.querySelector('.notification-message');
        notificationMessage.style.cssText = `
            color: var(--color-text);
            font-size: var(--font-size-sm);
            flex: 1;
        `;

        const notificationClose = notification.querySelector('.notification-close');
        notificationClose.style.cssText = `
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: var(--space-4);
            border-radius: var(--radius-sm);
            transition: background var(--duration-fast) var(--ease-standard);
        `;

        // Set colors based on type
        if (type === 'success') {
            notification.style.borderLeftColor = 'var(--color-success)';
            notification.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            notification.style.borderLeftColor = 'var(--color-error)';
            notification.style.borderLeftWidth = '4px';
        }

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .timeline-item, .leadership-item, .achievement-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .project-card, .timeline-item, .leadership-item, .achievement-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s var(--ease-standard);
        }
        
        .project-card.animate-in, .timeline-item.animate-in, .leadership-item.animate-in, .achievement-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification-close:hover {
            background: var(--color-secondary) !important;
        }
    `;
    document.head.appendChild(style);

    // Scroll event listeners
    let ticking = false;
    
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavLink();
                handleNavbarScroll();
                toggleBackToTopBtn();
                animateSkills();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calls
    updateActiveNavLink();
    handleNavbarScroll();
    toggleBackToTopBtn();

    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

    // Project card hover effects
    const projectCardsForHover = document.querySelectorAll('.project-card');
    projectCardsForHover.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-4px)';
        });
    });

    // Add click handlers for social links
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
        });
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Add focus management for mobile menu
    if (hamburger) {
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Add focus styles for better accessibility
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = 'var(--focus-outline)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Console welcome message
    console.log(`
    ╔══════════════════════════════════════════════════════════════════╗
    ║                    Omar Basem Abdulsalam                         ║
    ║                  Mechanical Design Engineer                      ║
    ║                                                                  ║
    ║  Portfolio built with HTML, CSS, and JavaScript                 ║
    ║  Contact: omarbasemm1@gmail.com                                  ║
    ║  LinkedIn: https://www.linkedin.com/in/omarbasemm/               ║
    ╚══════════════════════════════════════════════════════════════════╝
    `);

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
        });
    }

    // Add smooth reveal animation for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'all 1s var(--ease-standard)';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }

    // Add stagger effect for hero social links
    const heroSocialLinks = document.querySelectorAll('.hero-social .social-link');
    heroSocialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        link.style.transition = 'all 0.6s var(--ease-standard)';
        
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 800 + (index * 100));
    });

    // Preload critical sections
    const criticalSections = ['about', 'skills', 'projects'];
    criticalSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.willChange = 'transform, opacity';
        }
    });

    // Clean up will-change after animations
    setTimeout(() => {
        criticalSections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.willChange = 'auto';
            }
        });
    }, 3000);

    // Initialize project filter to show all projects
    const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterBtn && !allFilterBtn.classList.contains('active')) {
        allFilterBtn.classList.add('active');
    }

    // Ensure all project cards are visible initially
    projectCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('hidden');
    });
});
// Mechanical Engineering Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSkillBars();
    initContactForm();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('nav__menu--active');
            navToggle.classList.toggle('nav__toggle--active');
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 100;
                    const elementPosition = targetSection.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('nav__menu--active')) {
                        navMenu.classList.remove('nav__menu--active');
                        if (navToggle) {
                            navToggle.classList.remove('nav__toggle--active');
                        }
                    }

                    // Update active navigation link
                    updateActiveNavLink(this);
                }
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLinkOnScroll, 100));
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => link.classList.remove('nav__link--active'));
    activeLink.classList.add('nav__link--active');
}

// Update active nav link based on scroll position
function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('nav__link--active');
            });
            if (correspondingLink) {
                correspondingLink.classList.add('nav__link--active');
            }
        }
    });
}

// Skill bars animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('.skills');
    let hasAnimated = false;

    // Set up intersection observer for skill bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateSkillBars();
                hasAnimated = true;
            }
        });
    }, {
        threshold: 0.3
    });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

    function animateSkillBars() {
        skillBars.forEach((bar, index) => {
            const level = bar.getAttribute('data-level');
            
            setTimeout(() => {
                bar.style.width = level + '%';
                bar.style.transition = 'width 1.5s ease-out';
            }, index * 150); // Stagger animation
        });
    }
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    }
}

// Handle contact form submission
function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Validate form fields
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Show loading state
    submitBtn.textContent = 'Sending Message...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Show success message
        showNotification('Thank you for your message! I will get back to you within 24 hours.', 'success');
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }, 2000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const bgColor = type === 'success' ? 'var(--color-success)' : 
                    type === 'error' ? 'var(--color-error)' : 
                    'var(--color-info)';

    notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close" aria-label="Close notification">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close functionality
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    // Auto close after 6 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 6000);
}

// Close notification
function closeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Scroll effects
function initScrollEffects() {
    // Fade in animation for cards
    const cards = document.querySelectorAll('.project-card, .timeline-item, .education-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach((card, index) => {
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        cardObserver.observe(card);
    });
}

// Utility function: Throttle
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// Add mobile menu styles dynamically
const style = document.createElement('style');
style.textContent = `
    .nav__menu--active {
        position: fixed !important;
        top: 80px !important;
        left: 0 !important;
        right: 0 !important;
        background: var(--color-surface) !important;
        flex-direction: column !important;
        padding: var(--space-20) !important;
        box-shadow: var(--shadow-lg) !important;
        border-top: 1px solid var(--color-border) !important;
        display: flex !important;
        z-index: 999 !important;
    }

    .nav__menu--active .nav__link {
        padding: var(--space-12) 0 !important;
        border-bottom: 1px solid var(--color-border) !important;
    }

    .nav__menu--active .nav__link:last-child {
        border-bottom: none !important;
    }

    .nav__toggle--active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .nav__toggle--active span:nth-child(2) {
        opacity: 0;
    }

    .nav__toggle--active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }

    .nav__link--active {
        color: var(--color-primary) !important;
    }

    .notification__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .notification__close {
        background: none;
        border: none;
        color: inherit;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }

    .notification__close:hover {
        opacity: 1;
    }

    @media (min-width: 769px) {
        .nav__menu--active {
            position: static !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            background: transparent !important;
            flex-direction: row !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-top: none !important;
            display: flex !important;
        }

        .nav__menu--active .nav__link {
            padding: 0 !important;
            border-bottom: none !important;
        }
    }
`;
document.head.appendChild(style);

// Enhanced smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerHeight = 100;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize everything when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Portfolio website loaded successfully');
    });
} else {
    console.log('Portfolio website loaded successfully');
}